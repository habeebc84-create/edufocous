/**
 * POST /api/ai — server-side AI study coach for FocusMode.
 *
 * Runs as a Vercel Node function in production and through Vite dev
 * middleware locally (see vite.config.js). The API key is read from
 * process.env and never sent to the browser.
 *
 * Body: { mode: "explain" | "quiz" | "plan", text?: string, tasks?: string[] }
 * Response: { ok, offline?, content, model? }
 */

const MAX_INPUT = 2000;
const TIMEOUT_MS = 30_000;

const SYSTEM_PROMPTS = {
  explain:
    "You are a patient study coach for a student. Explain the concept they give you in four short parts: " +
    "a one-sentence definition, three key bullet points, one concrete analogy, and a one-line memory hook. " +
    "Plain text only, no markdown headings, under 170 words. If the topic is unclear, ask one clarifying question.",
  quiz:
    "You are a study coach writing practice questions. Write exactly 3 multiple-choice questions on the topic given, " +
    "each with 4 options labelled A-D, followed by the correct answer and a one-line reason. " +
    "Plain text, no markdown. Do not invent facts; if the topic is too vague, ask for one clarification first.",
  plan:
    "You are a study coach building a focus plan. Given the student's task list, produce a plan of 2-4 focus blocks " +
    "of 25 minutes. Each block: the task(s) to do, a one-line concrete goal, and a 5-minute break suggestion. " +
    "Order by what unblocks the most work first. Plain text, no markdown, under 170 words.",
};

function setJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error("Body too large");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Invalid JSON body");
  }
}

/** Honest fallback so the UI is usable before a key is configured. */
function offlineReply(mode, text) {
  const topic = (text || "your topic").trim() || "your topic";
  const hints = {
    explain:
      `Offline mode — no AI key is configured, so this is a study recipe rather than an answer.\n\n` +
      `Try this on "${topic}":\n` +
      `1. Write what you already know in two sentences.\n` +
      `2. Find the one word in the definition you can't explain, and look only that up.\n` +
      `3. Explain it out loud as if teaching a classmate.\n` +
      `4. Write the same idea from memory tomorrow, before opening notes.`,
    quiz:
      `Offline mode — no AI key is configured, so no questions were generated.\n\n` +
      `Meanwhile, quiz yourself on "${topic}" by writing 3 questions you would hate to be asked, then answering them ` +
      `in one line each. Whatever you can't answer is exactly what to review.`,
    plan:
      `Offline mode — no AI key is configured, so this plan is a default template.\n\n` +
      `Block 1 (25m): hardest task first, no browser.\n` +
      `Block 2 (25m): the task that unblocks others.\n` +
      `Block 3 (25m): review what you produced, write 3 lines of what stuck.\n` +
      `Breaks: 5 minutes away from the screen.`,
  };
  return hints[mode] ?? hints.explain;
}

function buildUserMessage(mode, text, tasks) {
  if (mode === "plan") {
    const list = Array.isArray(tasks) && tasks.length
      ? tasks.map((t, i) => `${i + 1}. ${String(t).slice(0, 200)}`).join("\n")
      : "(no tasks listed)";
    return `My tasks for today:\n${list}\n\n${String(text || "").slice(0, MAX_INPUT)}`.trim();
  }
  return String(text || "").slice(0, MAX_INPUT);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("allow", "POST, OPTIONS");
    return setJson(res, 204, {});
  }
  if (req.method !== "POST") {
    res.setHeader("allow", "POST, OPTIONS");
    return setJson(res, 405, { ok: false, error: "Use POST" });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (err) {
    return setJson(res, 400, { ok: false, error: err.message });
  }

  const mode = ["explain", "quiz", "plan"].includes(body.mode) ? body.mode : "explain";
  const text = typeof body.text === "string" ? body.text.slice(0, MAX_INPUT) : "";
  const tasks = Array.isArray(body.tasks) ? body.tasks.slice(0, 30) : [];

  if (mode !== "plan" && !text.trim()) {
    return setJson(res, 400, { ok: false, error: "Tell me a topic first." });
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return setJson(res, 200, {
      ok: true,
      offline: true,
      content: offlineReply(mode, mode === "plan" ? tasks.join(", ") : text),
    });
  }

  const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[mode] },
          { role: "user", content: buildUserMessage(mode, text, tasks) },
        ],
      }),
      signal: controller.signal,
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      // Surface the status, never the key or full upstream payload.
      return setJson(res, 502, {
        ok: false,
        error: `AI provider returned ${upstream.status}. Check AI_API_KEY, AI_BASE_URL and AI_MODEL.`,
      });
    }

    let content = "";
    try {
      const data = JSON.parse(raw);
      content = data?.choices?.[0]?.message?.content?.trim() ?? "";
    } catch {
      return setJson(res, 502, { ok: false, error: "AI provider sent a non-JSON response." });
    }

    if (!content) {
      return setJson(res, 502, { ok: false, error: "AI provider returned an empty answer." });
    }

    return setJson(res, 200, { ok: true, offline: false, content, model });
  } catch (err) {
    const aborted = err?.name === "AbortError";
    return setJson(res, aborted ? 504 : 502, {
      ok: false,
      error: aborted ? "The AI request timed out. Try a shorter topic." : "Could not reach the AI provider.",
    });
  } finally {
    clearTimeout(timer);
  }
}

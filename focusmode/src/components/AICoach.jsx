import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  HelpCircle,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

const MODES = [
  {
    id: "explain",
    label: "Explain",
    icon: BookOpen,
    placeholder: "e.g. Why does entropy increase in a spontaneous reaction?",
    cta: "Explain simply",
    inputLabel: "Topic or question to explain",
  },
  {
    id: "quiz",
    label: "Quiz me",
    icon: HelpCircle,
    placeholder: "e.g. Newton's three laws",
    cta: "Generate questions",
    inputLabel: "Topic to be quizzed on",
  },
  {
    id: "plan",
    label: "Plan",
    icon: ClipboardList,
    placeholder: "Optional: anything else on your mind for this session",
    cta: "Build a focus plan",
    inputLabel: "Extra context for your plan",
  },
];

export default function AICoach({ tasks = [] }) {
  const [mode, setMode] = useState("explain");
  const [text, setText] = useState("");
  const [state, setState] = useState({ status: "idle", content: "", error: "", offline: false });

  const active = MODES.find((m) => m.id === mode);
  const iconFor = { explain: BookOpen, quiz: HelpCircle, plan: ClipboardList };
  const openTasks = tasks.filter((t) => !t.done).map((t) => t.text);

  async function submit(e) {
    e.preventDefault();
    if (mode !== "plan" && !text.trim()) return;

    setState({ status: "loading", content: "", error: "", offline: false });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, text, tasks: openTasks }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        setState({
          status: "error",
          content: "",
          error: data.error || `Request failed (${res.status}).`,
          offline: false,
        });
        return;
      }
      setState({
        status: "done",
        content: data.content || "",
        error: "",
        offline: Boolean(data.offline),
      });
    } catch {
      setState({
        status: "error",
        content: "",
        error: "Couldn't reach the study coach. Check your connection and try again.",
        offline: false,
      });
    }
  }

  return (
    <section id="coach" className="glass mt-6 scroll-mt-24 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-4 w-4 text-accent-violet" aria-hidden="true" />
          AI study coach
        </h2>
        <span className="text-[11px] uppercase tracking-wide text-white/35">
          runs server-side
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-white/50">
        Explain a topic, get quizzed on it, or turn your task list into a focus plan.
        Requests go through our own API route, so no key ever reaches your browser.
      </p>

      {/* Mode tabs */}
      <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label="Coach mode">
        {MODES.map(({ id, label, icon: Icon }) => {
          const selected = id === mode;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                setState({ status: "idle", content: "", error: "", offline: false });
              }}
              aria-pressed={selected}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
                selected
                  ? "border-secondary/60 bg-secondary/15 text-white"
                  : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <form onSubmit={submit} className="mt-4">
        <label htmlFor="coach-input" className="sr-only">
          {active.inputLabel}
        </label>
        {mode === "plan" && (
          <p className="mb-2 text-xs text-white/40">
            Using {openTasks.length} open task{openTasks.length === 1 ? "" : "s"} from
            today&rsquo;s list.
          </p>
        )}
        <textarea
          id="coach-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={active.placeholder}
          rows={3}
          maxLength={2000}
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-secondary/60 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-white/30">{text.length}/2000</span>
          <button
            type="submit"
            disabled={state.status === "loading" || (mode !== "plan" && !text.trim())}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Wand2 className="h-4 w-4" aria-hidden="true" />
            )}
            {state.status === "loading" ? "Thinking…" : active.cta}
          </button>
        </div>
      </form>

      {/* Output */}
      {state.status === "error" && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      {state.status === "loading" && (
        <div className="mt-4 space-y-2" aria-hidden="true">
          {[90, 75, 60].map((w) => (
            <div
              key={w}
              className="h-3 animate-pulse rounded bg-white/10"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      )}

      {state.status === "done" && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
          {state.offline ? (
            <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-amber-300/90">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Offline mode — no AI key configured
            </p>
          ) : (
            <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-emerald-300/90">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              AI answer
            </p>
          )}
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
            {state.content}
          </div>
        </div>
      )}
    </section>
  );
}

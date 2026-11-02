# edufocous

Monorepo for **FocusMode** — a focus timer and study workspace.

```
focusmode/            Vite + React + Tailwind app (deploy target)
  src/                app source
  tailwind.config.js  design tokens: Electric Blue / Violet / Deep Navy
  vercel.json         Vercel build config
```

## FocusMode

A single-screen deep-work workspace: a wall-clock focus timer with three presets
(25 / 5 / 15), a task queue, session stats, and an **AI study coach** that can
explain a topic, generate practice questions, or turn your open tasks into a
25-minute focus plan.

Everything except the study coach runs in the browser. The coach posts to
`api/ai.js`, a server-side function that holds `AI_API_KEY`, so the key never
reaches the client bundle. With no key configured it answers in a clearly
labelled **offline mode** instead of failing.

### Run locally

```bash
cd focusmode
npm install
npm run dev      # http://localhost:5173
npm run build    # -> focusmode/dist
npm run preview  # serve the production build
```

### AI study coach

`POST /api/ai` with `{ mode: "explain" | "quiz" | "plan", text?, tasks? }`.

- **Production:** runs as a Vercel Node function (`focusmode/api/ai.js`).
- **Local:** mounted by a small Vite plugin in `vite.config.js`, so `npm run dev`
  serves the same route at `/api/ai` — no `vercel dev` needed.
- **Provider:** any OpenAI-compatible API. Defaults to
  `https://api.openai.com/v1` + `gpt-4o-mini`; override with `AI_BASE_URL`
  and `AI_MODEL`.
- **No key:** returns `{ ok: true, offline: true }` with study-technique
  guidance, and the UI labels it clearly.

### Deploy

```bash
cd focusmode
npx vercel --prod
```

Set `focusmode` as the project's **Root Directory** if the repo is linked to
Vercel directly (it is a subdirectory of this monorepo).

### Environment variables

Copy `focusmode/.env.example` to `focusmode/.env.local` and fill in values.

- `VITE_*` variables are **inlined into the client bundle** — public by design.
- `AI_API_KEY` has **no** `VITE_` prefix so it can only be read by server-side
  code (e.g. `api/` functions). Never expose it to the browser.

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
(25 / 5 / 15), a task queue, and session stats. Everything runs in the browser —
no accounts, no tracking, no network calls at runtime.

### Run locally

```bash
cd focusmode
npm install
npm run dev      # http://localhost:5173
npm run build    # -> focusmode/dist
npm run preview  # serve the production build
```

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

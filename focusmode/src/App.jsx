import { useCallback, useEffect, useState } from "react";
import {
  BellRing,
  BrainCircuit,
  Clock3,
  Github,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import AICoach from "./components/AICoach.jsx";
import FocusTimer from "./components/FocusTimer.jsx";
import TaskList from "./components/TaskList.jsx";
import { Logo } from "./components/Logo.jsx";
import { PRESETS } from "./hooks/useTimer.js";

const FEATURES = [
  {
    icon: Clock3,
    title: "Wall-clock timer",
    body: "Drifts by zero seconds even when the tab is backgrounded, because it tracks a target timestamp, not interval ticks.",
  },
  {
    icon: ListChecks,
    title: "Tasks in the same view",
    body: "Queue what you're working on and tick it off without leaving the timer. No second app to babysit.",
  },
  {
    icon: BrainCircuit,
    title: "Distraction-resistant",
    body: "One dial, three presets, keyboard control. Everything that isn't the current task gets out of the way.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Your tasks and sessions never leave the browser. There's no account wall and no tracking script.",
  },
];

const INITIAL_TASKS = [
  { id: 1, text: "Review chapter 4 notes", done: true },
  { id: 2, text: "Draft the physics summary sheet", done: false },
  { id: 3, text: "Solve 10 practice problems", done: false },
];

export default function App() {
  const [presetId, setPresetId] = useState("focus");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [sessions, setSessions] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleComplete = useCallback(
    (preset) => {
      if (preset.id === "focus") {
        setSessions((n) => n + 1);
        setFocusMinutes((m) => m + preset.minutes);
        notify("Focus session logged. Take a break — you earned it.");
      } else {
        notify("Break over. Ready for the next round?");
      }
    },
    [notify]
  );

  return (
    <div id="top" className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-5 text-sm text-white/60">
          <a href="#features" className="hidden transition hover:text-white sm:block">
            Features
          </a>
          <a href="#coach" className="transition hover:text-white">
            Study coach
          </a>
          <a href="#timer" className="transition hover:text-white">
            Start
          </a>
          <a
            href="https://github.com/habeebc84-create/edufocous"
            className="text-white/40 transition hover:text-white"
            aria-label="Source on GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-2xl pt-8 text-center sm:pt-14">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            FocusMode · beta
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Deep work,
            <span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">
              {" "}
              by design
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            A focus timer, a task queue, and an AI study coach in one screen. Set the
            block, ask for an explanation or a quiz, close the tabs you don&rsquo;t need.
          </p>
        </section>

        <div className="mx-auto max-w-xl">
          <FocusTimer
            activePreset={presetId}
            onPresetChange={setPresetId}
            onComplete={handleComplete}
          />

          {/* Session stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Target, label: "Sessions", value: sessions },
              { icon: Clock3, label: "Focus time", value: `${focusMinutes}m` },
              {
                icon: BellRing,
                label: "Next break",
                value: PRESETS[0].minutes - (focusMinutes % PRESETS[0].minutes),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="glass rounded-2xl px-3 py-4 text-center"
              >
                <Icon
                  className="mx-auto h-4 w-4 text-accent-blue"
                  aria-hidden="true"
                />
                <div className="mt-2 text-lg font-semibold tabular-nums text-white">
                  {value}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-white/40">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onAllDone={() => notify("Everything on today's list is done. Nice.")}
          />

          <AICoach tasks={tasks} />
        </div>

        {/* Features */}
        <section id="features" className="mt-24 scroll-mt-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Built to protect one thing: your attention
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass rounded-2xl p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-accent-blue">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-white/35 sm:flex-row">
          <Logo className="opacity-70" />
          <p>© {new Date().getFullYear()} FocusMode · a project of edufocous</p>
          <p>Runs entirely in your browser</p>
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 mx-auto max-w-sm rounded-xl border border-white/10 bg-dark-charcoal px-4 py-3 text-center text-sm text-white shadow-2xl shadow-black/50 sm:left-auto sm:right-6 sm:mx-0"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

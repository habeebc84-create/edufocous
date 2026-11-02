import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

/** Controlled task list — state lives in App so other panels can read it. */
export default function TaskList({ tasks, setTasks, onAllDone }) {
  const [value, setValue] = useState("");

  const doneCount = tasks.filter((t) => t.done).length;

  const commit = (next) => {
    setTasks(next);
    if (next.length > 0 && next.every((t) => t.done)) onAllDone?.();
  };

  const add = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    commit([...tasks, { id: Date.now(), text, done: false }]);
    setValue("");
  };

  const toggle = (id) =>
    commit(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => commit(tasks.filter((t) => t.id !== id));

  return (
    <section id="tasks" className="glass mt-6 scroll-mt-24 rounded-3xl p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-white">Today&rsquo;s tasks</h2>
        <span className="text-xs text-white/40">
          {doneCount}/{tasks.length} done
        </span>
      </div>

      <form onSubmit={add} className="mt-4 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a task…"
          aria-label="New task"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/60 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-3 text-white transition hover:bg-primary/90"
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {tasks.length === 0 && (
          <li className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/40">
            Nothing queued. Add your first task above.
          </li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              aria-label={`Mark "${task.text}" as ${task.done ? "not done" : "done"}`}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                task.done
                  ? "border-primary bg-primary text-white"
                  : "border-white/25 text-transparent hover:border-white/50"
              }`}
            >
              <Check className="h-3 w-3" aria-hidden="true" />
            </button>
            <span
              className={`flex-1 text-sm ${
                task.done ? "text-white/35 line-through" : "text-white/85"
              }`}
            >
              {task.text}
            </span>
            <button
              type="button"
              onClick={() => remove(task.id)}
              aria-label={`Delete "${task.text}"`}
              className="text-white/20 opacity-0 transition hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

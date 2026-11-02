import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { PRESETS, useTimer } from "../hooks/useTimer.js";

const RADIUS = 130;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function FocusTimer({ activePreset, onPresetChange, onComplete }) {
  const preset = PRESETS.find((p) => p.id === activePreset) ?? PRESETS[0];
  const timer = useTimer(preset.minutes);
  const lastMinutes = useRef(preset.minutes);

  // Switching preset resets the clock to that preset's length.
  useEffect(() => {
    if (lastMinutes.current !== preset.minutes) {
      lastMinutes.current = preset.minutes;
      timer.reset(preset.minutes);
    }
  }, [preset.minutes, timer]);

  useEffect(() => {
    if (timer.isDone) onComplete?.(preset);
  }, [timer.isDone, preset, onComplete]);

  // Space toggles, R resets — but never while typing in a field.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      if (e.code === "Space") {
        e.preventDefault();
        timer.toggle();
      }
      if (e.key.toLowerCase() === "r") timer.reset(preset.minutes);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [timer, preset.minutes]);

  const dashOffset = useMemo(
    () => CIRCUMFERENCE * (1 - timer.progress),
    [timer.progress]
  );

  return (
    <section
      id="timer"
      className="glass mx-auto mt-14 w-full max-w-lg rounded-3xl p-8 shadow-2xl shadow-black/40 sm:p-10"
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">
          <TimerIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {preset.tag}
        </span>
        <span className="text-xs text-white/40">
          {timer.isRunning ? "running" : timer.isDone ? "complete" : "paused"}
        </span>
      </div>

      {/* Dial */}
      <div className="relative mx-auto mt-6 h-[300px] w-[300px]">
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={`${timer.display} remaining`}
        >
          <defs>
            <linearGradient id="dial-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="150"
            cy="150"
            r={RADIUS}
            fill="none"
            stroke="url(#dial-stroke)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 300ms linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-white sm:text-7xl"
            aria-live="polite"
          >
            {timer.display}
          </span>
          <span className="mt-2 text-xs text-white/40">
            {timer.durationMin} minute {preset.label.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Presets */}
      <div
        className="mt-8 grid grid-cols-3 gap-2"
        role="group"
        aria-label="Timer length"
      >
        {PRESETS.map((p) => {
          const active = p.id === preset.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPresetChange(p.id)}
              aria-pressed={active}
              className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
                active
                  ? "border-primary/60 bg-primary/15 text-white"
                  : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              {p.label}
              <span className="mt-0.5 block text-[10px] text-white/40">
                {p.minutes} min
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={timer.toggle} className="btn-primary flex-1">
          {timer.isRunning ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {timer.isRunning ? "Pause" : timer.isDone ? "Go again" : "Start focus"}
        </button>
        <button
          type="button"
          onClick={() => timer.reset(preset.minutes)}
          className="btn-ghost"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 text-center text-[11px] text-white/30">
        <kbd className="rounded border border-white/15 px-1.5 py-0.5">space</kbd>{" "}
        start / pause ·{" "}
        <kbd className="rounded border border-white/15 px-1.5 py-0.5">r</kbd> reset
      </p>
    </section>
  );
}

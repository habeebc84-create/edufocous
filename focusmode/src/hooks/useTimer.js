import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const PRESETS = [
  { id: "focus", label: "Focus", minutes: 25, tag: "Deep work" },
  { id: "short", label: "Short break", minutes: 5, tag: "Reset" },
  { id: "long", label: "Long break", minutes: 15, tag: "Recover" },
];

/**
 * Wall-clock timer. Uses a target timestamp instead of counting interval
 * ticks, so it stays accurate when the tab is backgrounded or throttled.
 */
export function useTimer(initialMinutes = 25) {
  const [durationMin, setDurationMin] = useState(initialMinutes);
  const [endsAt, setEndsAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(initialMinutes * 60_000);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const tick = useRef(null);

  const totalMs = durationMin * 60_000;

  useEffect(() => {
    if (!isRunning || endsAt == null) return;

    const update = () => {
      const left = Math.max(0, endsAt - Date.now());
      setRemainingMs(left);
      if (left === 0) {
        setIsRunning(false);
        setIsDone(true);
      }
    };

    update();
    tick.current = setInterval(update, 250);
    return () => clearInterval(tick.current);
  }, [isRunning, endsAt]);

  const start = useCallback(() => {
    setIsDone(false);
    // Resume from wherever it was paused.
    setEndsAt(Date.now() + (remainingMs > 0 ? remainingMs : totalMs));
    setIsRunning(true);
  }, [remainingMs, totalMs]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setEndsAt(null);
  }, []);

  const reset = useCallback(
    (minutes = durationMin) => {
      setIsRunning(false);
      setEndsAt(null);
      setDurationMin(minutes);
      setRemainingMs(minutes * 60_000);
      setIsDone(false);
    },
    [durationMin]
  );

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, pause, start]);

  const progress = useMemo(() => {
    if (totalMs <= 0) return 0;
    return Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  }, [remainingMs, totalMs]);

  const remainingSec = Math.ceil(remainingMs / 1000);
  const display = useMemo(() => {
    const m = Math.floor(remainingSec / 60);
    const s = remainingSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remainingSec]);

  return {
    durationMin,
    remainingMs,
    remainingSec,
    display,
    progress,
    isRunning,
    isDone,
    start,
    pause,
    toggle,
    reset,
  };
}

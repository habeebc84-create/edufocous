/** FocusMode wordmark. */
export function Logo({ className = "" }) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-2.5 text-white ${className}`}
      aria-label="FocusMode home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="34 16"
            transform="rotate(-90 12 12)"
          />
          <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
      </span>
      <span className="text-sm font-semibold tracking-tight">
        Focus<span className="text-accent-blue">Mode</span>
      </span>
    </a>
  );
}

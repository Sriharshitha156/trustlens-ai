import { Hand, Eye, Zap, Gauge } from "lucide-react";

export type AutonomyLevel = "ask" | "recommend" | "notify";

interface Props {
  value: AutonomyLevel;
  onChange: (level: AutonomyLevel) => void;
  /** When true, the highest autonomy option is disabled (e.g. high-risk action). */
  highRisk?: boolean;
}

interface LevelMeta {
  id: AutonomyLevel;
  label: string;
  short: string;
  icon: typeof Hand;
  description: string;
}

const LEVELS: LevelMeta[] = [
  {
    id: "ask",
    label: "Always Ask Me",
    short: "Manual",
    icon: Hand,
    description:
      "The AI never acts on its own. Every recommendation waits for your explicit Approve, Override, or Escalate.",
  },
  {
    id: "recommend",
    label: "Recommend Only",
    short: "Assisted",
    icon: Eye,
    description:
      "The AI surfaces recommendations with full reasoning, but still needs your confirmation before anything happens.",
  },
  {
    id: "notify",
    label: "Act & Notify",
    short: "Supervised auto",
    icon: Zap,
    description:
      "For low-risk actions only, the AI may act and then notify you. You can always review and reverse it from the Activity Log.",
  },
];

export default function AutonomyDial({ value, onChange, highRisk }: Props) {
  const active = LEVELS.find((l) => l.id === value) ?? LEVELS[0];

  return (
    <section className="tl-panel" aria-labelledby="autonomy-dial-title">
      <h3 id="autonomy-dial-title" className="tl-panel-title flex items-center gap-2">
        <Gauge className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        Autonomy Dial
      </h3>
      <p className="mb-4 text-sm text-[var(--tl-text-secondary)]">
        Choose how independently the AI is allowed to act for this recommendation. The review
        controls below adapt to your choice.
      </p>

      <div
        role="radiogroup"
        aria-label="AI autonomy level"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {LEVELS.map((level) => {
          const Icon = level.icon;
          const selected = level.id === value;
          const disabled = highRisk && level.id === "notify";
          return (
            <button
              key={level.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${level.label}. ${level.description}`}
              disabled={disabled}
              onClick={() => onChange(level.id)}
              className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? "border-[var(--tl-dell-blue)] bg-[var(--tl-dell-blue)]/10"
                  : "border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] hover:border-[var(--tl-dell-blue-light)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon
                  className={`h-5 w-5 ${
                    selected ? "text-[var(--tl-dell-blue-light)]" : "text-[var(--tl-text-muted)]"
                  }`}
                />
                <span className="text-sm font-bold text-white">{level.label}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--tl-text-muted)]">
                {level.short}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-[var(--tl-bg-elevated)] px-4 py-3">
        <p className="text-sm text-[var(--tl-text-secondary)]">
          <strong className="text-white">{active.label}:</strong> {active.description}
        </p>
        {highRisk && (
          <p className="mt-2 text-xs font-semibold text-[var(--tl-warning)]">
            "Act &amp; Notify" is disabled because this is a high-risk action — human approval is
            always required.
          </p>
        )}
      </div>
    </section>
  );
}

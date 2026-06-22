import { AlertTriangle } from "lucide-react";
import { RecommendationBundle } from "../../types/datasets";
import { problemDetail } from "../../lib/problem";

function severityColor(severity: string): string {
  // AA-contrast-safe brights on the dark base (used for label + border).
  if (severity === "Critical" || severity === "High") return "#F87171";
  if (severity === "Medium") return "#FBBF24";
  return "#38BDF8";
}

/**
 * "The Problem" banner — states what is wrong, in plain language, BEFORE the
 * recommendation and reasoning. Derived from structured fields (action,
 * severity, device, top evidence) so it reads meaningfully.
 */
export default function ProblemBanner({ bundle }: { bundle: RecommendationBundle }) {
  const rec = bundle.recommendation;
  const color = severityColor(rec.severity);

  return (
    <section
      className="tl-panel"
      style={{ borderLeft: `4px solid ${color}` }}
      aria-labelledby="problem-banner-title"
    >
      <p
        id="problem-banner-title"
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider"
        style={{ color }}
      >
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        The Problem
      </p>
      <p className="mt-2 text-lg font-semibold leading-snug text-white">
        {problemDetail(rec, bundle.evidenceWeights)}
      </p>
      <p className="mt-3 text-xs text-[var(--tl-text-muted)]">
        <span className="font-bold" style={{ color }}>
          {rec.severity} severity
        </span>{" "}
        · Risk level: {rec.risk_level} · Device owner: {rec.device_owner}
      </p>
      <p className="mt-3 border-t border-[var(--tl-border)] pt-3 text-sm text-[var(--tl-text-secondary)]">
        <span className="font-bold text-white">AI's recommended response:</span> {rec.action}
        <span className="text-[var(--tl-text-muted)]"> — see the reasoning below before deciding.</span>
      </p>
    </section>
  );
}

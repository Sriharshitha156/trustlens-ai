import { AlertTriangle, TriangleAlert } from "lucide-react";
import { RecommendationRow, TrustLedgerRow } from "../../types/datasets";

interface Props {
  recommendation: RecommendationRow;
  ledger?: TrustLedgerRow;
}

type Impact = "Low" | "Medium" | "High";

function impactColor(level: Impact): string {
  if (level === "High") return "var(--tl-danger)";
  if (level === "Medium") return "var(--tl-warning)";
  return "var(--tl-text-muted)";
}

/**
 * AI Limitation Awareness — surfaces what the AI does NOT know and where it
 * may be wrong, derived from the Trust Ledger's known weaknesses plus the
 * recommendation's confidence/severity.
 */
export default function AILimitationPanel({ recommendation, ledger }: Props) {
  const weaknesses = (ledger?.known_weaknesses ?? "")
    .split(";")
    .map((w) => w.trim())
    .filter(Boolean);

  // Assign a plain-language impact level to each known gap.
  const gaps = weaknesses.map((w, i): { title: string; impact: Impact; note: string } => {
    const impact: Impact = i === 0 ? "Medium" : i === 1 ? "Low" : "Medium";
    return {
      title: w,
      impact,
      note: "May reduce accuracy until additional telemetry is available.",
    };
  });

  const reviewNeeded =
    recommendation.confidence_score < 80 ||
    recommendation.confidence.toLowerCase().includes("review") ||
    recommendation.confidence.toLowerCase().includes("low");

  return (
    <section
      className="tl-panel border-[var(--tl-warning)]/25 bg-[var(--tl-warning)]/5"
      aria-labelledby="ai-limitation-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="ai-limitation-title" className="tl-panel-title flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--tl-warning)]" />
          AI Limitation Awareness
        </h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--tl-bg-card)] px-3 py-1 text-[10px] font-bold text-[var(--tl-text-secondary)]">
            Confidence: <span className="text-[var(--tl-warning)]">{recommendation.confidence}</span>
          </span>
          <span className="rounded-full bg-[var(--tl-bg-card)] px-3 py-1 text-[10px] font-bold text-[var(--tl-text-secondary)]">
            Severity: <span className="text-[var(--tl-warning)]">{recommendation.severity}</span>
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm text-[var(--tl-text-secondary)]">
        Identifies modeling gaps, missing event telemetry, or out-of-context parameters.
      </p>

      {reviewNeeded && (
        <div className="mb-4 rounded-xl border border-[var(--tl-warning)]/30 bg-[var(--tl-bg-card)] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--tl-warning)]">
            <TriangleAlert className="h-4 w-4" />
            AI Limitation Warning
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
            Known data boundaries have been flagged for this recommendation. Review the gaps below to
            identify missing logs or out-of-bounds parameters.
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--tl-warning)]">
            ⚠ Human review recommended
          </p>
        </div>
      )}

      {gaps.length > 0 ? (
        <>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--tl-text-muted)]">
            Flagged knowledge gaps
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {gaps.map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-card)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{g.title}</p>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{
                      color: impactColor(g.impact),
                      backgroundColor: `color-mix(in srgb, ${impactColor(g.impact)} 18%, transparent)`,
                    }}
                  >
                    {g.impact}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--tl-text-muted)]">
                  <strong className="text-[var(--tl-text-secondary)]">Impact:</strong> {g.note}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--tl-text-muted)]">
          No significant knowledge gaps flagged for this recommendation.
        </p>
      )}
    </section>
  );
}

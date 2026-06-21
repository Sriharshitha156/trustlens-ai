import { Database, CheckCircle2, AlertOctagon } from "lucide-react";
import { EvidenceWeightRow, TrustLedgerRow } from "../../types/datasets";

interface Props {
  evidenceWeights: EvidenceWeightRow[];
  trustLedger: TrustLedgerRow[];
}

type Impact = "Low" | "Med" | "High";

function impactColor(level: Impact): string {
  if (level === "High") return "var(--tl-danger)";
  if (level === "Med") return "var(--tl-warning)";
  return "var(--tl-text-muted)";
}

const MED_KEYWORDS = ["offline", "unknown", "incomplete", "outage", "missing", "staging", "vpn"];

/**
 * Data Feeds & Telemetry Health Analysis (Trust Analytics).
 * Aggregates two organisation-wide profiles entirely from the dataset:
 *  - Data Source Trust Index: per-source usage + a computed trust composite.
 *  - Telemetry Gaps Profile: how often each known limitation appears.
 */
export default function DataFeedsHealthPanel({ evidenceWeights, trustLedger }: Props) {
  // --- Data Source Trust Index: aggregate evidence signals by type ---
  const byType = new Map<string, { uses: number; weightSum: number }>();
  for (const e of evidenceWeights) {
    const cur = byType.get(e.evidence_type) ?? { uses: 0, weightSum: 0 };
    cur.uses += 1;
    cur.weightSum += e.weight_percentage;
    byType.set(e.evidence_type, cur);
  }
  const sources = [...byType.entries()]
    .map(([name, v]) => {
      const avgWeight = v.weightSum / v.uses;
      // Composite trust index: blends how consistently the source is used
      // with the strength of its signal. Deterministic, derived from data.
      const trust = Math.min(97, Math.max(80, Math.round(80 + avgWeight / 4 + v.uses / 200)));
      return { name, uses: v.uses, trust };
    })
    .sort((a, b) => b.uses - a.uses)
    .slice(0, 6);

  // --- Telemetry Gaps Profile: count known weaknesses across the ledger ---
  const gapCounts = new Map<string, number>();
  for (const row of trustLedger) {
    for (const w of row.known_weaknesses.split(";").map((s) => s.trim()).filter(Boolean)) {
      gapCounts.set(w, (gapCounts.get(w) ?? 0) + 1);
    }
  }
  const totalLimitationLogs = [...gapCounts.values()].reduce((s, n) => s + n, 0);
  const gaps = [...gapCounts.entries()]
    .map(([title, count]): { title: string; count: number; impact: Impact } => {
      const lower = title.toLowerCase();
      const impact: Impact = MED_KEYWORDS.some((k) => lower.includes(k)) ? "Med" : "Low";
      return { title, count, impact };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <section className="tl-panel" aria-labelledby="data-feeds-health-title">
      <h3 id="data-feeds-health-title" className="tl-panel-title flex items-center gap-2">
        <Database className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        Data Feeds &amp; Telemetry Health Analysis
      </h3>
      <p className="mb-5 text-sm text-[var(--tl-text-secondary)]">
        Aggregate trust profiles computed from {evidenceWeights.length.toLocaleString()} source
        entries and {totalLimitationLogs.toLocaleString()} limitation logs.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Data Source Trust Index */}
        <div className="rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-[var(--tl-success)]" />
            Data Source Trust Index
          </p>
          <div className="space-y-4">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--tl-text-primary)]">{s.name}</span>
                  <span className="font-bold text-[var(--tl-dell-blue-light)]">
                    {s.trust}% Trust{" "}
                    <span className="font-normal text-[var(--tl-text-muted)]">
                      ({s.uses} uses)
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--tl-bg-card)]">
                  <div
                    className="h-full rounded-full bg-[var(--tl-dell-blue)]"
                    style={{ width: `${s.trust}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Gaps Profile */}
        <div className="rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <AlertOctagon className="h-4 w-4 text-[var(--tl-warning)]" />
            Telemetry Gaps Profile
          </p>
          <div className="space-y-3">
            {gaps.map((g) => (
              <div
                key={g.title}
                className="flex items-center justify-between rounded-lg bg-[var(--tl-bg-card)] px-4 py-3"
              >
                <div className="min-w-0 pr-3">
                  <p className="truncate text-sm font-semibold text-white">{g.title}</p>
                  <p className="text-[11px] text-[var(--tl-text-muted)]">
                    Total occurrences: {g.count}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-md px-2 py-1 text-[10px] font-bold"
                  style={{
                    color: impactColor(g.impact),
                    backgroundColor: `color-mix(in srgb, ${impactColor(g.impact)} 18%, transparent)`,
                  }}
                >
                  {g.count} {g.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[var(--tl-text-muted)]">
        Trust index is a computed composite of source usage frequency and signal weight. Gap impact
        is inferred from the nature of each known limitation.
      </p>
    </section>
  );
}

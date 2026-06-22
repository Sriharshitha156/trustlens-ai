import { Gavel, ShieldCheck, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CourtroomAnalysis } from "../../lib/courtroom";

export default function DecisionCourtroom({ analysis }: { analysis: CourtroomAnalysis }) {
  const { advocate, challenger, score, band, needsReview } = analysis;
  const meterColor =
    band === "High"
      ? "#F87171"
      : band === "Moderate"
        ? "#FBBF24"
        : "#22C55E";

  return (
    <section className="tl-panel border-[var(--tl-dell-blue)]/30" aria-labelledby="courtroom-title">
      <h3 id="courtroom-title" className="tl-panel-title flex items-center gap-2">
        <Gavel className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        High-Risk Decision Courtroom
      </h3>
      <p className="mb-5 text-sm text-[var(--tl-text-secondary)]">
        Two reasoning agents interpret the <strong className="text-white">same evidence</strong> — to
        help you think critically before a high-impact decision.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Advocate */}
        <div className="rounded-xl border border-[var(--tl-success)]/30 bg-[var(--tl-success)]/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--tl-success)]">
            <ShieldCheck className="h-4 w-4" />
            Advocate Agent — Arguments For Action
          </p>
          <ul className="mt-3 space-y-2">
            {advocate.map((a, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
                <span className="text-[var(--tl-success)]">▸</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Challenger */}
        <div className="rounded-xl border border-[var(--tl-warning)]/30 bg-[var(--tl-warning)]/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--tl-warning)]">
            <Scale className="h-4 w-4" />
            Challenger Agent — Arguments For Caution
          </p>
          <ul className="mt-3 space-y-2">
            {challenger.map((c, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
                <span className="text-[var(--tl-warning)]">▸</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disagreement meter */}
      <div className="mt-5 rounded-xl bg-[var(--tl-bg-elevated)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">Agent Disagreement</span>
          <span className="text-sm font-bold" style={{ color: meterColor }}>
            {band}
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--tl-bg-card)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, backgroundColor: meterColor }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-[var(--tl-text-muted)]">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {needsReview ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--tl-danger)]/15 px-4 py-3 text-sm font-bold text-[#F87171]">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            Agent Disagreement Detected — Human Review Recommended.
            <span className="block font-normal text-[var(--tl-text-secondary)]">
              The agents reached significantly different conclusions on the same evidence. Extra
              scrutiny is required before acting.
            </span>
          </span>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--tl-success)]/10 px-4 py-3 text-xs font-semibold text-[var(--tl-success)]">
          <CheckCircle2 className="h-4 w-4" />
          Agents broadly agree — but review both perspectives before deciding.
        </div>
      )}

      <p className="mt-3 text-[11px] text-[var(--tl-text-muted)]">
        The Courtroom informs your judgment — it does not make the decision.
      </p>
    </section>
  );
}

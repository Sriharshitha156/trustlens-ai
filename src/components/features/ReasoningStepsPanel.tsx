import {
  Brain,
  Database,
  Scale,
  AlertTriangle,
  History,
  Gauge,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { RecommendationBundle } from "../../types/datasets";

interface Props {
  bundle: RecommendationBundle;
}

/**
 * "Why Did The AI Recommend This?" — step-by-step reasoning trace.
 * Reconstructs the agent's thought process as numbered steps, each derived
 * from the recommendation bundle so it stays in sync with the data.
 */
export default function ReasoningStepsPanel({ bundle }: Props) {
  const rec = bundle.recommendation;
  const ledger = bundle.trustLedger;
  const impact = bundle.businessImpact;

  const sortedEvidence = [...bundle.evidenceWeights].sort(
    (a, b) => b.weight_percentage - a.weight_percentage,
  );
  const top = sortedEvidence[0];

  const steps = [
    {
      icon: Database,
      title: "Evidence Collected",
      weight: top ? `${top.weight_percentage}%` : undefined,
      body: rec.reasoning,
    },
    {
      icon: Scale,
      title: "Evidence Weighting",
      weight: undefined,
      body:
        sortedEvidence.length > 0
          ? `Weighted ${sortedEvidence.length} signal(s). Strongest: ${sortedEvidence
              .slice(0, 3)
              .map((e) => `${e.evidence_type} (${e.weight_percentage}%)`)
              .join(", ")}.`
          : "Signals were weighted to prioritise the most relevant indicators.",
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      weight: undefined,
      body: `Calculated a ${rec.risk_level} risk profile at ${rec.severity} severity for ${rec.device_name}. Failure to remediate escalates exposure across the fleet.`,
    },
    {
      icon: History,
      title: "Historical Similar Cases",
      weight: undefined,
      body: ledger
        ? `Evaluated ${ledger.past_similar_cases} similar cases in your organization. Of those, ${ledger.correct_recommendations} resolved correctly by taking action "${rec.action}".`
        : `Compared against historical cases where "${rec.action}" was applied.`,
    },
    {
      icon: Gauge,
      title: "Confidence Explanation",
      weight: undefined,
      body: `Rated "${rec.confidence}" (${rec.confidence_score}%). ${
        rec.confidence_score >= 85
          ? "Strong, consistent evidence supports this recommendation."
          : rec.confidence_score >= 70
            ? "Evidence is solid but not conclusive — review before acting."
            : "Confidence is constrained by limited or noisy data — human review recommended."
      }`,
    },
    {
      icon: ShieldCheck,
      title: "Trust Ledger Analysis",
      weight: undefined,
      body: ledger
        ? `This AI model's historical reliability for "${rec.action}" currently registers at ${ledger.historical_reliability_score}% accuracy on comparable endpoints.`
        : "Historical reliability data is being aggregated for this action type.",
    },
    {
      icon: Briefcase,
      title: "Business Impact Assessment",
      weight: undefined,
      body: impact
        ? `Predicted impact: ~${impact.potential_downtime_hours}h potential downtime affecting ${impact.affected_users} user(s), with an estimated ${impact.risk_reduction_pct}% risk reduction if actioned.`
        : "Business impact is estimated based on affected users and downtime.",
    },
  ];

  return (
    <section className="tl-panel" aria-labelledby="reasoning-steps-title">
      <h3 id="reasoning-steps-title" className="tl-panel-title flex items-center gap-2">
        <Brain className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        Why Did The AI Recommend This?
      </h3>
      <p className="mb-5 text-sm text-[var(--tl-text-secondary)]">
        The agent's reasoning, broken into plain-language steps.
      </p>

      <ol className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--tl-dell-blue)]/20 text-xs font-bold text-[var(--tl-dell-blue-light)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-sm font-bold text-white">
                      <Icon className="h-4 w-4 text-[var(--tl-dell-blue-light)]" aria-hidden="true" />
                      {step.title}
                    </p>
                    {step.weight && (
                      <span className="rounded-full bg-[var(--tl-dell-blue)]/20 px-2.5 py-0.5 text-[10px] font-bold text-[var(--tl-dell-blue-light)]">
                        Weight: {step.weight}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--tl-text-secondary)]">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

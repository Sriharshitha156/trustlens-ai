import { useState } from "react";
import {
  Brain,
  Scale,
  Database,
  Radar,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { RecommendationBundle } from "../../types/datasets";
import Modal from "../Modal";
import CounterConsiderationPanel from "./CounterConsiderationPanel";
import ReasoningStepsPanel from "./ReasoningStepsPanel";
import EvidenceWeightingChart from "./EvidenceWeightingChart";
import DataSourceAttributionPanel from "./DataSourceAttributionPanel";
import AgentChainPanel from "./AgentChainPanel";

export type ReviewKey =
  | "counter"
  | "reasoning"
  | "dataSource"
  | "multiAgent"
  | "impact"
  | "business";

interface Props {
  bundle: RecommendationBundle;
  reviewed: Record<ReviewKey, boolean>;
  onToggle: (key: ReviewKey) => void;
}

const ROWS: { key: ReviewKey; title: string; desc: string; icon: typeof Brain }[] = [
  { key: "counter", title: "Counter Consideration", desc: "An alternative explanation to weigh against the recommendation.", icon: Scale },
  { key: "reasoning", title: "Reasoning", desc: "Step-by-step explanation of how the AI reached this recommendation.", icon: Brain },
  { key: "dataSource", title: "Data Source Attribution", desc: "The data feeds and their trust levels behind this recommendation.", icon: Database },
  { key: "multiAgent", title: "Multi-Agent Handoff", desc: "How detection, analysis, and remediation agents collaborated.", icon: Radar },
  { key: "impact", title: "Impact Review", desc: "What happens if this recommendation is approved or dismissed.", icon: AlertTriangle },
  { key: "business", title: "Business Impact Score", desc: "Affected users, downtime, and risk reduction estimates.", icon: Briefcase },
];

export default function WhyRecommendBox({ bundle, reviewed, onToggle }: Props) {
  const [openKey, setOpenKey] = useState<ReviewKey | null>(null);
  const rec = bundle.recommendation;
  const reviewedCount = ROWS.filter((r) => reviewed[r.key]).length;

  const modalContent = (key: ReviewKey) => {
    switch (key) {
      case "counter":
        return <CounterConsiderationPanel recommendation={rec} counter={bundle.counterConsideration} />;
      case "reasoning":
        return (
          <div className="space-y-4">
            <EvidenceWeightingChart weights={bundle.evidenceWeights} />
            <ReasoningStepsPanel bundle={bundle} />
          </div>
        );
      case "dataSource":
        return <DataSourceAttributionPanel recommendation={rec} />;
      case "multiAgent":
        return <AgentChainPanel bundle={bundle} />;
      case "impact":
        return bundle.impactPreview ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--tl-success)]/30 bg-[var(--tl-success)]/5 p-4">
              <h4 className="text-sm font-bold text-[var(--tl-success)]">If Approved</h4>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
                <li>• {bundle.impactPreview.if_approved_threat_contained}</li>
                <li>• {bundle.impactPreview.if_approved_device_isolated}</li>
                <li>• {bundle.impactPreview.if_approved_user_impact}</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--tl-danger)]/30 bg-[var(--tl-danger)]/5 p-4">
              <h4 className="text-sm font-bold text-[var(--tl-danger)]">If Dismissed</h4>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
                <li>• {bundle.impactPreview.if_dismissed_malware_spread}</li>
                <li>• {bundle.impactPreview.if_dismissed_security_risk}</li>
                <li>• {bundle.impactPreview.if_dismissed_business_impact}</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--tl-text-muted)]">No impact preview available.</p>
        );
      case "business":
        return bundle.businessImpact ? (
          <div className="space-y-2 rounded-xl bg-[var(--tl-bg-elevated)] p-4 text-sm">
            <Stat label="Affected Users" value={String(bundle.businessImpact.affected_users)} />
            <Stat label="Potential Downtime" value={`${bundle.businessImpact.potential_downtime_hours} hours`} />
            <Stat label="Risk Reduction" value={`${bundle.businessImpact.risk_reduction_pct}%`} />
            <Stat label="Impact Level" value={bundle.businessImpact.impact_level} />
          </div>
        ) : (
          <p className="text-sm text-[var(--tl-text-muted)]">No business impact data available.</p>
        );
    }
  };

  const activeRow = ROWS.find((r) => r.key === openKey);

  return (
    <section className="tl-panel" aria-labelledby="why-box-title">
      <div className="flex items-center justify-between">
        <h3 id="why-box-title" className="tl-panel-title flex items-center gap-2">
          <Brain className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
          Why Did The AI Recommend This?
        </h3>
        <span className="text-xs font-bold text-[var(--tl-text-muted)]">
          {reviewedCount}/{ROWS.length} reviewed
        </span>
      </div>
      <p className="mb-4 mt-1 text-sm text-[var(--tl-text-secondary)]">
        Open each section to review the details, then mark it reviewed. Reviewing unlocks the approval gate below.
      </p>

      <div className="space-y-2">
        {ROWS.map((row) => {
          const Icon = row.icon;
          const isReviewed = reviewed[row.key];
          return (
            <div
              key={row.key}
              className="flex items-center gap-3 rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-3"
            >
              <Icon className="h-5 w-5 shrink-0 text-[var(--tl-dell-blue-light)]" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{row.title}</p>
                <p className="truncate text-xs text-[var(--tl-text-muted)]">{row.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenKey(row.key)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--tl-border)] bg-[var(--tl-bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--tl-dell-blue-light)] transition hover:border-[var(--tl-dell-blue)]"
              >
                Know more
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggle(row.key)}
                aria-pressed={isReviewed}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  isReviewed
                    ? "bg-[var(--tl-success)]/15 text-[var(--tl-success)]"
                    : "border border-[var(--tl-border)] bg-[var(--tl-bg-card)] text-[var(--tl-text-secondary)] hover:border-[var(--tl-success)]"
                }`}
              >
                {isReviewed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                {isReviewed ? "Reviewed" : "Mark reviewed"}
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        open={openKey !== null}
        onClose={() => setOpenKey(null)}
        title={activeRow?.title ?? ""}
        accent="blue"
        size="xl"
        footer={
          activeRow ? (
            <div className="flex justify-end gap-3">
              <button type="button" className="tl-btn-secondary py-2" onClick={() => setOpenKey(null)}>
                Close
              </button>
              <button
                type="button"
                className="tl-btn-primary px-4 py-2"
                onClick={() => {
                  if (!reviewed[activeRow.key]) onToggle(activeRow.key);
                  setOpenKey(null);
                }}
              >
                Mark Reviewed
              </button>
            </div>
          ) : undefined
        }
      >
        {openKey && modalContent(openKey)}
      </Modal>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[var(--tl-border)] pb-2 last:border-0">
      <span className="text-[var(--tl-text-secondary)]">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

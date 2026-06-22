import { useState, useEffect } from "react";
import { Lock, Unlock, FileText, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdaptiveApprovalRow, RiskLevel } from "../../types/datasets";

interface Props {
  adaptive?: AdaptiveApprovalRow;
  /** Auto-completed from the "Why" box: Counter + Reasoning + Data Source reviewed. */
  evidenceReviewed: boolean;
  /** Auto-completed from the "Why" box: Impact + Business Impact reviewed. */
  impactReviewed: boolean;
  /** When the Courtroom flags high agent disagreement, force written justification. */
  forceJustification?: boolean;
  onGateChange: (unlocked: boolean) => void;
}

const riskCopy: Record<RiskLevel, string> = {
  Low: "One-click approval permitted after review.",
  Medium: "Evidence review required before approval.",
  High: "Evidence and impact review required before approval.",
  Critical: "Evidence, impact review, and written justification required.",
};

export default function AdaptiveApprovalGate({
  adaptive,
  evidenceReviewed,
  impactReviewed,
  forceJustification = false,
  onGateChange,
}: Props) {
  const [justification, setJustification] = useState("");

  const needsEvidence = adaptive?.requires_evidence_review ?? false;
  const needsImpact = adaptive?.requires_impact_review ?? false;
  const needsJustification = (adaptive?.requires_written_justification ?? false) || forceJustification;

  const unlocked =
    (!needsEvidence || evidenceReviewed) &&
    (!needsImpact || impactReviewed) &&
    (!needsJustification || justification.trim().length >= 20);

  useEffect(() => {
    onGateChange(unlocked);
  }, [unlocked, onGateChange]);

  if (!adaptive) return null;

  return (
    <div className="tl-panel border-[var(--tl-dell-blue)]/20">
      <h3 className="tl-panel-title">Adaptive Approval Gate</h3>
      <p className="mb-2 text-sm text-[var(--tl-text-muted)]">
        Risk level:{" "}
        <span className="font-bold text-[var(--tl-dell-blue-light)]">{adaptive.risk_level}</span>
      </p>
      <p className="mb-4 text-sm text-[var(--tl-text-secondary)]">{riskCopy[adaptive.risk_level]}</p>

      {forceJustification && (
        <p className="mb-4 flex items-center gap-2 rounded-lg bg-[var(--tl-danger)]/15 px-3 py-2 text-xs font-bold text-[#F87171]">
          <AlertTriangle className="h-4 w-4" />
          Elevated scrutiny: the Decision Courtroom flagged high agent disagreement — written
          justification is required.
        </p>
      )}

      <div className="space-y-3">
        {needsEvidence && (
          <GateStatus
            done={evidenceReviewed}
            label="Evidence Review"
            hint="Mark Counter Consideration, Reasoning, and Data Source as reviewed above."
            icon={<Eye className="h-4 w-4" />}
          />
        )}
        {needsImpact && (
          <GateStatus
            done={impactReviewed}
            label="Impact Review"
            hint="Mark Impact Review and Business Impact Score as reviewed above."
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        )}
        {needsJustification && (
          <div className="rounded-xl bg-[var(--tl-bg-elevated)] p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <FileText className="h-4 w-4 text-[var(--tl-dell-blue)]" />
              Written Justification Required
            </p>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              placeholder="Provide written justification (min 20 characters)..."
              className="tl-input w-full"
            />
          </div>
        )}
      </div>

      <div
        className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold ${
          unlocked
            ? "bg-[var(--tl-success)]/15 text-[var(--tl-success)]"
            : "bg-[var(--tl-danger)]/15 text-[#F87171]"
        }`}
      >
        {unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        {unlocked ? "Approval gate unlocked" : "Approval locked until required reviews complete"}
      </div>
    </div>
  );
}

function GateStatus({
  done,
  label,
  hint,
  icon,
}: {
  done: boolean;
  label: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[var(--tl-bg-elevated)] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          {icon}
          {label}
        </span>
        {done ? (
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--tl-success)]">
            <CheckCircle2 className="h-4 w-4" /> Complete
          </span>
        ) : (
          <span className="text-xs font-bold text-[var(--tl-text-muted)]">Pending</span>
        )}
      </div>
      {!done && <p className="mt-1 text-xs text-[var(--tl-text-muted)]">{hint}</p>}
    </div>
  );
}

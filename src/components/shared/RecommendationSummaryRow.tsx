import { RecommendationRow } from "../../types/datasets";
import StatusBadge from "./StatusBadge";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { shortProblem } from "../../lib/problem";

const SEV_COLOR: Record<string, string> = {
  Critical: "bg-[var(--tl-danger)]",
  High: "bg-[var(--tl-warning)]",
  Medium: "bg-[var(--tl-dell-blue)]",
  Low: "bg-[var(--tl-text-muted)]",
};

export default function RecommendationSummaryRow({
  recommendation,
  onOpen,
}: {
  recommendation: RecommendationRow;
  onOpen: (rec: RecommendationRow) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(recommendation)}
      className="flex w-full items-center gap-4 rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] px-4 py-3.5 text-left transition hover:border-[var(--tl-dell-blue)]"
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${SEV_COLOR[recommendation.severity] ?? SEV_COLOR.Low}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[var(--tl-dell-blue-light)]">
            {recommendation.recommendation_id}
          </span>
          <span className="truncate text-sm font-semibold text-white">{recommendation.action}</span>
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--tl-text-muted)]">
          <AlertTriangle className="h-3 w-3 shrink-0" style={{ color: "var(--tl-warning)" }} aria-hidden="true" />
          {shortProblem(recommendation)}
          <span className="hidden sm:inline"> · {recommendation.severity}</span>
        </p>
      </div>
      <StatusBadge status={recommendation.status} />
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--tl-dell-blue-light)]">
        Explorer
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  );
}

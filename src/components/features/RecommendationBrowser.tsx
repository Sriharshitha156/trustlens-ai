import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ArrowUpDown, ListFilter } from "lucide-react";
import { Role, RecommendationRow } from "../../types/datasets";
import { useAppData } from "../../context/AppDataContext";
import { filterRecommendationsByRole } from "../../lib/dataLoader";
import { CURRENT_EMPLOYEE } from "../../roleConfig";
import { shortProblem } from "../../lib/problem";
import { priorityFactors, priorityBand, priorityColor } from "../../lib/priority";

const SEV_RANK: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const IMPACT_RANK: Record<string, number> = { Severe: 4, High: 3, Moderate: 2, Low: 1 };

type SortKey = "priority" | "risk" | "aging" | "business" | "confidence";
type StatusFilter = "All" | "Pending" | "Approved" | "Overridden" | "Escalated";
type SeverityFilter = "All" | "Critical" | "High" | "Medium" | "Low";

const MAX_ROWS = 100;

interface BrowserRow {
  rec: RecommendationRow;
  score: number;
  ageDays: number;
  impactLevel: string;
  riskLevel: string;
}

const SORTS: { key: SortKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "risk", label: "Risk level" },
  { key: "aging", label: "Days open" },
  { key: "business", label: "Business impact" },
  { key: "confidence", label: "Confidence" },
];

interface Props {
  activeRole: Role;
  onSelect: (id: string) => void;
}

export default function RecommendationBrowser({ activeRole, onSelect }: Props) {
  const { recommendations, indexes, data, selectedId } = useAppData();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("priority");
  const [desc, setDesc] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [severity, setSeverity] = useState<SeverityFilter>("All");
  const [preset, setPreset] = useState<string | null>(null);

  const { rows, total } = useMemo(() => {
    if (!indexes) return { rows: [] as BrowserRow[], total: 0 };
    const scoped = filterRecommendationsByRole(
      recommendations,
      activeRole,
      data?.manifest.current_employee ?? CURRENT_EMPLOYEE,
    );
    const enriched: BrowserRow[] = scoped.map((rec) => {
      const pf = priorityFactors(rec, indexes);
      return { rec, ...pf };
    });

    const q = query.trim().toLowerCase();
    let list = enriched.filter(({ rec }) => {
      const matchQ =
        !q ||
        rec.recommendation_id.toLowerCase().includes(q) ||
        rec.action.toLowerCase().includes(q) ||
        rec.device_name.toLowerCase().includes(q) ||
        rec.device_owner.toLowerCase().includes(q);
      const matchStatus = status === "All" || rec.status === status;
      const matchSeverity = severity === "All" || rec.severity === severity;
      return matchQ && matchStatus && matchSeverity;
    });

    if (preset === "critical-pending")
      list = list.filter((e) => e.rec.status === "Pending" && priorityBand(e.score) === "Critical");
    if (preset === "aging") list = list.filter((e) => e.ageDays > 14);
    if (preset === "high-impact")
      list = list.filter((e) => e.impactLevel === "Severe" || e.impactLevel === "High");

    const val = (e: (typeof enriched)[number]) => {
      switch (sortBy) {
        case "risk":
          return SEV_RANK[e.rec.risk_level] ?? SEV_RANK[e.rec.severity] ?? 0;
        case "aging":
          return e.ageDays;
        case "business":
          return IMPACT_RANK[e.impactLevel] ?? 0;
        case "confidence":
          return e.rec.confidence_score ?? 0;
        default:
          return e.score;
      }
    };
    list.sort((a, b) => (desc ? val(b) - val(a) : val(a) - val(b)));
    return { rows: list.slice(0, MAX_ROWS), total: list.length };
  }, [recommendations, indexes, data, activeRole, query, sortBy, desc, status, severity, preset]);

  const presetBtn = (id: string, label: string) => (
    <button
      type="button"
      onClick={() => setPreset(preset === id ? null : id)}
      className={`rounded-full px-3 py-1 text-xs font-bold transition ${
        preset === id
          ? "bg-[var(--tl-dell-blue)] text-white"
          : "border border-[var(--tl-border)] bg-[var(--tl-bg-card)] text-[var(--tl-text-secondary)] hover:border-[var(--tl-dell-blue)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="tl-panel" aria-labelledby="browser-title">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between"
      >
        <h2 id="browser-title" className="tl-panel-title flex items-center gap-2">
          <ListFilter className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
          Browse &amp; Prioritize Recommendations
        </h2>
        <ChevronDown
          className={`h-5 w-5 text-[var(--tl-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tl-text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, action, device, or owner..."
                className="tl-input w-full pl-10"
                aria-label="Search recommendations"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[var(--tl-text-muted)]" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="tl-input py-2 text-sm"
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setDesc((d) => !d)}
                className="flex items-center gap-1 rounded-lg border border-[var(--tl-border)] bg-[var(--tl-bg-card)] px-2.5 py-2 text-xs font-bold text-[var(--tl-text-secondary)] hover:border-[var(--tl-dell-blue)]"
                aria-label="Toggle sort direction"
              >
                <ArrowUpDown className="h-4 w-4" />
                {desc ? "High→Low" : "Low→High"}
              </button>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityFilter)}
                className="tl-input py-2 text-sm"
                aria-label="Filter by severity"
              >
                {(["All", "Critical", "High", "Medium", "Low"] as SeverityFilter[]).map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All severities" : s}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="tl-input py-2 text-sm"
                aria-label="Filter by status"
              >
                {(["All", "Pending", "Approved", "Overridden", "Escalated"] as StatusFilter[]).map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All statuses" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Presets + count */}
          <div className="flex flex-wrap items-center gap-2">
            {presetBtn("critical-pending", "🔴 Critical & Pending")}
            {presetBtn("aging", "⏳ Open > 14 days")}
            {presetBtn("high-impact", "💼 High business impact")}
            <span className="ml-auto text-xs text-[var(--tl-text-muted)]">
              Showing {rows.length} of {total}
              {total > MAX_ROWS ? ` (top ${MAX_ROWS} — filter to narrow)` : ""}
            </span>
          </div>

          {/* List */}
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {rows.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--tl-text-muted)]">
                No matching recommendations.
              </p>
            ) : (
              rows.map(({ rec, score, ageDays }) => (
                <RowItem
                  key={rec.recommendation_id}
                  rec={rec}
                  score={score}
                  ageDays={ageDays}
                  active={rec.recommendation_id === selectedId}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function RowItem({
  rec,
  score,
  ageDays,
  active,
  onSelect,
}: {
  rec: RecommendationRow;
  score: number;
  ageDays: number;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const color = priorityColor(score);
  return (
    <button
      type="button"
      onClick={() => onSelect(rec.recommendation_id)}
      aria-current={active}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        active
          ? "border-[var(--tl-dell-blue)] bg-[var(--tl-dell-blue)]/10"
          : "border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] hover:border-[var(--tl-dell-blue)]"
      }`}
    >
      <span
        className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg text-xs font-bold"
        style={{ backgroundColor: "var(--tl-bg-card)", border: `2px solid ${color}` }}
        title={`Priority ${score} (${priorityBand(score)})`}
      >
        <span className="text-[var(--tl-text-primary)]">{score}</span>
        <span className="text-[8px] font-bold uppercase tracking-wide text-[var(--tl-text-muted)]">
          prio
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--tl-dell-blue-light)]">
            {rec.recommendation_id}
          </span>
          <span className="truncate text-sm font-semibold text-white">{rec.action}</span>
        </div>
        <p className="truncate text-xs text-[var(--tl-text-muted)]">{shortProblem(rec)}</p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs font-bold" style={{ color }}>
          {rec.severity}
        </p>
        <p className="text-[10px] text-[var(--tl-text-muted)]">{ageDays}d open</p>
      </div>
    </button>
  );
}

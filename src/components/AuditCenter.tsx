import { useState } from "react";
import { motion } from "motion/react";
import { Search, ClipboardList, Filter, Download } from "lucide-react";
import { AuditRecord, RecommendationRow, TrustLedgerRow, Role } from "../types/datasets";
import { useAppData } from "../context/AppDataContext";
import { filterRecommendationsByRole } from "../lib/dataLoader";
import { CURRENT_EMPLOYEE } from "../roleConfig";
import DecisionMetricsBar from "./shared/DecisionMetricsBar";
import StatusBadge from "./shared/StatusBadge";

const SOURCE_POOL = [
  "Security Logs",
  "Endpoint Detection Systems",
  "Network Anomaly Detection",
  "Device Telemetry",
  "Malware Detection Engine",
  "Historical Incident Records",
  "Threat Intelligence Feeds",
];

const MED_KEYWORDS = ["offline", "unknown", "incomplete", "outage", "vpn", "staging"];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function trustLabel(score: number): "High Trust" | "Moderate Trust" | "Low Trust" {
  if (score >= 85) return "High Trust";
  if (score >= 70) return "Moderate Trust";
  return "Low Trust";
}

/** Derives the source-attribution list (with trust levels) for an audit record. */
function deriveSources(recId: string, confidence: number): { name: string; trust: string }[] {
  const h = hashStr(recId);
  const count = 3 + (h % 2);
  const start = h % SOURCE_POOL.length;
  return Array.from({ length: count }, (_, i) => {
    const name = SOURCE_POOL[(start + i) % SOURCE_POOL.length];
    const adj = (hashStr(name) % 20) - 10;
    return { name, trust: trustLabel(confidence + adj) };
  });
}

/** Derives flagged telemetry gaps (with impact levels) from the trust ledger. */
function deriveGaps(ledger?: TrustLedgerRow): { title: string; impact: "Low" | "Medium" | "High" }[] {
  const weaknesses = (ledger?.known_weaknesses ?? "")
    .split(";")
    .map((w) => w.trim())
    .filter(Boolean);
  return weaknesses.slice(0, 2).map((title) => {
    const lower = title.toLowerCase();
    const impact: "Low" | "Medium" | "High" = lower.includes("missing")
      ? "High"
      : MED_KEYWORDS.some((k) => lower.includes(k))
        ? "Medium"
        : "Low";
    return { title, impact };
  });
}

export default function AuditCenter({ activeRole }: { activeRole: Role }) {
  const { auditRecords, data, recommendations, orgMetrics } = useAppData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Approved" | "Overridden" | "Escalated">("All");

  const outcomeMap = new Map<string, any>(data?.outcomes.map((o) => [o.recommendation_id, o]) ?? []);
  const recMap = new Map<string, RecommendationRow>(
    data?.recommendations.map((r) => [r.recommendation_id, r]) ?? [],
  );
  const ledgerMap = new Map<string, TrustLedgerRow>(
    data?.trustLedger.map((l) => [l.recommendation_id, l]) ?? [],
  );

  const scopedRecs = filterRecommendationsByRole(
    recommendations,
    activeRole,
    data?.manifest.current_employee ?? CURRENT_EMPLOYEE,
  );
  const scopedIds = new Set(scopedRecs.map((r) => r.recommendation_id));

  const filtered = auditRecords
    .filter(
      (r) =>
        activeRole === Role.IT_ADMIN ||
        scopedIds.has(r.recommendation_id) ||
        scopedRecs.some((s) => s.device_id === r.device_id),
    )
    .filter((record) => {
      const q = search.toLowerCase();
      const match =
        record.device_name.toLowerCase().includes(q) ||
        record.action.toLowerCase().includes(q) ||
        record.outcome.toLowerCase().includes(q) ||
        record.reviewer.toLowerCase().includes(q);
      const f = filter === "All" || record.decision === filter;
      return match && f;
    })
    .slice(0, 100);

  const exportCsv = () => {
    const cols: (keyof AuditRecord)[] = [
      "timestamp",
      "recommendation_id",
      "device_name",
      "action",
      "severity",
      "confidence",
      "decision",
      "reviewer",
      "reviewer_role",
      "override_reason",
      "outcome",
      "notes",
    ];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = filtered.map((r) => cols.map((c) => escape(r[c])).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trustlens-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mesh-bg flex-1 overflow-y-auto">
      <div className="border-b border-[var(--tl-border)] bg-[var(--tl-bg-sidebar)] px-8 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--tl-dell-blue-light)]">
            <ClipboardList className="h-4 w-4" />
            Audit &amp; Activity Log
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-[var(--tl-text-primary)] lg:text-4xl">
            Decision Activity
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[var(--tl-text-secondary)]">
            Every AI action and the human decision behind it — searchable, filterable, and exportable.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-8 py-8">
        {orgMetrics && <DecisionMetricsBar metrics={orgMetrics} title="Decision Summary" />}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tl-text-muted)]" />
            <input
              type="text"
              placeholder="Search by device, action, reviewer, outcome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tl-input w-full pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--tl-text-muted)]" />
            {(["All", "Approved", "Overridden", "Escalated"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  filter === f
                    ? "bg-[var(--tl-dell-blue)] text-white"
                    : "border border-[var(--tl-border)] bg-[var(--tl-bg-card)] text-[var(--tl-text-primary)] hover:border-[var(--tl-dell-blue)]"
                }`}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              aria-label="Export audit log to CSV"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--tl-border)] bg-[var(--tl-bg-card)] px-3 py-2 text-xs font-bold text-[var(--tl-text-primary)] transition hover:border-[var(--tl-dell-blue)] disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="py-16 text-center text-[var(--tl-text-muted)]">No matching records found.</p>
          )}
          {filtered.map((record, i) => {
            const outcome = outcomeMap.get(record.recommendation_id);
            const rec = recMap.get(record.recommendation_id);
            const ledger = ledgerMap.get(record.recommendation_id);
            const confidence = rec?.confidence_score ?? 85;
            const sources = deriveSources(record.recommendation_id, confidence);
            const gaps = deriveGaps(ledger);
            const coreReasoning = record.ai_reasoning || rec?.reasoning || "";
            return (
              <motion.article
                key={record.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="tl-panel"
              >
                <div className="flex items-center justify-between border-b border-[var(--tl-border)] pb-3">
                  <span className="font-mono text-sm text-[var(--tl-text-muted)]">
                    {record.id}{" "}
                    <span className="text-[var(--tl-text-muted)]/70">
                      (Ref: {record.recommendation_id})
                    </span>
                  </span>
                  <StatusBadge status={record.decision} />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="AI Recommendation" value={record.action} />
                  <Field label="Human Decision" value={record.decision} />
                  <Field label="Outcome" value={outcome?.outcome_description || record.outcome} />
                  <Field label="Reviewer" value={`${record.reviewer} · ${record.reviewer_role}`} />
                  <Field label="Device" value={record.device_name} />
                  <Field label="Timestamp" value={record.timestamp} />
                </div>

                {record.override_reason && (
                  <div className="mt-4 rounded-xl bg-[var(--tl-bg-elevated)] p-4">
                    <span className="tl-field-label">Override Reason</span>
                    <p className="tl-field-value mt-1">{record.override_reason}</p>
                  </div>
                )}
                {record.notes && (
                  <div className="mt-4 rounded-xl bg-[var(--tl-bg-elevated)] p-4">
                    <span className="tl-field-label">Notes</span>
                    <p className="tl-field-value mt-1">{record.notes}</p>
                  </div>
                )}

                {/* AI Explainability & Data Quality Context */}
                <div className="mt-4 rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--tl-dell-blue-light)]">
                    AI Explainability &amp; Data Quality Context
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--tl-text-secondary)]">
                    <strong className="text-white">Sources Attributed:</strong>{" "}
                    {sources.map((s, idx) => (
                      <span key={s.name}>
                        {s.name} <span className="text-[var(--tl-text-muted)]">({s.trust})</span>
                        {idx < sources.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </p>
                  {gaps.length > 0 && (
                    <p className="mt-2 text-sm leading-relaxed">
                      <strong className="text-white">Flagged Telemetry Gaps:</strong>{" "}
                      {gaps.map((g, idx) => (
                        <span key={g.title} className="text-[var(--tl-warning)]">
                          {g.title} ({g.impact} Impact){idx < gaps.length - 1 ? " · " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                  {coreReasoning && (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--tl-text-secondary)]">
                      <strong className="text-white">Core Reasoning Step:</strong>{" "}
                      <span className="italic text-[var(--tl-text-muted)]">"{coreReasoning}"</span>
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--tl-bg-elevated)] p-4">
      <span className="tl-field-label">{label}</span>
      <p className="tl-field-value">{value}</p>
    </div>
  );
}

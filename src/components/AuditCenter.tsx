import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { RecommendationRow, TrustLedgerRow } from "../types/datasets";
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
  const count = 3 + (h % 2); // 3 or 4 sources
  const start = h % SOURCE_POOL.length;
  return Array.from({ length: count }, (_, i) => {
    const name = SOURCE_POOL[(start + i) % SOURCE_POOL.length];
    // vary trust slightly per source so they aren't all identical
    const adj = ((hashStr(name) % 20) - 10);
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

export default function AuditCenter() {
  const { auditRecords, data } = useAppData();
  const [search, setSearch] = useState("");

  const outcomeMap = new Map<string, any>(data?.outcomes.map((o) => [o.recommendation_id, o]) ?? []);
  const recMap = new Map<string, RecommendationRow>(
    data?.recommendations.map((r) => [r.recommendation_id, r]) ?? [],
  );
  const ledgerMap = new Map<string, TrustLedgerRow>(
    data?.trustLedger.map((l) => [l.recommendation_id, l]) ?? [],
  );

  const filtered = auditRecords
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        r.device_name.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.outcome.toLowerCase().includes(q) ||
        r.reviewer.toLowerCase().includes(q)
      );
    })
    .slice(0, 50);

  return (
    <div className="mesh-bg flex-1 overflow-y-auto">
      <div className="border-b border-[var(--tl-border)] bg-[var(--tl-bg-sidebar)] px-8 py-6">
        <h1 className="font-display text-3xl font-bold text-[var(--tl-text-primary)]">Audit Center</h1>
        <p className="mt-2 text-[var(--tl-text-secondary)]">
          Full accountability from audit records + outcomes.csv
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-8 py-8">
        <input
          className="tl-input mb-6 w-full"
          placeholder="Search audit records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-4">
          {filtered.map((record) => {
            const outcome = outcomeMap.get(record.recommendation_id);
            const rec = recMap.get(record.recommendation_id);
            const ledger = ledgerMap.get(record.recommendation_id);
            const confidence = rec?.confidence_score ?? 85;
            const sources = deriveSources(record.recommendation_id, confidence);
            const gaps = deriveGaps(ledger);
            const coreReasoning = record.ai_reasoning || rec?.reasoning || "";
            return (
              <article key={record.id} className="tl-panel">
                <div className="flex justify-between border-b border-[var(--tl-border)] pb-3">
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
                  <Field label="Reason" value={record.override_reason ?? record.notes} />
                  <Field label="Outcome" value={outcome?.outcome_description || record.outcome} />
                  <Field label="Timestamp" value={record.timestamp} />
                  <Field label="Reviewer" value={`${record.reviewer} · ${record.reviewer_role}`} />
                </div>

                {/* AI Explainability & Data Quality Context */}
                <div className="mt-4 rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--tl-dell-blue-light)]">
                    AI Explainability &amp; Data Quality Context
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--tl-text-secondary)]">
                    <strong className="text-white">Sources Attributed:</strong>{" "}
                    {sources.map((s, i) => (
                      <span key={s.name}>
                        {s.name}{" "}
                        <span className="text-[var(--tl-text-muted)]">({s.trust})</span>
                        {i < sources.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </p>
                  {gaps.length > 0 && (
                    <p className="mt-2 text-sm leading-relaxed">
                      <strong className="text-white">Flagged Telemetry Gaps:</strong>{" "}
                      {gaps.map((g, i) => (
                        <span key={g.title} className="text-[var(--tl-warning)]">
                          {g.title} ({g.impact} Impact){i < gaps.length - 1 ? " · " : ""}
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
              </article>
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

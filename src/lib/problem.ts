import { RecommendationRow, EvidenceWeightRow } from "../types/datasets";

/**
 * Maps an AI recommended action to the plain-language problem it responds to.
 * Used to show "what's wrong" before "what to do".
 */
const ACTION_PROBLEM: Record<string, string> = {
  "Force Password Reset": "Possible account compromise",
  "Quarantine Device": "Possible active malware infection",
  "Isolate Endpoint": "Possible active malware infection",
  "Restrict Network Access": "Suspicious network activity",
  "Deploy Security Patch": "Unpatched security vulnerability",
  "Escalate to Human Review": "Ambiguous threat requiring review",
  "Revoke Admin Credentials": "Risky privileged-access activity",
  "Monitor Device Activity": "Anomalous device behavior",
};

/** Short one-line problem for dashboard cards. */
export function shortProblem(rec: RecommendationRow): string {
  const base = ACTION_PROBLEM[rec.action] ?? `${rec.severity}-severity security threat`;
  return `${base} on ${rec.device_name}`;
}

/** Fuller plain-language problem statement for the Recommendation Explorer banner. */
export function problemDetail(rec: RecommendationRow, evidence: EvidenceWeightRow[]): string {
  const top = [...evidence]
    .sort((a, b) => b.weight_percentage - a.weight_percentage)
    .slice(0, 3)
    .map((e) => e.evidence_type);
  const base = ACTION_PROBLEM[rec.action] ?? "A potential security threat";
  const where = `${rec.device_name} (${rec.device_type}, ${rec.department})`;
  if (top.length > 0) {
    return `${base} detected on ${where}. The strongest warning signs are ${top.join(", ")}.`;
  }
  return `${base} detected on ${where}.`;
}

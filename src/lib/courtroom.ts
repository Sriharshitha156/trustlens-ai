import { RecommendationBundle } from "../types/datasets";

export interface CourtroomAnalysis {
  advocate: string[];
  challenger: string[];
  score: number; // disagreement 0–100 (higher = more caution warranted)
  band: "Low" | "Moderate" | "High";
  needsReview: boolean;
}

/**
 * High-Risk Decision Courtroom analysis.
 * Builds Advocate (for action) and Challenger (for caution) arguments from the
 * SAME evidence already in the bundle — no new facts, no LLM, fully deterministic.
 * Also computes a disagreement score that signals when human review is needed.
 */
export function courtroomAnalysis(bundle: RecommendationBundle): CourtroomAnalysis {
  const rec = bundle.recommendation;
  const ledger = bundle.trustLedger;
  const evidence = [...bundle.evidenceWeights].sort(
    (a, b) => b.weight_percentage - a.weight_percentage,
  );

  // ---- Advocate: why the action SHOULD be taken (verified evidence only) ----
  const advocate: string[] = [];
  evidence.slice(0, 3).forEach((e) =>
    advocate.push(`${e.evidence_type} (${e.weight_percentage}% weight): ${e.description}`),
  );
  if (ledger && ledger.past_similar_cases > 0) {
    advocate.push(
      `${ledger.correct_recommendations} of ${ledger.past_similar_cases} similar past cases were correctly resolved by "${rec.action}".`,
    );
  }
  if (bundle.businessImpact) {
    advocate.push(
      `Acting now is projected to reduce risk by ${bundle.businessImpact.risk_reduction_pct}% for ${bundle.businessImpact.affected_users} affected user(s).`,
    );
  }
  if (advocate.length === 0) {
    advocate.push(`Security indicators on ${rec.device_name} support taking "${rec.action}".`);
  }

  // ---- Challenger: why CAUTION may be warranted (same evidence, reinterpreted) ----
  const challenger: string[] = [];
  if (bundle.counterConsideration?.counter_consideration) {
    challenger.push(bundle.counterConsideration.counter_consideration);
  }
  (ledger?.known_weaknesses ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .forEach((w) => challenger.push(`Model limitation: ${w}.`));
  if (rec.confidence_score < 80) {
    challenger.push(
      `Confidence is "${rec.confidence}" (${rec.confidence_score}%) — the evidence is not conclusive.`,
    );
  }
  if (ledger && ledger.incorrect_recommendations > 0) {
    challenger.push(
      `This model was wrong ${ledger.incorrect_recommendations} time(s) on similar cases — a false positive is possible.`,
    );
  }
  if (challenger.length === 0) {
    challenger.push("No strong counter-indicators found — but confirm telemetry is complete before acting.");
  }

  // ---- Disagreement score ----
  const conf = rec.confidence_score ?? 80;
  const reliability = ledger?.historical_reliability_score ?? 90;
  const total = ledger ? ledger.correct_recommendations + ledger.incorrect_recommendations : 0;
  const fpRate = total > 0 ? (ledger!.incorrect_recommendations / total) * 100 : 0;

  const score = Math.max(
    0,
    Math.min(100, Math.round(0.45 * (100 - conf) + 0.35 * (100 - reliability) + 0.2 * fpRate)),
  );
  // Thresholds calibrated to the dataset's disagreement distribution
  // (max ≈ 39, median ≈ 13): High flags the most contested ~12% of high-risk cases.
  const band: CourtroomAnalysis["band"] = score >= 30 ? "High" : score >= 15 ? "Moderate" : "Low";

  return { advocate, challenger, score, band, needsReview: band === "High" };
}

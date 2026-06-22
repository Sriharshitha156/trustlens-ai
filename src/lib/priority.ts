import { RecommendationRow } from "../types/datasets";
import { buildIndexes } from "./dataLoader";

type Indexes = ReturnType<typeof buildIndexes>;

const RISK_SCORE: Record<string, number> = { Critical: 100, High: 75, Medium: 50, Low: 25 };
const IMPACT_SCORE: Record<string, number> = { Severe: 100, High: 80, Moderate: 55, Low: 30 };

export interface PriorityFactors {
  score: number;
  ageDays: number;
  impactLevel: string;
  riskLevel: string;
}

/**
 * Composite triage priority (0–100): blends risk, business impact, how long the
 * issue has been open (aging), and confidence. Transparent and deterministic.
 *   priority = 0.35*risk + 0.30*businessImpact + 0.20*aging + 0.15*confidence
 */
export function priorityFactors(rec: RecommendationRow, indexes: Indexes): PriorityFactors {
  const risk = RISK_SCORE[rec.risk_level] ?? RISK_SCORE[rec.severity] ?? 50;
  const bi = indexes.businessImpact.get(rec.recommendation_id);
  const impactLevel = bi?.impact_level ?? "Low";
  const business = IMPACT_SCORE[impactLevel] ?? 50;
  const aging = indexes.aging.get(rec.recommendation_id);
  const ageDays = aging?.age_days ?? 0;
  const agingScore = Math.min(ageDays / 30, 1) * 100;
  const confidence = rec.confidence_score ?? 70;

  const score = Math.round(0.35 * risk + 0.3 * business + 0.2 * agingScore + 0.15 * confidence);
  return { score, ageDays, impactLevel, riskLevel: rec.risk_level };
}

export function priorityBand(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 75) return "Critical";
  if (score >= 55) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export function priorityColor(score: number): string {
  // AA-contrast-safe brights for text/borders on the dark base.
  const band = priorityBand(score);
  if (band === "Critical") return "#F87171"; // red-400
  if (band === "High") return "#FBBF24"; // amber-400
  if (band === "Medium") return "#38BDF8"; // sky-400
  return "#CBD5E1"; // slate-300
}

# TrustLens AI — Product & Technical Specification

**Version:** 1.0 · **Team:** AI Mavericks · **Event:** Dell AI Future Minds Hackathon 2026
**Theme:** Transparent & Trustworthy AI Agent Interfaces

---

## 1. Overview

TrustLens AI is a web-based, desktop-first governance interface that makes AI-driven
security recommendations **transparent, explainable, accountable, and human-controlled**.
It is designed for IT administrators and security analysts who must act on AI recommendations
(e.g. *quarantine device*, *force password reset*) without an ML background.

The platform does not train or run a live model. It **simulates AI agent outputs** from
synthetic IT datasets and focuses entirely on the **user experience of trust** — the interface
layer that turns an opaque recommendation into a decision a human can understand and own.

---

## 2. Problem Statement

Enterprise AI agents increasingly act semi-autonomously, but their interfaces are opaque:

| Dimension | Problem |
|-----------|---------|
| **Opacity** | Users can't see *why* a recommendation was made — what data, what logic, what alternatives. |
| **Calibration uncertainty** | A bare "87%" gives no basis for deciding whether to trust or question. |
| **Accountability gap** | When AI is wrong, there's no accessible audit trail to course-correct or escalate. |

The result is a **trust deficit**: hesitation, manual overrides, or avoidance of AI features.

---

## 3. Goals & Non-Goals

### Goals
- Surface AI reasoning in **plain, non-technical language**.
- Communicate **confidence and uncertainty** as qualitative bands, never raw probabilities.
- Attribute **data sources** behind every recommendation.
- Expose **known limitations** and scope boundaries.
- Keep a **human in the loop** for every consequential action.
- Maintain a **transparent, searchable audit trail**.
- Validate the design through **usability testing**.

### Non-Goals
- Training or fine-tuning an ML model.
- Building a production backend or persistent database.
- Full mobile UI (desktop/web-first only).
- Legal/regulatory compliance frameworks.

---

## 4. Target Users (Personas)

| Persona | Priority | Description | Capabilities in app |
|---------|----------|-------------|---------------------|
| IT Administrator | Primary | Manages 500–5,000 endpoints; non-ML; high-stakes daily decisions. | Full governance, audit, trust analytics, AI health, decision authority. |
| Security Analyst | Secondary | Reviews flagged anomalies; needs confidence + sources to escalate. | Evidence, similar cases, outcome learning, decision authority. |
| Non-technical stakeholder / Employee | Tertiary | Reviews AI activity in plain language. | Personal dashboard, recommendations, notifications (no org data). |

Roles are enforced via `src/roleConfig.ts` (role-gated navigation and permissions).

---

## 5. The Five Mandatory Transparency Elements

| # | Element | Implementation | Component |
|---|---------|----------------|-----------|
| 1 | Reasoning steps | 7-step "Why Did The AI Recommend This?" + evidence weighting | `ReasoningStepsPanel`, `EvidenceWeightingChart` |
| 2 | Confidence level | Qualitative bands (High / Moderate / Review Recommended / Low) + explanation | `RecommendationExplorer`, dataset `confidence` |
| 3 | Data source attribution | Source cards with trust-level badges + attribution line | `DataSourceAttributionPanel` |
| 4 | Known limitations | Limitation warning + flagged gaps + counter-consideration + ledger weaknesses | `AILimitationPanel`, `CounterConsiderationPanel`, `TrustLedgerPanel` |
| 5 | Human-in-the-loop | Approve / Override / Escalate + risk-scaled approval gate | `RecommendationExplorer`, `AdaptiveApprovalGate` |

---

## 6. Functional Specification (Features)

### 6.1 Recommendation (Incident) Explorer
Detailed view of a single recommendation, ordered problem-first: **Problem Banner** (what's wrong) →
**Trust Ledger** → **Why Did The AI Recommend This?** box → **Decision Courtroom** (High/Critical only)
→ Outcome Learning → AI Limitation Awareness → AI Incident Cards (only if an incident exists) →
Adaptive Approval Gate → Human Review Controls → Audit Trail.

The **"Why" box** lists six factors — Counter Consideration, Reasoning, Data Source Attribution,
Multi-Agent Handoff, Impact Review, Business Impact Score — each as a heading with a **"Know more"**
modal and a **"Mark reviewed"** toggle. Marking factors reviewed auto-completes the approval gate.

### 6.2 Problem-First Framing
Every recommendation opens with a plain-language **Problem Banner** stating what is wrong (derived
from action, severity, device, and top evidence) before showing the recommended fix.

### 6.3 Confidence & Calibration
- Confidence shown as a labelled band with a plain-language explanation.
- Paired with the **Trust Ledger** (historical correct/incorrect counts, reliability score, known
  weaknesses) so users calibrate from history, not a single number.

### 6.4 Adaptive Approval Gate
Approval friction scales with risk: Low → one-click; Medium → evidence review; High → evidence +
impact review; Critical → + written justification. Evidence/impact steps auto-complete from the
"Why" box review toggles; high Courtroom disagreement forces written justification.

### 6.5 High-Risk Decision Courtroom *(signature feature, High/Critical only)*
An **Advocate Agent** (arguments for action) and a **Challenger Agent** (arguments for caution)
interpret the *same evidence* — no new facts. A **disagreement score** (from confidence, reliability,
and false-positive history) drives a meter; **High** disagreement raises a "Human Review Recommended"
alert and forces written justification. Logic in `src/lib/courtroom.ts`.

### 6.6 Multi-Agent Transparency
Visualises the chain of agents behind one recommendation: **Detection → Analysis → Remediation**,
including what each agent did and what it handed off. Derived from the recommendation bundle.

### 6.7 Dashboard — Priority Triage Browser
Search, filter (severity / status), and sort by a computed **Priority Score**
(`0.35·risk + 0.30·business impact + 0.20·aging + 0.15·confidence`, in `src/lib/priority.ts`).
Selecting a recommendation opens it in the Explorer. Role-scoped per persona.

### 6.8 Trust Analytics
Org-wide KPIs, trust timeline, **Data Feeds & Telemetry Health** (data-source trust index +
telemetry gaps profile), aggregate Trust Breakdown, Human Feedback Analytics, Outcome Learning.

### 6.9 AI Health Dashboard
Daily recommendations, accuracy, false positives, trust index, incident trends.

### 6.10 Audit & Activity Log (merged)
A single accountability page: KPI summary, search, decision filters, **CSV export**, role scoping,
and per-record **AI Explainability & Data Quality Context** (sources attributed, flagged telemetry
gaps, core reasoning) with the outcome from `outcomes.csv`.

---

## 7. Data Model

Synthetic data generated by `scripts/generate_datasets.py` (Python + Faker), 16 linked CSVs joined
on `recommendation_id` / `device_id` / `case_id`. Key entities (`src/types/datasets.ts`):

- `RecommendationRow` — action, severity, risk, confidence, reasoning, data sources, device.
- `TrustLedgerRow` — past cases, correct/incorrect, reliability score, known weaknesses.
- `EvidenceWeightRow` — evidence type, weight %, description.
- `ImpactPreviewRow`, `BusinessImpactRow` — approve/dismiss consequences, downtime, users.
- `AdaptiveApprovalRow` — per-risk review requirements.
- `CounterConsiderationRow`, `OutcomeRow`, `IncidentCardRow`, `SimilarCaseRow`.
- `TrustBreakdownRow`, `TrustTimelineRow`, `AIHealthRow`, `FeedbackRow`, `RecommendationAgingRow`.
- `AuditRecord` (runtime) — recommendation + human decision + outcome.

A `RecommendationBundle` aggregates all rows related to one recommendation for the Explorer.

---

## 8. Architecture & Tech Stack

- **Frontend:** React 19 + TypeScript, Vite 6, Tailwind CSS 4.
- **Charts:** Recharts. **Animation:** Motion. **Icons:** lucide-react. **CSV:** PapaParse.
- **State:** React Context (`AppDataContext`) loads CSVs at runtime; decisions update in-memory.
- **Client-side only** — no backend, no API key required; runs fully offline.
- **Build/checks:** `npm run dev`, `npm run build`, `npm run lint` (tsc --noEmit).

```
src/
  App.tsx                 # shell, routing, decision handling
  context/AppDataContext  # data load + derived metrics
  lib/dataLoader.ts       # CSV parse + bundle assembly
  roleConfig.ts           # persona permissions & nav
  types/datasets.ts       # data contracts
  components/             # pages
  components/features/    # transparency panels
  components/shared/      # reusable UI
```

---

## 9. Non-Functional Requirements

- **Accessibility:** WCAG 2.1 AA — keyboard focus rings, skip link, ARIA landmarks/labels,
  reduced-motion support, AA-contrast palette. Lighthouse Accessibility **100/100**
  (see `docs/ACCESSIBILITY.md`).
- **Transparency mandate:** all five elements present; no raw probabilities or ML jargon in the UI.
- **Human control mandate:** no consequential action executes without explicit confirmation.
- **Performance:** static client bundle; data loaded once at startup.
- **Privacy:** synthetic data only; no live organisational data.

---

## 10. Validation

5 moderated think-aloud usability sessions with non-ML participants across 3 representative
recommendations. Results, findings, and limitations: `docs/USABILITY_TEST_REPORT.md`
(method: `docs/USABILITY_TEST_PLAN.md`). Headline: comprehension of *what & why* is strong;
control discoverability is the top improvement area.

---

## 11. Out of Scope / Future Work

- Live Hugging Face inference + SHAP/LIME explanation rendering.
- Persistent multi-tenant audit storage.
- Formal NASA-TLX scoring and IT-admin-persona recruitment in the next test round.
- Live "Ask the Courtroom" Q&A via a real model; forced first-run onboarding (from usability findings).

---

## 12. Deliverables

| Deliverable | Location |
|-------------|----------|
| Interactive prototype | Live: https://trustlens-ai-beta.vercel.app/ · Code: https://github.com/Sriharshitha156/trustlens-ai |
| Design rationale deck | `docs/slide-deck.html` · outline `docs/DESIGN_RATIONALE_DECK.md` · regenerate `.pptx` via `scripts/generate_deck.py` |
| Usability test report | `docs/USABILITY_TEST_REPORT.md` |
| Accessibility audit | `docs/ACCESSIBILITY.md` |
| Source code | This repository |

# TrustLens AI — Design Rationale Deck

> Speaker-ready outline for the **8–12 slide** rationale deck (hackathon deliverable,
> feeds *Presentation & Communication, 10%*). Each slide = one section below.
> Paste into Google Slides / PowerPoint / Pitch; bullets are talk-track, not wall-of-text.
> Suggested total speaking time: **8–9 min**, leaving ~1 min for the live demo hand-off.

---

## Slide 1 — Title

**TrustLens AI**
*Transparent & Trustworthy AI Agent Interfaces for IT Operations*

- Team: ‹names / roles›
- Hackathon: ‹event, date›
- One-liner: *"We turn opaque AI recommendations into decisions an IT admin can understand, question, and stand behind."*

---

## Slide 2 — The Problem (interpretation)

AI agents now act semi-autonomously in IT/security platforms, but their interfaces are **opaque**:

- **Opacity** — no view into *why* a recommendation was made.
- **Calibration uncertainty** — "87%" tells you nothing about whether to trust it.
- **Accountability gap** — when AI is wrong, there's no usable audit trail.

> Result: a **trust deficit** → hesitation, manual overrides, or avoidance — killing the value AI was meant to deliver.

*(Speaker note: tie to the brief's three dimensions verbatim — shows we read it.)*

---

## Slide 3 — Who We Designed For (personas)

| Persona | Needs | What we gave them |
|---------|-------|-------------------|
| **IT Admin** (primary) | Speed, accuracy, audit traceability | Governance dashboard, Trust Analytics, Audit Center, override authority |
| **Security Analyst** (secondary) | Evidence + confidence to escalate | Evidence weighting, similar cases, outcome learning |
| **Non-tech stakeholder** (tertiary) | Plain-language "what & why" | Simplified view, plain audit log |

Key insight: *same data, three lenses* — we role-gate the UI (`roleConfig.ts`) instead of building three apps.

---

## Slide 4 — Design Principles

1. **No ML jargon, ever.** Confidence is a *band* ("High / Review Recommended"), never a raw probability.
2. **Show the reasoning, not just the verdict.** Every card answers *why*.
3. **Keep the human in the loop by default.** No consequential action without explicit confirmation.
4. **Make doubt visible.** Limitations and counter-considerations are first-class, not hidden.
5. **Calibrated trust > blind trust.** History (Trust Ledger) sits next to every confidence score.

---

## Slide 5 — The Five Mandatory Transparency Elements

> The brief requires all five. Here's where each lives in the product.

| Element | In TrustLens | Screen |
|---------|--------------|--------|
| **Reasoning steps** | "Why AI Recommended This" + Evidence Timeline + Evidence Weighting | Recommendation Explorer |
| **Confidence level** | Qualitative bands + plain explanation | Recommendation card / Explorer |
| **Data source attribution** | "Based on telemetry from N devices…" | Explorer |
| **Known limitations** | Limitations panel + Counter Consideration + Trust Ledger weaknesses | Explorer |
| **Human-in-the-loop** | Approve / Override / Escalate / Request Review + Adaptive Approval Gate | Explorer |

---

## Slide 6 — Signature Pattern #1: Calibrated Confidence

- Replaced raw `87%` with **bands + context**: *"Review Recommended — based on telemetry from 342 similar devices over 14 days."*
- Paired with the **Trust Ledger**: *"Correct 47 / Incorrect 3 · over-flags Linux devices."*
- **Why it matters:** users can't calibrate trust from a number alone — they need history + scope.

*(Demo cue: open a recommendation, show band → ledger.)*

---

## Slide 7 — Signature Pattern #2: Adaptive Approval Gate

Approval friction scales with **risk**, so low-risk isn't annoying and high-risk isn't reckless:

| Risk | Gate |
|------|------|
| Low | One-click |
| Medium | Evidence review |
| High | Evidence + impact review |
| Critical | + written justification |

**Why:** uniform friction trains users to click through everything; adaptive friction preserves attention for what matters.

---

## Slide 8 — Signature Pattern #3: Designing for Doubt

- **Counter Consideration** panel — an alternative explanation shown *next to* the recommendation, to fight automation bias.
- **Impact Preview** — consequences of *both* approving and dismissing.
- **AI Incident Cards** — when AI is wrong, a structured "what failed & lesson learned" card.

> We treat the AI's fallibility as a feature of the UI, not a secret.

---

## Slide 9 — Innovation / Stretch Goals Delivered

- **High-Risk Decision Courtroom** — Advocate vs Challenger agents debate the *same evidence*; a disagreement meter flags contested cases and forces human review.
- **Multi-Agent Transparency** — visualizes the *Detection → Analysis → Remediation* agent handoff behind one recommendation.
- **Accessibility** — WCAG 2.1 AA pass: keyboard focus rings, skip-link, landmarks, reduced-motion, AA-contrast palette (see `ACCESSIBILITY.md`).
- **Audit export** — one-click CSV of the decision trail for compliance.

---

## Slide 10 — Validation (usability testing)

- ‹N› think-aloud sessions, non-ML participants.
- **Comprehension: ‹x›/10** (target ≥ 7) — users explained *what & why* unaided.
- **NASA-TLX: ‹x›** (target < 12) — low cognitive load.
- Top change from testing: ‹one concrete fix›.

*(Full method + results: `USABILITY_TEST_REPORT.md`.)*

---

## Slide 11 — Architecture (kept honest to the brief)

- **No model trained / no prod backend** — outputs simulated from Faker-generated IT logs (`scripts/generate_datasets.py` → 16 linked CSVs).
- React 19 + Vite + Tailwind, fully client-side; loads CSVs via PapaParse.
- 60%+ effort on **design + testing**, per the brief's risk guidance.

---

## Slide 12 — Impact & Next Steps

- **Outcome:** an interface where admins develop *calibrated* trust — lean on AI where it's strong, override where they know better, always with a record.
- **Next:** live Hugging Face inference + SHAP rendering; multi-tenant audit retention; forced first-run onboarding.
- **Thank you** — live demo now.

---

### Appendix — Demo script (3–4 min)
1. Dashboard as IT Admin → open a Critical recommendation.
2. Walk the 5 elements: reasoning → confidence band → data sources → limitations → controls.
3. Trip the Adaptive Approval Gate (Critical → justification).
4. Show Counter Consideration + Impact Preview.
5. Open a High/Critical incident; show the Decision Courtroom (Advocate vs Challenger) and the disagreement alert.
6. Open Multi-Agent handoff view.
7. Approve → land on Audit Center → export CSV.

# TrustLens AI

## Transparent & Trustworthy AI Decision Intelligence Platform

TrustLens AI is an enterprise-grade platform designed to improve trust in AI-generated recommendations through transparency, explainability, accountability, historical reliability, and human oversight.

The platform transforms AI recommendations from a black-box experience into a transparent, explainable, and auditable workflow suitable for enterprise environments.

---

## 🚀 Live Demo

### Application

https://trustlens-ai-beta.vercel.app/

### GitHub Repository

https://github.com/Sriharshitha156/trustlens-ai

---

## 📌 Problem Statement

Enterprise AI systems generate recommendations such as:

- Quarantine Device
- Deploy Security Patch
- Restrict Network Access
- Escalate Security Incident

However, users often hesitate to act because they cannot understand:

- Why the AI made the recommendation
- What evidence was used
- How confident the AI is
- How reliable the AI has been historically
- What limitations exist
- What alternatives were considered
- What impact the action may have
- How decisions are recorded

This lack of transparency reduces trust, slows decision-making, and creates accountability concerns.

TrustLens AI solves this challenge by creating a human-centered interface that makes AI recommendations understandable, reviewable, and auditable.

---

## 💡 Solution

TrustLens AI transforms AI recommendations into transparent, explainable, accountable, and trustworthy decisions.

The platform enables users to:

- Understand AI reasoning
- Review supporting evidence
- Assess confidence levels
- Review historical reliability
- Explore alternative actions
- Evaluate business impact
- Learn from previous outcomes
- Identify AI limitations
- Maintain human control over critical decisions

---

# ✨ Core Features

## AI Decision Explorer

Provides complete visibility into AI-generated recommendations.

Includes:

- Recommendation Summary
- Evidence Timeline
- Confidence Explanation
- Data Sources Used
- Known Limitations
- Alternative Actions
- Human Review Controls
- Audit Trail

---

## Evidence Timeline

Displays the sequence of events that led to an AI recommendation.

```text
Failed Login Attempts
        ↓
Patch Compliance Violation
        ↓
Malware Detection
        ↓
Suspicious Network Activity
        ↓
AI Recommendation Generated
```

---

## Confidence Explanation

Instead of confusing probability percentages, TrustLens AI uses understandable confidence levels:

- High Confidence
- Moderate Confidence
- Review Recommended
- Low Confidence

Each confidence level includes a human-readable explanation.

---

## Data Source Attribution

Shows exactly what information contributed to a recommendation.

Examples:

- Device Telemetry
- Security Logs
- Patch Records
- Network Activity
- Compliance Policies

---

## AI Limitation Awareness

Highlights situations where the AI may be less reliable.

Examples:

- Missing telemetry
- Limited historical data
- Offline periods
- Unknown device states

---

## Alternative Recommendation Analysis

Compares multiple actions and explains tradeoffs.

Examples:

- Monitor Device
- Deploy Patch
- Restrict Network Access
- Quarantine Device

---

## Human-in-the-Loop Controls

Every recommendation requires human review.

Available actions:

- Approve
- Override
- Escalate
- Request Additional Review

Humans always remain in control of critical decisions.

---

# 🧠 Advanced Trust Intelligence Features

## Trust Ledger

Provides historical reliability information alongside confidence scores.

Includes:

- Correct Recommendations
- Incorrect Recommendations
- Historical Reliability Score
- Known Weaknesses
- Trust Trend Analysis

Example:

```text
Correct Recommendations: 47
Incorrect Recommendations: 3

Known Weaknesses:
- Over-flags Linux devices
- Less reliable on previously unseen device models
```

---

## Impact Preview

Shows consequences before users take action.

### If Approved

- Threat contained
- Device isolated
- Risk reduced
- Temporary user access restrictions

### If Dismissed

- Potential malware spread
- Increased security exposure
- Business impact escalation

---

## Adaptive Approval Gate

Approval requirements dynamically adjust based on risk level.

### Low Risk

- One-click approval

### Medium Risk

- Evidence review required

### High Risk

- Evidence review required
- Impact review required

### Critical Risk

- Evidence review required
- Impact review required
- Written justification required

---

## Counter Consideration Panel

Provides alternative explanations alongside recommendations.

Example:

```text
Recommendation:
Quarantine Device

Counter Consideration:
Similar behavior has previously occurred during software updates.
```

---

## Outcome Learning

Tracks outcomes:

- Recommendation Correct
- Recommendation Incorrect
- False Positive
- False Negative

Continuously improves trust assessments.

---

## AI Incident Cards

Automatically generated when recommendations fail.

Includes:

- Incident Summary
- Root Cause
- Safeguard Failure
- Corrective Action
- Lessons Learned

---

## Similar Cases Explorer

Displays historical recommendations and outcomes similar to the current case.

Includes:

- Previous incidents
- Actions taken
- Success rates
- Resolution outcomes

---

## Trust Timeline

Visualizes trust evolution over time.

Tracks:

- Monthly Trust Index
- Reliability Trends
- Outcome Performance
- Confidence Trends

---

## Evidence Weighting

Shows contribution of evidence to AI recommendations.

Example:

```text
Malware Signature → 45%
Failed Logins → 30%
Network Activity → 15%
Patch Violations → 10%
```

---

## Trust Breakdown

Explains how Trust Index scores are calculated.

Factors:

- Accuracy
- Approval Rate
- Outcome Success
- False Positive Rate

---

## AI Health Dashboard

Tracks:

- Daily Recommendations
- Accuracy
- False Positives
- Trust Index
- Incident Trends
- Reliability Metrics

---

## Business Impact Analysis

Measures organizational impact of recommendations.

Includes:

- Affected Users
- Downtime Estimates
- Risk Reduction Percentage
- Business Impact Level
- Operational Impact Assessment

---

## 🔍 Audit & Accountability Center

Tracks:

- AI Recommendations
- Human Decisions
- Override Reasons
- Timestamps
- Outcomes

Providing complete accountability and governance.

---

## 🚀 Innovation Highlights

### Historical Trust Intelligence

Trust Ledger provides historical AI reliability rather than relying solely on confidence scores.

### Human-Centered Explainability

Recommendations are presented in:

- Technical View
- Simplified View

### Adaptive Governance

Approval workflows dynamically adjust based on:

- Risk
- Confidence
- Historical Reliability
- Business Impact

### Counter Consideration Framework

Encourages users to critically evaluate recommendations.

### Continuous Outcome Learning

Improves AI trust through organizational memory and feedback.

### Transparent Failure Reporting

AI Incident Cards document failures, lessons learned, and corrective actions.

### Enterprise Trust Analytics

Trust Timeline, Trust Breakdown, and AI Health dashboards provide complete visibility into AI performance.

---

## 👥 User Roles

### IT Administrator

- View all recommendations
- Approve actions
- Override actions
- Access audit logs
- Manage governance workflows

### Security Analyst

- Analyze incidents
- Review recommendations
- Access trust analytics

### Employee

- View personal device status
- Review device-related recommendations

---

## 🏗 Application Modules

### Dashboard

Centralized overview of:

- Pending AI Decisions
- Trust Metrics
- Active Recommendations
- Human Review Queue

### Recommendation Portal

Deep explanation of every AI recommendation.

### Trust Analytics

Monitor trust trends and recommendation performance.

### Audit Center

Track all AI and human actions.

### Incident Reports

Generate comprehensive incident documentation.

### AI Health

Monitor AI system reliability and performance.

---

## 🛠 Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

### Deployment

- Vercel

---

## 📂 Project Structure

```text
trustlens-ai/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── data/
│   ├── assets/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Sriharshitha156/trustlens-ai.git
```

Move into project directory:

```bash
cd trustlens-ai
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running Locally

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The application automatically reloads when changes are made.

---

## 📦 Production Build

Create build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🏛 Architecture Flow

```text
Employee Device
        ↓
Telemetry Collection
        ↓
Risk Analysis Engine
        ↓
AI Recommendation Engine
        ↓
TrustLens Transparency Layer
        ↓
Trust Ledger
        ↓
Impact Analysis
        ↓
Human Review Interface
        ↓
Final Decision
        ↓
Outcome Learning
        ↓
Audit Logging
```

---

## 🎯 Demo Flow

1. Open Dashboard
2. Review Pending Recommendation
3. Explore Evidence Timeline
4. Understand Confidence Explanation
5. Review Trust Ledger
6. Analyze Impact Preview
7. Review Counter Consideration
8. Compare Similar Cases
9. Approve or Override Recommendation
10. Review Audit Trail
11. Generate AI Incident Report

---

## 🔮 Future Enhancements

- Real-Time Telemetry Integration
- Enterprise Authentication
- SIEM Integration
- Explainable AI APIs
- Predictive Trust Scoring
- Governance Policy Engine
- Advanced AI Monitoring
- Multi-Agent Collaboration

---

## 📈 Impact

TrustLens AI helps organizations:

- Build trust in AI systems
- Increase transparency
- Improve explainability
- Reduce automation bias
- Strengthen accountability
- Improve governance and compliance
- Support responsible AI adoption
- Enable informed decision-making
- Learn continuously from outcomes
- Keep humans in control of critical decisions

---

## ✅ Five Mandatory Transparency Elements — Where to Find Them

The problem statement requires all five transparency elements. Here is exactly where each lives:

| # | Required element | In TrustLens AI | Component |
|---|------------------|-----------------|-----------|
| 1 | **Reasoning steps** | "Why AI Recommended This" + Evidence Timeline + Evidence Weighting | `RecommendationExplorer`, `EvidenceWeightingChart` |
| 2 | **Confidence level** | Qualitative bands (High / Moderate / Review Recommended / Low) with plain-language explanation — no raw probabilities | `RecommendationExplorer`, dataset `confidence` |
| 3 | **Data source attribution** | "Data sources" line on every recommendation | `RecommendationExplorer` |
| 4 | **Known limitations** | Limitations + Counter Consideration + Trust Ledger weaknesses | `CounterConsiderationPanel`, `TrustLedgerPanel` |
| 5 | **Human-in-the-loop controls** | Approve / Override / Escalate + Adaptive Approval Gate | `RecommendationExplorer`, `AdaptiveApprovalGate` |

---

## 🌟 Stretch Goals Implemented

- **Autonomy Dial** (`AutonomyDial.tsx`) — per-recommendation control: *Always Ask Me → Recommend Only → Act & Notify*. High-risk actions automatically disable full autonomy. The human review controls adapt to the selected level.
- **Multi-Agent Transparency** (`AgentChainPanel.tsx`) — visualizes the *Detection → Analysis → Remediation* agent handoff behind each recommendation, derived live from the recommendation bundle.
- **Accessibility (WCAG 2.1 AA)** — keyboard focus rings, skip-to-content link, reduced-motion support, ARIA landmarks/labels. See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).
- **Audit CSV export** — one-click export of the (filtered) decision trail from the Activity Log for compliance.

---

## 🧩 Enhanced Explainability Panels

- **Reasoning Steps** (`ReasoningStepsPanel.tsx`) — a 7-step "Why Did The AI Recommend This?" trace (evidence → weighting → risk → history → confidence → trust ledger → business impact).
- **Data Source Attribution** (`DataSourceAttributionPanel.tsx`) — source cards with trust-level badges.
- **AI Limitation Awareness** (`AILimitationPanel.tsx`) — limitation warning + flagged telemetry gaps with impact levels.
- **Data Feeds & Telemetry Health** (`DataFeedsHealthPanel.tsx`) — org-wide data-source trust index + telemetry gaps profile in Trust Analytics.
- **AI Explainability context in the Audit Center** — sources attributed, flagged gaps, and core reasoning on every audit record.

> All panels are derived from the synthetic dataset so they stay consistent with the data shown.

---

## 📂 Documentation & Hackathon Deliverables

| Deliverable | File |
|-------------|------|
| Product & technical specification | [spec.md](spec.md) |
| Usability test report (5 participants, findings, limitations) | [docs/USABILITY_TEST_REPORT.md](docs/USABILITY_TEST_REPORT.md) · [printable HTML](docs/usability-report.html) |
| Usability test plan + NASA-TLX + comprehension quiz | [docs/USABILITY_TEST_PLAN.md](docs/USABILITY_TEST_PLAN.md) |
| Design rationale deck | [PowerPoint](docs/TrustLens-AI-Deck.pptx) · [HTML deck](docs/slide-deck.html) · [outline](docs/DESIGN_RATIONALE_DECK.md) |
| Accessibility audit (WCAG 2.1 AA · Lighthouse 100/100) | [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) |

---

## 🛠️ Local Development

```bash
# 1. (optional) regenerate the synthetic datasets — requires Python + Faker
pip install -r scripts/requirements.txt
npm run generate-data

# 2. install and run
npm install
npm run dev        # http://localhost:3000

# build & checks
npm run lint       # TypeScript type-check (tsc --noEmit)
npm run build      # production build
```

> The app runs **fully on the bundled synthetic CSVs** (no API key or backend required). The
> `@google/genai` dependency is optional and not on the critical path — TrustLens works offline.

---

## 👨‍💻 Team

**Team Name:** AI Mavericks

**Hackathon:** Dell AI Future Minds Hackathon 2026

**Theme:** Transparent & Trustworthy AI Agent Interfaces

---

## 📜 License

This project was developed for educational, research, innovation, and hackathon purposes.

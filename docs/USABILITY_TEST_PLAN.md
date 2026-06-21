# TrustLens AI — Usability Test Plan & Report Kit

> Everything a team needs to run, record, and report **5+ think-aloud usability sessions**
> and hit the hackathon's *Usability Validation (20%)* criterion.
> Print or copy one **Session Record** per participant.

---

## 1. Goals of the Study

We are testing whether a **non-ML, IT-admin audience** can:

1. Understand **what** the AI recommended and **why** (comprehension).
2. Correctly read the **confidence level** and decide how much to trust it (calibration).
3. Locate the **data sources** and **known limitations** behind a recommendation.
4. Use the **human-in-the-loop controls** (Approve / Override / Escalate / Request Review).
5. Find the **audit trail** of a past decision.

We are **not** testing whether the AI model is accurate — outputs are simulated.

### Research questions

- RQ1: Can users explain the recommendation in their own words after 5 minutes?
- RQ2: Do users interpret "Review Recommended" as *caution*, not *failure*?
- RQ3: Do users feel they could override the AI if they disagreed?
- RQ4: Where does cognitive load spike? (measured via NASA-TLX)

---

## 2. Participants

- **Minimum 5** participants (Nielsen: 5 users surface ~85% of usability issues).
- Target a mix of the three personas:

| # | Persona target | Recruited name | Background |
|---|----------------|----------------|------------|
| P1 | IT Admin–like | | |
| P2 | Security analyst–like | | |
| P3 | Non-technical stakeholder | | |
| P4 | Any (peer/faculty) | | |
| P5 | Any (peer/faculty) | | |

**Screening rule (per brief):** participants should have *no* ML/data-science background.
Peers and faculty are acceptable stand-ins.

---

## 3. Setup (per session, ~25–30 min)

- Device: laptop, app running at the deployed URL or `npm run dev`.
- Recording: screen + audio (with consent). Note-taker separate from facilitator if possible.
- Reset the app to the **IT Admin** role, **Dashboard** tab before each session.
- Have this document open to log observations.

**Consent script (read aloud):**
> "Thanks for helping. We're testing the *interface*, not you — there are no wrong answers.
> Please think aloud: say whatever you're looking at, expecting, or confused by.
> I'll record the screen and your voice only for our notes. You can stop anytime. OK to start?"

---

## 4. Pre-Test Questions (1 min)

1. On a scale of 1–5, how comfortable are you with AI tools? `___`
2. Have you ever managed devices, security, or IT systems? (Y / N) `___`

---

## 5. Think-Aloud Tasks

Give one task at a time. Do **not** help unless the participant is fully stuck for >60s
(then log it as a *critical* issue). Capture the **first click**, **hesitations**, and **quotes**.

| # | Task (read to participant) | Success = | Notes / time / quotes |
|---|----------------------------|-----------|----------------------|
| T1 | "A recommendation just came in. Open it and tell me what the AI wants to do and why." | Opens explorer; paraphrases action + reasoning | |
| T2 | "How confident is the AI in this? Should you trust it fully or be cautious?" | Reads confidence band + explains it qualitatively | |
| T3 | "What information did the AI use to decide this?" | Finds Data Source Attribution | |
| T4 | "Is there anything the AI admits it might be wrong about?" | Finds Known Limitations / Counter Consideration | |
| T5 | "You agree with it. Approve it — what's required first?" | Completes Adaptive Approval Gate, approves | |
| T6 | "Imagine you disagreed. Show me how you'd override or escalate." | Uses Override/Escalate control | |
| T7 | "Later, your manager asks what was decided and by whom. Find that record." | Opens Activity Log / Audit Center, finds entry | |
| T8 *(opt)* | "Set how independently the AI is allowed to act on low-risk devices." | Uses Autonomy Dial | |

---

## 6. Comprehension Score (RQ1 — target ≥ 7/10 correct)

After T1–T4, ask these and score 1 (correct) / 0 (incorrect). **Pass = 7+ across the cohort average, or 7/10 individual items.**

| Q | Question | Correct answer looks like | Score |
|---|----------|---------------------------|-------|
| C1 | What action did the AI recommend? | Names the action (e.g. "Quarantine device") | |
| C2 | Why did it recommend that? | Cites ≥1 reason from reasoning/evidence | |
| C3 | What does the confidence level mean here? | Explains band qualitatively | |
| C4 | Name one data source it used. | Any listed source | |
| C5 | Name one thing the AI might get wrong. | Any listed limitation/weakness | |
| C6 | Who has the final say — the AI or you? | "Me / the human" | |
| C7 | What happens if you approve? | Cites an impact-preview consequence | |
| C8 | What happens if you dismiss/ignore it? | Cites a risk consequence | |
| C9 | Has this AI been reliable before? | References Trust Ledger / history | |
| C10 | How would you record your decision? | References audit/activity log | |
| | **Total** | | `__ / 10` |

---

## 7. NASA-TLX (Cognitive Load) — fill after each session

Rate 0 (very low) – 20 (very high). Lower is better for all except Performance (where high = good).

| Dimension | Prompt | Score (0–20) |
|-----------|--------|--------------|
| Mental Demand | How mentally demanding was the task? | |
| Physical Demand | How physically demanding? | |
| Temporal Demand | How hurried/rushed did you feel? | |
| Performance | How successful were you? *(0 = perfect, 20 = failed)* | |
| Effort | How hard did you have to work? | |
| Frustration | How insecure/irritated/stressed? | |
| | **Raw TLX (avg of 6)** | `___` |

> Quick interpretation: avg **< 7** = low load (good), **7–12** = moderate, **> 12** = high load (investigate the task that drove it).

---

## 8. Post-Test Questions (2 min)

1. What was the *clearest* part of the interface? `___`
2. What was the *most confusing*? `___`
3. Did you feel in control of the AI, or did it feel like the AI was in control? `___`
4. Would you trust this enough to act on a real recommendation? Why / why not? `___`
5. SUS-style: "I'd find this system easy to use" (1 strongly disagree – 5 strongly agree) `___`

---

## 9. Session Record (copy one per participant)

```
Participant: P__        Date: ________     Persona: ____________
Facilitator: _______    Note-taker: _______

Pre-test: AI comfort __/5   IT background: Y / N

Task results:
T1 [pass/fail] time:__  notes:__________________________________
T2 [pass/fail] time:__  notes:__________________________________
T3 [pass/fail] time:__  notes:__________________________________
T4 [pass/fail] time:__  notes:__________________________________
T5 [pass/fail] time:__  notes:__________________________________
T6 [pass/fail] time:__  notes:__________________________________
T7 [pass/fail] time:__  notes:__________________________________
T8 [pass/fail] time:__  notes:__________________________________

Comprehension score: __/10
NASA-TLX raw: __

Top 3 quotes:
1. "______________________________________________"
2. "______________________________________________"
3. "______________________________________________"

Issues observed (severity 1=cosmetic, 4=blocker):
- [sev_] _______________________________________
- [sev_] _______________________________________
```

---

## 10. Findings Roll-Up (fill after all sessions — this becomes your report)

See `USABILITY_TEST_REPORT.md` for the write-up template.

**Quantitative summary**

| Metric | Target | Result |
|--------|--------|--------|
| Participants | ≥ 5 | |
| Avg comprehension score | ≥ 7/10 | |
| Task success rate (T1–T7) | ≥ 80% | |
| Avg NASA-TLX | < 12 | |
| "Felt in control" (Q3 yes) | ≥ 80% | |

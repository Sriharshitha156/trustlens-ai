# TrustLens AI — Usability Test Report

> Required hackathon deliverable (*Usability Validation, 20%*).
> Based on 5 moderated think-aloud sessions with non-ML participants.

---

## 1. Method

- **Approach:** Moderated **think-aloud** protocol — participants used the live prototype while narrating their thoughts; the facilitator gave one task at a time and observed without helping.
- **Participants:** 5 classmates, none with an AI/ML background (representative of the non-technical end of the target audience).
- **Tasks (4 core):** (T1) understand the recommendation & its reasoning, (T2) interpret the confidence level, (T3) find the data sources, (T4) override/escalate the recommendation.
- **Measures:** task success, a 5-item comprehension check, "felt in control" rating, and a short post-test interview (clearest part / most confusing part).
- **Session length:** ~10–12 min each.
- **Stimuli:** to keep results comparable, **3 representative recommendations** were used across the 5 sessions (each participant reviewed one): *Escalate to Human Review*, *Restrict Network Access*, and *Force Password Reset*. These span a range of risk levels and actions.
- **Note on NASA-TLX:** formal NASA-TLX scoring was deferred in this round due to session time limits; perceived effort was instead captured qualitatively via the interview. Recommended for the next round (see §6).

## 2. Participant Summary

| ID | Profile | Recommendation reviewed | Comprehension /5 | Felt in control | Headline reaction |
|----|---------|-------------------------|------------------|-----------------|-------------------|
| P1 | Classmate, non-technical | Escalate to Human Review | 3 | No | "It's good" |
| P2 | Classmate, non-technical | Restrict Network Access | 4 | Yes | "Good for time efficiency" |
| P3 | Classmate, non-technical | Force Password Reset | 1 | No | Could not get oriented |
| P4 | Classmate, non-technical | Force Password Reset | 5 | Yes | "Amazing — every company needs this" |
| P5 | Classmate, non-technical | Restrict Network Access | 3 | Partly | "Good if we understand how to use it" |
| **Avg** | | 3 recommendations total | **3.2 / 5 (64%)** | **~50%** | |

> **Per-recommendation note:** "Force Password Reset" (P3, P4) produced the widest spread — one participant grasped it fully (5/5) while another could not orient at all (1/5), pointing to a first-time-orientation issue rather than the recommendation itself. "Restrict Network Access" (P2, P5) was understood reasonably by both. "Escalate to Human Review" (P1) was understood but the participant could not locate the override/escalate controls.

## 3. Quantitative Results

| Metric | Target | Result | Pass? |
|--------|--------|--------|-------|
| Participants | ≥ 5 | 5 | ✅ |
| Avg comprehension | ≥ 70% | 64% (3.2/5) | ⚠️ Close — see findings |
| Task success (T1–T4) | ≥ 80% | ~65% (13/20) | ⚠️ |
| Felt in control | ≥ 80% | ~50% | ⚠️ Key insight |

**Task success heatmap** (✅ success · ⚠️ partial · ❌ failed)

| Task | P1 | P2 | P3 | P4 | P5 | Success |
|------|----|----|----|----|----|---------|
| T1 Understand recommendation + why | ✅ | ✅ | ❌ | ✅ | ✅ | 4/5 |
| T2 Interpret confidence | ✅ | ✅ | ❌ | ⚠️ | ✅ | 3.5/5 |
| T3 Find data sources | ✅ | ✅ | ❌ | ✅ | ⚠️ | 3.5/5 |
| T4 Override / escalate | ❌ | ✅ | ❌ | — | ✅ | 2/4 |

> Reading the data: the **reasoning ("what & why")** of a recommendation was the most successfully understood part (4/5). The weakest areas were **finding the human controls (override/escalate)** and **overall orientation for first-time users**.

### Results by recommendation

Because each participant reviewed one of three recommendations, we can compare how each performed:

| Recommendation | Participants | Avg comprehension | Notes |
|----------------|--------------|-------------------|-------|
| Force Password Reset | P3, P4 | 3.0 / 5 | Widest spread (1 and 5) — orientation-driven, not content-driven |
| Restrict Network Access | P2, P5 | 3.5 / 5 | Most consistent; both read evidence + confidence reasonably |
| Escalate to Human Review | P1 | 3.0 / 5 | Understood, but could not locate override/escalate controls |

**Interpretation:** comprehension varied more *between participants* than *between recommendations* — i.e., the differences came from each person's familiarity and orientation, not from any one recommendation being unclear. This suggests the transparency layout is consistent across action types, and that onboarding (not content) is the lever to pull.

## 4. Key Findings (qualitative)

### What worked
- **Plain-language reasoning lands.** P5 named *"why AI recommends this"* as the best part, and most participants could restate the recommendation and its reasons (P1: *"escalate to human review because many users are affected"*; P4: *"force password reset, because otherwise malware spreads"*). The core transparency goal is being met.
- **Strong perceived value.** P4: *"Amazing, every company needs this."* P2: *"good for time efficiency."*
- **Data sources are visible.** P2 and P5 spontaneously cited specific evidence (*"suspicious DNS query, patch violation, failed logins"*).

### Pain points (ranked by severity)
| # | Severity (1–4) | Issue | Evidence | Recommendation |
|---|----------------|-------|----------|----------------|
| 1 | 4 (blocker for 1 user) | **No clear orientation for first-time users** — P3 was lost from the start and couldn't complete any task. | P3: *"didn't understand anything."* | Force the Guided Tour / Welcome on first visit; add a one-line "start here" cue on the dashboard. |
| 2 | 3 | **Confidence % vs. Reliability % are confused.** Several users mixed the recommendation's confidence with the Trust Ledger's historical reliability. | P1: *"reliability 96% so we can trust"* (ignored confidence); P2: *"confidence 65 but reliability 98, so it depends"*; P5 read confidence but ignored reliability. | Visually separate and label the two; add a one-line explainer of how they relate. |
| 3 | 3 | **Human controls (Override/Escalate) hard to find.** | P1: *"I don't know 😅"* on the override task. | Make Approve/Override/Escalate more prominent; add hover tooltips. |
| 4 | 2 | **Automation-bias risk.** One user accepted the AI uncritically. | P4: *"100% reliable, yes."* | Surface the Counter-Consideration panel more strongly *before* the approve action. |
| 5 | 2 | **Specific panels read as confusing:** AI Incident Card (P5) and Business Impact score (P1). | P5: *"incident card is clueless"*; P1: most confusing = *"business impact score."* | Add plain-language headers / a short "what this means" line to those panels. |

### Trust & calibration insights
- **Calibration is partially working:** P2 reasoned well across two signals (*"confidence 65 but reliability 98, so it depends"*) — exactly the behavior the design intends.
- **But "in control" is the weak spot:** only about half felt in control, and this correlates with the override/escalate discoverability problem (Finding #3). Since "keeping the human in control" is the project's core thesis, this is the most important thing to improve.

## 5. Changes Made / Planned in Response

| Finding | Change | Status |
|---------|--------|--------|
| #1 First-time orientation | Ensure Welcome + Guided Tour auto-trigger on first load | Planned |
| #2 Confidence vs reliability confusion | Re-label and add an explainer line linking the two | Planned |
| #3 Controls hard to find | Increase prominence + tooltips on Approve/Override/Escalate | Planned |
| #4 Automation bias | Show Counter-Consideration prominently before approval | Planned |

## 6. Conclusion

With 5 non-technical participants, TrustLens AI succeeded at its primary goal — **making the AI's *what* and *why* understandable** (4/5 grasped the reasoning, and value reactions were strongly positive). The testing also surfaced three concrete, fixable issues: first-time orientation, the confidence-vs-reliability distinction, and the discoverability of the human-in-the-loop controls. The "felt in control" result (~50%) is the highest-priority improvement because human control is the project's central promise. 

**Next round (with more time):** add formal NASA-TLX scoring, recruit 1–2 participants closer to the IT-admin persona, and re-test after applying the Finding #1–#3 fixes to confirm comprehension and "in control" rise above target.

## 7. Limitations of This Study

We state these openly so the findings are read in the right context:

- **Sample size (n = 5).** Five is the established threshold for surfacing the majority of usability issues, but it is not statistically representative — percentages here are directional, not precise.
- **Participant profile.** All participants were classmates (non-technical), which matches the *non-ML* audience the brief targets, but none were practising IT administrators (the primary persona). Findings about IT-specific workflows should be confirmed with domain users.
- **Three stimuli.** Each participant saw one of three recommendations, so per-recommendation averages rest on 1–2 people and should be treated as illustrative.
- **Moderator effect.** Sessions were team-moderated; despite a neutral script, some social-desirability bias in the positive reactions is possible.
- **NASA-TLX deferred.** Cognitive load was captured qualitatively this round, not with the formal instrument.

None of these undermine the core conclusion (comprehension of *what & why* is strong; control discoverability needs work) — they scope how far it generalises and define the next round.

---

### Appendix A — Notable quotes
- P4: "Amazing. Every company needs this."
- P2: "It's good for time efficiency."
- P5: "It's good if we understand how to use it." / "Incident card is clueless; best part is *why AI recommends this*."
- P1: "It's good." (but could not find override; felt not in control)

### Appendix B — Raw session notes
Raw per-participant notes are retained in the team's session log (screen recordings + facilitator notes).

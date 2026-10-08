# Prompt: Recreate the "AI Ethics Lab" Activity

The deliverable is the prompt below. Copy it verbatim into a new project to rebuild the simulation with all revisions included.

---

Build a gamified, single-session web activity for an undergraduate Computer Science classroom on **explainability and transparency in AI**. Students don't just discuss the concepts — they investigate a loan denial case and design the explanation themselves.

## Scenario
A fictional lender, Credix, denied a loan to **Emily Carter**. Its denial message is opaque and unhelpful. Students act as the AI ethics team tasked with diagnosing the system's transparency failures and redesigning the explanation Emily receives.

## Activity Flow (8 steps, bi-directional navigation with back buttons)

**Step 0 — Concept Check (5 min).** Title: "Hands-on Exploration of Explainability & Transparency in AI". An onboarding panel explains the interaction rules: buttons enable only when a task is complete, and open-ended questions require a minimum character count (10 for most, 6 for final reflections). Then a multiple-choice quiz assessing key lecture terms: transparency vs. explainability, SHAP vs. LIME, how opacity exists at multiple levels, and why transparency by design matters. Students must **manually submit each answer** (clicking an option never auto-submits). Play distinct sounds for correct and wrong answers, show per-question feedback, and end with a score screen. If the score is low, show encouraging copy noting the simulation will reinforce the concepts — students can always proceed.

**Step 1 — Mission Brief (3 min).** Cinematic setup of the Credix / Emily Carter case.

**Step 2 — Evidence Board (4 min).** 7 clickable evidence cards; all must be reviewed to proceed. **Evidence progress is preserved**: if a student goes back from a later step, previously reviewed cards stay marked and they are not forced to re-review everything.

**Step 3 — Diagnose (4 min).** Multi-select of what important information is missing, pick the biggest problem with the current message, and a short free response (min 10 characters) on why the explanation is not helpful.

**Step 4 — Fix the System Map (5 min, open-ended).** Title: "Fix the System Map". Instruction: identify where each transparency issue should be addressed in the AI lifecycle and explain why. Show a lifecycle reference panel at top: Data Stage (what information is collected and used), Model Stage (how the system makes decisions), Deployment Stage (how decisions are shown to users), Monitoring Stage (how the system is reviewed and improved). Present 4 fixed issues (user doesn't understand denial; influencing factors invisible; user can't correct data; no way to challenge the decision). Each requires a **stage button selection + a short written explanation (max 400 chars)** — no dropdowns, no correctness gating. After submission, show a non-judgmental comparison: the student's stage vs. the suggested stage with a one-line rationale, plus a "System Thinking Insight" panel. Students can proceed regardless of their answers.

**Step 5 — Build (7 min).** An explanation builder with 10 selectable elements (why denied, main factors, risk score, data used, improvement steps, review request, correct info, simple explanation, detailed explanation, what's not considered). Strict **5-element limit** to force trade-offs. Live preview of the letter to Emily, plus dynamic lifecycle-coverage insight showing which stages the design addresses.

**Step 6 — Test with Stakeholders (4 min).** Three personas give feedback computed from the selected elements: **Emily** (understanding + next steps), **Jordan Lee, Product Manager** (clarity vs. overload), **Dr. Priya Sharma, Compliance Reviewer** (challenge/appeal path). Include a button to submit the explanation as final, and back navigation to revise.

**Step 7 — Reflect (3 min).** Reflection questions appear **only after the explanation is submitted as final**. Before that, students can view the full stakeholder feedback and revise. Four reflection questions (what changed after feedback; how you decided what to include; balancing clarity vs. overwhelm; does it fully solve the problem) plus three lifecycle governance questions (which stage your redesign focused on most; which stage still lacks transparency; what you'd change earlier in the lifecycle).

**Mission Complete (separate screen).** After the student clicks **Submit Responses**, show a dedicated congratulations card with the download and email buttons **centrally aligned beneath it**.

## Teacher Report
Downloadable plain-text report and a pre-filled mailto email. Teacher-friendly and easy to read, with sections: (1) Concept Check with score and per-question student answer vs. correct answer; (2) Diagnose responses; (2B) System Map with each issue's selected stage, suggested stage, match/mismatch, rationale, student explanation, and a match summary; (3) Explanation Design — initial and revised elements plus the final letter; (4) Stakeholder feedback; (5) Reflections; (6) AI Lifecycle Governance answers.

## Timer
35 minutes total: 5 for the concept check, 30 for the simulation, split logically per step (Build and Test get the most). Persistent header timer shows the step label, step countdown, and total remaining, turning warning colors when time runs low.

## Design & Feel
- Light theme: soft white and purple palette, engaging for university students. Never dark.
- Fonts: DM Sans for text, IBM Plex Mono for technical elements. Friendly, not robotic.
- Framer Motion transitions, micro-animations, tasteful emojis.
- **Sound effects via the Web Audio API only** (procedural, no external audio files): clicks, selects, correct-answer chime, wrong-answer buzz, submission, completion fanfare. Use a single shared, auto-resumed AudioContext so sounds actually play on first interaction.

## Technical
React + TypeScript + Tailwind CSS + Framer Motion. Centralize all state in a single `GameState.ts` (quiz results, evidence reviewed, diagnosis answers, system map responses with time spent, selected and revised elements, reflections, lifecycle notes). Keep every step in its own component under `src/components/game/`.

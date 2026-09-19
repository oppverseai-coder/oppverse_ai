# Oppverse AI — Project Reference & Assistant Guidelines

Oppverse is an AI-powered opportunity intelligence platform that continuously discovers, understands, ranks, and recommends personalized global opportunities (Jobs, Fellowships, Scholarships, Grants, Conferences, Travel, Accelerators) built around the individual.

---

## 🧠 Memory & Execution Logs Protocol (Mandatory)

Two persistent state tracking files live at the project root and **MUST** be updated after every successful prompt execution:

1. **[`MEMORY.md`](file:///C:/Projects/oppverse_ai/MEMORY.md):** 
   - Contains a **detailed, deep technical breakdown** of the last action carried out.
   - Documents modified files, component state, data structures, and immediate next steps.
   - Overwritten/updated dynamically to always represent the latest system snapshot so state or changes can be traced or reversed cleanly.

2. **[`LOGS.md`](file:///C:/Projects/oppverse_ai/LOGS.md):** 
   - An **append-only chronological audit trail** summarizing every single prompt/action executed from project inception to completion.
   - Format: `[YYYY-MM-DD HH:MM WAT] ACTION_TYPE | Scope: ... | Outcome: ...`

---

## 🔐 Accounts, Authentication & Deployment Identity

> [!IMPORTANT]
> **STRICT MULTI-ACCOUNT ISOLATION:** This machine hosts multiple client and venture projects. Whenever executing Git operations, Vercel deployments, or Supabase configurations for this project, you **MUST ONLY** use the specific Oppverse AI credentials and targets documented below. Never push code or deploy to any other account.

| Service | Authorized Account / Email / ID | Target URL / Reference |
| :--- | :--- | :--- |
| **Git & GitHub Email** | `oppverseai@gmail.com` | Primary author email for all commits |
| **GitHub Account** | `oppverseai-coder` | `https://github.com/oppverseai-coder` |
| **Vercel Account** | `oppverseai-coder` (`oppverseai@gmail.com`) | `https://vercel.com/oppverseai-coder` |
| **Supabase Org** | `vdzophdkuweprnjztino` | `https://supabase.com/dashboard/org/vdzophdkuweprnjztino` |

### Mandatory Pre-Flight Checks & Git Config
Before running any `git commit`, `git push`, or `vercel deploy`:
1. **Git Local Config:** Ensure repo local config is set to:
   ```bash
   git config user.name "oppverseai-coder"
   git config user.email "oppverseai@gmail.com"
   ```
2. **GitHub Auth Check:** Verify that `gh auth status` or git remote URL is linked strictly to `oppverseai-coder` (`oppverseai@gmail.com`).
3. **Vercel Check:** Verify active team/account with `vercel whoami` equals `oppverseai-coder` / `oppverseai@gmail.com`.
4. **Supabase Check:** Ensure database migrations and API keys point strictly to project under organization `vdzophdkuweprnjztino`.

---

## 📁 Project Architecture & Key Documents

- **[`MEMORY.md`](file:///C:/Projects/oppverse_ai/MEMORY.md):** Detailed memory and state of the latest executed action.
- **[`LOGS.md`](file:///C:/Projects/oppverse_ai/LOGS.md):** Chronological audit trail of all project actions.
- **[`PRD.md`](file:///c:/Projects/oppverse_ai/PRD.md):** Complete Oppverse Product Requirements Document (V1.0) — Product Thesis, 7 Major Engines, 16 Opportunity Categories, Explainable Matching, and Release Roadmap.
- **[`BUILD_PLAN.md`](file:///c:/Projects/oppverse_ai/BUILD_PLAN.md):** Technical implementation checklist and milestone roadmap.

---

## 🎯 Core Product Mechanics (Source of Truth)

1. **One Profile -> Opportunity Universe:** The user creates an Opportunity Profile once. Oppverse continuously searches for them.
2. **7 Major Engines:**
   - *Identity Engine* (Who are you)
   - *Goal Engine* (Where are you trying to go)
   - *Discovery Engine* (Ingestion, canonical deduplication, verification)
   - *Matching Engine* (Explainable fit, strict eligibility separation, readiness)
   - *Opportunity Agent* (Persistent natural-language Missions)
   - *Application Engine* (Workspace, Document Library, AI application assistant)
   - *Learning Engine* (Implicit + explicit feedback loops)
3. **Strict Eligibility & Anti-Hallucination:**
   - Never fabricate eligibility. If unclear, flag `Eligibility Unclear` and link to primary official source.
   - When helping users draft applications, ground all claims strictly in verified user profile history — never invent achievements.

---

## 🛠️ Development & Coding Standards

- **Aesthetics & UI:** Premium dark-mode/modern aesthetic, fluid micro-interactions, responsive typography, crisp information architecture.
- **Safety in Script Execution:** Node.js/Python scripts must cleanly resolve all promises/code paths without hanging.

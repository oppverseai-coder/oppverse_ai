# Oppverse AI — Project Reference & Assistant Guidelines

> [!CRITICAL]
> **MANDATORY PRE-FLIGHT INSTRUCTION:**
> Every AI agent (Antigravity, Claude, Codex, Cursor) **MUST ALWAYS** read and adhere to [`ANTIGRAVITY.md`](file:///C:/Projects/oppverse_ai/ANTIGRAVITY.md) and its 20 Immutable Rules before touching any code or making any modifications in this repository.

Oppverse is an AI-powered opportunity intelligence platform that continuously discovers, understands, ranks, and recommends personalized global opportunities (Jobs, Fellowships, Scholarships, Grants, Conferences, Travel, Accelerators) built around the individual.

---

## 🚫 Antigravity & AI Agent Safeguards Contract
All development in this repository is strictly governed by the 20 Immutable Rules in [`ANTIGRAVITY.md`](file:///C:/Projects/oppverse_ai/ANTIGRAVITY.md):
- **NEVER modify or redesign UI layouts, components, cards, padding, or margins.**
- **NEVER use AI slop icons, sparkles, stars, glowing badges, or artificial gradients.**
- **NEVER add or replace any icon without asking for user permission first.**
- **NEVER touch design tokens, typography, or theme architecture.**
- **NEVER modify the public landing page (`app/page.tsx` / `/`).**
- **Antigravity is restricted strictly to backend logic, API routes, data pipelines, error fixes, and build validations.**

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

- **[`ANTIGRAVITY.md`](file:///C:/Projects/oppverse_ai/ANTIGRAVITY.md):** The 20 Immutable Safeguards & Design Rules for AI assistants.
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

## 🎨 Immutable Design, Brand & Theme Contract (Mandatory)

Before any UI, styling, navigation, authentication, shell, route, Figma, generator, or deployment work, read and follow [`docs/DESIGN_AND_ROUTE_CONTRACT.md`](docs/DESIGN_AND_ROUTE_CONTRACT.md) and [`ANTIGRAVITY.md`](ANTIGRAVITY.md).

- Do not modify Oppverse branding, typography, color identity, light/dark theme architecture, selected-state behavior, landing-page presentation, or application layout as collateral work.
- Oppverse violet is reserved for primary actions, selected filters, active navigation, and focus states. Inactive controls remain neutral in both themes.
- Dark mode remains near-black. Light mode remains a true-white workspace with warm off-white navigation. The landing page remains independently dark.
- Do not introduce gradients, glow, neon, AI sparkles, emoji icons, decorative generated icons, or a second icon system.
- Do not let Figma imports, UI generators, formatters, component libraries, or automated agents overwrite protected files or establish a parallel design system.
- A change to any protected rule requires an explicit user request naming that exact change. General requests such as “improve,” “fix,” “deploy,” “add auth,” or “build onboarding” do not grant permission.

---

## 🚧 Route Ownership Contract (Mandatory)

The public website and authenticated product are deliberately separate. This contract must be preserved in every change:

| Route | Owner | Rule |
| :--- | :--- | :--- |
| `/` | Public landing page | This is the main domain and must remain a complete public marketing page. Never replace it with the dashboard and never redirect it to `/app`. |
| `/app` | Opportunity Universe | This is the authenticated application home. It must remain protected by authentication. |
| `/login`, `/signup` | Authentication | Public auth routes. Successful signup proceeds directly to `/onboarding`. |
| `/onboarding` | Post-signup onboarding | Protected route for incomplete profiles. |

Additional invariants:

- `app/page.tsx` owns the public landing page. Do not move the authenticated dashboard into this file.
- `app/app/page.tsx` owns the Opportunity Universe dashboard.
- The sidebar, mobile navigation, application logo, and authenticated dashboard links must use `/app` for Opportunity Universe.
- The application shell, sidebar, and authenticated header must not wrap the public landing page.
- Middleware must protect `/app` but must not protect or redirect `/`.
- Do not alter or remove the landing page while working on authentication, onboarding, dashboards, or application UI unless the user explicitly requests landing-page changes.
- Run `npm run test:routes` after navigation, shell, middleware, authentication, or routing changes. `npm run build` also runs this guard automatically.

See `docs/ROUTING.md` for the full route boundary and verification checklist.

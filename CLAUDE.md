# Oppverse AI — Project Reference & Assistant Guidelines

Oppverse is an AI-powered opportunity intelligence platform that continuously discovers, understands, ranks, and recommends personalized global opportunities (Jobs, Fellowships, Scholarships, Grants, Conferences, Travel, Accelerators) built around the individual.

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

- **[PRD.md](file:///c:/Projects/oppverse_ai/PRD.md):** Complete Oppverse Product Requirements Document (V1.0) — Product Thesis, 7 Major Engines, 16 Opportunity Categories, Explainable Matching, and Release Roadmap.
- **[CLAUDE.md](file:///c:/Projects/oppverse_ai/CLAUDE.md):** This developer & assistant instruction guide.

---

## 🎯 Core Product Mechanics (Source of Truth)

1. **One Profile $\rightarrow$ Opportunity Universe:** The user creates an Opportunity Profile once. Oppverse continuously searches for them.
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

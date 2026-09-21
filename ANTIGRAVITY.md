# ANTIGRAVITY.md — Oppverse AI Development, Design & Engineering Safeguards

> [!CRITICAL]
> **MANDATORY PRE-FLIGHT INSTRUCTION FOR ANTIGRAVITY & AI CODING AGENTS:**
> Before writing code, creating files, running scripts, or modifying logic in `oppverse_ai`, Antigravity **MUST ALWAYS** read this file in full and strictly adhere to the safeguards below.
> 
> *Synthesized from production engineering contracts and developer community feedback (Reddit r/programming, r/ChatGPTCoding, r/vibecoding) on AI agent failure modes.*

---

## 🚫 The Core Immutable Rules: What Antigravity Must NEVER Do

### 🎨 SECTION 1: DESIGN, UI & VISUAL RESTRAINT (RULES 1–6)
1. **NEVER MODIFY OR REDESIGN THE UI:** Do not redesign, rewrite, restyle, or alter existing UI components, cards, layouts, margins, or padding. Antigravity is strictly restricted to backend logic, data pipelines, API integrations, and bug fixes.
2. **NEVER USE AI SLOP ICONS, SPARKLES, OR GLOWS:** Never introduce sparkles (`✨`), star bursts, neon badges, magic wands, AI chips, halo glows, or gradient borders. The UI must remain clean, restrained, and professional.
3. **NEVER ADD AN ICON WITHOUT ASKING FIRST:** Never introduce, replace, or guess an icon. Always request explicit permission from the user before using or adding any icon.
4. **NEVER USE RAW EMOJIS IN THE INTERFACE:** Strictly zero raw text emojis in HTML, JSX, CSS, badges, buttons, tooltips, or navigation items.
5. **NEVER INTRODUCE SECONDARY ICON SETS OR UI LIBRARIES:** Do not install or import font-awesome, heroicons, radix-themes, shadcn overrides, or custom SVG paths. The approved icon baseline is Lucide outline only (when permitted).
6. **NEVER ALTER TYPOGRAPHY OR BRAND STYLES:** Do not modify font families, font pairings (Sora display / Inter body), font weights, line heights, or letter spacing in `app/globals.css` or Tailwind config.

---

### 🛡️ SECTION 2: BRAND, THEME & COLOR CONTRACT (RULES 7–10)
7. **NEVER ADD UNAPPROVED COLORS OR GRADIENTS:** Oppverse violet (`--accent`) is strictly reserved for primary actions, selected filters, active nav items, and focus rings. Inactive controls must remain neutral. Do not introduce purple/blue gradients, neon accents, or random hex codes.
8. **NEVER ALTER LIGHT/DARK THEME ARCHITECTURE:** Dark mode must remain near-black (`#09090b` / zinc-950). Light mode must remain a true-white workspace with warm off-white navigation. The landing page (`/`) must remain independently dark.
9. **NEVER OVERRIDE DESIGN TOKENS COLLATERALLY:** When fixing bugs or wiring APIs, never touch CSS custom properties, utility mappings, or design tokens in `app/globals.css`.
10. **NEVER AUTO-GENERATE VISUAL ASSETS OR PLACEHOLDERS:** Never create fake illustration graphics, banner mockups, or placeholder art without explicit user direction.

---

### 🚧 SECTION 3: ROUTING & STRUCTURAL INTEGRITY (RULES 11–14)
11. **NEVER MODIFY THE PUBLIC LANDING PAGE (`app/page.tsx` / `/`):** The public landing page is immutable. Never rewrite its marketing copy, rearrange sections, or replace it with the application dashboard.
12. **NEVER VIOLATE THE ROUTE OWNERSHIP CONTRACT:** 
    - `/` = Immutable Public Marketing Page
    - `/app` = Authenticated Opportunity Universe
    - `/login`, `/signup`, `/forgot-password` = Public Auth
    - `/onboarding` = 6-Step Setup Wizard
    Never wrap `/` with the authenticated sidebar/header chrome.
13. **NEVER ALTER SIDEBAR OR NAVIGATION BEHAVIOR:** Do not alter the collapsible desktop sidebar, mobile drawer, or bottom navigation bar layout. Sidebar defaults to collapsed on desktop without flash.
14. **NEVER RESHAPE ONBOARDING OR PROFILE FLOWS:** Do not add, remove, or reorder the 6 onboarding steps (`app/onboarding/page.tsx`) or profile structure without an explicit specification.

---

### 🧠 SECTION 4: DATA INTEGRITY & ELIGIBILITY (RULES 15–17)
15. **NEVER FABRICATE ELIGIBILITY OR ACHIEVEMENTS:** If eligibility is unclear, flag as `Eligibility Unclear` and link to official sources. Never invent qualifications, criteria, or applicant achievements.
16. **NEVER RE-INTRODUCE SAMPLE/DUMMY DATA:** Never import or recreate dummy mock data. Missing data must produce clean empty states, not synthetic fake profiles or opportunities.
17. **NEVER CORRUPT CATALOG SEED DATA:** Never delete, overwrite, or mutate the 40 verified global opportunity catalog records in Supabase unless specifically instructed.

---

### 🔐 SECTION 5: MULTI-ACCOUNT ISOLATION (RULES 18–20)
18. **NEVER COMMIT OR PUSH UNDER AN UNAUTHORIZED GIT IDENTITY:** All Git commits must strictly use `oppverseai-coder <oppverseai@gmail.com>`. Never commit or push under `WilliamsBRAND` or any other client account.
19. **NEVER DEPLOY TO UNAUTHORIZED ACCOUNTS OR TARGETS:** All Vercel deployments must target `oppverseai-coder` (`prj_8jBUAM72mrvkKkcAI56fFDZpsJQ2`). All Supabase operations must target organization `vdzophdkuweprnjztino` / project `phtikvfamizngfmliprh`.
20. **NEVER START A TASK WITHOUT READING `ANTIGRAVITY.md` FIRST:** Every agent session must inspect and honor `ANTIGRAVITY.md` before executing any file changes or commands.

---

## ⚡ SECTION 6: DEVELOPER FEEDBACK SAFEGUARDS (ANTI-SLOP & CODE HYGIENE)

*Based on developer community feedback regarding frequent AI coding agent failures:*

21. **SURGICAL EDITS ONLY (NO RECKLESS FILE WIPING):** Never replace or rewrite an entire file when a targeted 5-line diff suffices. Replacing entire files frequently strips away edge-case handling, performance optimizations, and critical fixes.
22. **NO UNSOLICITED REFACTORING OR SCOPE CREEP:** Fix only what was requested. Never refactor surrounding helper functions, change variable naming schemes, or restructure files just because you prefer a different style.
23. **PRESERVE ALL COMMENTS & ARCHITECTURAL DOCS:** Never delete existing inline comments, docstrings, or code rationale.
24. **ZERO PHANTOM DEPENDENCIES:** Never install new npm/pip packages or alter `package.json` / `package-lock.json` unless explicitly asked. Work strictly with the existing dependencies.
25. **NEVER HALLUCINATE API SIGNATURES OR SDK METHODS:** Always verify function signatures, SDK methods, and Supabase query syntax against active workspace types.
26. **NO COSMETIC CODE-CHURNING:** Never churn code by reformatting indentation, flipping single/double quotes, or re-ordering imports on working files.
27. **SAFE SCRIPT EXECUTION (NO HANGING PROMISES):** All Node.js scripts and tools must resolve in every code path and never leave dangling promises or unhandled exceptions that lock the IDE.
28. **PRE-FLIGHT BUILD & ROUTE VERIFICATION:** Always run `npm run test:routes` and `npx tsc --noEmit` before finishing any task to guarantee zero runtime regressions.

---

## 📋 Allowed Actions for Antigravity
- ✅ Fixing syntax, TypeScript, build, and runtime errors.
- ✅ Wiring backend endpoints, Supabase database queries, and data models.
- ✅ Optimizing AI matching algorithms, semantic vector embeddings, and search logic.
- ✅ Updating documentation, test scripts (`npm run test:routes`), and execution logs (`LOGS.md`, `MEMORY.md`).
- ✅ Running automated tests and verifying production builds.

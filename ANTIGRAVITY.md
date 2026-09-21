# ANTIGRAVITY.md — Oppverse AI Development & Design Safeguards

> [!CRITICAL]
> **MANDATORY PRE-FLIGHT INSTRUCTION FOR ANTIGRAVITY:**
> Before writing any code, creating any file, running any script, or modifying any existing logic in `oppverse_ai`, Antigravity **MUST ALWAYS** read this file in full and strictly adhere to the 20 Immutable Rules below.

---

## 🚫 The 20 Immutable Rules: What Antigravity Must NEVER Do

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

### 🔐 SECTION 5: MULTI-ACCOUNT ISOLATION & WORKFLOW (RULES 18–20)
18. **NEVER COMMIT OR PUSH UNDER AN UNAUTHORIZED GIT IDENTITY:** All Git commits must strictly use `oppverseai-coder <oppverseai@gmail.com>`. Never commit or push under `WilliamsBRAND` or any other client account.
19. **NEVER DEPLOY TO UNAUTHORIZED ACCOUNTS OR TARGETS:** All Vercel deployments must target `oppverseai-coder` (`prj_8jBUAM72mrvkKkcAI56fFDZpsJQ2`). All Supabase operations must target organization `vdzophdkuweprnjztino` / project `phtikvfamizngfmliprh`.
20. **NEVER START A TASK WITHOUT READING `ANTIGRAVITY.md` FIRST:** Every agent session must inspect and honor `ANTIGRAVITY.md` before executing any file changes or commands.

---

## 📋 Allowed Actions for Antigravity
- ✅ Fixing syntax, TypeScript, build, and runtime errors.
- ✅ Wiring backend endpoints, Supabase database queries, and data models.
- ✅ Optimizing AI matching algorithms, semantic vector embeddings, and search logic.
- ✅ Updating documentation, test scripts (`npm run test:routes`), and execution logs (`LOGS.md`, `MEMORY.md`).
- ✅ Running automated tests and verifying production builds.

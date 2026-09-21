# OPPVERSE AI â€” WORKING MEMORY (LATEST STATE)

**Last Updated:** 2026-09-21 06:12 WAT  
**Project:** Oppverse AI (`C:\Projects\oppverse_ai`)  
**Product Lead:** Tomide Williams  

---

## ðŸ“Œ 1. Latest Action Carried Out

- **Action:** Implemented the first functional AI-assisted personalization pipeline while preserving the existing UI and onboarding flow.
- **Identity safety:** Removed all imports of `lib/sample-data.ts` from production application paths. Missing data now produces empty/error states rather than another person's profile or recommendations.
- **AI interpretation:** Added server-side Groq profile and CV interpretation with evidence validation. Explicit structured facts remain authoritative and unsupported AI attributes are discarded.
- **Semantic layer:** Added canonical profile/opportunity representations and stored 1536-dimensional semantic vectors. Migration `005_ai_personalization.sql` is applied locally and remotely; all 40 opportunities were backfilled.
- **Hybrid matching:** Deterministic eligibility remains authoritative. Ranking now combines existing structured matching, semantic profile similarity, and stated-goal alignment.
- **Connected surfaces:** Opportunity Universe, Discover, Missions, Oppverse AI, CV parsing, and application tailoring now use authenticated user context and real database records.
- **Isolation:** Private server APIs derive identity from the Supabase session rather than trusting client-supplied user IDs. Anonymous personalization requests return HTTP 401.
- **Verification:** Route contract passed 8 checks; three materially different test profiles produced different top recommendations; goal changes altered matching signals; TypeScript and the full production build passed; 40/40 opportunities have stored semantic vectors.

### Previous Action

- **Action:** Renamed the Opportunity Universe shelf label from `Serendipity` to `Worth Exploring` while preserving the existing internal filter identifier and behavior.
- **Scope:** User-facing copy only in `app/app/page.tsx`; no matching, filtering, data, routing, or backend behavior changed.
- **Verification:** Route contract passed all 8 checks and TypeScript validation passed.

### Previous Action

- **Action:** Added permanent route-ownership protection for the public landing page and authenticated application.
- **Route contract:** `/` is permanently assigned to the public landing page; `/app` is permanently assigned to the authenticated Opportunity Universe workspace; signup proceeds to `/onboarding` before `/app`.
- **Agent protection:** Added a mandatory Route Ownership Contract to `AGENTS.md`, ensuring future coding agents receive the boundary before making changes.
- **Architecture reference:** Added `docs/ROUTING.md` with the route map, component ownership, authentication flow, and verification procedure.
- **Automated guard:** Added `scripts/verify-route-contract.mjs` and `npm run test:routes`. The guard checks landing/dashboard ownership, shell isolation, desktop/mobile navigation, and middleware protection.
- **Build enforcement:** Added the route guard as `prebuild`, so production builds fail before compilation if the landing-page contract is broken.
- **Verification:** The route contract passed all 8 checks.

### Previous Action

- **Action:** Restored the original Oppverse landing page to `/` from the immutable five-hour-old Vercel deployment without redesigning or rewriting it.
- **Recovered artifacts:** Original deployed page structure, copy, iconography, imagery, animation, responsive behavior, and exact deployed CSS values. Landing assets in `public/landing/` were preserved and reused.
- **Route preservation:** Copied the current authenticated Opportunity Universe implementation into `app/app/page.tsx`; `/app` remains the dashboard. Updated desktop and mobile Universe navigation links to `/app`.
- **Shell isolation:** `Sidebar` and `AppShell` now treat `/` as a public route, preventing application navigation and header chrome from wrapping the restored landing page.
- **Verification:** `npx tsc --noEmit` passed; local HTTP checks returned `200` for both `/` and `/app`, with their expected landing and dashboard content detected. All 45 CSS module classes referenced by the recovered page resolve successfully.

### Previous Action

- **Action:** Restored a restrained Oppverse violet interaction layer without changing application structure, data, routes, or behavior.
- **Scope:** Frontend presentation tokens and compatibility mappings in `app/globals.css` only.
- **Implementation details:**
  1. Added dark/light semantic accent tokens: `--accent`, `--accent-hover`, `--accent-strong`, `--accent-foreground`, `--accent-soft`, and `--accent-border`.
  2. Applied accent colour to primary component buttons, selected filters, active tab indicators, profile progress, and checkbox controls.
  3. Restored existing cyan/indigo utility intent through the semantic accent tokens instead of allowing the compatibility layer to flatten those utilities to gray.
  4. Refined active sidebar navigation with a quiet tinted state, slim accent rail, and accent icon while preserving navigation structure and collapse behavior.
  5. Refined opportunity-card hover borders with a restrained accent boundary and no gradient or glow.
- **Safety:** No backend, Supabase, discovery, matching, eligibility, authentication, route, content, or workflow files were modified. The parallel discovery process was left untouched.
- **Verification:** `npx tsc --noEmit` completed successfully. A second preview server was stopped after detecting the existing process on port 3000 to avoid competing Next.js build processes.

### Previous Action

- **Action:** Executed Phase A (Supabase Enterprise Database Migration & Seeding) and Phase B (Live Multi-Tenant Data Layer Integration across all Views).
- **Scope:** Full-stack Database DDL/DML, Row Level Security, pgvector, typed Supabase Client/Database helper layer, and View data hook integration.
- **Key Deliverables:**
  1. **Phase A Database Architecture (`supabase/migrations/`):**
     - Executed `001_initial_schema.sql` via Supabase Management API (`[SUPABASE_MANAGEMENT_TOKEN_SECURED]`).
     - Enabled `pgvector` and `uuid-ossp` extensions.
     - Created 7 core enterprise tables: `profiles`, `personas`, `opportunities`, `matches`, `missions`, `applications`, `vault_documents`.
     - Enabled strict Row Level Security (RLS) on all tables with tenant isolation (`auth.uid() = user_id` / `auth.uid() = id`).
     - Automated `on_auth_user_created` trigger for immediate zero-friction profile & default persona generation on signup.
     - Executed `002_seed_opportunities.sql` with verified live opportunities across all 8 categories.
  2. **Phase B Live Data Layer (`lib/supabase/db.ts`):**
     - Typed repository helpers for `fetchOpportunities`, `fetchUserProfile`, `updateUserProfile`, `fetchUserMissions`, `saveUserMission`, `fetchUserApplications`, `fetchUserVaultDocs`.
     - Graceful offline and cold-start fallback ensuring zero empty screen crashes.
  3. **Connected Live Views:**
     - `app/page.tsx` (Home Feed): Dynamically reads verified opportunities and personalized matches.
     - `app/discover/page.tsx` (Catalog): Real-time category filtering, search, and match evaluation.
     - `app/missions/page.tsx` (Autonomous Agents): Real-time mission creation and persistence to `public.missions`.
     - `app/applications/page.tsx` (Pipeline & Vault): Dynamic multi-stage Kanban and Master Document Vault.
     - `app/profile/page.tsx` (Identity Engine): Live reading/writing of profile fields, citizenship gates, skills, and personas.
     - `app/saved/page.tsx` (Bookmarks): Reads user saved opportunities.

---

## ðŸ—ï¸ 2. Current Architecture & State Snapshot

### Core Technologies
- **Framework:** Next.js 14.2.35 (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons + Framer Motion (Preserving original brand theme & dark aesthetic)
- **Navigation:** Adaptive Desktop Sidebar (Defaults collapsed) + Mobile Drawer + Bottom Tab Bar
- **Database & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL, pgvector)
- **Org Target:** `phtikvfamizngfmliprh`

### Live Routes
| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Main-domain Oppverse landing page |
| `/app` | Authenticated | Home Opportunity Universe Feed & Daily Brief Hero |
| `/login` | Public / Auth | User Sign In (Email + Google OAuth) |
| `/signup` | Public / Auth | User Registration |
| `/forgot-password` | Public / Auth | Password Recovery Request |
| `/onboarding` | Authenticated | 3-Step Setup Wizard |
| `/discover` | Authenticated / Demo | Multi-filter Opportunity Catalog across 8 Categories |
| `/missions` | Authenticated / Demo | Autonomous Search Agents Workspace |
| `/applications` | Authenticated / Demo | Application Kanban Tracker & Document Vault |
| `/agent` | Authenticated / Demo | Oppverse AI Copilot Chat |
| `/profile` | Authenticated / Demo | Multi-Persona Identity Engine & CV Parser |
| `/saved` | Authenticated / Demo | Saved & Bookmarked Opportunities |

---

## ðŸ” 3. Credentials & Isolation Checklist

- **Git & GitHub Email:** `oppverseai@gmail.com`
- **GitHub Username:** `oppverseai-coder`
- **Vercel Deployment Account:** `oppverseai-coder`
- **Supabase Organization:** `phtikvfamizngfmliprh`
- **Local Dev Server:** Active on `http://localhost:3000` (**HTTP 200 OK**)

## 2026-09-20 Landing Route Restoration

- Restored the original public landing page at `/` without visual or copy changes.
- Preserved the application dashboard at `/app` and updated internal dashboard navigation accordingly.
- Production deployment: `https://oppverseai.vercel.app`
- Verified production `/` and `/app` both return HTTP 200 with their expected content.

## 2026-09-21 Clean Signup Baseline

- Hard-deleted every Supabase Auth user and confirmed all user-owned profile, persona, match, mission, application, and vault records are empty.
- Preserved the 40 global opportunity catalogue records so new users can receive real catalogue matches after onboarding.
- Removed the obsolete sample-data module from the codebase.
- Opportunity Universe now excludes deterministically ineligible opportunities and matches below 45%; Discover remains the broad catalogue.
- Route, personalization, TypeScript, and production-build checks pass.

## 2026-09-21 Intentional Product Light Mode

- Light mode is scoped to product and authentication routes, with a near-white canvas, white surfaces, crisp neutral borders, near-black text, and restrained violet interaction accents.
- The public landing page at `/` is always rendered in its existing dark presentation and ignores the saved product theme.
- Theme preference still persists across product navigation and initializes before paint.
- Brand icons automatically use their dark-on-light asset in light mode.

## 2026-09-21 Opportunity Feed Quality Guardrails

- Opportunity Universe only presents confirmed eligible matches scoring 65% or higher; Discover remains the broader browsing surface.
- Editorial guides, listicles, and roundup pages are rejected before ranking and by future ingestion runs.
- Category labels are inferred from the opportunity content instead of blindly trusting a source-wide default.
- Generic remote and funding metadata cannot create a recommendation without category, skills, or semantic relevance evidence.

## 2026-09-21 Light Theme Contrast Direction

- Product light mode uses a true-white working canvas with subtly warm off-white navigation rather than a page-wide gray tint.
- Cards and form controls remain white; hierarchy comes from near-black text, measured neutral borders, and minimal elevation.
- Oppverse violet remains reserved for primary actions and focus states. Dark mode and the public landing page are unaffected.



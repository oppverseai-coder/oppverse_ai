# OPPVERSE AI â€” MASTER BUILD PLAN & TECHNICAL ROADMAP
**Product:** Oppverse AI (AI Opportunity Intelligence Platform)  
**Version:** 1.0  
**Founder / Product Lead:** Tomide Williams  
**Repository Path:** `C:\Projects\oppverse_ai`  
**GitHub:** `https://github.com/oppverseai-coder` (Email: `oppverseai@gmail.com`)  
**Vercel:** `https://vercel.com/oppverseai-coder`  
**Supabase Org:** `vdzophdkuweprnjztino`

---

## ðŸ›ï¸ 1. ARCHITECTURE & TECH STACK

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router, React Server Components) | Fast rendering, SEO-ready, built-in API routes, seamless Vercel integration |
| **Styling & Design** | Tailwind CSS + Lucide Icons + Framer Motion | Premium dark glassmorphism, responsive layouts, fluid micro-animations |
| **Backend & Database** | Supabase (PostgreSQL, pgvector, Row Level Security) | Relational integrity, vector search for profile-to-opportunity matching, Auth |
| **Authentication** | Supabase Auth (Email magic link / password + Google OAuth) | Secure, out-of-the-box user management |
| **AI Processing** | OpenAI / Anthropic / Google Gemini APIs via Node.js | Fast JSON-structured extraction of CVs, opportunities, and match explanations |
| **Storage** | Supabase Storage Buckets (`resumes`, `portfolios`, `documents`) | Secure file storage for user documents and provider assets |
| **Hosting & CI/CD** | Vercel (Production & Preview Deployments) | Instant edge deployments linked to `oppverseai-coder` |

---

## ðŸ—„ï¸ 2. DATABASE SCHEMA DESIGN (Supabase PostgreSQL)

```sql
-- 1. PROFILES & PERSONAS
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  headline text,
  citizenship text[] default '{}',
  country_of_residence text,
  city text,
  bio text,
  years_experience integer default 0,
  career_level text, -- 'Early', 'Mid', 'Senior', 'Executive'
  skills text[] default '{}',
  education jsonb default '[]', -- [{degree, institution, field, year}]
  work_history jsonb default '[]', -- [{role, company, start, end, description}]
  goals text[] default '{}', -- Target aspirations
  opportunity_interests text[] default '{}', -- ['Jobs', 'Fellowships', 'Scholarships', 'Grants', etc.]
  remote_preference text default 'any', -- 'remote', 'hybrid', 'onsite', 'any'
  relocation_preference boolean default false,
  profile_strength integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. OPPORTUNITY REPOSITORY
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  provider text not null,
  category text not null, -- 'Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Conferences', 'Travel', 'Accelerators'
  subcategory text,
  description text not null,
  summary text,
  official_source_url text not null,
  application_url text not null,
  deadline timestamp with time zone,
  is_rolling_deadline boolean default false,
  location_type text default 'Remote', -- 'Remote', 'Physical', 'Hybrid'
  host_country text,
  eligible_countries text[] default '{}', -- ['Nigeria', 'Ghana', 'All', etc.]
  funding_status text not null, -- 'Fully Funded', 'Partially Funded', 'Paid', 'Unpaid', 'Grant Award'
  funding_amount text, -- e.g. "$50,000" or "Tuition + Â£1,500/mo stipend"
  application_complexity text default 'Moderate', -- 'Quick', 'Moderate', 'Heavy'
  required_documents text[] default '{}', -- ['CV', 'Motivation Letter', 'References']
  experience_required text,
  education_required text,
  verification_status text default 'Verified', -- 'Verified', 'Recently Checked', 'Unverified', 'Closed'
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. MATCHES & INTELLIGENCE
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  match_score integer not null, -- 0 to 100
  match_label text not null, -- 'Exceptional Match', 'Strong Match', 'Good Match', 'Worth Exploring', 'Not Eligible'
  is_eligible boolean default true,
  eligibility_status text default 'Eligible', -- 'Eligible', 'Ineligible', 'Eligibility Unclear'
  why_it_matches jsonb default '[]', -- ["Reason 1", "Reason 2"]
  watch_outs jsonb default '[]', -- ["Requires 2 references"]
  action_priority text default 'Worth Exploring', -- 'Apply Now', 'Prepare This Week', 'Worth Exploring', 'Save for Later', 'Skip'
  readiness_score integer default 50, -- 0 to 100
  created_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

-- 4. MY MISSIONS (Autonomous Search Agents)
create table public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, -- e.g. "Find Fully Funded AI Fellowships"
  query_prompt text not null,
  target_categories text[] default '{}',
  countries text[] default '{}',
  funding_preference text default 'Fully Funded',
  is_active boolean default true,
  last_run_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 5. APPLICATIONS & WORKSPACE TRACKER
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  status text default 'Saved', -- 'Saved', 'Preparing', 'Ready', 'Applied', 'Interview', 'Shortlisted', 'Won', 'Rejected', 'Withdrawn'
  checklist jsonb default '[]', -- [{task: "Update CV", completed: false}]
  notes text,
  deadline timestamp with time zone,
  applied_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

## ðŸš€ 3. STEP-BY-STEP PHASED EXECUTION ROADMAP

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                           OPPVERSE BUILD JOURNEY                            â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Phase 0       â”‚ Project Scaffold, UI Design Tokens, Supabase DB & Auth     â”‚
â”‚ Phase 1       â”‚ Profile Onboarding, CV AI Parsing & Persona Engine          â”‚
â”‚ Phase 2       â”‚ Opportunity Database & Ingestion Engine (MVP 6 Categories)  â”‚
â”‚ Phase 3       â”‚ Explainable Matching & Strict Eligibility Engine            â”‚
â”‚ Phase 4       â”‚ Home Universe, Daily Brief & Category Shelves               â”‚
â”‚ Phase 5       â”‚ Autonomous "My Missions" & Oppverse AI Chat Advisor         â”‚
â”‚ Phase 6       â”‚ Application Workspace, Document Vault & Pipeline Tracker    â”‚
â”‚ Phase 7       â”‚ Polish, Security, Multi-Account Verification & Deployment   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

### ðŸ”¹ PHASE 0: Foundations, App Shell & Supabase Setup
- [ ] **Step 0.1: Initialize Next.js Project**
  - Scaffold Next.js 14 App Router project with TypeScript and Tailwind CSS in `C:\Projects\oppverse_ai`.
  - Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
- [ ] **Step 0.2: Configure Git Identity**
  - Set local repository config:
    ```bash
    git config user.name "oppverseai-coder"
    git config user.email "oppverseai@gmail.com"
    ```
- [ ] **Step 0.3: Supabase Integration**
  - Create Supabase client helper (`lib/supabase/client.ts`, `lib/supabase/server.ts`).
  - Run the SQL schema migration in Supabase SQL editor (`vdzophdkuweprnjztino`).
  - Configure Auth flow (Email magic link / password & session cookies).
- [ ] **Step 0.4: Master App Shell & Design System**
  - Implement luxury obsidian dark theme (`#08090E` background, `#12141F` card background, `#6366F1` indigo & `#06B6D4` cyan gradients).
  - Build responsive Navigation Sidebar and Topbar (`Home`, `Discover`, `My Missions`, `Saved`, `Applications`, `Oppverse AI`, `Profile`).

---

### ðŸ”¹ PHASE 1: Opportunity Profile & Identity Engine
- [ ] **Step 1.1: CV Upload & AI Extraction API**
  - Build API route `/api/profile/parse-cv` using AI structured JSON output.
  - Extract skills, employment history, degrees, citizenship, languages, and achievements into standard JSON.
- [ ] **Step 1.2: Profile Onboarding & Verification UI**
  - Step 1: Upload CV or fill manual form.
  - Step 2: Confirm extracted data (Skills tags, Experience timeline).
  - Step 3: Opportunity Universe preferences (Jobs, Fellowships, Scholarships, Grants, Conferences, Travel).
- [ ] **Step 1.3: Explainable Profile Strength Meter**
  - Visual widget calculating profile completeness (e.g., *"78% Strength â€” Add your nationality to unlock scholarship eligibility checks"*).
- [ ] **Step 1.4: Multi-Persona Support**
  - Allow switching between Personas (e.g. *Tomide the PMM* vs *Tomide the Founder* vs *Tomide the Speaker*).

---

### ðŸ”¹ PHASE 2: Discovery Engine & Curated Opportunity DB
- [ ] **Step 2.1: Ingestion & Seed Data Suite**
  - Create a benchmark dataset of 50+ real, verified high-impact opportunities across:
    - ðŸ’¼ **Jobs:** Global remote AI, product, and tech roles hiring from Africa.
    - ðŸŽ“ **Scholarships:** Fully funded Master's/PhD (Chevening, DAAD, Mastercard Foundation, Commonwealth).
    - ðŸ›ï¸ **Fellowships:** Leadership and tech fellowships (Obama Foundation, Echoing Green, Techstars).
    - ðŸ’° **Grants:** Non-dilutive startup and research grants (Tony Elumelu, Google for Startups Africa).
    - âœˆï¸ **Travel Opportunities:** Fully funded conferences & summit speaker grants.
    - ðŸš€ **Accelerators:** Early-stage startup programs (Y Combinator, Techstars, ARM Labs).
- [ ] **Step 2.2: Discover & Search Page UI**
  - Category filters, country eligibility dropdown, funding pill filters (`Fully Funded`, `Partial`, `Paid`).
  - Opportunity Card component with deadline badges and verification tags (`Verified`, `Recently Checked`).

---

### ðŸ”¹ PHASE 3: Explainable Matching Engine
- [x] **Step 3.1: Strict Eligibility Engine**
  - Compare user profile (`citizenship`, `experience`, `education`) against opportunity criteria.
  - Immediately flag `Not Eligible` with plain-English reasons if restricted (zero false hopes).
  - Handle ambiguous criteria as `Eligibility Unclear` + `[Check Official Source]`.
- [x] **Step 3.2: Fit Scoring & Match Labels**
  - Algorithmic scoring evaluating: Relevance, Goal Alignment, Financial Fit, Experience Fit.
  - Output labels: `Exceptional Match`, `Strong Match`, `Good Match`, `Worth Exploring`.
- [x] **Step 3.3: "Why This Matches You" Card Component**
  - Display 3 core reasons why the opportunity fits the user.
  - Display watch-outs (e.g., *"Requires 2 references"*, *"Closing in 5 days"*).
  - Display estimated application effort (`Quick`, `Moderate`, `Heavy`).

---

### ðŸ”¹ PHASE 4: Home Universe & Daily Opportunity Brief
- [x] **Step 4.1: Daily Opportunity Brief Hero**
  - Personalized morning greeting: *"Good morning, Tomide. 24 new opportunities discovered. 3 Strong Matches for you today."*
  - Interactive Action Cards: `[View Match]`, `[Save]`, `[Dismiss]`.
- [x] **Step 4.2: Curated Feed Shelves**
  - â­ **Best Matches** (Highest overall fit score)
  - ðŸ†• **New Today** (Fresh opportunities added within 24h)
  - â³ **Closing Soon** (Deadlines within 14 days)
  - ðŸ’Ž **Fully Funded** (100% covered programs)
  - ðŸŽ² **You Didn't Search for This, But...** (Serendipitous discovery)
- [x] **Step 4.3: Opportunity Detail Modal / Drawer**
  - Full opportunity intelligence: Overview, Benefits, Requirements checklist, Readiness meter (`75% Ready`), and `Pursue Opportunity` button.

---

### ðŸ”¹ PHASE 5: My Missions & Oppverse AI Assistant
- [x] **Step 5.1: "My Missions" (Autonomous Agents)**
  - UI to create persistent opportunity missions (e.g., *"Find fully funded AI fellowships for Nigerians"*).
  - Live feed stream filtered strictly by each mission's criteria.
- [x] **Step 5.2: Oppverse AI Conversational Drawer**
  - Slide-out AI assistant grounded in the Opportunity Graph.
  - Quick action prompts:
    - *"What are my top 3 opportunities this week?"*
    - *"Am I eligible for this grant?"*
    - *"Generate a preparation checklist for the Berlin Fellowship."*

---

### ðŸ”¹ PHASE 6: Application Workspace & Pipeline Tracker
- [x] **Step 6.1: Application Workspace**
  - When clicking `Pursue Opportunity`, generate an active Workspace.
  - Auto-generated checklist items (`Update CV`, `Draft Statement of Purpose`, `Request Reference`).
  - Note taking & deadline countdown timer.
- [x] **Step 6.2: Kanban Pipeline Tracker**
  - Visual drag-and-drop or column view:
    $$	ext{Saved} \longrightarrow 	ext{Preparing} \longrightarrow 	ext{Ready} \longrightarrow 	ext{Applied} \longrightarrow 	ext{Interview} \longrightarrow 	ext{Won / Offer}$$
- [x] **Step 6.3: Document Vault**
  - Basic storage for Master CV, bio, headshot, portfolio links, and transcripts.

---

### ðŸ”¹ PHASE 7: QA, Security Polish & Production Deployment
- [x] **Step 7.1: Pre-Flight Account Isolation Audit**
  - Verify Git remote points strictly to `https://github.com/oppverseai-coder`.
  - Verify commit author is `oppverseai@gmail.com`.
  - Verify Vercel deployment team is `oppverseai-coder`.
  - Verify Supabase project is under org `vdzophdkuweprnjztino`.
- [x] **Step 7.2: Mobile & Tablet Responsiveness Review**
  - Ensure all feed cards, drawers, and modals render smoothly on mobile viewports.
- [x] **Step 7.3: Production Deployment**
  - Deploy to Vercel production under `oppverseai-coder`.

---

## ðŸŽ¯ IMMEDIATE NEXT ACTION (STARTING PHASE 0)

We will now immediately proceed with **Phase 0**:
1. Initialize the Next.js frontend with Tailwind CSS and dependencies inside `C:\Projects\oppverse_ai`.
2. Configure local Git identity (`oppverseai-coder` / `oppverseai@gmail.com`).
3. Set up the Supabase database connection and create the luxury dark-mode App Shell.

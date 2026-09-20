-- ==============================================================================
-- OPPVERSE AI: ENTERPRISE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target Project: phtikvfamizngfmliprh
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- 2. ENUM TYPES
do $$ begin
  create type opportunity_category as enum (
    'Jobs', 'Fellowships', 'Scholarships', 'Grants', 
    'Conferences', 'Accelerators', 'Hackathons', 'Residencies', 'Competitions', 'Speaking'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type funding_type as enum (
    'Fully Funded', 'Partially Funded', 'Paid', 'Grant Award', 'Prize Money', 'Unpaid'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type application_stage as enum (
    'Saved', 'Preparing', 'Ready', 'Applied', 'Interview', 'Won', 'Rejected', 'Withdrawn'
  );
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text,
  avatar_url text,
  headline text,
  citizenship text[] default '{}',
  country_of_residence text default 'Nigeria',
  city text,
  bio text,
  years_experience integer default 0,
  career_level text default 'Mid', -- 'Early', 'Mid', 'Senior', 'Executive'
  skills text[] default '{}',
  education jsonb default '[]'::jsonb, -- [{degree, institution, field, year}]
  work_history jsonb default '[]'::jsonb, -- [{role, company, start, end, description}]
  goals text[] default '{}',
  opportunity_interests text[] default '{"Jobs", "Fellowships", "Grants", "Conferences"}',
  remote_preference text default 'any', -- 'remote', 'hybrid', 'onsite', 'any'
  relocation_preference boolean default false,
  profile_strength integer default 50, -- 0 to 100
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. PERSONAS TABLE (Multi-Persona Engine)
create table if not exists public.personas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null, -- e.g. "Product Marketing Lead"
  role text not null,
  target_categories text[] default '{"Jobs", "Fellowships"}',
  min_compensation text,
  location_preference text default 'Remote / Worldwide',
  skills text[] default '{}',
  is_active boolean default false,
  embedding vector(1536), -- Semantic vector for matching
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. OPPORTUNITIES REPOSITORY (Global Verified Database)
create table if not exists public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  provider text not null,
  category text not null,
  subcategory text,
  description text not null,
  summary text,
  official_source_url text not null,
  application_url text not null,
  deadline timestamp with time zone,
  is_rolling_deadline boolean default false,
  location_type text default 'Remote', -- 'Remote', 'Physical', 'Hybrid'
  host_country text,
  eligible_countries text[] default '{"All"}',
  funding_status text default 'Fully Funded',
  funding_amount text, -- e.g. "â‚¬4,200/mo + Flights + Housing"
  application_complexity text default 'Moderate', -- 'Quick', 'Moderate', 'Heavy'
  required_documents text[] default '{"CV", "Motivation Letter"}',
  experience_required text,
  education_required text,
  verification_status text default 'Verified', -- 'Verified', 'Recently Checked', 'Closed'
  is_featured boolean default false,
  embedding vector(1536), -- Vector representation of opportunity requirements
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. MATCHES TABLE (Explainable Matching Engine Results)
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  persona_id uuid references public.personas(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  match_score integer not null check (match_score >= 0 and match_score <= 100),
  match_label text not null, -- 'Exceptional Match', 'Strong Match', 'Good Match', 'Worth Exploring'
  is_eligible boolean default true,
  eligibility_status text default 'Eligible', -- 'Eligible', 'Ineligible', 'Eligibility Unclear'
  why_it_matches jsonb default '[]'::jsonb, -- 3 core bullet points
  watch_outs jsonb default '[]'::jsonb, -- 2 critical warnings
  subscores jsonb default '{"category": 90, "skills": 85, "seniority": 80, "financial": 100, "logistics": 95}'::jsonb,
  readiness_score integer default 60, -- 0 to 100
  action_priority text default 'Worth Exploring', -- 'Apply Now', 'Prepare This Week', 'Worth Exploring'
  created_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

-- 7. MY MISSIONS TABLE (Autonomous Search Agents)
create table if not exists public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, -- e.g. "Find Fully Funded AI Fellowships"
  query_prompt text not null,
  target_categories text[] default '{"Fellowships", "Jobs"}',
  countries text[] default '{"Remote", "Global"}',
  funding_preference text default 'Fully Funded',
  is_active boolean default true,
  match_count integer default 0,
  last_run_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 8. APPLICATIONS WORKSPACE TABLE (Kanban Pipeline)
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  status text default 'Saved', -- 'Saved', 'Preparing', 'Ready', 'Applied', 'Interview', 'Won'
  checklist jsonb default '[]'::jsonb, -- [{id: "1", task: "Tailor CV", completed: false}]
  notes text default '',
  deadline timestamp with time zone,
  applied_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

-- 9. DOCUMENT VAULT TABLE (Master Documents Storage)
create table if not exists public.vault_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  document_type text not null, -- 'Master Resume / CV', 'Motivation Statement', 'Speaker Kit', 'Reference'
  storage_path text,
  file_size text,
  tags text[] default '{}',
  extracted_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.personas enable row level security;
alter table public.opportunities enable row level security;
alter table public.matches enable row level security;
alter table public.missions enable row level security;
alter table public.applications enable row level security;
alter table public.vault_documents enable row level security;

-- Profiles: Users can view, insert, and update only their own profile
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Personas: Isolated to persona owner
create policy "Users can manage their own personas" on public.personas
  for all using (auth.uid() = user_id);

-- Opportunities: Read-only for all authenticated & anonymous users
create policy "Opportunities are viewable by everyone" on public.opportunities
  for select using (true);

-- Matches: Isolated to user
create policy "Users can view their own matches" on public.matches
  for all using (auth.uid() = user_id);

-- Missions: Isolated to mission owner
create policy "Users can manage their own missions" on public.missions
  for all using (auth.uid() = user_id);

-- Applications: Isolated to applicant
create policy "Users can manage their own applications" on public.applications
  for all using (auth.uid() = user_id);

-- Document Vault: Isolated to document owner
create policy "Users can manage their own vault documents" on public.vault_documents
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 11. AUTOMATIC NEW USER ONBOARDING TRIGGER
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create default profile row
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );

  -- 2. Create initial default persona
  insert into public.personas (user_id, name, role, is_active)
  values (
    new.id,
    'Product Marketing Lead',
    'B2B SaaS, Positioning, Growth & Time Intelligence',
    true
  );

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 12. PERFORMANCE & VECTOR INDEXES
-- ==============================================================================

create index if not exists idx_opportunities_category on public.opportunities(category);
create index if not exists idx_opportunities_funding on public.opportunities(funding_status);
create index if not exists idx_opportunities_deadline on public.opportunities(deadline);
create index if not exists idx_matches_user_score on public.matches(user_id, match_score desc);
create index if not exists idx_applications_user_status on public.applications(user_id, status);
create index if not exists idx_missions_user on public.missions(user_id);
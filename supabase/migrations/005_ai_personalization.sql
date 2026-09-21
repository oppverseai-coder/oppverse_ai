alter table public.profiles
  add column if not exists interpreted_profile jsonb not null default '{}'::jsonb,
  add column if not exists semantic_text text,
  add column if not exists embedding vector(1536),
  add column if not exists personalization_updated_at timestamp with time zone;

alter table public.personas
  add column if not exists interpreted_profile jsonb not null default '{}'::jsonb,
  add column if not exists semantic_text text;

alter table public.opportunities
  add column if not exists interpreted_data jsonb not null default '{}'::jsonb,
  add column if not exists semantic_text text,
  add column if not exists embedding_updated_at timestamp with time zone;

create index if not exists idx_profiles_embedding_hnsw
on public.profiles using hnsw (embedding vector_cosine_ops);

comment on column public.profiles.interpreted_profile is
  'Evidence-backed AI interpretation. Explicit profile facts remain authoritative.';
comment on column public.profiles.semantic_text is
  'Canonical user representation used to derive the stored semantic vector.';
comment on column public.opportunities.semantic_text is
  'Canonical opportunity representation used to derive the stored semantic vector.';

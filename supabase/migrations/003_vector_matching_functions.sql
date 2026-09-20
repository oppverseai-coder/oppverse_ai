-- ==============================================================================
-- OPPVERSE AI: 5-LAYER VECTOR MATCHING & SEMANTIC SIMILARITY FUNCTIONS
-- Migration: 003_vector_matching_functions.sql
-- Target Project: phtikvfamizngfmliprh
-- ==============================================================================

-- 1. Create Cosine Similarity RPC Function for Opportunities
create or replace function match_opportunities_for_persona(
  query_embedding vector(1536) default null,
  match_threshold float default 0.4,
  match_limit int default 25,
  filter_category text default null
)
returns table (
  id uuid,
  title text,
  provider text,
  category text,
  subcategory text,
  description text,
  summary text,
  official_source_url text,
  application_url text,
  deadline timestamp with time zone,
  is_rolling_deadline boolean,
  location_type text,
  host_country text,
  eligible_countries text[],
  funding_status text,
  funding_amount text,
  application_complexity text,
  required_documents text[],
  experience_required text,
  education_required text,
  verification_status text,
  is_featured boolean,
  similarity float
)
language plpgsql security definer
as $$
begin
  if query_embedding is null then
    return query
    select
      o.id,
      o.title,
      o.provider,
      o.category,
      o.subcategory,
      o.description,
      o.summary,
      o.official_source_url,
      o.application_url,
      o.deadline,
      o.is_rolling_deadline,
      o.location_type,
      o.host_country,
      o.eligible_countries,
      o.funding_status,
      o.funding_amount,
      o.application_complexity,
      o.required_documents,
      o.experience_required,
      o.education_required,
      o.verification_status,
      o.is_featured,
      0.95::float as similarity
    from public.opportunities o
    where (filter_category is null or o.category = filter_category)
    order by o.is_featured desc, o.created_at desc
    limit match_limit;
  else
    return query
    select
      o.id,
      o.title,
      o.provider,
      o.category,
      o.subcategory,
      o.description,
      o.summary,
      o.official_source_url,
      o.application_url,
      o.deadline,
      o.is_rolling_deadline,
      o.location_type,
      o.host_country,
      o.eligible_countries,
      o.funding_status,
      o.funding_amount,
      o.application_complexity,
      o.required_documents,
      o.experience_required,
      o.education_required,
      o.verification_status,
      o.is_featured,
      coalesce(1 - (o.embedding <=> query_embedding), 0.85)::float as similarity
    from public.opportunities o
    where (filter_category is null or o.category = filter_category)
      and (o.embedding is null or 1 - (o.embedding <=> query_embedding) >= match_threshold)
    order by o.is_featured desc, similarity desc nulls last, o.created_at desc
    limit match_limit;
  end if;
end;
$$;

-- 2. Index for Vector Similarity (HNSW)
create index if not exists idx_opportunities_embedding_hnsw 
on public.opportunities using hnsw (embedding vector_cosine_ops);

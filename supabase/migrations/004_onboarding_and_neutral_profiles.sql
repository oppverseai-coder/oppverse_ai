alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

alter table public.profiles
  add column if not exists active_persona_id uuid references public.personas(id) on delete set null;

alter table public.personas
  add column if not exists headline text,
  add column if not exists goals text[] default '{}';

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, onboarding_completed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Remove the legacy persona that was created for every account regardless of identity.
delete from public.personas
where name = 'Product Marketing Lead'
  and role = 'B2B SaaS, Positioning, Growth & Time Intelligence'
  and not exists (
    select 1 from public.profiles p
    where p.id = personas.user_id and p.onboarding_completed = true
  );

-- CRM MVP migration: add CRM fields to contact_leads + lead_notes table
-- Run this in Supabase SQL Editor if schema.sql was already executed before this change.

-- 1) Add CRM columns to contact_leads
alter table public.contact_leads
  add column if not exists lead_status text not null default 'nuevo'
    check (lead_status in ('nuevo','contactado','interesado','propuesta_enviada','inscrito','perdido')),
  add column if not exists next_followup_at timestamptz,
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists gclid text;

-- 2) Lead notes table
create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.lead_notes enable row level security;

create policy "Admin manage lead notes"
on public.lead_notes
for all
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- 3) Admin can update contact_leads (CRM ops: change status, followup, assigned_to)
create policy "Admin update contact leads"
on public.contact_leads
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

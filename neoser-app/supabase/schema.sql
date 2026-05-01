create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'instructor', 'student')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2) not null default 0,
  currency text not null default 'PEN',
  mode text not null default 'Presencial',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  lead_id uuid,
  payment_provider text not null check (payment_provider in ('mercadopago', 'culqi', 'niubiz', 'izipay')),
  provider_payment_id text,
  amount numeric(10,2) not null,
  currency text not null default 'PEN',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'refunded')),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  message text not null,
  source text not null default 'web',
  wa_consent boolean not null default false,
  gestation_weeks smallint check (gestation_weeks between 0 and 45),
  service_interest text,
  expected_due_date date,
  lead_status text not null default 'nuevo' check (lead_status in ('nuevo','contactado','interesado','propuesta_enviada','inscrito','perdido')),
  next_followup_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  gclid text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.contact_leads enable row level security;

create policy "Profiles own read"
on public.profiles
for select
using (auth.uid() = id);

create policy "Admin manage profiles"
on public.profiles
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

create policy "Public read published courses"
on public.courses
for select
using (is_published = true);

create policy "Admin manage courses"
on public.courses
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

create policy "Users own enrollments"
on public.enrollments
for select
using (auth.uid() = user_id);

create policy "Users create own enrollments"
on public.enrollments
for insert
with check (auth.uid() = user_id);

create policy "Admin read all enrollments"
on public.enrollments
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Users create payments for own enrollments"
on public.payments
for insert
with check (
  exists (
    select 1 from public.enrollments e
    where e.id = enrollment_id and e.user_id = auth.uid()
  )
);

create policy "Users read own payments"
on public.payments
for select
using (
  exists (
    select 1 from public.enrollments e
    where e.id = enrollment_id and e.user_id = auth.uid()
  )
);

create policy "Admin read all payments"
on public.payments
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admin update payments"
on public.payments
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

create policy "Public create contact leads"
on public.contact_leads
for insert
with check (true);

create policy "Admin read contact leads"
on public.contact_leads
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Lead notes (CRM history)
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

-- Admin can update contact_leads (CRM operations)
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

-- WhatsApp opt-out list (anti-ban compliance)
create table if not exists public.wa_opt_outs (
  phone text primary key,
  opted_out_at timestamptz not null default now()
);

alter table public.wa_opt_outs enable row level security;

-- No open policy needed: service_role key bypasses RLS.
-- Only admin can read opt-outs via anon/authenticated clients.
create policy "Admin read opt-outs"
on public.wa_opt_outs
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Booking pipeline (Cal.com + pre-registro web)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  booking_status text not null default 'pending' check (booking_status in ('pending', 'confirmed', 'cancelled', 'rescheduled')),
  preferred_date date,
  preferred_time text,
  service_interest text,
  source text not null default 'web',
  notes text,
  cal_booking_uid text unique,
  cal_event_type_id integer,
  cal_starts_at timestamptz,
  cal_ends_at timestamptz,
  lead_id uuid references public.contact_leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_created_at on public.bookings(created_at desc);
create index if not exists idx_bookings_status on public.bookings(booking_status);
create index if not exists idx_bookings_source on public.bookings(source);

alter table public.bookings enable row level security;

create policy "Public create bookings"
on public.bookings
for insert
with check (true);

create policy "Admin read bookings"
on public.bookings
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admin update bookings"
on public.bookings
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

-- Email automation audit trail
create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.contact_leads(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  provider text not null default 'hubspot',
  template_key text not null,
  recipient_email text not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_events_created_at on public.email_events(created_at desc);
create index if not exists idx_email_events_status on public.email_events(status);

alter table public.email_events enable row level security;

create policy "Admin read email events"
on public.email_events
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Keep updated_at fresh on bookings
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_bookings_updated on public.bookings;
create trigger on_bookings_updated
  before update on public.bookings
  for each row execute function public.touch_updated_at();

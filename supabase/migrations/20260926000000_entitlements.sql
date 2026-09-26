-- Phase 3: paid access. Real SAT papers are grouped by year and sold per year
-- (2024 = ¥20, 2025 = ¥49, 2026 = ¥99; 2023 is free and needs no row). An
-- entitlement is a permanent unlock: one row = one student owns one year.
-- The gate is enforced in the UI; this table is the record of who bought what.
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  year integer not null check (year between 2000 and 2100),
  granted_by uuid not null references public.profiles(id) on delete restrict,
  granted_at timestamptz not null default now(),
  note text not null default '' check (char_length(note) <= 200),
  unique (student_id, year)
);

create index entitlements_student_idx
on public.entitlements (student_id);

alter table public.entitlements enable row level security;

revoke all on public.entitlements from anon, authenticated;

-- Row filtering lives in the policies below: teachers manage every row, students
-- only read their own; a student insert matches no policy and is denied.
grant select, insert, update, delete on public.entitlements to authenticated;

create policy "Teachers manage entitlements"
on public.entitlements for all to authenticated
using ((select public.is_teacher()))
with check ((select public.is_teacher()));

create policy "Students read own entitlements"
on public.entitlements for select to authenticated
using (student_id = (select auth.uid()));

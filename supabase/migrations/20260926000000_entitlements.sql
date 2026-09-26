-- Phase 3: paid access. A teacher grants a student a time-boxed entitlement that
-- unlocks the mock-test section. The gate is enforced in the UI; this table is the
-- record of who paid and until when.
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  granted_by uuid not null references public.profiles(id) on delete restrict,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  note text not null default '' check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  check (expires_at > starts_at)
);

create index entitlements_student_active_idx
on public.entitlements (student_id, expires_at desc);

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

-- Phase 4: invited teacher accounts with an annual subscription, and per-teacher
-- student isolation. Teachers other than the owner pay ¥199/year; they register
-- only through a single-use invite code, and each teacher only ever sees the
-- students that were recruited through their own invite links.

-- 1. profiles gains a student→teacher owner link and an owner (super-admin) flag.
alter table public.profiles
  add column teacher_id uuid references public.profiles(id) on delete set null,
  add column is_owner boolean not null default false;

create index profiles_teacher_idx on public.profiles (teacher_id);
create index profiles_role_idx on public.profiles (role);

-- Backfill: the site owner is the only existing teacher; every pre-existing
-- student belongs to him.
update public.profiles set is_owner = true where email = 'itspatrickzou@gmail.com';

update public.profiles
set teacher_id = (select id from public.profiles where is_owner limit 1)
where role = 'student'
  and teacher_id is null
  and (select id from public.profiles where is_owner limit 1) is not null;

-- 2. invites: one row per single-use code. A teacher invite creates a teacher
-- account + a subscription; a student invite binds the new student to its creator.
create table public.invites (
  code text primary key default replace(gen_random_uuid()::text, '-', ''),
  kind text not null check (kind in ('teacher', 'student')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  duration_days integer not null default 365 check (duration_days between 1 and 3650),
  used_by uuid references public.profiles(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index invites_created_by_idx on public.invites (created_by);

-- 3. teacher_subscriptions: one year at a time. An expired subscription leaves the
-- account and its data intact but locks the backend (see is_teacher_active).
create table public.teacher_subscriptions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  note text not null default '' check (char_length(note) <= 200),
  check (expires_at > starts_at)
);

create index teacher_subscriptions_teacher_idx on public.teacher_subscriptions (teacher_id, expires_at desc);

-- 4. Helper functions.
create function public.is_owner()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select coalesce((select is_owner from public.profiles where id = (select auth.uid())), false);
$$;

-- Active = owner, or a teacher with a non-expired subscription. Gates the paid
-- backend features; reads keep using is_teacher() so a lapsed teacher still sees
-- their own data.
create function public.is_teacher_active()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select
    coalesce((select is_owner from public.profiles where id = (select auth.uid())), false)
    or (
      (select public.is_teacher())
      and exists (
        select 1 from public.teacher_subscriptions
        where teacher_id = (select auth.uid()) and expires_at > now()
      )
    );
$$;

-- A teacher may manage a student only if that student belongs to them.
create function public.can_manage_student(target_student_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select
    (select public.is_owner())
    or exists (
      select 1 from public.profiles
      where id = target_student_id
        and teacher_id = (select auth.uid())
        and (select public.is_teacher_active())
    );
$$;

-- Consumes a single-use invite for the signed-in user. Runs as definer so it can
-- flip role / teacher_id, which the client can never write directly.
create function public.redeem_invite(invite_code text)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  target public.invites;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return 'unauthenticated';
  end if;

  select * into target from public.invites
  where code = invite_code and used_by is null
  for update;

  if not found then
    return 'invalid';
  end if;

  update public.invites
  set used_by = current_user_id, used_at = now()
  where code = target.code;

  if target.kind = 'teacher' then
    update public.profiles set role = 'teacher' where id = current_user_id;
    insert into public.teacher_subscriptions (teacher_id, expires_at)
    values (current_user_id, now() + make_interval(days => target.duration_days));
  else
    update public.profiles set teacher_id = target.created_by where id = current_user_id;
  end if;

  return target.kind;
end;
$$;

-- 5. Grants. All three helpers are definer functions; only authenticated callers.
revoke all on function public.is_owner() from public, anon;
revoke all on function public.is_teacher_active() from public, anon;
revoke all on function public.can_manage_student(uuid) from public, anon;
revoke all on function public.redeem_invite(text) from public, anon;
grant execute on function public.is_owner() to authenticated;
grant execute on function public.is_teacher_active() to authenticated;
grant execute on function public.can_manage_student(uuid) to authenticated;
grant execute on function public.redeem_invite(text) to authenticated;

revoke all on public.invites from anon, authenticated;
revoke all on public.teacher_subscriptions from anon, authenticated;
-- Renewals append a new row (see Teachers.tsx), so no update grant is needed.
grant select, insert, delete on public.invites to authenticated;
grant select, insert on public.teacher_subscriptions to authenticated;

alter table public.invites enable row level security;
alter table public.teacher_subscriptions enable row level security;

-- 6. RLS.
-- Teachers only see the students that belong to them; the owner sees everyone.
drop policy "Students view themselves; teachers view students" on public.profiles;
create policy "Users see themselves, their teacher, or their students"
on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or (select public.is_owner())
  or ((select public.is_teacher()) and teacher_id = (select auth.uid()))
);

-- A teacher only manages invites they created; only an active teacher may create one.
create policy "Active teachers manage their invites"
on public.invites for all to authenticated
using (created_by = (select auth.uid()) and (select public.is_teacher_active()))
with check (created_by = (select auth.uid()) and (select public.is_teacher_active()));

create policy "Owners manage all invites"
on public.invites for all to authenticated
using ((select public.is_owner()))
with check ((select public.is_owner()));

create policy "Teachers read own subscriptions"
on public.teacher_subscriptions for select to authenticated
using (teacher_id = (select auth.uid()) or (select public.is_owner()));

create policy "Owners manage subscriptions"
on public.teacher_subscriptions for all to authenticated
using ((select public.is_owner()))
with check ((select public.is_owner()));

-- Entitlements: a teacher may only unlock their own students, and only while active.
drop policy "Teachers manage entitlements" on public.entitlements;
create policy "Owners and active teachers manage entitlements"
on public.entitlements for all to authenticated
using ((select public.can_manage_student(student_id)))
with check ((select public.can_manage_student(student_id)));

-- Phase 3 (part B): classes. A teacher groups students so one assignment can be
-- published to a whole class. Membership is expanded into assignment_recipients
-- at publish time (a snapshot — students added later do not inherit old work).
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

alter table public.classes enable row level security;
alter table public.class_members enable row level security;

create function public.can_manage_class(target_class_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.classes
    where id = target_class_id
      and teacher_id = (select auth.uid())
      and (select public.is_teacher())
  );
$$;

create function public.is_class_member(target_class_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.class_members
    where class_id = target_class_id and student_id = (select auth.uid())
  );
$$;

revoke all on public.classes from anon, authenticated;
revoke all on public.class_members from anon, authenticated;
revoke all on function public.can_manage_class(uuid) from public, anon;
revoke all on function public.is_class_member(uuid) from public, anon;

grant select, insert, update, delete on public.classes to authenticated;
grant select, insert, delete on public.class_members to authenticated;

grant execute on function public.can_manage_class(uuid) to authenticated;
grant execute on function public.is_class_member(uuid) to authenticated;

create policy "Teachers manage their classes"
on public.classes for all to authenticated
using (teacher_id = (select auth.uid()) and (select public.is_teacher()))
with check (teacher_id = (select auth.uid()) and (select public.is_teacher()));

create policy "Students view their classes"
on public.classes for select to authenticated
using ((select public.is_class_member(id)));

create policy "Teachers manage class members"
on public.class_members for all to authenticated
using ((select public.can_manage_class(class_id)))
with check (
  (select public.can_manage_class(class_id))
  and exists (select 1 from public.profiles where id = student_id and role = 'student')
);

create policy "Students view their class memberships"
on public.class_members for select to authenticated
using (student_id = (select auth.uid()));

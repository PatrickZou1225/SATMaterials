-- Phase 2: assignments, recipients, stable question references and submissions.
create type public.assignment_status as enum ('draft', 'published', 'closed');
create type public.submission_status as enum ('in_progress', 'submitted');

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  instructions text not null default '',
  due_at timestamptz,
  status public.assignment_status not null default 'published',
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.assignment_recipients (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

create table public.assignment_questions (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  position integer not null check (position > 0),
  question_key text not null check (question_key ~ '^[a-z0-9_-]+:[a-z0-9_-]+$'),
  primary key (assignment_id, position),
  unique (assignment_id, question_key)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.submission_status not null default 'in_progress',
  score integer check (score is null or score >= 0),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique (assignment_id, student_id),
  check ((status = 'submitted') = (submitted_at is not null))
);

create table public.submission_answers (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_key text not null,
  selected_answer integer check (selected_answer between 0 and 3),
  is_correct boolean,
  answered_at timestamptz not null default now(),
  primary key (submission_id, question_key)
);

alter table public.assignments enable row level security;
alter table public.assignment_recipients enable row level security;
alter table public.assignment_questions enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_answers enable row level security;

grant select, insert, update, delete on public.assignments to authenticated;
grant select, insert, delete on public.assignment_recipients to authenticated;
grant select, insert, update, delete on public.assignment_questions to authenticated;
grant select on public.submissions to authenticated;
grant insert (assignment_id, student_id, status, started_at, submitted_at) on public.submissions to authenticated;
grant update (status, submitted_at) on public.submissions to authenticated;
grant select, delete on public.submission_answers to authenticated;
grant insert (submission_id, question_key, selected_answer, answered_at) on public.submission_answers to authenticated;
grant update (selected_answer, answered_at) on public.submission_answers to authenticated;

create function public.can_manage_assignment(target_assignment_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.assignments
    where id = target_assignment_id
      and created_by = (select auth.uid())
      and (select public.is_teacher())
  );
$$;

create function public.is_assignment_recipient(target_assignment_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.assignment_recipients r
    join public.assignments a on a.id = r.assignment_id
    where r.assignment_id = target_assignment_id
      and r.student_id = (select auth.uid())
      and a.status <> 'draft'
  );
$$;

create function public.is_submission_open(target_submission_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.submissions
    where id = target_submission_id
      and student_id = (select auth.uid())
      and status = 'in_progress'
  );
$$;

revoke all on function public.can_manage_assignment(uuid) from public, anon;
revoke all on function public.is_assignment_recipient(uuid) from public, anon;
revoke all on function public.is_submission_open(uuid) from public, anon;
grant execute on function public.can_manage_assignment(uuid) to authenticated;
grant execute on function public.is_assignment_recipient(uuid) to authenticated;
grant execute on function public.is_submission_open(uuid) to authenticated;

create policy "Teachers manage their assignments"
on public.assignments for all to authenticated
using (created_by = (select auth.uid()) and (select public.is_teacher()))
with check (created_by = (select auth.uid()) and (select public.is_teacher()));

create policy "Students view assigned published work"
on public.assignments for select to authenticated
using ((select public.is_assignment_recipient(id)));

create policy "Teachers manage assignment recipients"
on public.assignment_recipients for all to authenticated
using ((select public.can_manage_assignment(assignment_id)))
with check (
  (select public.can_manage_assignment(assignment_id))
  and exists (select 1 from public.profiles where id = student_id and role = 'student')
);

create policy "Students view their assignment links"
on public.assignment_recipients for select to authenticated
using (student_id = (select auth.uid()));

create policy "Visible assignment questions"
on public.assignment_questions for select to authenticated
using ((select public.can_manage_assignment(assignment_id)) or (select public.is_assignment_recipient(assignment_id)));

create policy "Teachers manage assignment questions"
on public.assignment_questions for all to authenticated
using ((select public.can_manage_assignment(assignment_id)))
with check ((select public.can_manage_assignment(assignment_id)));

create policy "Students view their submissions"
on public.submissions for select to authenticated
using (student_id = (select auth.uid()));

create policy "Students start their submissions"
on public.submissions for insert to authenticated
with check (
  student_id = (select auth.uid()) and (select public.is_assignment_recipient(assignment_id))
);

create policy "Students submit their in-progress submissions"
on public.submissions for update to authenticated
using (student_id = (select auth.uid()) and status = 'in_progress')
with check (
  student_id = (select auth.uid()) and (select public.is_assignment_recipient(assignment_id))
);

create policy "Teachers view assigned submissions"
on public.submissions for select to authenticated
using ((select public.can_manage_assignment(assignment_id)));

create policy "Students view their answers"
on public.submission_answers for select to authenticated
using (exists (select 1 from public.submissions where id = submission_id and student_id = (select auth.uid())));

create policy "Students add answers while in progress"
on public.submission_answers for insert to authenticated
with check ((select public.is_submission_open(submission_id)));

create policy "Students edit answers while in progress"
on public.submission_answers for update to authenticated
using ((select public.is_submission_open(submission_id)))
with check ((select public.is_submission_open(submission_id)));

create policy "Students remove answers while in progress"
on public.submission_answers for delete to authenticated
using ((select public.is_submission_open(submission_id)));

create policy "Teachers view submission answers"
on public.submission_answers for select to authenticated
using (
  exists (
    select 1 from public.submissions s
    where s.id = submission_id and (select public.can_manage_assignment(s.assignment_id))
  )
);

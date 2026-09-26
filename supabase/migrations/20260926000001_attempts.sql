-- Phase 3: attempt records. Mock-test runs are persisted so teachers can see
-- 已作答人数 / 完成率 / 平均准确率. Assignment submissions keep their own tables;
-- these cover the free-form mock-test / practice path where there is no assignment.
create type public.attempt_status as enum ('in_progress', 'submitted');

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  set_id text not null,
  module_num integer not null check (module_num > 0),
  correct_count integer check (correct_count is null or correct_count >= 0),
  total_questions integer not null check (total_questions > 0),
  status public.attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  check ((status = 'submitted') = (submitted_at is not null)),
  check (correct_count is null or correct_count <= total_questions)
);

create index attempts_student_idx on public.attempts (student_id, started_at desc);
create index attempts_module_idx on public.attempts (set_id, module_num);

create table public.attempt_answers (
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_key text not null check (question_key ~ '^[a-z0-9_-]+:[a-z0-9_-]+$'),
  selected_answer integer check (selected_answer between 0 and 3),
  is_correct boolean,
  answered_at timestamptz not null default now(),
  primary key (attempt_id, question_key)
);

alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;

create function public.is_own_attempt(target_attempt_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.attempts
    where id = target_attempt_id and student_id = (select auth.uid())
  );
$$;

create function public.is_attempt_open(target_attempt_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.attempts
    where id = target_attempt_id
      and student_id = (select auth.uid())
      and status = 'in_progress'
  );
$$;

revoke all on public.attempts from anon, authenticated;
revoke all on public.attempt_answers from anon, authenticated;
revoke all on function public.is_own_attempt(uuid) from public, anon;
revoke all on function public.is_attempt_open(uuid) from public, anon;

grant select on public.attempts to authenticated;
grant insert (student_id, set_id, module_num, total_questions, status, started_at) on public.attempts to authenticated;
grant update (correct_count, status, submitted_at) on public.attempts to authenticated;

grant select, delete on public.attempt_answers to authenticated;
grant insert (attempt_id, question_key, selected_answer, is_correct, answered_at) on public.attempt_answers to authenticated;
grant update (selected_answer, is_correct, answered_at) on public.attempt_answers to authenticated;

grant execute on function public.is_own_attempt(uuid) to authenticated;
grant execute on function public.is_attempt_open(uuid) to authenticated;

create policy "Students view their attempts"
on public.attempts for select to authenticated
using (student_id = (select auth.uid()));

create policy "Teachers view all attempts"
on public.attempts for select to authenticated
using ((select public.is_teacher()));

create policy "Students start their attempts"
on public.attempts for insert to authenticated
with check (student_id = (select auth.uid()));

create policy "Students update their in-progress attempts"
on public.attempts for update to authenticated
using (student_id = (select auth.uid()) and status = 'in_progress')
with check (student_id = (select auth.uid()));

create policy "Students view their attempt answers"
on public.attempt_answers for select to authenticated
using ((select public.is_own_attempt(attempt_id)));

create policy "Teachers view attempt answers"
on public.attempt_answers for select to authenticated
using (exists (select 1 from public.attempts a where a.id = attempt_id and (select public.is_teacher())));

create policy "Students add answers while in progress"
on public.attempt_answers for insert to authenticated
with check ((select public.is_attempt_open(attempt_id)));

create policy "Students edit answers while in progress"
on public.attempt_answers for update to authenticated
using ((select public.is_attempt_open(attempt_id)))
with check ((select public.is_attempt_open(attempt_id)));

create policy "Students remove answers while in progress"
on public.attempt_answers for delete to authenticated
using ((select public.is_attempt_open(attempt_id)));

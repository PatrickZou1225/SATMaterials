-- Fix a leak in the attempt policies: "Teachers view all attempts" was written
-- with is_teacher(), so any teacher could read every student's mock-test records.
-- Profiles and entitlements were scoped to the owning teacher in
-- 20260927000000_teachers.sql, but attempts is older and was missed. Scope reads
-- to the teacher's own students, matching the rest of the backend.

-- Like can_manage_student, but without the is_teacher_active() gate: a teacher
-- whose subscription lapsed keeps access to the data they already collected
-- (reads use is_teacher() elsewhere for the same reason).
create function public.owns_student(target_student_id uuid)
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
    );
$$;

revoke all on function public.owns_student(uuid) from public, anon;
grant execute on function public.owns_student(uuid) to authenticated;

drop policy "Teachers view all attempts" on public.attempts;
drop policy "Teachers view attempt answers" on public.attempt_answers;

create policy "Teachers view own students' attempts"
on public.attempts for select to authenticated
using ((select public.owns_student(student_id)));

create policy "Teachers view own students' attempt answers"
on public.attempt_answers for select to authenticated
using (exists (
  select 1 from public.attempts a
  where a.id = attempt_id and (select public.owns_student(a.student_id))
));

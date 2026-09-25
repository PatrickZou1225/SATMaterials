-- Phase 1: student registration and teacher roles.
-- Run this migration in the Supabase SQL Editor before setting VITE_SUPABASE_*.
create type public.account_role as enum ('student', 'teacher');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  role public.account_role not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create function public.is_teacher()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'teacher'
  );
$$;

revoke all on public.profiles from anon, authenticated;
revoke all on function public.is_teacher() from public, anon;
grant usage on type public.account_role to authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant execute on function public.is_teacher() to authenticated;

create policy "Students view themselves; teachers view students"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_teacher()));

create policy "Users edit their own display name"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create function public.sync_auth_profile()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, email, display_name)
    values (
      new.id,
      new.email,
      coalesce(nullif(left(trim(new.raw_user_meta_data ->> 'display_name'), 60), ''), split_part(new.email, '@', 1))
    );
  elsif new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.sync_auth_profile();

create trigger on_auth_user_email_changed
after update of email on auth.users
for each row execute function public.sync_auth_profile();

-- Phase 5: teaching boards. A teacher uploads a PDF handout, annotates it
-- (freehand strokes / highlights / text) and stores the annotations as vector
-- JSON; their students open the board read-only. The PDF lives in a Supabase
-- Storage bucket ("boards"); the annotation data lives here.

create type public.board_status as enum ('draft', 'published', 'archived');

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  status public.board_status not null default 'published',
  pdf_path text,
  pdf_name text,
  page_count integer not null default 1 check (page_count between 0 and 2000),
  annotations jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index boards_teacher_idx on public.boards (teacher_id);

-- A board is visible to its owner-teacher's students (once published) and to the
-- super-admin. Mirrors the teacher→student isolation used everywhere else.
create function public.can_view_board(target_board uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select
    (select public.is_owner())
    or (
      (select status from public.boards where id = target_board) = 'published'
      and exists (
        select 1 from public.profiles
        where id = (select auth.uid())
          and teacher_id = (select teacher_id from public.boards where id = target_board)
      )
    );
$$;

create function public.can_manage_board(target_board uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select
    (select public.is_owner())
    or exists (
      select 1 from public.boards
      where id = target_board
        and teacher_id = (select auth.uid())
        and (select public.is_teacher())
    );
$$;

revoke all on function public.can_view_board(uuid) from public, anon;
revoke all on function public.can_manage_board(uuid) from public, anon;
grant execute on function public.can_view_board(uuid) to authenticated;
grant execute on function public.can_manage_board(uuid) to authenticated;

revoke all on public.boards from anon, authenticated;
grant select, insert, update, delete on public.boards to authenticated;

alter table public.boards enable row level security;

create policy "Teachers manage their boards"
on public.boards for all to authenticated
using (teacher_id = (select auth.uid()) and (select public.is_teacher()))
with check (teacher_id = (select auth.uid()) and (select public.is_teacher()));

create policy "Owners manage all boards"
on public.boards for all to authenticated
using ((select public.is_owner()))
with check ((select public.is_owner()));

create policy "Students view published boards"
on public.boards for select to authenticated
using ((select public.can_view_board(id)));

-- Storage: a public-read bucket that only active teachers may write to. PDFs are
-- named with a random uuid so the object path is not guessable.
insert into storage.buckets (id, name, public)
values ('boards', 'boards', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can read board files" on storage.objects;
create policy "Anyone can read board files"
on storage.objects for select
using (bucket_id = 'boards');

drop policy if exists "Teachers upload board files" on storage.objects;
create policy "Teachers upload board files"
on storage.objects for insert to authenticated
with check (bucket_id = 'boards' and (select public.is_teacher()));

drop policy if exists "Teachers update their board files" on storage.objects;
create policy "Teachers update their board files"
on storage.objects for update to authenticated
using (bucket_id = 'boards' and (select public.is_teacher()));

drop policy if exists "Teachers delete their board files" on storage.objects;
create policy "Teachers delete their board files"
on storage.objects for delete to authenticated
using (bucket_id = 'boards' and (select public.is_teacher()));

-- "Cloud drive" for the owner's private PDF handouts. Files live in the existing
-- public-read `boards` storage bucket under a `library/` prefix (unguessable
-- uuid paths); this table tracks the display name + metadata so the drive can
-- list them. Scoped to the site owner, matching the owner-gated 私人讲义 area.

create table public.library_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 200),
  size_bytes bigint,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index library_files_owner_idx on public.library_files (owner_id);

revoke all on public.library_files from anon, authenticated;
grant select, insert, update, delete on public.library_files to authenticated;

alter table public.library_files enable row level security;

create policy "Owners manage their library files"
on public.library_files for all to authenticated
using (owner_id = (select auth.uid()) and (select public.is_owner()))
with check (owner_id = (select auth.uid()) and (select public.is_owner()));

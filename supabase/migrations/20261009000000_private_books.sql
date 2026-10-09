-- Private teaching materials. Files in this bucket are readable and writable
-- only by the site owner; signed URLs expire automatically.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private-books', 'private-books', false, 52428800, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Site owner can read private books"
on storage.objects for select to authenticated
using (bucket_id = 'private-books' and (select public.is_owner()));

create policy "Site owner can upload private books"
on storage.objects for insert to authenticated
with check (bucket_id = 'private-books' and (select public.is_owner()));

create policy "Site owner can update private books"
on storage.objects for update to authenticated
using (bucket_id = 'private-books' and (select public.is_owner()))
with check (bucket_id = 'private-books' and (select public.is_owner()));

create policy "Site owner can delete private books"
on storage.objects for delete to authenticated
using (bucket_id = 'private-books' and (select public.is_owner()));

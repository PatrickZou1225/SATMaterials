-- Board-inserted images live in Storage, not in the database.
--
-- A board's drawings are small (shapes + text), but pasted screenshots/photos are
-- big data URLs. Those used to be written into `boards.pages` jsonb, eating the
-- 500 MB database limit. Now every page's image files are collected into one JSON
-- blob uploaded to the `boards` bucket at `boardfiles/{owner_id}/{uuid}.json`;
-- the row only keeps the path and its size.
alter table public.boards add column if not exists files_path text;
alter table public.boards add column if not exists files_bytes bigint;

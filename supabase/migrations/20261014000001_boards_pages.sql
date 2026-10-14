-- Upgrade the teaching board from a per-page vector-annotation map to a
-- multi-page document that mirrors an Excalidraw scene per page. Each item in
-- `pages` carries its own background (a PDF handout page or a blank/colored
-- board) and the Excalidraw scene (elements / appState / files) drawn on it.
-- The old `annotations` column only held freehand strokes and can't express
-- shapes, images, or backgrounds, so it is replaced outright. `boards` held no
-- production data at this point, so the drop is safe.

alter table public.boards drop column if exists annotations;
alter table public.boards add column if not exists pages jsonb not null default '[]';

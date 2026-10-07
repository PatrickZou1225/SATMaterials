-- The official-sample "Hard" pool is sold as a one-off ¥9.9 unlock. It is not a
-- year, so entitlements gain a `product` key alongside the per-year real-paper
-- unlocks: a row is either a year (product = '') or a product (year = null).
-- Teachers still grant it by hand from /students, same as a year.
alter table public.entitlements add column product text not null default '';

alter table public.entitlements alter column year drop not null;

-- A student owns a given product at most once. Partial so the year rows
-- (product = '') keep relying on the existing unique (student_id, year).
create unique index entitlements_student_product_key
on public.entitlements (student_id, product)
where product <> '';

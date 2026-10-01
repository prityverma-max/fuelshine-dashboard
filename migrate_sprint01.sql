-- ===================================================================
-- Fuelshine dashboard — move to the Sprint 01 timeline (run ONCE)
--
-- Old calendar: 13 weeks, week 1 = Mon Sep 14 2026.
-- New calendar: 17 weeks, week 1 = Mon Sep 28 2026 (Sprint 01 plan).
--
-- Every saved week moves back two numbers:
--   old week 1 (Sep 14) → week -1  ┐ before Sprint 01: kept in the same
--   old week 2 (Sep 21) → week  0  ┘ table, counted as opening MRR
--   old week 3 (Sep 28) → week  1, … old week 13 (Dec 7) → week 11
-- Change history is renumbered the same way. Nothing is deleted.
--
-- Run in Supabase → SQL Editor, then push the new code straight away
-- (no weekly saves in between). A second run stops with an error and
-- changes nothing.
-- ===================================================================
begin;

-- 0. Run-once guard. The marker table is also how the new dashboard
--    checks that this migration has been applied.
create table if not exists public.schema_migrations (
  name       text primary key,
  applied_at timestamptz not null default now()
);
alter table public.schema_migrations enable row level security;
drop policy if exists migrations_read on public.schema_migrations;
create policy migrations_read on public.schema_migrations for select using (true);

do $$
begin
  if exists (select 1 from public.schema_migrations where name = 'sprint01_timeline') then
    raise exception 'Sprint 01 migration already applied — nothing changed.';
  end if;
end $$;

-- 1. Allow weeks -1..17 (-1 and 0 = before Sprint 01).
alter table public.weeks drop constraint if exists weeks_week_num_check;

-- 2. Renumber weeks: N → N-2. Two steps so no primary key collides.
update public.weeks set week_num = week_num + 1000;
update public.weeks set week_num = week_num - 1002;
update public.weeks
   set data = jsonb_set(data, '{weekNum}', to_jsonb(week_num))
 where data ? 'weekNum';

alter table public.weeks
  add constraint weeks_week_num_check check (week_num between -1 and 17);

-- 3. Change history: same renumbering; pre-sprint weeks relabelled.
update public.change_log
   set ref_key   = (ref_key::int - 2)::text,
       ref_label = case
         when ref_key = '1' then 'Before Sprint 01 (week of Sep 14)'
         when ref_key = '2' then 'Before Sprint 01 (week of Sep 21)'
         else 'Week ' || (ref_key::int - 2)
       end,
       data = case when data ? 'weekNum'
                   then jsonb_set(data, '{weekNum}', to_jsonb(ref_key::int - 2))
                   else data end
 where scope = 'week' and ref_key ~ '^[0-9]+$';

insert into public.schema_migrations(name) values ('sprint01_timeline');

commit;

-- Check: -1 and 0 are the pre-sprint weeks (if any were saved); 1-11 the rest.
select week_num, updated_by, updated_at from public.weeks order by week_num;

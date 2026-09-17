-- ===================================================================
-- Fuelshine 90-Day Sprint — database schema
-- Paste this whole file into Supabase → SQL Editor → Run. Once.
-- ===================================================================

-- Current value of each week. One row per week, overwritten on save.
create table if not exists public.weeks (
  week_num    int primary key check (week_num between 1 and 13),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Current status of each tracked row in the decision tables
-- (IP actions, associations/events, channels, verticals).
-- item_key looks like 'ip:4', 'assoc:1', 'chan:2', 'fvvert:3', 'gfvert:1'.
create table if not exists public.trackers (
  item_key    text primary key,
  status      text,
  note        text,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Immutable audit trail for BOTH weekly numbers and status changes.
-- One row per save. Never updated, never deleted.
--   scope = 'week'    -> ref_key is the week number
--   scope = 'tracker' -> ref_key is the item_key above
create table if not exists public.change_log (
  id          bigserial primary key,
  scope       text not null check (scope in ('week','tracker')),
  ref_key     text not null,
  ref_label   text,
  version_no  int not null,
  data        jsonb not null,
  changes     jsonb not null default '[]'::jsonb,
  editor      text,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists change_log_ref_idx
  on public.change_log (scope, ref_key, version_no desc);
create index if not exists change_log_created_idx
  on public.change_log (created_at desc);

-- -------------------------------------------------------------------
-- Row level security.
--
-- This is an internal team tool with no login, so the anon key is
-- allowed to read and write the tables above — and nothing else in your
-- project. Deletes and updates on change_log are NOT granted, which is
-- what makes the audit trail tamper-resistant from the browser.
--
-- If you later add Supabase Auth, tighten `using (true)` to
-- `using (auth.role() = 'authenticated')`.
-- -------------------------------------------------------------------

alter table public.weeks      enable row level security;
alter table public.trackers   enable row level security;
alter table public.change_log enable row level security;

drop policy if exists weeks_read   on public.weeks;
drop policy if exists weeks_write  on public.weeks;
drop policy if exists weeks_update on public.weeks;
create policy weeks_read   on public.weeks for select using (true);
create policy weeks_write  on public.weeks for insert with check (true);
create policy weeks_update on public.weeks for update using (true) with check (true);

drop policy if exists trackers_read   on public.trackers;
drop policy if exists trackers_write  on public.trackers;
drop policy if exists trackers_update on public.trackers;
create policy trackers_read   on public.trackers for select using (true);
create policy trackers_write  on public.trackers for insert with check (true);
create policy trackers_update on public.trackers for update using (true) with check (true);

drop policy if exists log_read  on public.change_log;
drop policy if exists log_write on public.change_log;
create policy log_read  on public.change_log for select using (true);
create policy log_write on public.change_log for insert with check (true);
-- Deliberately no update/delete policy: history is append-only.

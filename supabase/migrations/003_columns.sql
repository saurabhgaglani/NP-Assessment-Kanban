-- Allow any status value (custom columns need arbitrary ids)
alter table public.tasks drop constraint if exists tasks_status_check;

-- Columns table: stores user's board columns in order
create table if not exists public.columns (
  id         text primary key,  -- matches the col id used in UI (e.g. 'todo', 'col_1234')
  title      text not null,
  position   integer not null default 0,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists columns_user_id_idx on public.columns(user_id);

alter table public.columns enable row level security;

create policy "users can read own columns"
  on public.columns for select using (auth.uid() = user_id);

create policy "users can insert own columns"
  on public.columns for insert with check (auth.uid() = user_id);

create policy "users can update own columns"
  on public.columns for update using (auth.uid() = user_id);

create policy "users can delete own columns"
  on public.columns for delete using (auth.uid() = user_id);

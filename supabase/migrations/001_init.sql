create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  status       text not null default 'todo',
  priority     text default 'normal',
  due_date     date,
  assignee_id  uuid,
  user_id      uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),

  constraint tasks_status_check
    check (status in ('todo', 'in_progress', 'in_review', 'done')),

  constraint tasks_priority_check
    check (priority in ('low', 'normal', 'high'))
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);

alter table public.tasks enable row level security;

create policy "users can read own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "users can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  color      text not null default '#94A3B8',
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists team_members_user_id_idx on public.team_members(user_id);

alter table public.team_members enable row level security;

create policy "users can read own team members"
  on public.team_members for select using (auth.uid() = user_id);

create policy "users can insert own team members"
  on public.team_members for insert with check (auth.uid() = user_id);

create policy "users can delete own team members"
  on public.team_members for delete using (auth.uid() = user_id);

-- Add assignee_id FK to tasks (run after team_members exists)
alter table public.tasks
  drop constraint if exists tasks_assignee_fk;

alter table public.tasks
  add constraint tasks_assignee_fk
  foreign key (assignee_id) references public.team_members(id) on delete set null;

# Kanban Task Board — Internship Assessment

## 1. Overview

This project is a modern Kanban-style task board designed to provide a clean, intuitive, and visually polished task management experience. The application allows users to create tasks, organize them across workflow stages, and update their status via drag-and-drop interactions.

The focus of this implementation was on:
- Strong visual design and usability
- Smooth interaction patterns (especially drag-and-drop)
- A simple but robust backend using Supabase
- Clear data ownership and security using Row Level Security (RLS)

### Tech Stack
- Frontend: React (JavaScript), Tailwind CSS
- Backend: Supabase (PostgreSQL, Auth, RLS)
- Deployment: Vercel

---

## 2. Design Decisions

The UI was designed with a whitespace-first philosophy, ensuring that the interface feels light, readable, and uncluttered.

### Key decisions:
- Light main workspace + dark sidebar
- Color used intentionally (blue for actions, colors for status only)
- Clear visual hierarchy between task titles and metadata
- Minimal, distraction-free Kanban board

The goal was to create something closer to Linear or Notion rather than a basic to-do list.

---

## 3. Live Application

Live URL: **[https://np-assessment-kanban-6vua.vercel.app/]**

---

## 4. GitHub Repository

Repository: **[https://github.com/saurabhgaglani/NP-Assessment-Kanban]**

---

## 5. Database Schema

The application uses Supabase with a primary `tasks` table.

### Tasks Table

```sql
create extension if not exists "pgcrypto";

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo',
  priority text default 'normal',
  due_date date,
  assignee_id uuid,
  user_id uuid not null,
  created_at timestamptz default now(),

  constraint tasks_status_check
    check (status in ('todo', 'in_progress', 'in_review', 'done')),

  constraint tasks_priority_check
    check (priority in ('low', 'normal', 'high'))
);
```

### Row Level Security (RLS)

```sql
alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
on public.tasks for select
using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
on public.tasks for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on public.tasks for delete
using (auth.uid() = user_id);
```

---

## 6. Local Setup Instructions

### Prerequisites
- Node.js installed
- Supabase account

### Steps

1. Clone the repository:
```bash
git clone https://github.com/saurabhgaglani/NP-Assessment-Kanban.git
cd NP-Assessment-Kanban/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npm run start
```

---

## 7. Advanced Features Implemented

The application includes several enhancements focused on usability, clarity, and interaction quality.

### Interactive onboarding with live preview
A guided onboarding flow allows users to set up their board step-by-step, with a live Kanban preview that updates in real time based on user input.

### Ability to drag/drop reorder columns
Can reorder columns in onboarding and in the actual board. Simple drag and drop interface. 

### Smooth drag-and-drop
Tasks can be moved fluidly across columns with immediate UI updates and persisted backend state.

### CRUD Tasks
Implemented Create, Read, Update and Delete task functionality. Persists in supabase database

### JWT Authentication
Guest user authenticated using session token and given user id. Tasks and board saved with user ID strict RLC implemented only user with same user id can crud tickets created by that userid

### Due dates and overdue indicators
Tasks support due dates, with overdue items visually highlighted to improve prioritization.

### Team members and assignees
Users can create team members and assign them to tasks. Each member is represented by a simple avatar using initials and color, and is displayed directly on task cards.

### Filtering
Tasks can be filtered by assigned team member and overdue status, enabling more focused task views.

### Dashboard and metrics
A dashboard provides high-level insights such as task completion percentage and workload distribution across team members.

### Responsive design
The layout adapts across screen sizes while maintaining usability and visual clarity.


## 8. Tradeoffs

- No custom backend (used Supabase directly from the frontend)
- Limited filters added. 

---

## 9. Improvements with More Time

- Comments and activity logs
- More Advanced filtering and search
- Real-time collaboration
- Mobile optimization

---

## 10. Final Notes

This project was built with a focus on delivering a polished, production-like experience rather than a minimal prototype. Emphasis was placed on design quality, interaction smoothness, and clean architecture.

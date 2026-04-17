-- ============================================================
-- Task Manager – Supabase initial schema
-- Run this in your Supabase project's SQL editor (Dashboard →
-- SQL Editor → New Query) in a single execution.
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles: one row per auth.users entry, stores display name & role.
create table if not exists public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  username    text        not null,
  role        text        not null default 'User',
  created_at  timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id                      uuid        default gen_random_uuid() primary key,
  user_id                 uuid        references auth.users(id) on delete cascade not null,
  title                   text        not null,
  description             text,
  is_completed            boolean     not null default false,
  priority                text        not null default 'Medium',
  planned_completion_date date,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Subtasks
create table if not exists public.subtasks (
  id           uuid    default gen_random_uuid() primary key,
  task_id      uuid    references public.tasks(id) on delete cascade not null,
  title        text    not null,
  description  text,
  is_completed boolean not null default false,
  status       text    not null default 'To Do'
);

-- Notifications
create table if not exists public.notifications (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  type       text        not null,
  message    text        not null,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.tasks         enable row level security;
alter table public.subtasks      enable row level security;
alter table public.notifications enable row level security;

-- Profiles -------------------------------------------------------
-- Each user can read and update their own profile.
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- Admins can read and manage all profiles.
create policy "profiles_admin_all"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'Admin'
    )
  );

-- Tasks ----------------------------------------------------------
-- Users can manage their own tasks.
create policy "tasks_own"
  on public.tasks for all
  using (user_id = auth.uid());

-- Admins can manage all tasks.
create policy "tasks_admin_all"
  on public.tasks for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'Admin'
    )
  );

-- Subtasks -------------------------------------------------------
-- Users can manage subtasks that belong to their own tasks.
create policy "subtasks_own"
  on public.subtasks for all
  using (
    exists (
      select 1 from public.tasks t
      where t.id = subtasks.task_id and t.user_id = auth.uid()
    )
  );

-- Notifications --------------------------------------------------
-- Users can manage their own notifications.
create policy "notifications_own"
  on public.notifications for all
  using (user_id = auth.uid());

-- ============================================================
-- TRIGGER: auto-create profile on sign-up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- RPC: users can delete their own auth account
-- ============================================================

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- ============================================================
-- RPC: admin can delete any user (verifies caller is Admin)
-- ============================================================

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'Admin'
  ) then
    raise exception 'Unauthorized: caller is not an admin';
  end if;

  delete from auth.users where id = target_user_id;
end;
$$;

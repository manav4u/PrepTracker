-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  prn text,
  theme text default 'dark',
  selected_subjects text[] default '{}',
  setup_complete boolean default false,
  "group" text check ("group" in ('A', 'B')),
  streak integer default 0,
  last_study_date timestamptz,
  updated_at timestamptz default now()
);

-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  priority text check (priority in ('CRITICAL', 'NORMAL', 'LOW')) default 'NORMAL',
  category text check (category in ('EXAM', 'LAB', 'SUBMISSION', 'GENERAL')) default 'GENERAL',
  due_date timestamptz,
  created_at timestamptz default now()
);

-- Create subject_progress table
create table public.subject_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id text not null,
  unit_id text not null,
  status text check (status in ('Not Started', 'In Progress', 'Revision', 'Mastered')) default 'Not Started',
  pyqs_completed text[] default '{}',
  updated_at timestamptz default now(),
  unique(user_id, subject_id, unit_id)
);

-- Create resources table
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  author text default 'YOU',
  downloads text default '0',
  subject text not null,
  category text not null,
  url text not null,
  is_system boolean default false,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.subject_progress enable row level security;
alter table public.resources enable row level security;

-- Create policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

create policy "Users can view own progress" on public.subject_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.subject_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.subject_progress for update using (auth.uid() = user_id);

create policy "Users can view own resources" on public.resources for select using (auth.uid() = user_id);
create policy "Users can insert own resources" on public.resources for insert with check (auth.uid() = user_id);
create policy "Users can delete own resources" on public.resources for delete using (auth.uid() = user_id);

-- Create a function to handle new user signups
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime
alter publication supabase_realtime add table public.tasks, public.subject_progress, public.resources;

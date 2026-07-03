-- Run this SQL in Supabase SQL Editor (Dashboard > SQL)

-- RSVP table
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  guest_count int default 1,
  attending boolean not null,
  message text,
  created_at timestamptz default now()
);

-- Wishes table
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  approved boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table rsvps enable row level security;
alter table wishes enable row level security;

-- RSVP: anyone can insert (anon), only service role can read
create policy "Anyone can submit RSVP"
  on rsvps for insert
  to anon, authenticated
  with check (true);

-- Wishes: anyone can insert, anyone can read approved wishes
create policy "Anyone can submit wishes"
  on wishes for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read approved wishes"
  on wishes for select
  to anon, authenticated
  using (approved = true);

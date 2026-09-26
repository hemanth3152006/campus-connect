  x cv-- Base schema for a fresh Campus360 Supabase project.
-- Run this before bootstrap-admin.sql.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text,
  phone text,
  route text,
  pickup_point text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.route_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  name text not null,
  sequence integer not null,
  lat double precision not null,
  lng double precision not null
);

insert into public.routes (name)
select 'North Campus Loop'
where not exists (
  select 1 from public.routes where name = 'North Campus Loop'
);

insert into public.route_stops (route_id, name, sequence, lat, lng)
select route.id, stop.name, stop.sequence, stop.lat, stop.lng
from public.routes route
cross join (values
  ('Main Gate', 1, 12.9716, 77.5946),
  ('Science Block', 2, 12.9752, 77.5990),
  ('Hostel Entrance', 3, 12.9791, 77.6024)
) as stop(name, sequence, lat, lng)
where route.name = 'North Campus Loop'
  and not exists (
    select 1
    from public.route_stops existing_stop
    where existing_stop.route_id = route.id
      and existing_stop.name = stop.name
  );
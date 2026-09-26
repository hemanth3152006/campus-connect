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
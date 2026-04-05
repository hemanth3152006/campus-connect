-- Bootstrap the first admin account for Campus360
--
-- Run this in the Supabase SQL editor after you create the Auth user in
-- Authentication > Users.
--
-- Steps:
-- 1. Create the Auth user in Supabase Dashboard with email + password.
-- 2. Copy the user's UUID from Authentication > Users.
-- 3. Replace the placeholders below with the real values and run the script.

insert into public.users (
  id,
  full_name,
  email,
  role,
  phone,
  route,
  pickup_point,
  is_active
)
values (
  '00000000-0000-0000-0000-000000000000',
  'Super Admin',
  'admin@example.com',
  'admin',
  null,
  null,
  null,
  true
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  phone = excluded.phone,
  route = excluded.route,
  pickup_point = excluded.pickup_point,
  is_active = excluded.is_active;

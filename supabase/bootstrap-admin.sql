-- Bootstrap the first admin account for Campus360
--
-- IMPORTANT:
-- 1. Run supabase/schema.sql first so public.users exists.
-- 2. Create the Auth user in Authentication > Users.
-- 3. Replace the placeholder UUID and email below with the real values.
--
-- Then run this file in the Supabase SQL editor.


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

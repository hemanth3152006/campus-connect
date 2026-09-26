# Supabase Setup for Campus'360

Follow these steps **in order**. Do not skip steps.

## Step 1: Create the base schema (SQL Editor)

1. Open the SQL Editor in your new Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql).
3. Wait until it finishes successfully.

If this step fails with `relation public.users does not exist`, your project does not have the schema yet.

## Step 2: Create Auth User (Supabase Dashboard)

1. Go to https://supabase.com → Your Project → Authentication → Users
2. Click **Add user**
3. Enter:
   - Email: `admin@campus360.com` (or your email)
   - Password: `SecurePassword123!` (or your password)
4. Click **Create user**
5. **Copy the new user's UUID** (looks like: `3ffa6d41-dab2-44c9-bcb4-1eda581c14cb`)

## Step 3: Create Profile Row (SQL Editor)

1. Go to SQL Editor in Supabase
2. Run this SQL (replace UUID and email):

```sql
insert into public.users (
  id,
  full_name,
  email,
  role,
  is_active
)
values (
  '3ffa6d41-dab2-44c9-bcb4-1eda581c14cb',
  'Admin User',
  'admin@campus360.com',
  'admin',
  true
);
```

**IMPORTANT:**
- Replace `3ffa6d41-dab2-44c9-bcb4-1eda581c14cb` with YOUR UUID
- Replace `admin@campus360.com` with YOUR email
- Keep role **lowercase**: `admin`, `student`, `teacher`, or `driver`

## Step 4: Login in the App

1. Refresh the app (http://localhost:8081)
2. Enter:
   - Email: `admin@campus360.com` (same as step 1)
   - Password: `SecurePassword123!` (same as step 1)
   - Role: **Admin** (select from buttons, match your SQL role)
3. Click Sign In

## Troubleshooting

**Error: "relation public.users does not exist"**
- You skipped the schema step. Run [supabase/schema.sql](supabase/schema.sql) first.

**Error: "invalid input syntax for type uuid"**
- You didn't paste a real UUID. Go back to Supabase Auth, find the user, copy the UUID exactly.

**Error: "violates foreign key constraint"**
- The Auth user doesn't exist yet. Complete Step 1 first.

**Error: "violates check constraint"**
- Role is wrong case. Use `admin` not `Admin`.

**Error: "Account not found or password is wrong"**
- Email or password mismatch. Double-check both match exactly.

**Error: "role mismatch" or "Account is registered as driver"**
- You selected the wrong role button on login. Select the role that matches your SQL (step 2).

## To Add More Users

Repeat Steps 1 & 2 for each new user (student, teacher, driver, etc).

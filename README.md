# Welcome to campus'360

## Project info
smarter way to track your academices

## How can I edit this code?

There are several ways of editing your application.

**Use VS CODE**

Simply Copy the link (https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via VS CODE  will be committed .

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase admin bootstrap

To create the first admin login:

1. Create an Auth user in Supabase Dashboard under Authentication > Users.
2. Copy that user's UUID.
3. Open [supabase/bootstrap-admin.sql](supabase/bootstrap-admin.sql) and replace the placeholder email and UUID.
4. Run the SQL file in the Supabase SQL editor.
5. Log in in the app with the same email, password, and select the Admin role.

The app requires a matching row in public.users for every auth user.

## How can I deploy this project?

Simply open netlify (before that you have to publish it in your github)
## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

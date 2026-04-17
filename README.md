# Task Manager — Angular + Supabase + Vercel

A full-stack task management application built with **Angular 18** (frontend) and **Supabase** (database, auth, and REST API). Deployed as a static SPA on **Vercel** with no custom backend server required.

## Features

- User authentication (email + password via Supabase Auth)
- Create, update, delete, and organize tasks with priority levels
- Subtask system with Kanban-style status tracking
- Calendar view for scheduling and deadline management
- In-app notifications and toast messages
- Analytics dashboard (task completion stats, priority distribution)
- Admin panel — user management and role assignment
- Light/dark theme with persistent settings
- Multi-language support (English / French)

## Architecture

```
Browser (Angular 18 SPA on Vercel)
  │
  ├── Supabase Auth       — email/password sign-in & sign-up
  └── Supabase PostgREST  — tasks, subtasks, notifications, profiles
                            (Row Level Security enforces per-user isolation)
```

No custom backend server. All data access goes through the Supabase JS client directly from the Angular app.

## Project Layout

```
TaskManager-FullStack/
├── TaskManager.App/          # Angular 18 frontend
│   ├── src/app/
│   │   ├── Components/       # Feature components
│   │   ├── models/           # TypeScript interfaces
│   │   ├── services/         # Supabase-backed services
│   │   └── environments/     # Build-time env config
│   ├── scripts/
│   │   └── generate-env.js   # Injects Supabase keys at Vercel build time
│   └── vercel.json           # Vercel static build + SPA routing
├── supabase/
│   └── migrations/
│       └── 001_initial.sql   # Tables, RLS policies, triggers, RPCs
└── .env.example              # Environment variable template
```

## Local Development Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **SQL Editor**, run the contents of `supabase/migrations/001_initial.sql`.
3. In **Auth → Providers**, ensure **Email** is enabled.
4. Copy your project's **URL** and **anon/public key** from **Project Settings → API**.

### 2. Configure environment

Open `TaskManager.App/src/environments/environment.ts` and fill in your values:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabaseAnonKey: 'YOUR_ANON_KEY'
};
```

### 3. Install and run

```bash
cd TaskManager.App
npm install
npm start          # serves at http://localhost:4200
```

## Vercel Deployment

### 1. Set environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `SUPABASE_ANON_KEY` | your anon/public key |

The `scripts/generate-env.js` prebuild script reads these and writes `environment.prod.ts` before `ng build` runs.

### 2. Configure the Vercel project

| Setting | Value |
|---|---|
| Root directory | `TaskManager.App` |
| Build command | `npm run vercel-build` |
| Output directory | `dist/fullstack-app/browser` |
| Framework preset | Other (or Angular) |

### 3. Deploy

Push to your connected Git branch. Vercel will build and deploy automatically.

## Key Services

| Service | What it does |
|---|---|
| `SupabaseService` | Creates and exports the singleton `SupabaseClient` |
| `AuthService` | Sign-in, sign-up, sign-out, profile/password updates |
| `TaskService` | Task and subtask CRUD against Supabase tables |
| `DataService` | Thin delegation layer kept for component compatibility |
| `NotificationService` | Notification CRUD against Supabase table |
| `ThemeService` | Light/dark theme toggle with localStorage persistence |
| `ToastService` | Short-lived toast messages |

## Supabase Schema Overview

| Table | Purpose |
|---|---|
| `profiles` | One row per user; stores `username` and `role` |
| `tasks` | User tasks with priority, completion status, planned date |
| `subtasks` | Child items of tasks with Kanban status |
| `notifications` | In-app notification records per user |

Row Level Security ensures each user only sees their own data. Admin users (where `profiles.role = 'Admin'`) can read and manage all records.

## Admin Notes

Most admin operations work via the RLS policies in `001_initial.sql`. The following actions use Postgres RPC functions (also in the migration file) because they require elevated privileges:

- `delete_own_account()` — called when a user deletes their own account
- `admin_delete_user(target_user_id)` — called by admins to delete another user

## Scripts

```bash
npm start          # local dev server (port 4200)
npm run build      # production build (requires env values in environment.prod.ts)
npm run vercel-build  # Vercel CI build: injects env vars then ng build
npm test           # Karma unit tests
npm run lint:css   # Stylelint
```

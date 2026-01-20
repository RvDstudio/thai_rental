# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run Biome linter (biome check)
pnpm format       # Format code with Biome
```

## Database Commands (Drizzle + Neon)

```bash
pnpm db:generate  # Generate migrations from schema changes
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema directly to database (dev only)
pnpm db:studio    # Open Drizzle Studio for database browsing
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router (React 19)
- **Database**: Neon (serverless PostgreSQL) with Drizzle ORM
- **Auth**: Better Auth with email/password, magic link (via Resend), and OAuth (Google, GitHub)
- **i18n**: next-intl with cookie-based locale (en, th) - no URL prefixes
- **Styling**: Tailwind CSS 4
- **Linting**: Biome (replaces ESLint/Prettier)
- **Maps**: Leaflet with react-leaflet

### Route Groups
- `src/app/(main)/` - Public-facing pages with main Header
- `src/app/admin/` - Admin dashboard with separate AdminSidebar/AdminHeader layout

### Authentication
- Server config: `src/lib/auth.ts` - Better Auth with Drizzle adapter, magic link plugin
- Client hooks: `src/lib/auth-client.ts` - exports `useSession`, `signIn`, `signUp`, `signOut`
- Server helpers: `src/lib/auth-server.ts` - `getSession()`, `isAdmin()`, `requireAdmin()` for server components/routes
- API handler: `src/app/api/auth/[...all]/route.ts`
- User roles: `user.role` field ('user' | 'admin') - admin routes check via `requireAdmin()`

### Database Schema
Defined in `src/db/schema.ts`:
- Better Auth tables: `user`, `session`, `account`, `verification`
- App tables: `property` (listings), `rental` (agreements)
- User has `role` field for admin access

### Internationalization
- Config: `src/i18n/routing.ts` - locales: en, th (cookie-based, no URL prefix)
- Messages: `messages/en.json`, `messages/th.json`
- Use `useTranslations()` hook in client components, `getTranslations()` in server components

### Path Alias
`@/*` maps to `./src/*`

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret key
- `BETTER_AUTH_URL` - Base URL for auth
- `NEXT_PUBLIC_BASE_URL` - Public base URL for client
- `RESEND_API_KEY` - For magic link emails
- `EMAIL_FROM` - Sender email address
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth

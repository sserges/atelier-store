# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This project runs Next.js 16.4 with React 19.3. Before relying on any Next.js API or convention, check the bundled docs in `node_modules/next/dist/docs/` (`01-app/` covers the App Router).

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run lint         # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit
```

There is no test framework yet. Use `lint` and `typecheck` to check changes.

Database and auth (they need `DATABASE_URL` in `.env.local`; copy `.env.example`):

```bash
npm run auth:generate  # Better Auth CLI writes tables to src/db/schema/auth.ts
npm run db:generate    # drizzle-kit: SQL migration from schema → ./drizzle
npm run db:migrate     # apply migrations
npm run db:push        # push schema without a migration (prototyping only)
npm run db:studio
```

## Architecture

Stack: App Router + TypeScript (strict, `@/*` → `src/*`), Tailwind CSS v4, Better Auth, Drizzle ORM on Neon Postgres.

- **Next config** (`next.config.ts`): `cacheComponents` and `partialPrefetching` are on, so caching and rendering follow the Cache Components model rather than older `fetch`/route-segment caching. Tailwind v4 runs through a Turbopack loader rule (`@tailwindcss/turbopack`) for `*.css`, not PostCSS. Theme tokens live in `src/app/globals.css` under `@theme inline`.
- **Database** (`src/db/index.ts`): one Drizzle client built on the Neon **HTTP** driver (`drizzle-orm/neon-http`). It throws at import time if `DATABASE_URL` is missing. The HTTP driver has no interactive transactions.
- **Schema** (`src/db/schema/`): `index.ts` is a barrel. Put each table group in its own sibling file and re-export it from `index.ts`. Both drizzle-kit (`schema: ./src/db/schema`) and the Better Auth adapter (`import * as schema`) read the schema through this barrel, so a table that isn't re-exported there is invisible to auth.
- **Auth**: `src/lib/auth.ts` is the server instance (Drizzle adapter, `provider: "pg"`). `nextCookies()` must stay the **last** plugin. `src/app/api/auth/[...all]/route.ts` mounts it at `/api/auth/*`. `src/lib/auth-client.ts` is the React client and has no `baseURL`, so it targets the same origin. No auth methods are configured yet.

Enabling auth means: configure methods in `src/lib/auth.ts`, then run `npm run auth:generate`, add `export * from "./auth";` to `src/db/schema/index.ts`, and run `npm run db:generate && npm run db:migrate`.

## Environment

`DATABASE_URL` (Neon pooled connection string), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (no trailing slash). drizzle-kit loads `.env.local` and then `.env` through dotenv.

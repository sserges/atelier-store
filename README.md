# Atelier Store

Next.js (App Router) + TypeScript + Tailwind CSS v4, with Better Auth, Drizzle ORM and Neon Postgres.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run dev
```

## Project layout

```
src/
  app/
    api/auth/[...all]/route.ts   Better Auth HTTP handler (/api/auth/*)
    layout.tsx, page.tsx
  db/
    index.ts                     Drizzle client (Neon HTTP driver)
    schema/index.ts              Schema barrel — re-export every table here
  lib/
    auth.ts                      Better Auth server instance (Drizzle adapter)
    auth-client.ts               Better Auth React client
drizzle.config.ts                drizzle-kit config (reads .env.local / .env)
drizzle/                         Generated migrations (created by db:generate)
```

## Scripts

| Script                  | Purpose                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Start the dev server                                            |
| `npm run build`         | Production build                                                |
| `npm run lint`          | ESLint                                                          |
| `npm run typecheck`     | TypeScript check                                                |
| `npm run auth:generate` | Generate Better Auth tables into `src/db/schema/auth.ts`        |
| `npm run db:generate`   | Create a SQL migration from the schema                          |
| `npm run db:migrate`    | Apply migrations to the database                                |
| `npm run db:push`       | Push schema directly (prototyping only)                         |
| `npm run db:studio`     | Open Drizzle Studio                                             |

## Next steps

No schemas or auth methods are configured yet. When enabling auth:

1. Configure auth methods in `src/lib/auth.ts` (e.g. `emailAndPassword`, `socialProviders`).
2. `npm run auth:generate`, then add `export * from "./auth";` to `src/db/schema/index.ts`.
3. `npm run db:generate && npm run db:migrate`.

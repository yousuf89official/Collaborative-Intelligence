# Collaborative Intelligence

Enterprise campaign intelligence platform — unified analytics across Google Ads, Meta Ads, TikTok, and more.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL via Prisma ORM (hosted on Neon)
- **Auth**: NextAuth.js v4 (credentials provider, JWT sessions)
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **Deployment**: Vercel (Singapore region)

## Environments

| Environment | Branch | Database | How to run |
|-------------|--------|----------|------------|
| **Local** | any | Mock DB (in-memory) | `npm run dev:local` |
| **Staging** | `staging` | Neon Postgres (staging branch) | Push to `staging` → Vercel Preview |
| **Production** | `main` | Neon Postgres (production) | Merge to `main` → Vercel Production |

### Local Development

```bash
npm run dev:local          # Starts with mock DB (no Postgres needed)
```

Login: `admin@collaborativeintelligence.io` / `admin123`

Mock DB is defined in `src/lib/mock-db.ts` with seed data in `src/lib/mock-data.ts`.

### Staging

- Branch: `staging`
- Auto-deploys to Vercel Preview URL on push
- Uses separate Neon database branch
- Env vars scoped as "Preview" in Vercel dashboard

### Production

- Branch: `main`
- Auto-deploys to Vercel Production on merge
- Uses main Neon database
- Env vars scoped as "Production" in Vercel dashboard
- Cron jobs (`/api/sync`, `/api/scheduled-reports/send`) only run in production

## Environment Variables

See `.env.example` for the full list. Key groups:

- **Database**: `DATABASE_POSTGRES_PRISMA_URL`, `DATABASE_URL_UNPOOLED`, `USE_MOCK_DB`
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Security**: `ENCRYPTION_KEY`, `CRON_SECRET`
- **Integrations**: Google Ads, Meta Ads, Resend (email)

## Database Commands

```bash
npm run db:push            # Push schema to database (no migration history)
npm run db:migrate         # Create and apply migration
npm run db:studio          # Open Prisma Studio GUI
npm run db:seed            # Run seed script
```

## Key Architecture Decisions

- **Row-Level Security (RLS)**: Enforced at the Postgres level. See `prisma/rls-policies.sql`.
- **Mock DB**: Full Prisma-compatible in-memory engine for local dev. Supports CRUD, relations, filtering.
- **Prisma singleton**: `src/lib/prisma.ts` manages a global instance. In dev, it resets on code changes (except mock mode).
- **Auth flow**: NextAuth credentials → bcrypt → JWT session (8h TTL) → role-based access.

## Git Branching

- `main` — Production. Always deployable.
- `staging` — Staging/QA. Merges from feature branches before going to main.
- Feature branches — Branch from `staging`, merge back to `staging`.

## Build

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build   # Local builds need extra memory
```

Vercel handles memory automatically during deployment.

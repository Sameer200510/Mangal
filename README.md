# Mangal — Matrimony & Wedding Ecosystem

Production-oriented monorepo for a privacy-first matrimony marketplace and wedding-services ecosystem. It uses Next.js, Express, Prisma/PostgreSQL, Redis/BullMQ and Socket.IO.

## Quick start

1. Copy `.env.example` to `.env` and replace all secrets.
2. Start dependencies: `docker compose up -d postgres redis minio`.
3. Enable Corepack and install: `corepack enable && pnpm install`.
4. Run `pnpm db:generate && pnpm db:migrate && pnpm db:seed`.
5. Start the apps: `pnpm dev`.

Web: http://localhost:3000. API: http://localhost:4000/api/v1. Swagger: http://localhost:4000/docs.

## Architecture

`apps/web` is the public/member/admin Next.js UI. `apps/api` exposes versioned HTTP and Socket.IO interfaces. `packages/db` owns the normalized relational model and repository client. API modules are organized by bounded context; integrations are replaceable adapters. See [docs/SRS.md](docs/SRS.md), [docs/API.md](docs/API.md), [docs/SECURITY.md](docs/SECURITY.md), and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Production checklist

- Use managed PostgreSQL, Redis, object storage, secret manager and transactional email/SMS providers.
- Set long random JWT keys, TLS, allowed origins, S3 encryption/KMS, backups and observability endpoints.
- Configure Razorpay/Stripe, Google OAuth, WhatsApp, KYC and AI provider credentials in their adapters.
- Run database migrations as a one-off deployment job; never from multiple API replicas.

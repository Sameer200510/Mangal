# Mangal Platform — Phase 0 Complete Project Audit

**Date:** September 14, 2026  
**Auditor:** Senior Software Architect & Engineering Team  
**Platform:** Mangal (AI-Powered Matrimony & Wedding Ecosystem)  
**Standard:** Tier-1 Enterprise Matrimonial System (Comparable to Shaadi.com, Jeevansathi, BharatMatrimony)

---

## 1. Executive Summary

Mangal is an AI-powered matrimony and wedding ecosystem engineered to connect Brides, Grooms, Families, Pandits, Wedding Organizers, Admins, Moderators, and Support Executives.

### Audit Baseline Findings
- **Repository State:** Clean workspace initialized at `C:\Users\SAMEER LOHANI\Desktop\Mangal`. Git tracking initiated.
- **Runtime Environment:**
  - Node.js: `v22.18.0` (LTS/Current active)
  - Package Manager: `pnpm` (11.5.1) and `npm` (11.6.1)
  - Operating System: Windows 11 (PowerShell pwsh environment)
  - Database Services: PostgreSQL 13/14 actively running on ports `5432` and `5433`
  - Docker Desktop: Installed (v29.3.1), daemon currently offline on local host.
  - Redis: Port 6379 offline natively. Requires transparent in-memory cache adapter fallback for native zero-friction developer workflow, as well as Redis connectivity when Docker container is started.

---

## 2. Infrastructure & Port Mapping

| Service | Target Port | Status on Host | Architecture Strategy |
|:---|:---|:---|:---|
| **Express API** | `4000` | Free | Native Express + TypeScript server with Socket.IO gateway |
| **Next.js Web** | `3000` | Free | Next.js 14 App Router with Mangal Design System |
| **PostgreSQL** | `5432` / `5433` | Active on Host | Local dev connects to `localhost:5432` (or Docker Postgres container in containerized mode) |
| **Redis** | `6379` | Offline on Host | `MemoryCacheAdapter` fallback automatically active if Redis connection fails; connects to Redis when available |
| **MinIO / S3 Storage** | `9000` | Offline on Host | `LocalStorageAdapter` saves to `uploads/` directory with expirable signed URL emulator; S3 client in production |
| **MailHog / SMTP** | `1025` / `8025` | Offline on Host | Console & mock mail adapter logs OTP and verification emails in dev mode; SMTP/SES in production |

---

## 3. Architecture Overview

Mangal operates as a modular monorepo powered by `pnpm`:

```
Mangal/
├── backend/                          # Express + TypeScript + Prisma Backend & Realtime Gateway
│   ├── prisma/                       # PostgreSQL schema, migrations, seed script
│   ├── src/config/                   # Strict Zod environment validation
│   ├── src/middleware/               # Security (Helmet, CORS, Rate-limit, Auth, RBAC, ErrorHandler)
│   ├── src/adapters/                 # Extensible provider adapters (Storage, Cache, Mail, SMS, AI, Video)
│   ├── src/routes/                   # Health & feature route controllers
│   ├── src/socket/                   # Realtime gateway (Socket.IO events, presence, room permissions)
│   ├── src/common/                   # Shared TypeScript definitions, Zod validation schemas, DTOs, Enums
│   └── src/database.ts               # Prisma Client singleton
│
├── frontend/                         # Next.js 14 Frontend Application
│   ├── src/app/                      # App Router: Auth, Onboarding, Discovery, Matches, Chat, Kundli, Marketplace, Admin
│   ├── src/components/               # Mangal UI Components (Royal crimson & gold design tokens)
│   ├── src/lib/                      # API Client, State, Utilities
│   └── src/common/                   # Shared contracts, enums & schemas
│
├── docs/                             # Engineering, Architecture, Security, API specifications
├── docker/                           # Multi-stage production container Dockerfiles
├── docker-compose.yml                # Local developer orchestration (Postgres, Redis, MinIO, MailHog)
├── docker-compose.prod.yml           # Production deployment stack
└── .env.example                      # Documented environment variables with security guidelines
```

---

## 4. Security & Compliance Baseline

1. **Password Security:** Password hashing via **Argon2id** (`argon2` algorithm) with high memory cost and unique salt per user.
2. **Session & Token Lifecycle:** 
   - Access tokens: Short-lived (15 minutes), signed with asymmetric or high-entropy HMAC secret.
   - Refresh tokens: Stored as SHA-256 cryptographic hashes in database with token family identifiers for immediate replay-attack detection and family revocation.
3. **Data Protection & PII:**
   - Identity documents (Aadhaar, PAN, Passport) are **never** stored in database tables. Secure object storage stores files; signed, expiring URLs (15 min TTL) protect access.
   - All government ID numbers must be hashed and masked (`XXXX-XXXX-1234`).
4. **Chat & Contact Consent:**
   - Chat and video calling are strictly locked until mutual interest is accepted or explicit parental permission is granted.

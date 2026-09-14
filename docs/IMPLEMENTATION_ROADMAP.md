# Mangal Platform — Comprehensive Implementation Roadmap (Phases 0 to 18)

**Platform:** Mangal (AI-Powered Matrimony & Wedding Ecosystem)  
**Standard:** Enterprise Grade (Shaadi.com / BharatMatrimony Tier)  
**Monorepo:** pnpm workspaces (`apps/web`, `apps/api`, `packages/database`, `packages/common`)

---

## 1. Milestone Tracking Matrix

| Phase | Milestone Name | Key Deliverables | Verification Gates |
|:---|:---|:---|:---|
| **Phase 0** | **Complete Project Audit** | Git setup, environment probe, audit docs, risk register, roadmap | Directory audit & docs created |
| **Phase 1** | **Foundation Hardening** | Monorepo scaffolding, Express+TS, Next.js, Prisma, Health/Readiness, Docker, Logging, CORS, Env validation | `pnpm dev`, `pnpm build`, `/health/live`, `/health/ready` |
| **Phase 2** | **Authentication System** | Argon2id, JWT rotation, OTP, Google OAuth, 2FA, RBAC, Sessions, Account lockout, Auth pages | Unit tests, Token revocation, Login/Signup flows |
| **Phase 3** | **Profile Onboarding** | Multi-step wizard, autosave drafts, Zod validation, media uploads, completeness score, partner preferences | End-to-end profile creation with score computation |
| **Phase 4** | **Verification and Trust** | Government ID & Aadhaar/PAN adapters, selfie match, duplicate detection, blue tick, admin verification queue | ID upload, masked storage, verification approval |
| **Phase 5** | **Matchmaking Engine** | Baseline deterministic ranking, 15+ filter criteria, compatibility scores, explainable match reasons | Search filter tests, ranking correctness tests |
| **Phase 6** | **Swipe, Interest & Match Flow** | Swipe deck, interests sent/received, super likes, match creation, chat unlock gates | Swipe actions, mutual match trigger, lock enforcement |
| **Phase 7** | **Real-Time Chat & Calling** | Socket.IO messaging, presence, read receipts, attachments, WebRTC calling abstraction, voice notes | Realtime message delivery, authorization check |
| **Phase 8** | **Pandit & Kundli Module** | Pandit directory, Kundli upload/analysis adapter, Gun Milan engine, Dosha detection, Muhurat, bookings | 36 Gun Milan calculation, Dosha report generation |
| **Phase 9** | **Wedding Marketplace** | Vendor listings (Venues, Catering, Photography, Decor, DJ), packages, portfolio, review system | Vendor onboarding, package browsing, reviews |
| **Phase 10** | **Bookings and Payments** | Razorpay, Stripe, UPI adapters, idempotent webhooks, GST invoices, coupons, refunds | Webhook signature verification, transaction audit |
| **Phase 11** | **Memberships & Premium** | Free, Silver, Gold, Diamond tiers, profile boosts, contact reveals, renewal/grace lifecycle | Plan upgrades, quota enforcement, boost active |
| **Phase 12** | **Notification Engine** | Multi-channel notifications (In-app, Email, SMS, Push, WhatsApp), BullMQ retry queues | Queue processing, multi-channel delivery |
| **Phase 13** | **Admin & Moderation** | Admin dashboard, user management, content moderation, fraud signals, revenue analytics, audit logs | Admin RBAC, review action audit logs |
| **Phase 14** | **AI Features** | AI bio generator, match recommendations, conversation starters, safe moderation, PII redaction | Safety tests, prompt injection tests, fallback mode |
| **Phase 15** | **Security Hardening** | OWASP Top 10 defenses, IDOR prevention, rate limiting, anti-scraping, encryption at rest, data export | Security regression tests, pen-test checklist |
| **Phase 16** | **Testing & QA** | Unit tests, integration tests, E2E tests (Playwright), accessibility (WCAG 2.1 AA), load testing | Automated test runner passing 100% |
| **Phase 17** | **Deployment & Observability** | Multi-stage Docker, NGINX config, health monitoring, structured JSON logs, backup & recovery runbooks | Production container build and boot test |
| **Phase 18** | **UI/UX Polish** | Mangal Glassmorphic design system, responsive mobile layout, skeletons, empty states, micro-animations | Visual audit, accessibility compliance AA |

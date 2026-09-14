# Mangal — AI-Powered Matrimony & Wedding Ecosystem

<p align="center">
  <strong>Complete, production-ready, scalable matrimonial and wedding ecosystem platform</strong><br>
  Built for Brides, Grooms, Families, Pandits, Wedding Organizers, Admins, and Support Teams.
</p>

---

## 🌟 Platform Highlights

- **Matrimonial Matchmaking**: 15+ filter criteria, 36-point Gun Milan, Manglik analysis, and AI compatibility scoring.
- **Verification & Trust**: Multi-tier verification (Email, Phone OTP, Government ID, Selfie match, Blue-tick verification).
- **Real-Time Communication**: Socket.IO encrypted messaging, typing indicators, read receipts, and WebRTC audio/video calling.
- **Pandit & Astrology**: Vedic astrology consultation, Kundli generation, Dosha detection, and Muhurat matching.
- **Wedding Marketplace**: Comprehensive directory for venues, caterers, photographers, decorators, and DJs with end-to-end booking and payments.
- **Financial Gateway**: Razorpay, Stripe, and UPI adapters with automated GST invoicing and webhook reconciliation.
- **Enterprise Security**: Argon2id password hashing, rotating refresh token families, RBAC, Helmet, rate-limiting, and comprehensive audit logs.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Mangal Glassmorphic Design System (Vanilla CSS tokens)
- **Backend**: Express.js, TypeScript, Socket.IO, Pino Logger, Helmet, Express-Rate-Limit
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Cache & Queue**: Redis (with automatic in-memory fallback for local development)
- **Orchestration**: Docker Compose (Dev & Production)
- **Package Manager**: pnpm workspaces

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 20 (v22 recommended)
- pnpm >= 9
- PostgreSQL (Local or Docker)

### 1. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone <repository-url>
cd Mangal
pnpm install
```

### 2. Configure Environment
Copy the environment template:
```bash
cp .env.example .env
```
Edit `.env` to configure your PostgreSQL credentials and preferred provider keys.

### 3. Database Setup
Generate Prisma client and apply migrations:
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 4. Run Development Servers
Start both backend API (`http://localhost:4000`) and frontend Web (`http://localhost:3000`):
```bash
pnpm dev
```

### 5. Health Checks
- API Liveness: `http://localhost:4000/health/live`
- API Readiness: `http://localhost:4000/health/ready`
- Web Platform: `http://localhost:3000`

---

## 🐳 Docker Deployment

### Local Docker Stack (PostgreSQL + Redis + MinIO)
```bash
docker-compose up -d
```

### Production Stack
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📚 Documentation

- [Project Audit Report](docs/PROJECT_AUDIT.md)
- [Implementation Roadmap (Phases 0 - 18)](docs/IMPLEMENTATION_ROADMAP.md)
- [Known Issues & Risk Register](docs/KNOWN_ISSUES.md)
- [System Architecture](docs/ARCHITECTURE.md)

---

## 📜 License
Proprietary & Confidential — Mangal Matrimony Platform.

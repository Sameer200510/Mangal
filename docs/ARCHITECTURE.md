# Mangal Platform — System Architecture & Design Specification

**Platform:** Mangal (AI-Powered Matrimony & Wedding Ecosystem)  
**Standard:** Clean Architecture, SOLID Principles, 12-Factor App  

---

## 1. System Topology

```
                  +----------------------------------------------+
                  |           Next.js Frontend (apps/web)        |
                  |     (App Router, SSR/SSG, Design System)     |
                  +-----------------------+----------------------+
                                          |
                        HTTPS / WSS REST & Socket.IO
                                          |
                                          v
+---------------------------------------------------------------------------------+
|                         Express.js API Gateway (apps/api)                       |
|  +---------------------------------------------------------------------------+  |
|  | Security Middleware: Helmet, CORS, Rate Limit, Request Size, Auth, RBAC   |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
|  +--------------------------------+       +----------------------------------+  |
|  | Feature Modules:               |       | Provider Adapters:               |  |
|  | - Auth (Argon2, JWT, OTP, 2FA) |       | - Storage: Local / S3 / MinIO    |  |
|  | - Profiles & Onboarding        |       | - Cache: Memory / Redis          |  |
|  | - Verification & Trust         | <---> | - Email: Console / SES / SMTP    |  |
|  | - Matchmaking Engine           |       | - SMS: Console / Twilio / MSG91  |  |
|  | - Swipes & Interests           |       | - Payments: Mock / Razorpay      |  |
|  | - Realtime Chat & Calling      |       | - AI: Deterministic / Gemini     |  |
|  | - Pandit & Kundli Milan        |       | - Video: WebRTC / Twilio Video   |  |
|  | - Wedding Organizer Market    |       +----------------------------------+  |
|  | - Bookings & Invoicing         |                                             |
|  | - Memberships & Subscriptions  |                                             |
|  | - Admin & Moderation           |                                             |
|  +--------------------------------+                                             |
+-----------------------------------------+---------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------+
|                               Persistence Layer                                 |
|  +-------------------------------------+   +---------------------------------+  |
|  | PostgreSQL Database                 |   | Redis (or In-Memory Fallback)   |  |
|  | (Prisma ORM: Schema, Migrations)    |   | - Session Caching               |  |
|  | - Users, Profiles, Photos, IDs      |   | - Rate Limiting                 |  |
|  | - Matches, Messages, Bookings       |   | - Socket.IO Pub/Sub Adapter     |  |
|  +-------------------------------------+   +---------------------------------+  |
+---------------------------------------------------------------------------------+
```

---

## 2. Package & Monorepo Organization

The project uses `pnpm workspaces` organized into 2 primary industry-grade directories:

- `frontend/`: Next.js 14+ with App router, responsive mobile-first UI, luxury Indian matrimony color palette (Crimson `#800020`, Gold `#D4AF37`, Navy `#0A1128`, Glassmorphism), WCAG 2.1 AA compliance.
- `backend/`: Express.js + TypeScript, Prisma ORM with PostgreSQL, modular controllers, services, Socket.IO gateway, Redis/In-memory cache adapters, and background job processors, and standard API response envelope:
  ```typescript
  export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
      code: string;
      message: string;
      details?: unknown;
    };
    meta?: {
      timestamp: string;
      requestId?: string;
      page?: number;
      limit?: number;
      total?: number;
    };
  }
  ```

---

## 3. Database Entities & Relationships

Key entities modeled in Prisma:
- **User**: Core authentication identity (Email, Phone, PasswordHash, Role, Status, 2FA).
- **Session**: Active device sessions, refresh token hashes, IP address, user agent, expiry.
- **Profile**: Matrimonial profile (Personal, Physical, Horoscope, Education, Career, Family, Lifestyle, Preferences, Completeness score).
- **ProfilePhoto**: Photo gallery with primary photo flag, blur-on-request privacy, approval status.
- **IdentityVerification**: Government ID records, Aadhaar/PAN status, selfie verification, audit notes.
- **Interest**: Sent / Received interest requests with status (PENDING, ACCEPTED, DECLINED, WITHDRAWN).
- **Match**: Mutual connections unlocking real-time chat and calling permissions.
- **Conversation & Message**: Real-time chats, delivery receipts, reactions, media attachments.
- **PanditProfile & Kundli**: Astrologer credentials, Kundli charts, Gun Milan scores (Ashtakoota 36 points), consultations.
- **OrganizerProfile & Listing**: Wedding vendors (Venues, Catering, Photo, Decor), packages, reviews.
- **Booking & Payment**: Orders, invoices, Razorpay/Stripe payment intents, refunds.
- **Membership**: Subscription tiers (Free, Silver, Gold, Diamond), feature limits, expiration.
- **AuditLog**: Immutably logged sensitive mutations for administrative compliance.

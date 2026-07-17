# Software requirements specification

## Scope and users

Mangal connects adults seeking marriage (brides, grooms and families) with verified matrimonial profiles, pandits, and wedding providers. Internal roles are Super Admin, Admin, Moderator, and Support. Users must be 18+ and consent to processing before profile activation.

## Functional requirements

| Domain | Capability |
|---|---|
| Identity | Email/password, Google and OTP adapter flows, email/phone verification, session list and revocation, optional 2FA. |
| Profiles | Controlled disclosure of biodata, media, preferences, family data, documents and KYC review state. |
| Discovery | Filtered, paginated discovery; saved searches; recommendations; likes, passes, super-likes and interests. |
| Communication | Consent-gated conversations, Socket.IO real-time delivery, read state, blocks/reports, attachments and moderation queue. |
| Services | Pandit/organizer onboarding, services/packages, availability, booking, invoices, payment/refund webhooks. |
| Administration | KYC queues, users, roles, reports, content review, plans, payments, CMS, notifications and immutable audit history. |

## Non-functional requirements

P95 reads under 300 ms excluding external providers; stateless API replicas; PostgreSQL point-in-time recovery; Redis-backed queues; RPO ≤15 min and RTO ≤4 hr; WCAG 2.1 AA; OWASP ASVS-aligned controls; all production ingress over TLS. Data locality, retention and consent policies must be set for the target jurisdiction before launch.

## Acceptance gates

Production launch requires completed provider adapters, KYC/manual moderation runbook, legal/privacy review, penetration test, disaster-recovery exercise, load test, monitoring/alerting, and actual migration/seed execution in a staging environment.

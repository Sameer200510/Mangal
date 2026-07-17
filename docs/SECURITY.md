# Security architecture and launch audit

## Built-in controls

- Argon2id password hashing; short-lived signed access tokens; rotating, SHA-256-hashed refresh session tokens.
- Role middleware, request-size limits, CORS allowlist, Helmet headers, rate limits, schema validation, Prisma parameterization, and Pino secret redaction.
- Private object keys for KYC, MIME/size validation required at upload boundary, moderation before public media, and report/block workflows.
- Immutable-style audit records for privileged actions. Never log passwords, OTPs, tokens, government IDs, or payment payloads.

## Required before production

1. Add CSRF protection if using cookie-based tokens; this implementation uses bearer tokens.
2. Put Google OAuth, OTP/SMS, KYC/face matching, content moderation, payments, WhatsApp, email, and video through vetted adapters with webhook signature verification and idempotency keys.
3. Enforce age verification and consent, encrypt KYC data with KMS, publish retention/deletion schedules, and complete jurisdictional legal review (DPDP/GDPR as applicable).
4. Configure WAF/DDoS, CSP tailored to deployed domains, secret manager, SAST/dependency scanning, image scanning, penetration testing and incident response.
5. Require least-privilege IAM, backups and restore drills; alert on login anomalies, payment failures, moderation SLA and queue depth.

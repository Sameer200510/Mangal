# API contract

Base URL: `/api/v1`. Interactive OpenAPI is served at `/docs`.

All protected endpoints require `Authorization: Bearer <accessToken>`. Access tokens expire in 15 minutes; refresh rotation uses `POST /auth/refresh`. Errors use `{ "error": { "code", "message", "details?" } }`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create an adult member account. |
| POST | `/auth/login` | Exchange credentials for access/refresh tokens. |
| POST | `/auth/refresh` | Rotate a valid refresh session. |
| POST | `/auth/logout` | Revoke a refresh session. |
| GET/PUT | `/profiles/me` | Read or upsert the authenticated profile. |
| GET | `/profiles/:slug` | Read a publicly visible profile. |
| GET | `/discovery/profiles?page=1&limit=20` | Filterable profile discovery. |
| POST | `/discovery/swipes` | Record LIKE, PASS, or SUPER_LIKE. |
| POST | `/interests` | Send a consent-based interest. |
| PATCH | `/interests/:id` | Accept or decline a received interest. |

New endpoints must use Zod request validation, cursor/page pagination, a scoped authorization policy, idempotency for financial writes, and audit logging for admin/sensitive actions.

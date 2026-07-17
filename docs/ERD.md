# Core data model

```mermaid
erDiagram
  USER ||--o| PROFILE : owns
  USER ||--o{ SESSION : has
  USER ||--o{ OAUTH_IDENTITY : authenticates
  PROFILE ||--o| PARTNER_PREFERENCE : defines
  PROFILE ||--o{ MEDIA : publishes
  PROFILE ||--o{ VERIFICATION_DOCUMENT : submits
  USER ||--o{ INTEREST : sends
  USER ||--o{ INTEREST : receives
  USER ||--o{ SWIPE : creates
  CONVERSATION ||--o{ CONVERSATION_MEMBER : includes
  PROFILE ||--o{ CONVERSATION_MEMBER : joins
  CONVERSATION ||--o{ MESSAGE : contains
  PROFILE ||--o{ MESSAGE : sends
  SERVICE_PROVIDER ||--o{ WEDDING_SERVICE : lists
  WEDDING_SERVICE ||--o{ BOOKING : receives
  BOOKING ||--o{ PAYMENT : settles
  PLAN ||--o{ MEMBERSHIP : grants
  USER ||--o{ MEMBERSHIP : holds
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ REPORT : files
  PROFILE ||--o{ REPORT : concerns
  USER ||--o{ AUDIT_LOG : performs
```

The schema enforces identity and relationship integrity through UUID foreign keys, unique constraints for profile ownership and interest/swipe pairs, and query-aligned indexes. PII documents retain only encrypted object keys; their bytes belong in private object storage, never in PostgreSQL.

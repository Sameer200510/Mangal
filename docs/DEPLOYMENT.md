# Deployment and operations

Build immutable web and API images, run a migration job exactly once, then deploy horizontally behind NGINX/load balancer. Use managed PostgreSQL with SSL and automated backups, managed Redis, S3-compatible private storage, a secrets manager, and a transactional email/SMS vendor.

Environment variables are in `.env.example`; production secrets must not reside in source control. Health endpoint: `/healthz`. Route structured logs to a central collector and expose metrics/traces through OpenTelemetry before traffic is enabled.

CI runs generation, linting, tests and builds. CD should build/scans images, deploy to staging, run migrations, execute smoke tests, obtain approval, then use rolling/canary release with automated rollback on health/error-budget breach.

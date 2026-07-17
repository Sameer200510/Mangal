# Quality strategy

Run `pnpm lint`, `pnpm test`, and `pnpm build` locally and in CI. Unit tests cover deterministic domain functions and security utilities. Add integration tests with an ephemeral PostgreSQL/Redis service for registration, refresh-token reuse, role denial, profile visibility, matching, booking/payment webhooks and Socket.IO authorization. Add Playwright accessibility and critical-path tests for signup, consent, discovery, interest acceptance, chat unlock and booking.

Load test discovery and messaging with k6 against staging using realistic profile cardinality. Baseline P95/P99 latency, connection count, queue lag, database pool saturation and error rate. Include migration compatibility tests and restore-from-backup exercises in each release train.

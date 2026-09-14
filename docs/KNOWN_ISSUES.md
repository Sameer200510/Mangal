# Mangal Platform — Known Issues & Risk Register

**Scope:** Mangal Enterprise Platform  
**Status:** Monitored & Managed  

---

## 1. Environment & Infrastructure

### 1.1 Docker Desktop Engine Offline
- **Impact:** `docker-compose up` will fail if Docker Desktop is stopped.
- **Remediation:** 
  - Dual execution strategy: Native Windows execution using local PostgreSQL (`localhost:5432`) and built-in in-memory fallback for Redis.
  - Transparent fallback: In-memory cache and event emitter take over automatically when Redis is unreachable, allowing local frontend and backend development to proceed seamlessly.

### 1.2 Multi-Platform Path Separators
- **Impact:** Windows uses `\` while Linux containers use `/`.
- **Remediation:** All file path manipulations in TypeScript/Node use `path.join()`, `path.resolve()`, or `url.fileURLToPath()` without hardcoded backslashes.

---

## 2. External Service Adapters & Fallback Architecture

| External Service | Production Provider | Local Development Mock Fallback |
|:---|:---|:---|
| **SMS / OTP** | Twilio / MSG91 / Fast2SMS | `MockSmsAdapter` (logs 6-digit OTP to console, accepts `123456` in mock mode) |
| **Email** | SendGrid / AWS SES / Resend | `MockEmailAdapter` (prints email HTML to console or MailHog) |
| **Storage / CDN** | AWS S3 / Cloudflare R2 / MinIO | `LocalStorageAdapter` (saves to `uploads/` directory with local URL) |
| **Payments** | Razorpay / Stripe / UPI Gateway | `MockPaymentAdapter` (instant sandbox success/failure simulator) |
| **Astrology / Kundli** | Vedic Astro API | `DeterministicKundliAdapter` (calculates 36 Gunas using baseline mathematical tables) |
| **AI LLM** | Google Gemini / OpenAI / Anthropic | `DeterministicAiAdapter` (generates structured profile bios and suggestions based on verified rules) |
| **Video Calling** | Twilio Video / Agora / WebRTC | `MockVideoCallAdapter` (provides WebRTC signaling room URLs) |

---

## 3. Data Protection & Security Controls

### 3.1 PII & Government ID Protection
- Under no circumstances will raw Aadhaar/PAN/Passport photos or biometric data be stored as unencrypted blobs in relational database tables.
- All documents require presigned, short-lived URLs (maximum 15 minutes TTL) accessible only by authenticated and authorized moderation roles.

### 3.2 Chat & Call Safety
- No messaging or calling channels can be initiated unless a mutual match is confirmed or explicit family consent is registered.
- Instant user blocking and report triggers invalidate ongoing Socket.IO sessions.

# Deploying Mangal on Render (render.com)

This guide provides step-by-step instructions for deploying the entire Mangal Matrimony & Wedding Ecosystem platform (PostgreSQL database, Express API backend, and Next.js frontend) to Render.

---

## 🚀 Method 1: Automatic 1-Click Blueprint (Recommended)

Render's Blueprint feature reads the [`render.yaml`](./render.yaml) file in this repository and automatically sets up the PostgreSQL database, Backend Web Service, and Frontend Web Service in perfect sync with all environment variables wired up.

### Steps:
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click on the **"New +"** button at the top right of your dashboard.
3. Select **"Blueprint"**.
4. Connect your GitHub repository: **`Sameer200510/Mangal`**.
5. Select branch: **`main`**.
6. Render will automatically parse `render.yaml` and display the plan:
   - 🗄️ **`mangal-postgres`** (Managed PostgreSQL Database)
   - ⚙️ **`mangal-api`** (Backend Express + Socket.IO + Prisma Web Service)
   - 🌐 **`mangal-web`** (Frontend Next.js 14 Web Service)
7. Click **"Apply"** (or **"Create Blueprint Instance"**).
8. Render will now:
   - Provision your PostgreSQL database.
   - Run Prisma migrations (`pnpm --filter backend run db:deploy`).
   - Build and start the backend API.
   - Build and start the Next.js frontend with live Aipan UI and Swipe deck.

Once deployment finishes, you will receive two public URLs:
- **Frontend URL:** `https://mangal-web.onrender.com`
- **Backend API URL:** `https://mangal-api.onrender.com`

---

## 🛠️ Method 2: Manual Service Setup on Render

If you prefer to configure each service manually in the Render dashboard:

### Step 1: Create PostgreSQL Database
1. In Render dashboard, click **"New +"** -> **"PostgreSQL"**.
2. **Name:** `mangal-postgres`
3. **Database:** `mangal_prod`
4. **User:** `mangal`
5. **Region:** Oregon (or closest to your users)
6. **Plan:** Free
7. Click **"Create Database"**.
8. Copy the **Internal Database URL** once it is created.

---

### Step 2: Create Backend Web Service (`mangal-api`)
1. Click **"New +"** -> **"Web Service"**.
2. Connect **`Sameer200510/Mangal`** (`main` branch).
3. **Name:** `mangal-api`
4. **Language:** Node
5. **Region:** Same as your database (Oregon)
6. **Branch:** `main`
7. **Build Command:**
   ```bash
   pnpm install --no-frozen-lockfile --prod=false && pnpm --filter backend run db:generate && pnpm --filter backend run build
   ```
8. **Start Command:**
   ```bash
   pnpm --filter backend run db:deploy && pnpm --filter backend start
   ```
9. **Health Check Path:** `/health/live`
10. **Environment Variables:**
    - `NODE_ENV`: `production`
    - `PORT`: `10000`
    - `DATABASE_URL`: *(Paste your Internal Database URL from Step 1)*
    - `REDIS_ENABLED`: `false`
    - `JWT_ACCESS_SECRET`: *(Generate a random 32+ character string)*
    - `JWT_REFRESH_SECRET`: *(Generate a random 32+ character string)*
    - `COOKIE_SECRET`: *(Generate a random 32+ character string)*
    - `CORS_ORIGINS`: `*`
    - `PROVIDER_MODE`: `mock`
    - `STORAGE_PROVIDER`: `local`
    - `STORAGE_LOCAL_PATH`: `./uploads`
11. Click **"Create Web Service"**.
12. Copy your backend's live URL (e.g. `https://mangal-api.onrender.com`).

---

### Step 3: Create Frontend Web Service (`mangal-web`)
1. Click **"New +"** -> **"Web Service"**.
2. Connect **`Sameer200510/Mangal`** (`main` branch).
3. **Name:** `mangal-web`
4. **Language:** Node
5. **Region:** Same as backend (Oregon)
6. **Branch:** `main`
7. **Build Command:**
   ```bash
   pnpm install --no-frozen-lockfile --prod=false && pnpm --filter frontend run build
   ```
8. **Start Command:**
   ```bash
   pnpm --filter frontend start
   ```
9. **Environment Variables:**
    - `NODE_ENV`: `production`
    - `NEXT_PUBLIC_API_URL`: `https://mangal-api.onrender.com` *(Your backend URL from Step 2)*
    - `BACKEND_URL`: `https://mangal-api.onrender.com` *(Your backend URL from Step 2)*
10. Click **"Create Web Service"**.

---

## 🪔 Step 4: Seed Sample Data (Optional)

After your backend service is live, you can populate test brides, grooms, pandits, and vendors:

1. In Render Dashboard, open your **`mangal-api`** service.
2. Click on the **"Shell"** tab on the left menu.
3. Run the following command:
   ```bash
   pnpm --filter backend run db:seed
   ```
4. **Default Test Accounts:**
   - **Admin:** `admin@mangal.com` / `Admin@123`
   - **Sample Groom (Kumaoni):** `kavya.joshi@example.com` / `Password@123`
   - **Sample Bride (Garhwali):** `priya.rawat@example.com` / `Password@123`
   - **Pandit:** `pandit.nautiyal@example.com` / `Pandit@123`

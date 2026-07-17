import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";
// API scripts execute from apps/api; load the shared monorepo environment file.
loadEnv({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
const envSchema = z.object({ NODE_ENV: z.enum(["development", "test", "production"]).default("development"), API_PORT: z.coerce.number().default(4000), WEB_ORIGIN: z.string().url(), JWT_ACCESS_SECRET: z.string().min(32), JWT_REFRESH_SECRET: z.string().min(32), DATABASE_URL: z.string().url() });
export const env = envSchema.parse(process.env);

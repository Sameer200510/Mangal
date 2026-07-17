import PrismaClientPackage from "@prisma/client";
import argon2 from "argon2";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
loadEnv({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });
const { PrismaClient, Role, SubscriptionTier } = PrismaClientPackage;
const db = new PrismaClient();
await db.plan.upsert({ where: { code: SubscriptionTier.FREE }, update: {}, create: { code: SubscriptionTier.FREE, name: "Free", price: 0, durationDays: 3650, entitlements: { likesPerDay: 10 } } });
for (const [code, name, price] of [[SubscriptionTier.SILVER, "Silver", 999], [SubscriptionTier.GOLD, "Gold", 1999], [SubscriptionTier.DIAMOND, "Diamond", 3999]] as const) await db.plan.upsert({ where:{code}, update:{}, create:{code,name,price,durationDays:30,entitlements:{unlimitedChat:true}} });
// Development-only bootstrap account. Change password before any non-local use.
await db.user.upsert({ where: { email: "admin@mangal.local" }, update: {}, create: { email: "admin@mangal.local", passwordHash: await argon2.hash("ChangeMeImmediately!2026"), role: Role.SUPER_ADMIN } });
await db.$disconnect();

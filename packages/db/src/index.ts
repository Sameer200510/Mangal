// Prisma Client is CommonJS at runtime. Re-exporting it with `export *` loses
// enum values under Node ESM, so expose the runtime values explicitly.
import PrismaClientPackage from "@prisma/client";
export const PrismaClient = PrismaClientPackage.PrismaClient;
export const Role = PrismaClientPackage.Role;
export const SwipeType = PrismaClientPackage.SwipeType;
export const SubscriptionTier = PrismaClientPackage.SubscriptionTier;
export type { AccountStatus, BookingStatus, InterestStatus, MessageType, PaymentStatus, ReportStatus, Role, SwipeType, SubscriptionTier, VerificationStatus } from "@prisma/client";
export { prisma } from "./client.js";

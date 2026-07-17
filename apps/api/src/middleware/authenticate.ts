import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/http.js"; import { verifyAccessToken, type TokenClaims } from "../lib/auth.js";
declare global { namespace Express { interface Request { auth?: TokenClaims; } } }
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => { try { const token = req.header("authorization")?.replace(/^Bearer\s+/i, ""); if (!token) throw new AppError(401, "UNAUTHENTICATED", "Authentication required"); req.auth = await verifyAccessToken(token); next(); } catch { next(new AppError(401, "UNAUTHENTICATED", "Invalid or expired access token")); } };
export const authorize = (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => !req.auth || !roles.includes(req.auth.role) ? next(new AppError(403, "FORBIDDEN", "Insufficient permissions")) : next();

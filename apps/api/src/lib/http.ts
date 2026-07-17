import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
export class AppError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }
export const notFound = (_req: Request, _res: Response, next: NextFunction) => next(new AppError(404, "NOT_FOUND", "Resource not found"));
export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => { const e = error instanceof AppError ? error : error instanceof ZodError ? new AppError(422, "VALIDATION_ERROR", "Invalid request") : new AppError(500, "INTERNAL_ERROR", "An unexpected error occurred"); res.status(e.status).json({ error: { code: e.code, message: e.message, details: error instanceof ZodError ? error.flatten() : undefined } }); };

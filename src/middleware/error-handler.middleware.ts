import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export default function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error("Помилка:", err);

    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("UNIQUE constraint failed")) {
        res.status(409).json({ error: "CONFLICT", message: "Дані вже існують" });
        return;
    }
    if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) {
        res.status(400).json({ error: "BAD_REQUEST", message: "Некоректні дані" });
        return;
    }
    if (err instanceof ApiError) {
        res.status(err.status).json({
            error: err.name,
            message: err.message,
            details: err.details
        });
        return;
    }
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "Помилка сервера" });
}

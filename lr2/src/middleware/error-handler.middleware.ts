import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ApiError) {
        res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details
            }
        });
        return;
    }

    console.error("Unhandled error:", err);
    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Щось пішло не так на сервері"
        }
    });
};

export default errorHandler;

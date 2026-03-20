import { Request, Response, NextFunction } from "express";

interface DtoClass {
    new (data: Record<string, unknown>): { validate(): unknown };
}

const validationMiddleware = (DtoClass: DtoClass) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = new DtoClass(req.body as Record<string, unknown>).validate();
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validationMiddleware;
import { Request, Response, NextFunction } from "express";
import service from "../services/passes.service";
import { UpdatePassDto, PassResponseDto } from "../dtos/passes.dto";

class PassesController {
    getAll(req: Request, res: Response, next: NextFunction): void {
        try {
            const passes = service.getAllPasses(req.query as { status?: string; search?: string });
            res.status(200).json({ items: passes, total: passes.length });
        } catch (error) {
            next(error);
        }
    }

    getById(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            const pass = service.getPassById(req.params.id);
            res.status(200).json({ pass });
        } catch (error) {
            next(error);
        }
    }

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const newPass = service.createPass(req.body);
            res.status(201).json(new PassResponseDto(newPass));
        } catch (error) {
            next(error);
        }
    }

    update(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            const updatedPass = service.updatePass(req.params.id, req.body as UpdatePassDto);
            res.status(200).json(new PassResponseDto(updatedPass));
        } catch (error) {
            next(error);
        }
    }

    patch(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            const updatedPass = service.patchPass(req.params.id, req.body as UpdatePassDto);
            res.status(200).json(new PassResponseDto(updatedPass));
        } catch (error) {
            next(error);
        }
    }

    delete(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            service.deletePass(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new PassesController();
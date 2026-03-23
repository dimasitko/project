import { Request, Response, NextFunction } from "express";
import service from "../services/passes.service";
import { CreatePassDto, UpdatePassDto } from "../dtos/passes.dto";

class PassesController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const passes = await service.getAllPasses(req.query);
            res.status(200).json({ items: passes, total: passes.length });
        } catch (error) {
            next(error);
        }
    }
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pass = await service.getPassById(String(req.params.id));
            res.status(200).json({ data: pass });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = new CreatePassDto(req.body).validate();
            const newPass = await service.createPass(dto);
            res.status(201).json({ data: newPass });
        } catch (error) { 
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = new UpdatePassDto(req.body).validate();
            const updatedPass = await service.updatePass(String(req.params.id), dto);
            res.status(200).json({ data: updatedPass });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await service.deletePass(String(req.params.id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new PassesController();
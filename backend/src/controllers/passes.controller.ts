import { Request, Response, NextFunction } from "express";
import service from "../services/passes.service";
import { CreatePassDto, UpdatePassDto } from "../dtos/passes.dto";

class PassesController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = req.query as Record<string, string>;
            const passes = await service.getAllPasses(filters);
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
    async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await service.getStats();
            res.status(200).json({ data: stats });
        } catch (error) {
            next(error);
        }
    }

    async getPassesWithUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const passes = await service.getPassesWithUsers();
            res.status(200).json({ data: passes });
        } catch (error) {
            next(error);
        }
    }

    async searchVulnerable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = String(req.query.q || "");
            const result = await service.searchVulnerable(query);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }
}

export default new PassesController();

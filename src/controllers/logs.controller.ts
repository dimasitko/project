import { Request, Response, NextFunction } from "express";
import service from "../services/logs.service";
import { CreateLogDto} from "../dtos/logs.dto";

class LogsController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const logs = await service.getAllLogs(req.query);
            res.status(200).json({ items: logs, total: logs.length });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = new CreateLogDto(req.body).validate();
            const newLog = await service.createLog(dto);
            res.status(201).json({ data: newLog });
        } catch (error) {
            next(error);
        }
    }
}

export default new LogsController();

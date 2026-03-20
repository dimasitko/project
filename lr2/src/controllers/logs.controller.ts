import { Request, Response, NextFunction } from "express";
import service from "../services/logs.service";
import { CreateLogDto, LogResponseDto } from "../dtos/logs.dto";

class LogsController {
    getAll(req: Request, res: Response, next: NextFunction): void {
        try {
            const logs = service.getAllLogs();
            res.status(200).json({ items: logs, total: logs.length });
        } catch (error) {
            next(error);
        }
    }

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const newLog = service.createLog(req.body as CreateLogDto);
            res.status(201).json(new LogResponseDto(newLog));
        } catch (error) {
            next(error);
        }
    }
}

export default new LogsController();

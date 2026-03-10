const service = require("../services/logs.service");
const { CreateLogDto, LogResponseDto } = require("../dtos/logs.dto");

class LogsController {
    getAll(req, res, next) {
        try {
            const logs = service.getAllLogs();
            res.status(200).json({ items: logs, total: logs.length });
        } catch (error) {
            next(error);
        }
    }

    create(req, res, next) {
        try {
            const dto = new CreateLogDto(req.body).validate();
            const newLog = service.createLog(dto);
            res.status(201).json(new LogResponseDto(newLog));
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new LogsController();
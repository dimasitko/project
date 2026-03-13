const service = require("../services/logs.service");
const { LogResponseDto } = require("../dtos/logs.dto");

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
            const newLog = service.createLog(req.body);
            res.status(201).json(new LogResponseDto(newLog));
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new LogsController();

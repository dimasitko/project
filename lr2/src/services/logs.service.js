const { v4: uuidv4 } = require("uuid");
const repository = require("../repositories/logs.repository");

class LogsService {
    getAllLogs() {
        return repository.getAll();
    }

    createLog(createDto) {
        const log = {
            id: uuidv4(),
            action: createDto.action.trim(),
            timestamp: new Date().toISOString()
        };
        return repository.add(log);
    }
}
module.exports = new LogsService();

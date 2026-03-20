import { v4 as uuidv4 } from "uuid";
import repository from "../repositories/logs.repository";
import { CreateLogDto, Log } from "../dtos/logs.dto";

class LogsService {
    getAllLogs(): Log[] {
        return repository.getAll();
    }

    createLog(createDto: CreateLogDto): Log {
        const log: Log = {
            id: uuidv4(),
            action: createDto.action.trim(),
            timestamp: new Date().toISOString()
        };
        return repository.add(log);
    }
}

export default new LogsService();
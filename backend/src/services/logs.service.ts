import repository from "../repositories/logs.repository";
import { CreateLogDto, Log } from "../dtos/logs.dto";

class LogsService {
    async getAllLogs(query: { search?: string }): Promise<Log[]> {
        return await repository.getAll(query.search);
    }

    async createLog(createDto: CreateLogDto): Promise<Log> {
        return await repository.add(createDto.action, new Date().toISOString());
    }
}

export default new LogsService();

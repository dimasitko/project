import { Log } from "../dtos/logs.dto";

const logs: Log[] = [];

class LogsRepository {
    getAll(): Log[] {
        return [...logs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    add(log: Log): Log {
        logs.push(log);
        return log;
    }
}

export default new LogsRepository();
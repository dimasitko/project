import { Log } from "../dtos/logs.dto";
import { all, run, escapeSql } from "../db/dbClient";

class LogsRepository {
    async getAll(): Promise<Log[]> {
        return await all<Log>("SELECT * FROM logs ORDER BY id DESC LIMIT 50;");
    }
    
    async add(action: string, timestamp: string): Promise<Log> {
        const sql = `INSERT INTO logs (action, timestamp) VALUES ('${escapeSql(action)}', '${timestamp}');`;
        const result = await run(sql);
        const rows = await all<Log>(`SELECT * FROM logs WHERE id = ${result.lastID};`);
        return rows[0];
    }
}

export default new LogsRepository();
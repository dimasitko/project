import { Log } from "../dtos/logs.dto";
import { all, run, escapeSql } from "../db/dbClient";

class LogsRepository {
    async getAll(search? : string): Promise<Log[]> {
       let sql = "SELECT id,  action, created_at as timestamp FROM logs WHERE 1=1";

        if (search) {
            const searchLower = search.toLowerCase();
            const searchCapitalized = searchLower.charAt(0).toUpperCase() + searchLower.slice(1);
            sql += ` AND (action LIKE '%${escapeSql(searchLower)}%' OR action LIKE '%${escapeSql(searchCapitalized)}%')`;
        }
        
        sql += " ORDER BY id DESC LIMIT 50;";
        return await all<Log>(sql);
    }
    
    async add(action: string, timestamp: string): Promise<Log> {
        const sql = `INSERT INTO logs (action, created_at) VALUES ('${escapeSql(action)}', '${timestamp}');`;
        const result = await run(sql);
        const rows = await all<Log>(`SELECT * FROM logs WHERE id = ${result.lastID};`);
        return rows[0];
    }
}

export default new LogsRepository();
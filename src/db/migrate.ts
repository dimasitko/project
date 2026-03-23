import fs from "fs";
import path from "path";
import { run} from "./dbClient";

export async function migrate() {
    try {
        const migrationsPath = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsPath).sort();

        for (const file of files) {
            const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
            const queries = sql.split(';').filter(q => q.trim());
            
            for (const query of queries) {
                await run(query);
            }
            console.log(`Міграції успішно виконані ${file}`);
        }
    } catch (error) {
        console.error('Помилка міграції:', error);
        throw error;
    }
}
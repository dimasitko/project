import fs from "fs";
import path from "path";
import { run, all} from "./dbClient";

export async function migrate() {
    try {
        const folder = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(folder).sort();

        const setupSql = fs.readFileSync(path.join(folder, '000_setup.sql'), 'utf8');
        await run(setupSql);

        const applied = (await all<{name: string}>("SELECT name FROM schema_migrations")).map(m => m.name);

        for (const file of files) {
            if (file === '000_setup.sql' || applied.includes(file)) continue;

            const sql = fs.readFileSync(path.join(folder, file), 'utf8');
            for (const query of sql.split(';').filter(q => q.trim())) {
                await run(query);
            }
        
            await run(`INSERT INTO schema_migrations (name) VALUES ('${file}');`);
            console.log(`Міграції успішно виконані ${file}`);
        }
    } catch (error) {
        console.error('Помилка міграції:', error);
        throw error;
    }
}
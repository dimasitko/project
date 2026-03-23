import fs from "fs";
import path from "path";
import { run, all, escapeSql } from "./dbClient";

export async function migrate(): Promise<void> {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename VARCHAR(255) NOT NULL UNIQUE,
            appliedAt VARCHAR(255) NOT NULL
        );
    `);

    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir);

    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    const applied = await all<{ filename: string }>("SELECT filename FROM schema_migrations;");
    const appliedSet = new Set(applied.map((x) => x.filename));

    for (const file of files) {
        if (appliedSet.has(file)) continue;
        
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8").trim();
        if (!sql) continue;

        await run(sql);
        const now = new Date().toISOString();
        await run(`INSERT INTO schema_migrations (filename, appliedAt) VALUES ('${escapeSql(file)}', '${now}');`);
        console.log(`Міграцію застосовано: ${file}`);
    }
}
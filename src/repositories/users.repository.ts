import { User, UpdateUserDto } from "../dtos/users.dto";
import { all, get, run, escapeSql } from "../db/dbClient";

class UsersRepository {
    async getAll(role?: string, search?: string): Promise <User[]> {
        let sql = "SELECT * FROM users WHERE 1=1";

        if (role && role !== "Всі") sql += ` AND role = '${escapeSql(role)}'`;

        if (search) {
        const searchLower = search.toLowerCase();
        const searchCapitalized = searchLower.charAt(0).toUpperCase() + searchLower.slice(1);
        sql += ` AND (name LIKE '%${escapeSql(searchLower)}%' OR name LIKE '%${escapeSql(searchCapitalized)}%')`;
        }
        
        sql += " ORDER BY id DESC;";
        return await all<User>(sql);
    }

    async getById(id: number): Promise <User | undefined> {
        return await get<User>(`SELECT * FROM users WHERE id = ${id};`);
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return await get<User>(`SELECT * FROM users WHERE email = '${escapeSql(email)}';`);
    }

    async add(user: { email: string; name: string; role: string; created_at: string }): Promise <User> {
        const sql = `INSERT INTO users (email, name, role, created_at) VALUES ('${escapeSql(user.email)}', '${escapeSql(user.name)}', '${escapeSql(user.role)}', '${user.created_at}');`;
        const result = await run(sql);
        return (await this.getById(result.lastID))!;
    }

    async update(id: number, user: UpdateUserDto): Promise <User | null> {
        let sql = `UPDATE users SET `;
        const updates = [];
        if (user.name !== undefined) updates.push(`name = '${escapeSql(user.name)}'`);
        if (user.role !== undefined) updates.push(`role = '${escapeSql(user.role)}'`);
        
        if (updates.length === 0) 
        return await this.getById(id) || null;
        
        sql += updates.join(", ") + ` WHERE id = ${id};`;
        await run(sql);
        return await this.getById(id) || null;
    }

    async delete(id: number): Promise <boolean> {
        const result = await run(`DELETE FROM users WHERE id = ${id};`);
        return result.changes>0;
    }

    //Ендпоін на бонусні бали
    async getAdminsForExport(): Promise <User[]> {
        const sql = `SELECT id, name FROM users WHERE role = 'Адміністратор' ORDER BY id DESC;`;
        return await all<User>(sql);
    }

    async importAdminsBatch(usersData: any[]): Promise<number> {
        let importedCount = 0;
        for (const u of usersData) {
            if (u.name && u.email) {
                const createdAt = u.created_at || new Date().toISOString()
                const sql = `INSERT INTO users (name, email, role, created_at) 
                             VALUES ('${escapeSql(u.name)}', '${escapeSql(u.email)}', 'Адміністратор', '${createdAt}')`;
                await run(sql);
                importedCount++;
            }
        }
        return importedCount;
    }
}

export default new UsersRepository();
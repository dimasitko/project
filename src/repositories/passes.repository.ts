import { Pass, UpdatePassDto } from "../dtos/passes.dto";
import { all, get, run, escapeSql } from "../db/dbClient";

class PassesRepository {
    async getAll(queryParams: { status?: string, search?: string, user_id?: string, sort?: string, order?: string }): Promise<any[]> {
    let sql = `SELECT p.id, p.status, p.date, p.comment, p.created_at, u.name as userName, u.email as userEmail, a.name as adminName FROM passes p JOIN users u ON p.user_id = u.id JOIN users a ON p.admin_id = a.id WHERE 1=1`;

    if (queryParams.status && queryParams.status !== "Всі") {
        sql += ` AND p.status = '${escapeSql(queryParams.status)}'`;
    }
    
    if (queryParams.search) {
        const searchLower = queryParams.search.toLowerCase();
        const searchCapitalized = searchLower.charAt(0).toUpperCase() + searchLower.slice(1);
        sql += ` AND (u.name LIKE '%${escapeSql(searchLower)}%' OR u.name LIKE '%${escapeSql(searchCapitalized)}%')`;
    }

    if (queryParams.user_id) {
        sql += ` AND p.user_id = '${escapeSql(queryParams.user_id)}'`; 
    }

    const validSort = ['id', 'date', 'created_at', 'status'];
    const sortCol = validSort.includes(queryParams.sort as string) ? `p.${queryParams.sort}` : 'p.id';
    const sortOrder = String(queryParams.order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${sortCol} ${sortOrder} LIMIT 100;`;

    return await all(sql);
}

   async getById(id: number): Promise<Pass | undefined> {
        return await get<Pass>(`SELECT * FROM passes WHERE id = ${id};`);
    }

    async add(pass: { user_id: number; admin_id: number; status: string; date: string; comment?: string; created_at: string }): Promise<Pass> {
        const sql = `
            INSERT INTO passes (user_id, admin_id, status, date, comment, created_at)
            VALUES (${pass.user_id}, ${pass.admin_id}, '${escapeSql(pass.status)}', '${escapeSql(pass.date)}', '${escapeSql(pass.comment)}', '${pass.created_at}');
        `;
        const result = await run(sql);
        return (await this.getById(result.lastID))!;
    }

    async update(id: number, updateDto: UpdatePassDto): Promise<Pass | null> {
        let sql = `UPDATE passes SET `;
        const updates = [];
        if (updateDto.status !== undefined) updates.push(`status = '${escapeSql(updateDto.status)}'`);
        if (updateDto.date !== undefined) updates.push(`date = '${escapeSql(updateDto.date)}'`);
        if (updateDto.comment !== undefined) updates.push(`comment = '${escapeSql(updateDto.comment)}'`);
        
        if (updates.length === 0) return await this.getById(id) || null;
        
        sql += updates.join(", ") + ` WHERE id = ${id};`;
        await run(sql);
        return await this.getById(id) || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await run(`DELETE FROM passes WHERE id = ${id};`);
        return result.changes > 0;
    }

    //Ендпойнти
    async getStats(): Promise<any[]> {
        return await all(`SELECT status, COUNT(id) as totalCount FROM passes GROUP BY status;`);
    }

    async getPassesWithUsers(): Promise<any[]> {
        return await all(`
            SELECT p.id, p.status, p.date, p.comment, p.created_at,
                   u.name as userName, u.email as userEmail,
                   a.name as adminName
            FROM passes p
            JOIN users u ON p.user_id = u.id
            JOIN users a ON p.admin_id = a.id
            ORDER BY p.id DESC;
        `);
    }
    // SQL ін'єкція
    async searchVulnerable(q: string): Promise<Pass[]> {
        const sql = `SELECT * FROM passes WHERE comment LIKE '%${q}%' ORDER BY id DESC;`;
        return await all<Pass>(sql);
    }
}

export default new PassesRepository();

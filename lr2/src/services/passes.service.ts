import repository from "../repositories/passes.repository";
import usersRepository from "../repositories/users.repository";
import { CreatePassDto, UpdatePassDto, Pass } from "../dtos/passes.dto";
import ApiError from "../utils/ApiError";

class PassesService {
    async getAllPasses(query: { status?: string; search?: string }): Promise<any[]> {
        return await repository.getAll(query.status, query.search);
    }

    async getPassById(id: string): Promise<Pass> {
        const pass = await repository.getById(Number(id));
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        return pass;
    }

    async createPass(createDto: CreatePassDto): Promise<Pass> {
        let user = await usersRepository.getByEmail(createDto.userEmail);

        if (!user) {
            let mappedRole = "Студент";
            if (createDto.status === "Вчитель") mappedRole = "Вчитель";
            if (createDto.status === "Техперсонал") mappedRole = "Техперсонал";

            user = await usersRepository.add({
                email: createDto.userEmail,
                name: createDto.userName,
                role: mappedRole,
                created_at: new Date().toISOString()
            });
        }

        return await repository.add({
            user_id: user.id,
            admin_id: createDto.adminId,
            status: createDto.status,
            date: createDto.date,
            comment: createDto.comment,
            created_at: new Date().toISOString()
        });
    }

    async updatePass(id: string, updateDto: UpdatePassDto): Promise<Pass> {
        const pass = await repository.update(Number(id), updateDto);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        return pass;
    }

    async deletePass(id: string): Promise<void> {
        const isDeleted = await repository.delete(Number(id));
        if (!isDeleted) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
    }
}

export default new PassesService();

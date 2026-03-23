import repository from "../repositories/users.repository";
import { CreateUserDto, UpdateUserDto, User } from "../dtos/users.dto";
import ApiError from "../utils/ApiError";

class UsersService {
    async getAllUsers(query: { role?: string; search?: string }): Promise<User[]> {
        return await repository.getAll(query.role, query.search);
    }

    async getUserById(id: string): Promise<User> {
        const user = await repository.getById(Number(id));
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        return user;
    }

    async createUser(createDto: CreateUserDto): Promise<User> {
        return await repository.add({
            email: createDto.email,
            name: createDto.name,
            role: createDto.role,
            created_at: new Date().toISOString()
        });
    }
    

    async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
        const user = await repository.update(Number(id), updateDto);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        return user;
    }

    async deleteUser(id: string): Promise<void> {
        const isDeleted = await repository.delete(Number(id));
        if (!isDeleted) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    }
}

export default new UsersService();

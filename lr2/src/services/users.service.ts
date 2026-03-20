import { v4 as uuidv4 } from "uuid";
import repository from "../repositories/users.repository";
import { CreateUserDto, UpdateUserDto, User } from "../dtos/users.dto";
import ApiError from "../utils/ApiError";
 
interface UsersQuery {
    role?: string;
    search?: string;
}
 
class UsersService {
    getAllUsers(query: UsersQuery): User[] {
        let users = repository.getAll();
 
        if (query.role && query.role !== "Всі") {
            users = users.filter((u) => u.role === query.role);
        }
        if (query.search) {
            users = users.filter((u) =>
                u.name.toLowerCase().includes(query.search!.toLowerCase())
            );
        }
 
        return users;
    }
 
    getUserById(id: string): User {
        const user = repository.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        return user;
    }
 
    createUser(createDto: CreateUserDto): User {
        const user: User = {
            id: uuidv4(),
            name: createDto.name.trim(),
            role: createDto.role
        };
        return repository.add(user);
    }
 
    updateUser(id: string, updateDto: UpdateUserDto): User {
        const user = repository.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
 
        const mergedData: User = { ...user, ...updateDto };
        return repository.update(id, mergedData) as User;
    }
 
    deleteUser(id: string): void {
        const user = repository.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        repository.delete(id);
    }
}
 
export default new UsersService();
 
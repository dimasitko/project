const { v4: uuidv4 } = require("uuid");
const repository = require("../repositories/users.repository");
const ApiError = require("../utils/ApiError");

class UsersService {
    getAllUsers(query) {
        let users = repository.getAll();

        // Фільтрація
        if (query.role && query.role !== "Всі") {
            users = users.filter((u) => u.role === query.role);
        }
        if (query.search) {
            users = users.filter((u) =>
                u.name.toLowerCase().includes(query.search.toLowerCase())
            );
        }
        return users;
    }

    getUserById(id) {
        const user = repository.getById(id);

        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        return user;
    }

    createUser(createDto) {
        const user = {
            id: uuidv4(),
            name: createDto.name.trim(),
            role: createDto.role
        };
        return repository.add(user);
    }

    updateUser(id, updateDto) {
        const user = repository.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");

        const mergedData = { ...user, ...updateDto };
        return repository.update(id, mergedData);
    }

    deleteUser(id) {
        const user = repository.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
        repository.delete(id);
    }
}
module.exports = new UsersService();

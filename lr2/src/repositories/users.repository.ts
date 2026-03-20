import { User } from "../dtos/users.dto";

const users: User[] = [];

class UsersRepository {
    getAll(): User[] {
        return users;
    }

    getById(id: string): User | undefined {
        return users.find((u) => u.id === id);
    }

    add(user: User): User {
        users.push(user);
        return user;
    }

    update(id: string, updatedData: User): User | null {
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            return users[index];
        }
        return null;
    }

    delete(id: string): boolean {
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default new UsersRepository();
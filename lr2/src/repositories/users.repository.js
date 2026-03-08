let users = [];

class UsersRepository {
    getAll() {
        return users;
    }
    getById(id) {
        return users.find(p => p.id === id);
    }
    add(pass) {
        users.push(user);
        return user;
    }
    update(id, updatedData) {
        const index = users.findIndex(p => p.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            return users[index];
        }
        return null;
    }
    delete(id) {
        const index = users.findIndex(p => p.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    }
}
module.exports = new UsersRepository();
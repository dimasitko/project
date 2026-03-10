const passes = [];

class PassesRepository {
    getAll() {
        return passes;
    }
    getById(id) {
        return passes.find((p) => p.id === id);
    }
    add(pass) {
        passes.push(pass);
        return pass;
    }
    update(id, updatedData) {
        const index = passes.findIndex((p) => p.id === id);
        if (index !== -1) {
            passes[index] = { ...passes[index], ...updatedData };
            return passes[index];
        }
        return null;
    }
    delete(id) {
        const index = passes.findIndex((p) => p.id === id);
        if (index !== -1) {
            passes.splice(index, 1);
            return true;
        }
        return false;
    }
}
module.exports = new PassesRepository();

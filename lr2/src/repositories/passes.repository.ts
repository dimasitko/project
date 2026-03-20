import { Pass } from "../dtos/passes.dto";

const passes: Pass[] = [];

class PassesRepository {
    getAll(): Pass[] {
        return passes;
    }

    getById(id: string): Pass | undefined {
        return passes.find((p) => p.id === id);
    }

    add(pass: Pass): Pass {
        passes.push(pass);
        return pass;
    }

    update(id: string, updatedData: Pass): Pass | null {
        const index = passes.findIndex((p) => p.id === id);
        if (index !== -1) {
            passes[index] = { ...passes[index], ...updatedData };
            return passes[index];
        }
        return null;
    }

    delete(id: string): boolean {
        const index = passes.findIndex((p) => p.id === id);
        if (index !== -1) {
            passes.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default new PassesRepository();

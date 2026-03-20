import { v4 as uuidv4 } from "uuid";
import repository from "../repositories/passes.repository";
import { CreatePassDto, UpdatePassDto, Pass } from "../dtos/passes.dto";
import ApiError from "../utils/ApiError";

interface PassesQuery {
    status?: string;
    search?: string;
}

class PassesService {
    getAllPasses(query: PassesQuery): Pass[] {
        let passes = repository.getAll();

        if (query.status && query.status !== "Всі") {
            passes = passes.filter((p) => p.status === query.status);
        }
        if (query.search) {
            passes = passes.filter((p) =>
                p.name.toLowerCase().includes(query.search!.toLowerCase())
            );
        }

        return passes;
    }

    getPassById(id: string): Pass {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        return pass;
    }

    createPass(createDto: CreatePassDto): Pass {
        const pass: Pass = {
            id: uuidv4(),
            name: createDto.name.trim(),
            status: createDto.status,
            date: createDto.date,
            admin: createDto.admin.trim(),
            comment: createDto.comment ? createDto.comment.trim() : ""
        };
        return repository.add(pass);
    }

    updatePass(id: string, updateDto: UpdatePassDto): Pass {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");

        const mergedData: Pass = { ...pass, ...updateDto };
        return repository.update(id, mergedData) as Pass;
    }

    patchPass(id: string, patchDto: UpdatePassDto): Pass {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");

        const patchedData: Partial<Pass> = {};
        if (patchDto.name !== undefined) patchedData.name = patchDto.name.trim();
        if (patchDto.status !== undefined) patchedData.status = patchDto.status;
        if (patchDto.date !== undefined) patchedData.date = patchDto.date;
        if (patchDto.admin !== undefined) patchedData.admin = patchDto.admin.trim();
        if (patchDto.comment !== undefined) patchedData.comment = patchDto.comment.trim();

        return repository.update(id, { ...pass, ...patchedData }) as Pass;
    }

    deletePass(id: string): void {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        repository.delete(id);
    }
}

export default new PassesService();
const { v4: uuidv4 } = require("uuid");
const repository = require("../repositories/passes.repository");
const ApiError = require("../utils/ApiError");

class PassesService {
    getAllPasses(query) {
        let passes = repository.getAll();

        // Фільтрація
        if (query.status && query.status !== "Всі") {
            passes = passes.filter((p) => p.status === query.status);
        }
        if (query.search) {
            passes = passes.filter((p) =>
                p.name.toLowerCase().includes(query.search.toLowerCase())
            );
        }
        return passes;
    }

    getPassById(id) {
        const pass = repository.getById(id);

        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        return pass;
    }

    createPass(createDto) {
        const pass = {
            id: uuidv4(),
            name: createDto.name.trim(),
            status: createDto.status,
            date: createDto.date,
            admin: createDto.admin.trim(),
            comment: createDto.comment ? createDto.comment.trim() : ""
        };
        return repository.add(pass);
    }

    updatePass(id, updateDto) {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");

        const mergedData = { ...pass, ...updateDto };
        return repository.update(id, mergedData);
    }

    patchPass(id, patchDto) {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");

        const patchedData = {};
        if (patchDto.name !== undefined) patchedData.name = patchDto.name.trim();
        if (patchDto.status !== undefined) patchedData.status = patchDto.status;
        if (patchDto.date !== undefined) patchedData.date = patchDto.date;
        if (patchDto.admin !== undefined) patchedData.admin = patchDto.admin.trim();
        if (patchDto.comment !== undefined) patchedData.comment = patchDto.comment.trim();

        return repository.update(id, { ...pass, ...patchedData });
    }

    deletePass(id) {
        const pass = repository.getById(id);
        if (!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
        repository.delete(id);
    }
}
module.exports = new PassesService();

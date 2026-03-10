const service = require("../services/passes.service");
const { CreatePassDto, UpdatePassDto, PassResponseDto } = require("../dtos/passes.dto");

class PassesController {
    getAll(req, res, next) {
        try {
            const passes = service.getAllPasses(req.query);
            res.status(200).json({ items: passes, total: passes.length });
        } catch (error) {
            next(error);
        }
    }

    getById(req, res, next) {
        try {
            const pass = service.getPassById(req.params.id);
            res.status(200).json({ pass });
        } catch (error) {
            next(error);
        }
    }

    create(req, res, next) {
        try {
            const dto = new CreatePassDto(req.body).validate();
            const newPass = service.createPass(dto);
            res.status(201).json(new PassResponseDto(newPass));
        } catch (error) {
            next(error);
        }
    }

    update(req, res, next) {
        try {
            const patchDto = new UpdatePassDto(req.body).validate();
            const updatedPass = service.updatePass(req.params.id, patchDto);
            res.status(200).json(new PassResponseDto(updatedPass));
        } catch (error) {
            next(error);
        }
    }

    delete(req, res, next) {
        try {
            service.deletePass(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new PassesController();

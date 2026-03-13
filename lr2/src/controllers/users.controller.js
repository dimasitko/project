const service = require("../services/users.service");
const { UserResponseDto } = require("../dtos/users.dto");

class UsersController {
    getAll(req, res, next) {
        try {
            const users = service.getAllUsers(req.query);
            res.status(200).json({ items: users, total: users.length });
        } catch (error) {
            next(error);
        }
    }

    getById(req, res, next) {
        try {
            const user = service.getUserById(req.params.id);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    create(req, res, next) {
        try {
            const newUser = service.createUser(req.body);
            res.status(201).json(new UserResponseDto(newUser));
        } catch (error) {
            next(error);
        }
    }

    update(req, res, next) {
        try {
            const updatedUser = service.updateUser(req.params.id, req.body);
            res.status(200).json(new UserResponseDto(updatedUser));
        } catch (error) {
            next(error);
        }
    }

    delete(req, res, next) {
        try {
            service.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new UsersController();

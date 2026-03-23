import { Request, Response, NextFunction } from "express";
import service from "../services/users.service";
import { UpdateUserDto, CreateUserDto } from "../dtos/users.dto";

class UsersController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await service.getAllUsers(req.query);
            res.status(200).json({ items: users, total: users.length });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await service.getUserById(String(req.params.id));
            res.status(200).json({ data: user });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = new CreateUserDto(req.body).validate();
            const newUser = await service.createUser(dto);
            res.status(201).json({ data: newUser });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = new UpdateUserDto(req.body).validate();
            const updatedUser = await service.updateUser(String(req.params.id), dto);
            res.status(200).json({ data: updatedUser });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await service.deleteUser(String(req.params.id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new UsersController();

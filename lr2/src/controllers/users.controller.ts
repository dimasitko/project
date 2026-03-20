import { Request, Response, NextFunction } from "express";
import service from "../services/users.service";
import { UpdateUserDto, UserResponseDto } from "../dtos/users.dto";

class UsersController {
    getAll(req: Request, res: Response, next: NextFunction): void {
        try {
            const users = service.getAllUsers(req.query as { role?: string; search?: string });
            res.status(200).json({ items: users, total: users.length });
        } catch (error) {
            next(error);
        }
    }

    getById(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            const user = service.getUserById(req.params.id);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    create(req: Request, res: Response, next: NextFunction): void {
        try {
            const newUser = service.createUser(req.body);
            res.status(201).json(new UserResponseDto(newUser));
        } catch (error) {
            next(error);
        }
    }

    update(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            const updatedUser = service.updateUser(req.params.id, req.body as UpdateUserDto);
            res.status(200).json(new UserResponseDto(updatedUser));
        } catch (error) {
            next(error);
        }
    }

    delete(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
        try {
            service.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new UsersController();

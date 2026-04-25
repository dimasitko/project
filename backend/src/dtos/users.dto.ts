import ApiError from "../utils/ApiError";

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

const VALID_ROLES = ["Вчитель", "Студент", "Адміністратор", "Техперсонал"] as const;

export class CreateUserDto {
    email: string;
    name: string;
    role: string;

    constructor(data: Record<string, unknown>) {
        this.email = data.email as string;
        this.name = data.name as string;
        this.role = data.role as string;
    }

    validate(): this {
        const errors = [];

        if (!this.email || !this.email.includes("@"))
            errors.push({ field: "email", message: "Введіть коректний email" });

        if (!this.name || this.name.trim().length === 0)
            errors.push({ field: "name", message: "Ім'я обов'язкове" });
        if (this.name && this.name.length > 20)
            errors.push({ field: "name", message: "Максимум 20 символів" });

        if (!VALID_ROLES.includes(this.role as (typeof VALID_ROLES)[number]))
            errors.push({ field: "role", message: "Некоректна роль" });

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }

        return this;
    }
}

export class UpdateUserDto {
    name?: string;
    role?: string;

    constructor(data: Record<string, unknown>) {
        if (data.name !== undefined) this.name = data.name as string;
        if (data.role !== undefined) this.role = data.role as string;
    }

    validate(): this {
        const errors = [];

        if (this.name !== undefined) {
            if (this.name.trim().length === 0)
                errors.push({ field: "name", message: "Ім'я обов'язкове" });
            if (this.name.length > 20)
                errors.push({ field: "name", message: "Максимум 20 символів" });
        }
        if (this.role !== undefined) {
            if (!VALID_ROLES.includes(this.role as (typeof VALID_ROLES)[number]))
                errors.push({ field: "role", message: "Некоректна роль" });
        }

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }

        return this;
    }
}

export class UserResponseDto {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: string;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }
}

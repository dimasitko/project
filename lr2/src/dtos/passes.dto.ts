import ApiError from "../utils/ApiError";
 
export interface Pass {
    id: string;
    name: string;
    status: string;
    date: string;
    admin: string;
    comment: string;
}
 
const VALID_STATUSES = ["Вчитель", "Студент", "Інше"] as const;
 
export class CreatePassDto {
    name: string;
    status: string;
    date: string;
    admin: string;
    comment?: string;
 
    constructor(data: Record<string, unknown>) {
        this.name = data.name as string;
        this.status = data.status as string;
        this.date = data.date as string;
        this.admin = data.admin as string;
        this.comment = data.comment as string | undefined;
    }
 
    validate(): this {
        const errors = [];
 
        if (!this.name || this.name.trim().length === 0)
            errors.push({ field: "name", message: "Ім'я обов'язкове" });
        if (this.name && this.name.length > 20)
            errors.push({ field: "name", message: "Максимум 20 символів" });
 
        if (!VALID_STATUSES.includes(this.status as (typeof VALID_STATUSES)[number]))
            errors.push({ field: "status", message: "Некоректна причина" });
 
        if (!this.date) errors.push({ field: "date", message: "Оберіть дату" });
 
        if (!this.admin || this.admin.trim().length === 0)
            errors.push({ field: "admin", message: "Ім'я адміністратора обов'язкове" });
        if (this.admin && this.admin.length > 20)
            errors.push({ field: "admin", message: "Максимум 20 символів" });
 
        if (this.comment && this.comment.length > 35)
            errors.push({ field: "comment", message: "Максимум 35 символів" });
 
        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }
 
        return this;
    }
}
 
export class UpdatePassDto {
    name?: string;
    status?: string;
    date?: string;
    admin?: string;
    comment?: string;
 
    constructor(data: Record<string, unknown>) {
        if (data.name !== undefined) this.name = data.name as string;
        if (data.status !== undefined) this.status = data.status as string;
        if (data.date !== undefined) this.date = data.date as string;
        if (data.admin !== undefined) this.admin = data.admin as string;
        if (data.comment !== undefined) this.comment = data.comment as string;
    }
 
    validate(): this {
        const errors = [];
 
        if (this.name !== undefined) {
            if (this.name.trim().length === 0)
                errors.push({ field: "name", message: "Ім'я обов'язкове" });
            if (this.name.length > 20)
                errors.push({ field: "name", message: "Максимум 20 символів" });
        }
        if (this.status !== undefined) {
            if (!VALID_STATUSES.includes(this.status as (typeof VALID_STATUSES)[number]))
                errors.push({ field: "status", message: "Некоректна причина" });
        }
        if (this.date !== undefined) {
            if (!this.date) errors.push({ field: "date", message: "Оберіть дату" });
        }
        if (this.admin !== undefined) {
            if (this.admin.trim().length === 0)
                errors.push({ field: "admin", message: "Ім'я адміністратора обов'язкове" });
            if (this.admin.length > 20)
                errors.push({ field: "admin", message: "Максимум 20 символів" });
        }
        if (this.comment !== undefined) {
            if (this.comment.length > 35)
                errors.push({ field: "comment", message: "Максимум 35 символів" });
        }
 
        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }
 
        return this;
    }
}
 
export class PassResponseDto {
    id: string;
    name: string;
    status: string;
    date: string;
    admin: string;
    comment: string;
 
    constructor(pass: Pass) {
        this.id = pass.id;
        this.name = pass.name;
        this.status = pass.status;
        this.date = pass.date;
        this.admin = pass.admin;
        this.comment = pass.comment;
    }
}
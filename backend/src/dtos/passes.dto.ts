import ApiError from "../utils/ApiError";

export interface Pass {
    id: number;
    user_id: number;
    admin_id: number;
    name: string;
    status: string;
    date: string;
    comment: string;
    createdAt: string;
}

const VALID_STATUSES = ["Вчитель", "Студент", "Техперсонал"] as const;

export class CreatePassDto {
    userName: string;
    userEmail: string;
    adminId: number;
    status: string;
    date: string;
    comment?: string;

    constructor(data: Record<string, unknown>) {
        this.userName = data.userName as string;
        this.userEmail = data.userEmail as string;
        this.adminId = Number(data.adminId);
        this.status = data.status as string;
        this.date = data.date as string;
        this.comment = data.comment as string | undefined;
    }

    validate(): this {
        const errors = [];

        if (!this.userName || this.userName.trim().length === 0)
            errors.push({ field: "name", message: "Ім'я обов'язкове" });
        if (this.userName && this.userName.length < 3)
            errors.push({ field: "name", message: "Мінімум 3 символи" });
        if (this.userName && this.userName.length > 40)
            errors.push({ field: "name", message: "Максимум 40 символів" });

        if (!this.userEmail || !this.userEmail.includes("@"))
            errors.push({ field: "userEmail", message: "Введіть коректний email" });
        if (this.userEmail && this.userEmail.length < 8)
            errors.push({ field: "userEmail", message: "Мінімум 8 символів" });
        if (this.userEmail && this.userEmail.length > 50)
            errors.push({ field: "userEmail", message: "Максимум 50 символів" });

        if (!VALID_STATUSES.includes(this.status as (typeof VALID_STATUSES)[number]))
            errors.push({ field: "status", message: "Некоректна причина" });

        if (!this.date) {
            errors.push({ field: "date", message: "Оберіть дату" });
            } else {
            const today = new Date().toISOString().split('T')[0];
            if (this.date < today) {
                errors.push({ field: "date", message: "Дата не може бути в минулому" });
                }
            }
           
        if (!this.adminId || isNaN(this.adminId))
            errors.push({ field: "adminId", message: "Оберіть адміністратора зі списку" });

        if (this.comment && this.comment.length > 35)
            errors.push({ field: "comment", message: "Максимум 35 символів" });

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }

        return this;
    }
}

export class UpdatePassDto {
    status?: string;
    date?: string;
    comment?: string;

    constructor(data: Record<string, unknown>) {
        if (data.status !== undefined) this.status = data.status as string;
        if (data.date !== undefined) this.date = data.date as string;
        if (data.comment !== undefined) this.comment = data.comment as string;
    }

    validate(): this {
        const errors = [];

        if (this.status !== undefined) {
            if (!VALID_STATUSES.includes(this.status as (typeof VALID_STATUSES)[number]))
                errors.push({ field: "status", message: "Некоректна причина" });
        }
        if (this.date !== undefined) {
        if (!this.date) {
            errors.push({ field: "date", message: "Оберіть дату" });
            } else {
            const today = new Date().toISOString().split('T')[0];
            if (this.date < today) {
                errors.push({ field: "date", message: "Дата не може бути в минулому" });
                }
            }
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
    id: number;
    user_id: number;
    admin_id: number;
    status: string;
    date: string;
    comment: string;
    createdAt: string;

    constructor(pass: Pass) {
        this.id = pass.id;
        this.user_id = pass.user_id;
        this.admin_id = pass.admin_id;
        this.status = pass.status;
        this.date = pass.date;
        this.comment = pass.comment;
        this.createdAt = pass.createdAt;
    }
}

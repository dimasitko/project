import ApiError from "../utils/ApiError";

export interface Log {
    id: number;
    action: string;
    created_at: string;
}

export class CreateLogDto {
    action: string;

    constructor(data: Record<string, unknown>) {
        this.action = data.action as string;
    }

    validate(): this {
        const errors = [];

        if (!this.action || this.action.trim().length === 0) {
            errors.push({ field: "action", message: "Дія є обов'язковою" });
        }

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }

        return this;
    }
}

export class LogResponseDto {
    id: number;
    action: string;
    created_at: string;

    constructor(log: Log) {
        this.id = log.id;
        this.action = log.action;
        this.created_at = log.created_at;
    }
}

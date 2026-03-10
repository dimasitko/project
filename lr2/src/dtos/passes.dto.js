const ApiError = require("../utils/ApiError");

class CreatePassDto {
    constructor(data) {
        this.name = data.name;
        this.status = data.status;
        this.date = data.date;
        this.admin = data.admin;
        this.comment = data.comment;
    }
    validate() {
        const errors = [];
        if (!this.name || this.name.trim().length === 0)
            errors.push({ field: "name", message: "Ім'я обов'язкове" });
        if (this.name && this.name.length > 20)
            errors.push({ field: "name", message: "Максимум 20 символів" });

        const validStatuses = ["Вчитель", "Студент", "Інше"];
        if (!validStatuses.includes(this.status))
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

class UpdatePassDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.status !== undefined) this.status = data.status;
        if (data.date !== undefined) this.date = data.date;
        if (data.admin !== undefined) this.admin = data.admin;
        if (data.comment !== undefined) this.comment = data.comment;
    }
    validate() {
        const errors = [];

        if (this.name !== undefined) {
            if (this.name.trim().length === 0)
                errors.push({ field: "name", message: "Ім'я обов'язкове" });
            if (this.name.length > 20)
                errors.push({ field: "name", message: "Максимум 20 символів" });
        }
        if (this.status !== undefined) {
            const validStatuses = ["Вчитель", "Студент", "Інше"];
            if (!validStatuses.includes(this.status))
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
class PassResponseDto {
    constructor(pass) {
        this.id = pass.id;
        this.name = pass.name;
        this.status = pass.status;
        this.date = pass.date;
        this.admin = pass.admin;
        this.comment = pass.comment;
    }
}

module.exports = {
    CreatePassDto,
    UpdatePassDto,
    PassResponseDto
};

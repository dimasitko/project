const ApiError = require("../utils/ApiError");

class CreateLogDto {
    constructor(data) {
        this.action = data.action;
    }
    validate() {
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

class LogResponseDto {
    constructor(log) {
        this.id = log.id;
        this.action = log.action;
        this.time = log.time;   
    }
}

module.exports = {
    CreateLogDto,
    LogResponseDto
};
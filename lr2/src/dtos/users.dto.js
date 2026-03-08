const ApiError = require('../utils/ApiError')

class CreateUserDto {
    constructor(data) {
        this.name = data.name;
        this.role = data.role;
    }
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim().length === 0) errors.push({ field: 'name', message: "Ім'я обов'язкове" });
        if (this.name && this.name.length > 20) errors.push({ field: 'name', message: "Максимум 20 символів" });
        
        const validRoles = ['Вчитель', 'Студент', 'Адміністратор'];
        if (!validRoles.includes(this.role)) errors.push({ field: 'role', message: "Некоректна роль" });

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }
        
        return this;
    }
}
class UpdateUserDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.role !== undefined) this.role = data.role;
    }
    
    validate() {
       const errors = [];
       
        if (this.name !== undefined) {
            if (this.name.trim().length === 0) errors.push({ field: 'name', message: "Ім'я обов'язкове" });
            if (this.name.length > 20) errors.push({ field: 'name', message: "Максимум 20 символів" });
        }        
        if (this.role !== undefined) {
            const validRoles = ['Вчитель', 'Студент', 'Адміністратор'];
            if (!validRoles.includes(this.role)) errors.push({ field: 'role', message: "Некоректна роль" });
        }  

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
        }        
        return this;
    }
}

class UserResponseDto {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.role = user.role;
    }
}

module.exports = {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto
};
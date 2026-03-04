const {v4 : uuidv4} = require('uuid');
const repository = require ('../repositories/incidents.repository');
const ApiError = require ('../utils/ApiError')

class PassesService{

validateDto(dto){
    const errors = [];

    if (!dto.name || dto.name.trim().length === 0) errors.push({ field: 'name', message: "Ім'я обов'язкове" });
    if (dto.name && dto.name.length > 20) errors.push({ field: 'name', message: "Максимум 20 символів" });
        
    const validStatuses = ['Вчитель', 'Студент', 'Інше'];
    if (!validStatuses.includes(dto.status)) errors.push({ field: 'status', message: "Некоректна причина" });
        
    if (!dto.date) errors.push({ field: 'date', message: "Оберіть дату" });
    
    if (!dto.admin || dto.admin.trim().length === 0) errors.push({ field: 'admin', message: "Ім'я адміністратора обов'язкове" });
    if (dto.admin && dto.admin.length > 20) errors.push({ field: 'admin', message: "Максимум 20 символів" });
    
    if (dto.comment && dto.comment.length > 35) errors.push({ field: 'comment', message: "Максимум 35 символів" });

    if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Помилка валідації даних", errors);
    }
}


getAllPasses(query) {
  let passes = repository.getAll();

  // Фільтрація
   if (query.status && query.status !== 'Всі') {
            passes = passes.filter(p => p.status === query.status);
        if (query.search) {
            passes = passes.filter(p => p.name.toLowerCase().includes(query.search.toLowerCase()));
        }
        return passes;
    }
}

getPassById(id){
    const pass = repository.getById();

    if(!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
    return pass;
}

createPass(dto){
    this.validateDto(dto);
    const pass = {
        id: uuidv4(),
        name: dto.name.trim(),
        status: dto.status,
        date: dto.date,
        admin: dto.admin.trim(),
        comment: dto.comment ? dto.comment.trim(): ""
    };
    return repository.add(pass);
}

updatePass(id, patch){
    this.validateDto(dto);
    const pass = repository.getById(id);

    if(!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
    return repository.update(id, dto);
}

deletePass(id){
    const pass = repository.getById(id);
    if(!pass) throw new ApiError(404, "NOT_FOUND", "Пропуск не знайдено");
    repository.delete(id);
}
}
module.exports = new PassesService();
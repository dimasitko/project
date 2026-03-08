const {v4 : uuidv4} = require('uuid');
const repository = require ('../repositories/users.repository');
const ApiError = require ('../utils/ApiError');

class UsersService{

getAllUsers(query) {
  let passes = repository.getAll();
}

getUserById(id){
    const user = repository.getById(id);

    if(!pass) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return pass;
}

createUser(createDto){
    const user = {
        id: uuidv4(),
        name:createDto.name.trim(),
        role:createDto.role
    };
    return repository.add(pass);
}

updateUser(id, updateDto){
    const user = repository.getById(id);
    if(!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");

    const mergedData = { ...user, ...updateDto };
    return repository.update(id, mergedData);
}

deleteUser(id){
    const user = repository.getById(id);
    if(!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    repository.delete(id);
}
}
module.exports = new UsersService();
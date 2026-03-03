const {v4 : uuidv4} = require('uuid')

const passes = [];


export function list() {
  return passes;
}

export function getById(id) {
     return passes.find((x) => x.id === id) ?? null;
}

export function create(name){
    const pass = {
        id: uuidv4(),
        name,
        status,
        date,
        admin
};
passes.push(pass);
return pass;
}

export function update(id, patch){
   const pass = passes.find((x) => x.id === id);
   if(!pass) return null;
   // не закінчив

}

export function remove(id){
    const index = passes.findIndex(p => p.id === id);
    if (index < 0) return false;
    items.splice(idx, 1);
    return true;
}

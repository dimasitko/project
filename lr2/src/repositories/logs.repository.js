const logs = [];

class LogsRepository {
    getAll() {
        return [...logs].sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    
    add(log) {
        logs.push(log);
        return log;
    }
}
module.exports = new LogsRepository();
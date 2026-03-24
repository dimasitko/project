CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL CHECK(length(name) >= 2),,
    role VARCHAR NOT NULL CHECK(role IN ('Вчитель', 'Студент', 'Адміністратор', 'Техперсонал')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
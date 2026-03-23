CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK(role IN ('Вчитель', 'Студент', 'Адміністратор')),
    created_at VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL CHECK(status IN ('Вчитель', 'Студент', 'Інше')),
    date VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    status VARCHAR NOT NULL CHECK(status IN ('Вчитель', 'Студент', 'Техперсонал')),
    date VARCHAR NOT NULL CHECK(length(date) >= 10)
    comment VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
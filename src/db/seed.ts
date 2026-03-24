import { run, all } from "./dbClient";

export async function seed() {
    const userCheck = await all("SELECT id FROM users LIMIT 1");
    if (userCheck.length > 0) return;

    console.log("🌱 Початок генерації даних");

    await run(`INSERT INTO users (email, name, role) VALUES ('admin@gmail.com', 'Сабур Адмін', 'Адміністратор');`);
    await run(`INSERT INTO users (email, name, role) VALUES ('security@gmail.com', 'Охоронець Вадим', 'Адміністратор');`);

    const teachers = [
        ['bondar@gmail.com', 'Бондар Олег'], ['shevchenko@gmail.com', 'Шевченко Олена'],
        ['tkach@gmail.com', 'Ткач Ігор'], ['moroz@gmail.com', 'Мороз Вікторія'],
        ['kravetz@gmail.com', 'Кравець Андрій']
    ];
    for (const [email, name] of teachers) {
        await run(`INSERT INTO users (email, name, role) VALUES ('${email}', '${name}', 'Вчитель');`);
    }

    for (let i = 1; i <= 15; i++) {
        await run(`INSERT INTO users (email, name, role) VALUES ('student${i}@gmail.com', 'Студент №${i}', 'Студент');`);
    }

    for (let i = 1; i <= 20; i++) {
        const userId = (i % 20) + 3; 
        const status = i % 5 === 0 ? 'Вчитель' : 'Студент';
        await run(`
            INSERT INTO passes (user_id, admin_id, status, date, comment) 
            VALUES (${userId}, 1, '${status}', '2026-05-${10 + (i % 15)}', 'Запис №${i}');
        `);
    }

    console.log("Базу наповнено користувачами");
}
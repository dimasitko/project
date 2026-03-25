import { run, all } from "./dbClient";

export async function seed() {
    const userCheck = await all("SELECT id FROM users LIMIT 1");
    if (userCheck.length > 0) return;

    console.log("Початок генерації даних");

    await run(`INSERT INTO users (email, name, role) VALUES ('admin@gmail.com', 'Дмитро Кулик', 'Адміністратор');`);
    await run(`INSERT INTO users (email, name, role) VALUES ('lopatko.v@gmail.com', 'Вадим Лопатко', 'Адміністратор');`);

    const teachers = [
        ['bondar@gmail.com', 'Бондар Олег'], ['shevchenko@gmail.com', 'Шевченко Олена'],
        ['tkach@gmail.com', 'Ткач Ігор'], ['moroz@gmail.com', 'Мороз Вікторія'],
        ['kravetz@gmail.com', 'Кравець Андрій']
    ];
    for (const [email, name] of teachers) {
        await run(`INSERT INTO users (email, name, role) VALUES ('${email}', '${name}', 'Вчитель');`);
    }

    const students = [
        ['kovalenko@gmail.com', 'Коваленко Марія'], ['boyko@gmail.com', 'Бойко Денис'],
        ['zayets@gmail.com', 'Заєць Анна'], ['melnyk@gmail.com', 'Мельник Тарас'],
        ['shevchuk@gmail.com', 'Шевчук Іван'], ['lysenko@gmail.com', 'Лисенко Юлія'],
        ['hryhorenko@gmail.com', 'Григоренко Максим'], ['savchenko@gmail.com', 'Савченко Олена'],
        ['pavlyuk@gmail.com', 'Павлюк Сергій'], ['danylyuk@gmail.com', 'Данилюк Катерина'],
        ['romanyuk@gmail.com', 'Романюк Дмитро'], ['tkachenko@gmail.com', 'Ткаченко Віталій'],
        ['havrylyuk@gmail.com', 'Гаврилюк Софія'], ['klymenko@gmail.com', 'Клименко Артем'],
        ['polishchuk@gmail.com', 'Поліщук Дарина']
    ];
    for (const [email, name] of students) {
        await run(`INSERT INTO users (email, name, role) VALUES ('${email}', '${name}', 'Студент');`);
    }

    for (let i = 1; i <= 20; i++) {
        const userId = (i % 20) + 3;
        const status = i % 5 === 0 ? 'Вчитель' : 'Студент';
        await run(`INSERT INTO passes (user_id, admin_id, status, date, commemt) VALUES (${userId}, 1, '${status}', '2026-05-${10 + (i % 15)}', '-');`);
    }

    console.log("Базу наповнено користувачами");
}
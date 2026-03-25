# LR 3


## Підготовка та запуск

1.  **Встановлення залежностей**:
    ```bash
    npm install
    ```
2.  **Запуск проєкту**:
    ```bash
    npm run dev
    ```
3.  **База даних**:
    Файл бази даних автоматично створюється при першому запуску за шляхом:  
    `src/data/app.db`

## Пару curl запитів

  Перегляд всіх users:
  ```bash
  curl -i http://localhost:3000/api/users
  ```

  Створити нового користувача:
  ```bash
  curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Микола Гоголь", "email": "gogol@ukr.net", "role": "Вчитель"}'
  ```

  Пошук користувачів за частиною імені:
  ```bash
  curl "http://localhost:3000/api/users?search=Пет"
  ```

## Схема бази даних

Проєкт використовує реляційну структуру з трьома основними таблицями та суворими обмеженнями цілісності.

### 1. Перелік таблиць та атрибутів

| Таблиця | Поле | Тип | Обмеження | Опис |
| :--- | :--- | :--- | :--- | :--- |
| **users** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Унікальний ID користувача |
| | `email` | TEXT | **UNIQUE**, **NOT NULL** | Унікальна пошта |
| | `name` | TEXT | **NOT NULL**, **CHECK**(length >= 2) | ПІБ (мін. 2 символи) |
| | `role` | TEXT | **NOT NULL**, **CHECK**(role IN (...)) | Студент/Вчитель/Адмін |
| | `created_at` | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Час створення запису |
| **passes** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Номер перепустки |
| | `user_id` | INTEGER | **FOREIGN KEY**, **NOT NULL** | Власник (зв'язок 1:N) |
| | `admin_id` | INTEGER | **FOREIGN KEY**, **NOT NULL** | Хто видав перепустку |
| | `status` | TEXT | **NOT NULL**, **CHECK**(status IN (...)) | Тип (Студент/Вчитель/Тех) |
| | `date` | TEXT | **NOT NULL**, **CHECK**(length >= 10) | Дата (YYYY-MM-DD) |
| | `comment` | TEXT | DEFAULT '' | Довільний коментар |
| | `created_at` | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Час створення запису |
| **logs** | `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID запису в журналі |
| | `action` | TEXT | **NOT NULL** | Опис події |
| | `created_at` | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Час створення запису |

### 2. Зв'язки між таблицями
* **Users ↔ Passes (1:N)**: Користувач може мати декілька записів у журналі перепусток. Зв'язок реалізований через `user_id` (Foreign Key), що посилається на `users(id)`.

## Індекси

У проєкті реалізовано систему індексів для прискорення типових операцій пошуку та сортування:

* **`idx_passes_status_date`**: Оптимізує складні запити, де є одночасна фільтрація за статусом та сортування за датою.
* **`idx_users_name`**: Прискорює текстовий пошук користувачів за ім'ям (особливо важливо для великої кількості записів).
* **`idx_logs_timestamp`**: Забезпечує миттєву видачу останніх логів без повного перебору таблиці.

**Навіщо це потрібно:** Індекси дозволяють базі даних знаходити потрібні рядки за логарифмічний час замість лінійного. Це значно знижує навантаження на диск та прискорює відповідь API.


## Ендпоінти та приклади запитів

### 1. Пошук перепусток (WHERE + ORDER BY + LIMIT)
Ендпоінт підтримує складні комбінації параметрів для точної вибірки:
`GET /api/passes?status=Студент&sort=date&order=desc&limit=5`

**Приклад:**
```bash
curl "http://localhost:3000/api/passes?status=Студент&sort=date&order=desc"
```

### 2. Дані через JOIN
Ендпоінт повертає перепустки разом із повними іменами власників, об'єднуючи таблиці passes та users:
`GET /api/passes/with-users`

**Приклад:**
```bash
curl "http://localhost:3000/api/passes/with-users"
```

### 3. Агрегація даних (COUNT + GROUP BY)
Ендпоінт повертає статистику кількості перепусток за кожним статусом:
`GET /api/passes/stats`

**Приклад:**
```bash
curl "http://localhost:3000/api/passes/stats"
```

## SQL Injection

Для демонстрації загрози безпеці реалізовано вразливий ендпоінт:
`POST /api/passes/vulnerable`

### Чому це небезпечно?
Код використовує рядкову конкатенацію для формування SQL-запиту:
`sql += " WHERE status = '" + req.body.status + "'"`

Якщо зловмисник введе в поле `status` значення: `' OR '1'='1`, підсумковий запит виглядатиме так:
`SELECT * FROM passes WHERE status = '' OR '1'='1'`.
Це зламає логіку фільтрації та виведе всі дані з таблиці. В інших частинах проєкту використовуються параметризовані запити, які автоматично екранують ввід користувача.
# LR 4


## Підготовка та запуск

1.  **Встановлення залежностей**:
    ```bash
    npm install
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    ```
    ```bash
    npm run dev
    ```
    Фронтенд запуститься на порту 
    `http://localhost:5173`


3.  **Backend**:
    ```bash
    cd backend
    ```
    ```bash
    npm run dev
    ```
    Бекенд запуститься на порту 
    `http://localhost:3000`



## Пару curl запитів

  Перегляд всіх users:
  ```bash
  curl -i http://localhost:3000/api/v1/users
  ```

  Створити нового користувача:
  ```bash
  curl -X POST http://localhost:3000/api/v1/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Микола Гоголь", "email": "gogol@ukr.net", "role": "Вчитель"}'
  ```

  Пошук користувачів за частиною імені:
  ```bash
  curl "http://localhost:3000/api/v1/users?search=Пет"
  ```

## Відтворювані сценарії для перевірки

### 1. Перевірка GET-запитів(200 OK)
Отримати список усіх користувачів:
```bash
curl -i http://localhost:3000/api/v1/users
```

### 2. Перевірка POST-запиту (201 Created)
Створити нового користувача:
```bash
curl -X POST http://localhost:3000/api/v1/users \
   -H "Content-Type: application/json" \
   -d '{"name": "Микола Гоголь", "email": "gogol@ukr.net", "role": "Вчитель"}'
```

### 3. Перевірка обробки помилок(400 Bad Request)
Спробуємо створити користувача з некоректним email та занадто коротким ім'ям:
``` bash
curl -i -X POST http://localhost:3000/api/v1/users \
   -H "Content-Type: application/json" \
   -d '{"name": "Я", "email": "bad-email", "role": "Студент"}'
```

### 4. Перевірка CORS (500 Internal Server Error)
Бекенд налаштовано так, щоб дозволяти запити лише з http://localhost:5173. Спробуємо відправити запит з іншого Origin:
```bash
curl -i -X GET http://localhost:3000/api/v1/users \
   -H "Origin: [http://evil-hacker.com](http://evil-hacker.com)"
```

### 4. Розширена перевірка CORS(204 No Content)
**Дозволений Origin**
Браузер перед POST/PUT запитами часто робить OPTIONS-запит (preflight), щоб перевірити дозволи. Зімітуємо його:
```bash
curl -i -X OPTIONS http://localhost:3000/api/v1/users \
   -H "Origin: http://localhost:5173" \
   -H "Access-Control-Request-Method: POST"
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

### 1. Пошук перепусток
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

### 3. Агрегація даних
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
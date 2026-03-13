# LR2 — REST API без БД

## Запуск

```bash
cd lr2
npm install
npm run dev
```

Сервер запускається на: http://localhost:3000


## Сутності

- ``Users`` - користувачі системи
- ``Passes`` - пропуски
- ``Logs`` - журнал дій


## Перевірка сервера

```bash
curl -i http://localhost:3000/health
```


## Users `/api/users`

### Отримати всіх користувачів
```bash
curl -i http://localhost:3000/api/users
```

### Отримати користувача за ID
```bash
curl -i http://localhost:3000/api/users/<id>
```

### Створити користувача
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Іван Петренко\", \"role\": \"Студент\"}"
```

### Оновити користувача (PUT)
```bash
curl -i -X PUT http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Олена Коваль\", \"role\": \"Вчитель\"}"
```

### Часткове оновлення (PATCH)
```bash
curl -i -X PATCH http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" \
  -d "{\"role\": \"Адміністратор\"}"
```

### Видалити користувача
```bash
curl -i -X DELETE http://localhost:3000/api/users/<id>
```

### Помилка валідації (400)
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"\"}"
```

### Не знайдено (404)
```bash
curl -i http://localhost:3000/api/users/non-existing-id
```

---

## Passes `/api/passes`

### Створити пропуск
```bash
curl -i -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Іван Петренко\", \"status\": \"Студент\", \"date\": \"2026-03-11\", \"admin\": \"Адмін\", \"comment\": \"Без коментаря\"}"
```

### Отримати всі пропуски
```bash
curl -i http://localhost:3000/api/passes
```

### Фільтрація за статусом
```bash
curl -i -G "http://localhost:3000/api/passes" --data-urlencode "status=Студент"
```

### Пошук за ім'ям
```bash
curl -i -G "http://localhost:3000/api/passes" --data-urlencode "search=Іван"
```

### Отримати пропуск за ID
```bash
curl -i http://localhost:3000/api/passes/<id>
```

### Оновити пропуск (PUT)
```bash
curl -i -X PUT http://localhost:3000/api/passes/<id> \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Іван Петренко\", \"status\": \"Вчитель\", \"date\": \"2026-03-12\", \"admin\": \"Адмін\", \"comment\": \"\"}"
```

### Часткове оновлення (PATCH)
```bash
curl -i -X PATCH http://localhost:3000/api/passes/<id> \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"Інше\"}"
```

### Видалити пропуск
```bash
curl -i -X DELETE http://localhost:3000/api/passes/<id>
```

### Помилка валідації (400)
```bash
curl -i -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Іван\", \"status\": \"Невідомий\"}"
```


## Logs `/api/logs`

### Отримати всі логи
```bash
curl -i http://localhost:3000/api/logs
```

### Створити лог
```bash
curl -i -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d "{\"action\": \"Створено пропуск для Івана Петренка\"}"
```

### Помилка валідації (400)
```bash
curl -i -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d "{\"action\": \"\"}"
```


## Допустимі значення

| Поле | Допустимі значення |
|---|---|
| `user.role` | `Вчитель`, `Студент`, `Адміністратор` |
| `pass.status` | `Вчитель`, `Студент`, `Інше` |

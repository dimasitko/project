const express = require("express");
const errorHandler = require('./middleware/error-handler.middleware');
const passesRoutes = require('./routes/passes.routes');
const usersRoutes = require('./routes/users.routes');
const loggerMiddleware = require("./middleware/request-logging.middleware");

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(loggerMiddleware);
app.use(express.static('public'));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.get("/api/boom", () => {
  throw new Error("Boom (demo)");
});

app.use("/api/passes", passesRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Маршрут не знайдено" } });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API started on: http://localhost:${PORT}`);
});

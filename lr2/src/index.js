const express = require("express");
const errorHandler = require('./middleware/error-handler.middleware');
const passesRoutes = require('./routes/passes.routes');

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(express.static('public'));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.use("/api/passes", passesRoutes);
app.use((req, res, next) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Маршрут не знайдено" } });
});

app.get("/api/boom", (req, res) => {
  throw new Error("Boom (demo)");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API started on: http://localhost:${PORT}`);
});

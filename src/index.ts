import express from "express";
import errorHandler from "./middleware/error-handler.middleware";
import loggerMiddleware from "./middleware/request-logging.middleware";
import passesRoutes from "./routes/passes.routes";
import usersRoutes from "./routes/users.routes";
import logsRoutes from "./routes/logs.routes";
import { migrate } from "./db/migrate";
import { seed } from "./db/seed";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(loggerMiddleware);
app.use(express.static("public"));

async function bootstrap() {
    await migrate();
    await seed();

    app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
    app.get("/api/boom", () => {
        throw new Error("Boom (demo)");
    });

    app.use("/api/passes", passesRoutes);
    app.use("/api/users", usersRoutes);
    app.use("/api/logs", logsRoutes);
    app.use((_req, res) => {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Маршрут не знайдено" } });
    });

    app.use(errorHandler);

    app.listen(PORT, () => console.log(`API started on: http://localhost:${PORT}`));
}

bootstrap().catch(console.error);

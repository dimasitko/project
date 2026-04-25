import express from "express";
import cors from "cors";
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

const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"), false);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

async function bootstrap() {
    await migrate();
    await seed();

    app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
    app.get("/api/v1/boom", () => {
        throw new Error("Boom (demo)");
    });

    app.use("/api/v1/passes", passesRoutes);
    app.use("/api/v1/users", usersRoutes);
    app.use("/api/v1/logs", logsRoutes);
    app.use((_req, res) => {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Маршрут не знайдено" } });
    });

    app.use(errorHandler);

    app.listen(PORT, () => console.log(`API started on: http://localhost:${PORT}`));
}

bootstrap().catch(console.error);

import express from "express";
import logger from "./config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    morgan("combined", {
        stream: {
            writableObjectMode: true,
            write: message => logger.info(message.trim()),
        },
    })
);

app.get("/", (req, res) => {
    logger.info("Logs from Exitbase");
    res.status(200).send("Exitbase");
});

// health
app.get("/health", (req, res) => {
    res.status(200).send({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// api routes
app.get("/api", (req, res) => {
    res.status(200).send({
        status: "OK",
        message: "Exitbase API is running.",
    });
});

app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error("Unhandled error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.name || "Internal Server Error",
        message: err.message || "An unexpected error occurred.",
    });
});

export default app;

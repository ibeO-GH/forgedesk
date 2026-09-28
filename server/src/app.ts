import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: clientUrls,
  }),
);

app.use(express.json());

app.use(helmet());

app.use("/api/tasks", taskRoutes);

app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ message: "ForgeDesk API is running" });
});

app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    message: "ForgeDesk API is running",
  });
});

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONOGODB_URI is not defined");
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: "forgdesk",
    });

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`ForgeDesk API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

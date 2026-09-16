import express from "express";
import cors from "cors";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    message: "ForgeDesk API is running",
  });
});

app.listen(PORT, () => {
  console.log(`ForgeDesk API running on http://localhost:${PORT}`);
});

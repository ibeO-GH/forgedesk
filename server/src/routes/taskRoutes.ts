import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.post("/", createTask);

router.get("/", getTasks);

router.patch("/:id", updateTask);

export default router;

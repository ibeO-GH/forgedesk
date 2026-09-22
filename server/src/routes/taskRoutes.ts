import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validation/taskSchemas.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), createTask);

router.get("/", getTasks);

router.patch("/:id", validate(updateTaskSchema), updateTask);

router.delete("/:id", deleteTask);

export default router;

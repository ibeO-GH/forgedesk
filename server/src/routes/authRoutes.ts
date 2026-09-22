import { Router } from "express";
import {
  login,
  register,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getCurrentUser);

router.get("/admin-test", authenticate, requireRole("admin"), (_req, res) => {
  res.json({
    message: "You have administrator access",
  });
});

export default router;

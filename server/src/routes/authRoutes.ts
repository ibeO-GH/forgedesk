import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  register,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);

router.post("/login", authLimiter, validate(loginSchema), login);

router.get("/me", authenticate, getCurrentUser);

router.get("/admin-test", authenticate, requireRole("admin"), (_req, res) => {
  res.json({
    message: "You have administrator access",
  });
});

export default router;

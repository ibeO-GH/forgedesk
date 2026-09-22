import { Router } from "express";
import {
  login,
  register,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, getCurrentUser);

router.get("/admin-test", authenticate, requireRole("admin"), (_req, res) => {
  res.json({
    message: "You have administrator access",
  });
});

export default router;

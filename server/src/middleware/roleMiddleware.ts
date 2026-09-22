import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.js";

export function requireRole(role: "user" | "admin") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.userRole !== role) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
}

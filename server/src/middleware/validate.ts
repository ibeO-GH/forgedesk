import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

type ValidationTarget = "body" | "params";

export function validate(schema: ZodType, target: ValidationTarget = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[target] = result.data;

    next();
  };
}

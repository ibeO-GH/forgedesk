import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((fieldError) => ({
        field: fieldError.path,
        message: fieldError.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid resource identifier",
    });
  }

  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return res.status(409).json({
      message: "A resource with the provided value already exists",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

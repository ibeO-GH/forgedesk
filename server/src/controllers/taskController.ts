import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

export async function createTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, priority } = req.body;

    const task = await Task.create({
      title,
      priority,
      userId: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function getTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { title, priority, status } = req.body;

    const updates: {
      title?: string;
      priority?: "low" | "medium" | "high";
      status?: "todo" | "in-progress" | "done";
    } = {};

    if (title !== undefined) {
      updates.title = title;
    }

    if (priority !== undefined) {
      updates.priority = priority;
    }

    if (status !== undefined) {
      updates.status = status;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

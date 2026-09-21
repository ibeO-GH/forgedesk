import type { Request, Response } from "express";
import Task from "../models/Task.js";

export async function createTask(req: Request, res: Response) {
  try {
    const { title, priority } = req.body;

    const task = await Task.create({
      title,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create task:", error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
}

export async function getTasks(_req: Request, res: Response) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
}

export async function updateTask(req: Request, res: Response) {
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

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Failed to update task:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete task:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
}

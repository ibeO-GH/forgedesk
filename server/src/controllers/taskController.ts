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

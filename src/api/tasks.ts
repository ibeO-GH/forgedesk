import type { Task } from "../types/task";

const API_URL = "http://localhost:5000/api";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const tasks = await response.json();

  return tasks.map((task: Task & { _id: string }) => ({
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
  }));
}

export async function createTask(
  title: string,
  priority: Task["priority"],
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      priority,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const task = await response.json();

  return {
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
  };
}

export async function updateTaskStatus(
  taskId: string,
  status: Task["status"],
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task status");
  }

  const task = await response.json();

  return {
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
  };
}

export async function updateTask(
  taskId: string,
  updates: {
    title: string;
    priority: Task["priority"];
  },
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  const task = await response.json();

  return {
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
  };
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

import type { Task } from "../types/task";

const API_URL = "http://localhost:5000/api";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
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

  return response.json();
}

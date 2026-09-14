import { useState } from "react";
import type { Task, TaskPriority } from "../types/task";

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function createTask(title: string, priority: TaskPriority) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: "todo",
      priority,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  function updateTaskStatus(taskId: string, status: Task["status"]) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
  }

  function updateTask(
    taskId: string,
    updates: Partial<Pick<Task, "title" | "priority">>,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  }

  function deleteTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }

  return {
    tasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
}

export default useTasks;

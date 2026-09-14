import type { Task } from "../types/task";

interface TaskFilterOptions {
  searchTerm: string;
  status: "all" | Task["status"];
  priority: "all" | Task["priority"];
}

export function filterTasks(tasks: Task[], filters: TaskFilterOptions): Task[] {
  return tasks.filter((task) => {
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });
}

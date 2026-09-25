import { describe, expect, it } from "vitest";
import { filterTasks } from "./taskFilters";
import type { Task } from "../types/task";

const tasks: Task[] = [
  {
    id: "1",
    title: "Build authentication",
    status: "todo",
    priority: "high",
  },
  {
    id: "2",
    title: "Connect Frontend to Backend",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "3",
    title: "Write API tests",
    status: "done",
    priority: "low",
  },
];

describe("filterTasks", () => {
  it("returns all tasks when no filters are applied", () => {
    expect(
      filterTasks(tasks, {
        searchTerm: "",
        status: "all",
        priority: "all",
      }),
    ).toEqual(tasks);
  });

  it("filters tasks by search term case-insensitively", () => {
    expect(
      filterTasks(tasks, {
        searchTerm: "FRONTEND",
        status: "all",
        priority: "all",
      }),
    ).toEqual([tasks[1]]);
  });

  it("filters tasks by status", () => {
    expect(
      filterTasks(tasks, {
        searchTerm: "",
        status: "done",
        priority: "all",
      }),
    ).toEqual([tasks[2]]);
  });

  it("filters tasks by priority", () => {
    expect(
      filterTasks(tasks, {
        searchTerm: "",
        status: "all",
        priority: "high",
      }),
    ).toEqual([tasks[0]]);
  });

  it("combines search, status, and priority filters", () => {
    const matchingTask: Task = {
      id: "4",
      title: "Review authentication",
      status: "todo",
      priority: "high",
    };

    const result = filterTasks([...tasks, matchingTask], {
      searchTerm: "AUTH",
      status: "todo",
      priority: "high",
    });

    expect(result).toEqual([tasks[0], matchingTask]);
  });

  it("returns an empty array when no tasks match", () => {
    expect(
      filterTasks(tasks, {
        searchTerm: "nonexistent",
        status: "all",
        priority: "all",
      }),
    ).toEqual([]);
  });
});

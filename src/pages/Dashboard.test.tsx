import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import Dashboard from "./Dashboard";
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
  {
    id: "4",
    title: "Design dashboard layout",
    status: "todo",
    priority: "medium",
  },
  {
    id: "5",
    title: "Add error handling",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "6",
    title: "Document deployment",
    status: "done",
    priority: "low",
  },
  {
    id: "7",
    title: "Review API security",
    status: "todo",
    priority: "high",
  },
];

function renderDashboard(
  overrides: Partial<ComponentProps<typeof Dashboard>> = {},
) {
  return render(
    <Dashboard
      tasks={tasks}
      isLoading={false}
      isError={false}
      error={null}
      onEditTask={vi.fn()}
      onUpdateStatus={vi.fn()}
      onDeleteTask={vi.fn()}
      {...overrides}
    />,
  );
}

describe("Dashboard", () => {
  it("shows the loading state", () => {
    renderDashboard({ isLoading: true });

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
  });

  it("shows the API error state", () => {
    renderDashboard({
      isError: true,
      error: new Error("Unable to load tasks"),
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load tasks");
  });

  it("shows task statistics", () => {
    renderDashboard();

    expect(
      screen.getByText("Total Tasks").nextElementSibling,
    ).toHaveTextContent("7");

    expect(
      screen.getAllByText("In Progress")[0].nextElementSibling,
    ).toHaveTextContent("2");

    expect(
      screen.getAllByText("Completed")[0].nextElementSibling,
    ).toHaveTextContent("2");
  });

  it("shows the first five tasks and pagination", () => {
    renderDashboard();

    expect(screen.getByText("Build authentication")).toBeInTheDocument();
    expect(screen.getByText("Add error handling")).toBeInTheDocument();

    expect(screen.queryByText("Review API security")).not.toBeInTheDocument();

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Review API security")).toBeInTheDocument();

    expect(screen.queryByText("Build authentication")).not.toBeInTheDocument();

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("moves back to the previous page", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByText("Build authentication")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("disables pagination buttons at the appropriate boundaries", async () => {
    const user = userEvent.setup();

    renderDashboard();

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Previous" })).not.toBeDisabled();

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("filters tasks by search term", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.type(
      screen.getByRole("searchbox", { name: "Search tasks" }),
      "authentication",
    );

    expect(screen.getByText("Build authentication")).toBeInTheDocument();

    expect(
      screen.queryByText("Connect Frontend to Backend"),
    ).not.toBeInTheDocument();

    expect(screen.queryByText("No matching tasks")).not.toBeInTheDocument();
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter tasks by status",
      }),
      "done",
    );

    expect(screen.getByText("Write API tests")).toBeInTheDocument();
    expect(screen.getByText("Document deployment")).toBeInTheDocument();

    expect(screen.queryByText("Build authentication")).not.toBeInTheDocument();
  });

  it("filters tasks by priority", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter tasks by priority",
      }),
      "high",
    );

    expect(screen.getByText("Build authentication")).toBeInTheDocument();

    expect(screen.getByText("Add error handling")).toBeInTheDocument();

    expect(screen.getByText("Review API security")).toBeInTheDocument();

    expect(screen.queryByText("Write API tests")).not.toBeInTheDocument();
  });

  it("combines search and filters", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.type(
      screen.getByRole("searchbox", { name: "Search tasks" }),
      "api",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter tasks by status",
      }),
      "todo",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter tasks by priority",
      }),
      "high",
    );

    expect(screen.getByText("Review API security")).toBeInTheDocument();

    expect(screen.queryByText("Write API tests")).not.toBeInTheDocument();

    expect(screen.queryByText("Add error handling")).not.toBeInTheDocument();
  });

  it("resets pagination when a filter changes", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter tasks by status",
      }),
      "done",
    );

    expect(
      screen.queryByRole("navigation", {
        name: "Task pagination",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Write API tests")).toBeInTheDocument();
  });

  it("shows a no-match state when filters return no tasks", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.type(
      screen.getByRole("searchbox", { name: "Search tasks" }),
      "does not exist",
    );

    expect(
      screen.getByRole("heading", {
        name: "No matching tasks",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Try adjusting your search or filters."),
    ).toBeInTheDocument();
  });

  it("shows the empty workspace state", () => {
    renderDashboard({ tasks: [] });

    expect(
      screen.getByRole("heading", {
        name: "No tasks yet",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first task to start managing your workspace.",
      ),
    ).toBeInTheDocument();
  });

  it("calls onEditTask with the selected task", async () => {
    const user = userEvent.setup();
    const onEditTask = vi.fn();

    renderDashboard({ onEditTask });

    await user.click(
      screen.getByRole("button", {
        name: "Edit Build authentication",
      }),
    );

    expect(onEditTask).toHaveBeenCalledWith(tasks[0]);
  });

  it("calls onUpdateStatus with the task ID and new status", async () => {
    const user = userEvent.setup();
    const onUpdateStatus = vi.fn();

    renderDashboard({ onUpdateStatus });

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Status for Build authentication",
      }),
      "done",
    );

    expect(onUpdateStatus).toHaveBeenCalledWith("1", "done");
  });

  it("calls onDeleteTask with the task ID after confirmation", async () => {
    const user = userEvent.setup();
    const onDeleteTask = vi.fn().mockResolvedValue(undefined);

    renderDashboard({ onDeleteTask });

    await user.click(
      screen.getByRole("button", {
        name: "Delete Build authentication",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm delete Build authentication",
      }),
    );

    expect(onDeleteTask).toHaveBeenCalledWith("1");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderDashboard();

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

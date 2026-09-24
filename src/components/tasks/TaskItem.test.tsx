import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskItem from "./TaskItem";
import { axe } from "jest-axe";

const task = {
  id: "task-123",
  title: "Build authentication",
  status: "todo" as const,
  priority: "high" as const,
};

describe("TaskItem", () => {
  it("renders the task information", () => {
    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Build authentication")).toBeInTheDocument();

    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("todo")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Edit Build authentication" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Delete Build authentication" }),
    ).toBeInTheDocument();
  });

  it("calls onUpdateStatus when the status changes", async () => {
    const user = userEvent.setup();
    const onUpdateStatus = vi.fn();

    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={onUpdateStatus}
        onDelete={vi.fn()}
      />,
    );

    const statusSelect = screen.getByRole("combobox");

    await user.selectOptions(statusSelect, "done");

    expect(onUpdateStatus).toHaveBeenCalledWith("task-123", "done");
  });

  it("calls onEdit with the task when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onEdit={onEdit}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Edit Build authentication" }),
    );

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("opens the delete confirmation when Delete is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Build authentication" }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Delete task?",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Delete task?" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Are you sure you want to delete this task? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("closes the delete confirmation when Cancel is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Build authentication" }),
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("heading", { name: "Delete task?" }),
    ).not.toBeInTheDocument();
  });

  it("deletes the task when deletion is confirmed", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Build authentication" }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Delete task?",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Confirm delete Build authentication",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith("task-123");

    expect(
      screen.queryByRole("dialog", {
        name: "Delete task?",
      }),
    ).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("gives the status control an accessible name", () => {
    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Status for Build authentication",
      }),
    ).toBeInTheDocument();
  });

  it("gives task actions accessible names", () => {
    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Edit Build authentication",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete Build authentication",
      }),
    ).toBeInTheDocument();
  });

  it("disables the status control while updating", () => {
    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
        isUpdatingStatus
      />,
    );

    expect(screen.getByLabelText(`Status for ${task.title}`)).toBeDisabled();
  });

  it("displays a status update error", () => {
    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
        statusError={new Error("Failed to update status")}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to update status",
    );
  });

  it("shows a deleting state while deleting", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: `Delete ${task.title}` }),
    );

    rerender(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
        isDeleting
      />,
    );

    expect(
      screen.getByRole("button", { name: `Confirm delete ${task.title}` }),
    ).toHaveTextContent("Deleting...");

    expect(
      screen.getByRole("button", { name: `Confirm delete ${task.title}` }),
    ).toBeDisabled();
  });

  it("displays a delete error", async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={task}
        onEdit={vi.fn()}
        onUpdateStatus={vi.fn()}
        onDelete={vi.fn()}
        deleteError={new Error("Failed to delete task")}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: `Delete ${task.title}` }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to delete task",
    );
  });
});

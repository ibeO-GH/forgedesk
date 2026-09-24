import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EditTaskModal from "./EditTaskModal";
import { axe } from "jest-axe";

const task = {
  id: "task-123",
  title: "Build authentication",
  status: "todo" as const,
  priority: "high" as const,
};

describe("EditTaskModal", () => {
  it("renders the existing task data", () => {
    render(<EditTaskModal task={task} onClose={vi.fn()} onUpdate={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Edit Task" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Task title")).toHaveValue(
      "Build authentication",
    );

    expect(screen.getByLabelText("Priority")).toHaveValue("high");

    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });

  it("updates the task with the edited values", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditTaskModal task={task} onClose={vi.fn()} onUpdate={onUpdate} />);

    const titleInput = screen.getByLabelText("Task title");

    await user.clear(titleInput);
    await user.type(titleInput, "Build authentication system");

    await user.selectOptions(screen.getByLabelText("Priority"), "medium");

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(onUpdate).toHaveBeenCalledWith("task-123", {
      title: "Build authentication system",
      priority: "medium",
    });
  });

  it("does not update the task when the title is empty", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditTaskModal task={task} onClose={vi.fn()} onUpdate={onUpdate} />);

    const titleInput = screen.getByLabelText("Task title");

    await user.clear(titleInput);

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<EditTaskModal task={task} onClose={onClose} onUpdate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EditTaskModal task={task} onClose={vi.fn()} onUpdate={vi.fn()} />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("renders as an accessible dialog", () => {
    render(<EditTaskModal task={task} onClose={vi.fn()} onUpdate={vi.fn()} />);

    expect(
      screen.getByRole("dialog", {
        name: "Edit Task",
      }),
    ).toBeInTheDocument();
  });

  it("shows a submitting state while saving", () => {
    render(
      <EditTaskModal
        task={task}
        onClose={vi.fn()}
        onUpdate={vi.fn()}
        isSubmitting
      />,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    expect(screen.getByLabelText("Task title")).toBeDisabled();
    expect(screen.getByLabelText("Priority")).toBeDisabled();
  });

  it("displays an error when task update fails", () => {
    render(
      <EditTaskModal
        task={task}
        onClose={vi.fn()}
        onUpdate={vi.fn()}
        error={new Error("Failed to update task")}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to update task",
    );
  });
});

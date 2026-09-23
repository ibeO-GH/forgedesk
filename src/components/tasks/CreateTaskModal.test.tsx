import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CreateTaskModal from "./CreateTaskModal";

describe("CreateTaskModal", () => {
  it("renders the create task form", () => {
    render(<CreateTaskModal onClose={vi.fn()} onCreate={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Create Task" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Task title")).toBeInTheDocument();

    expect(screen.getByLabelText("Priority")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create Task" }),
    ).toBeInTheDocument();
  });

  it("does not create a task when the title is empty", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();

    render(<CreateTaskModal onClose={vi.fn()} onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    expect(onCreate).not.toHaveBeenCalled();
  });

  it("creates a task with the entered title and priority", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onClose = vi.fn();

    render(<CreateTaskModal onClose={onClose} onCreate={onCreate} />);

    await user.type(
      screen.getByLabelText("Task title"),
      "Build authentication",
    );

    await user.selectOptions(screen.getByLabelText("Priority"), "high");

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    expect(onCreate).toHaveBeenCalledWith("Build authentication", "high");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

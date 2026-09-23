import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TaskBadge from "./TaskBadge";

describe("TaskBadge", () => {
  it("renders a priority badge", () => {
    render(<TaskBadge type="priority" value="high" />);

    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders a status badge", () => {
    render(<TaskBadge type="status" value="done" />);

    expect(screen.getByText("done")).toBeInTheDocument();
  });

  it("formats the in-progress status label", () => {
    render(<TaskBadge type="status" value="in-progress" />);

    expect(screen.getByText("inprogress")).toBeInTheDocument();
  });
});

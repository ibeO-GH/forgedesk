import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Register from "./Register";
import { axe } from "jest-axe";

const { loginUser, register } = vi.hoisted(() => ({
  loginUser: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    token: null,
    isLoading: false,
    loginUser,
    logout: vi.fn(),
  }),
}));

vi.mock("../api/auth", () => ({
  register,
}));

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the registration form", () => {
    render(<Register onLogin={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: "Create your ForgeDesk account",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("shows an error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(<Register onLogin={vi.fn()} />);

    await user.type(screen.getByLabelText("Full name"), "Test User");

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "TestPassword123");

    await user.type(
      screen.getByLabelText("Confirm password"),
      "DifferentPassword123",
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

    expect(register).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("calls the register API and stores the authenticated user", async () => {
    const user = userEvent.setup();

    register.mockResolvedValue({
      user: {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
      token: "test-token",
    });

    render(<Register onLogin={vi.fn()} />);

    await user.type(screen.getByLabelText("Full name"), "Test User");

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "TestPassword123");

    await user.type(
      screen.getByLabelText("Confirm password"),
      "TestPassword123",
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(register).toHaveBeenCalledWith(
      "Test User",
      "test@example.com",
      "TestPassword123",
    );

    expect(loginUser).toHaveBeenCalledWith(
      {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
      "test-token",
    );
  });

  it("displays an API error when registration fails", async () => {
    const user = userEvent.setup();

    register.mockRejectedValue(new Error("Email already exists"));

    render(<Register onLogin={vi.fn()} />);

    await user.type(screen.getByLabelText("Full name"), "Test User");

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "TestPassword123");

    await user.type(
      screen.getByLabelText("Confirm password"),
      "TestPassword123",
    );

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("calls onLogin when Sign in is clicked", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();

    render(<Register onLogin={onLogin} />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Register onLogin={vi.fn()} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

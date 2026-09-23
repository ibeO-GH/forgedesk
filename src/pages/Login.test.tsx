import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";

const { loginUser, login } = vi.hoisted(() => ({
  loginUser: vi.fn(),
  login: vi.fn(),
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
  login,
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<Login onRegister={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Welcome to ForgeDesk" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("allows the user to enter login credentials", async () => {
    const user = userEvent.setup();

    render(<Login onRegister={vi.fn()} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "TestPassword123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("TestPassword123");
  });

  it("calls the login API and stores the authenticated user", async () => {
    const user = userEvent.setup();

    login.mockResolvedValue({
      user: {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
      token: "test-token",
    });

    render(<Login onRegister={vi.fn()} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "TestPassword123");

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(login).toHaveBeenCalledWith("test@example.com", "TestPassword123");

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

  it("displays an API error when login fails", async () => {
    const user = userEvent.setup();

    login.mockRejectedValue(new Error("Invalid email or password"));

    render(<Login onRegister={vi.fn()} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    await user.type(screen.getByLabelText("Password"), "WrongPassword");

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();

    expect(loginUser).not.toHaveBeenCalled();
  });

  it("calls onRegister when Create one is clicked", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn();

    render(<Login onRegister={onRegister} />);

    await user.click(screen.getByRole("button", { name: "Create one" }));

    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});

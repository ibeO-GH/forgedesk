import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { getCurrentUser } from "../api/auth";
import type { AuthUser } from "../api/auth";

vi.mock("../api/auth", () => ({
  getCurrentUser: vi.fn(),
}));

const mockedGetCurrentUser = vi.mocked(getCurrentUser);

const user: AuthUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
};

function TestConsumer() {
  const { user: currentUser, token, isLoading, loginUser, logout } = useAuth();

  return (
    <div>
      <p data-testid="loading">{String(isLoading)}</p>
      <p data-testid="user">{currentUser?.name ?? "No user"}</p>
      <p data-testid="token">{token ?? "No token"}</p>

      <button type="button" onClick={() => loginUser(user, "new-token")}>
        Login
      </button>

      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGetCurrentUser.mockReset();
  });

  it("starts without an authenticated session when no token exists", async () => {
    renderAuth();

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("token")).toHaveTextContent("No token");
    expect(mockedGetCurrentUser).not.toHaveBeenCalled();
  });

  it("restores a valid stored session", async () => {
    localStorage.setItem("forgedesk_token", "stored-token");
    mockedGetCurrentUser.mockResolvedValue(user);

    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(mockedGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    expect(screen.getByTestId("token")).toHaveTextContent("stored-token");

    expect(localStorage.getItem("forgedesk_user")).toBe(JSON.stringify(user));
  });

  it("clears an invalid stored session", async () => {
    localStorage.setItem("forgedesk_token", "expired-token");
    localStorage.setItem("forgedesk_user", JSON.stringify(user));

    mockedGetCurrentUser.mockRejectedValue(
      new Error("Invalid or expired token"),
    );

    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("token")).toHaveTextContent("No token");
    expect(localStorage.getItem("forgedesk_token")).toBeNull();
    expect(localStorage.getItem("forgedesk_user")).toBeNull();
  });

  it("sets the authenticated user and token when loginUser is called", async () => {
    const userEventSetup = userEvent.setup();

    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    await userEventSetup.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    expect(screen.getByTestId("token")).toHaveTextContent("new-token");

    expect(localStorage.getItem("forgedesk_token")).toBe("new-token");
    expect(localStorage.getItem("forgedesk_user")).toBe(JSON.stringify(user));
  });

  it("clears the authenticated session when logout is called", async () => {
    const userEventSetup = userEvent.setup();

    localStorage.setItem("forgedesk_token", "stored-token");
    mockedGetCurrentUser.mockResolvedValue(user);

    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    });

    await userEventSetup.click(screen.getByRole("button", { name: "Logout" }));

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("token")).toHaveTextContent("No token");
    expect(localStorage.getItem("forgedesk_token")).toBeNull();
    expect(localStorage.getItem("forgedesk_user")).toBeNull();
  });

  it("keeps the session loading until stored-session restoration finishes", async () => {
    localStorage.setItem("forgedesk_token", "stored-token");

    let resolveUser!: (value: AuthUser) => void;

    mockedGetCurrentUser.mockReturnValue(
      new Promise<AuthUser>((resolve) => {
        resolveUser = resolve;
      }),
    );

    renderAuth();

    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    resolveUser(user);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user")).toHaveTextContent("Test User");
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    function InvalidConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<InvalidConsumer />)).toThrow(
      "useAuth must be used inside AuthProvider",
    );
  });
});

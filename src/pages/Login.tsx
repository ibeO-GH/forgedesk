import { useState, type FormEvent } from "react";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  onRegister: () => void;
}

function Login({ onRegister }: LoginProps) {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);

      loginUser(data.user, data.token);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to ForgeDesk
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="font-medium text-gray-900 hover:underline"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

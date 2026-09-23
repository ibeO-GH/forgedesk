import { useState, type FormEvent } from "react";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

interface RegisterProps {
  onLogin: () => void;
}

function Register({ onLogin }: RegisterProps) {
  const { loginUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = await register(name, email, password);

      loginUser(data.user, data.token);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create account",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your ForgeDesk account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create an account to start managing your tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300"
              placeholder="Your name"
            />
          </div>

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
              aria-describedby={error ? "register-error" : undefined}
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
              autoComplete="new-password"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300"
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div
              id="register-error"
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;

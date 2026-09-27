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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-slate-700/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-900 shadow-lg">
            F
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              ForgeDesk
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage your tasks and keep your work moving.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                className="fd-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                className="fd-input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div
                id="login-error"
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="fd-button-primary w-full"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegister}
              className="font-semibold text-slate-900 transition hover:text-slate-600 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Create one
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Your workspace, organized.
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  onCreateTask: () => void;
}

function Topbar({ onCreateTask }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-16 flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </span>

            <span className="text-slate-300">/</span>

            <span className="text-xs font-semibold text-slate-500">
              Overview
            </span>
          </div>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Here's what's happening with your workspace.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              {user?.name
                ?.split(" ")
                .filter(Boolean)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="max-w-44 truncate text-sm font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="max-w-44 truncate text-xs text-slate-500">
                {user?.email}
              </p>

              <p className="mt-0.5 text-xs font-medium capitalize text-slate-400">
                {user?.role}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={logout}
              className="fd-button-secondary flex-1 sm:flex-none"
            >
              Logout
            </button>

            <button
              type="button"
              onClick={onCreateTask}
              className="fd-button-primary flex-1 sm:flex-none"
            >
              <span className="mr-2 text-base leading-none">+</span>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;

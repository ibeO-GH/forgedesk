import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { filterTasks } from "../utils/taskFilters";
import TaskItem from "../components/tasks/TaskItem";

interface DashboardProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onEditTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void | Promise<void>;
  isUpdatingStatus?: boolean;
  statusError?: Error | null;
  isDeleting?: boolean;
  deleteError?: Error | null;
}

function Dashboard({
  tasks,
  isLoading,
  isError,
  error,
  onEditTask,
  onUpdateStatus,
  onDeleteTask,
  isUpdatingStatus = false,
  statusError = null,
  isDeleting = false,
  deleteError = null,
}: DashboardProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all",
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Task["priority"]
  >("all");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const filteredTasks = filterTasks(tasks, {
    searchTerm,
    status: statusFilter,
    priority: priorityFilter,
  });

  const completedTasks = tasks.filter((task) => task.status === "done").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const tasksPerPage = 5;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;

  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + tasksPerPage,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <main
        className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div
            className="rounded-2xl border border-red-200 bg-red-50 p-8"
            role="alert"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              !
            </div>

            <h2 className="mt-5 font-bold text-red-900">
              Failed to load tasks
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-red-700">
              {error?.message || "Something went wrong while loading tasks."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Workspace overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Keep your work moving.
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="fd-card relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-100" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Tasks
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600">
                  ▦
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {tasks.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Tasks in your workspace
              </p>
            </div>
          </div>

          <div className="fd-card relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-50" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm text-blue-600">
                  →
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {inProgressTasks}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Currently being worked on
              </p>
            </div>
          </div>

          <div className="fd-card relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-50" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Completed</p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm text-emerald-600">
                  ✓
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {completedTasks}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Successfully completed
              </p>
            </div>
          </div>
        </div>

        <section
          className="fd-card mt-6 overflow-hidden"
          aria-labelledby="recent-tasks-heading"
        >
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="recent-tasks-heading"
                    className="text-lg font-bold tracking-tight text-slate-900"
                  >
                    Recent Tasks
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {filteredTasks.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and track your current work.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 xl:flex-row xl:w-auto">
                <div className="w-full xl:w-64">
                  <label htmlFor="task-search" className="sr-only">
                    Search tasks
                  </label>

                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                      aria-hidden="true"
                    >
                      ⌕
                    </span>

                    <input
                      id="task-search"
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search tasks..."
                      className="fd-input pl-9"
                    />
                  </div>
                </div>

                <div className="w-full xl:w-auto">
                  <label htmlFor="task-status-filter" className="sr-only">
                    Filter tasks by status
                  </label>

                  <select
                    id="task-status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as "all" | Task["status"],
                      )
                    }
                    className="fd-input w-full xl:w-40"
                  >
                    <option value="all">All Tasks</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div className="w-full xl:w-auto">
                  <label htmlFor="task-priority-filter" className="sr-only">
                    Filter tasks by priority
                  </label>

                  <select
                    id="task-priority-filter"
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(
                        event.target.value as "all" | Task["priority"],
                      )
                    }
                    className="fd-input w-full xl:w-40"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 sm:p-5">
            {filteredTasks.length === 0 ? (
              <div
                className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
                aria-live="polite"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-500">
                  {tasks.length === 0 ? "+" : "⌕"}
                </div>

                {tasks.length === 0 ? (
                  <>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      No tasks yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Create your first task to start managing your workspace.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      No matching tasks
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Try adjusting your search or filters.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3" aria-live="polite">
                {paginatedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDeleteTask}
                    isUpdatingStatus={isUpdatingStatus}
                    statusError={statusError}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
                aria-label="Task pagination"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="fd-button-secondary px-3 py-2"
                >
                  Previous
                </button>

                <p
                  className="text-sm font-medium text-slate-500"
                  aria-live="polite"
                >
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {totalPages}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="fd-button-secondary px-3 py-2"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;

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
        className="min-w-0 flex-1 p-4 sm:p-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading tasks...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          role="alert"
        >
          <h2 className="font-semibold text-red-800">Failed to load tasks</h2>

          <p className="mt-2 text-sm text-red-600">
            {error?.message || "Something went wrong while loading tasks."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {tasks.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {inProgressTasks}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {completedTasks}
          </p>
        </div>
      </div>

      <section
        className="mt-6 rounded-xl border border-gray-200 bg-white p-5"
        aria-labelledby="recent-tasks-heading"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="recent-tasks-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Recent Tasks
          </h2>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="w-full sm:w-56">
              <label htmlFor="task-search" className="sr-only">
                Search tasks
              </label>
              <input
                id="task-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="task-status-filter" className="sr-only">
                Filter tasks by status
              </label>

              <select
                id="task-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | Task["status"])
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
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
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div
            className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
            aria-live="polite"
          >
            {tasks.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  No tasks yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first task to start managing your workspace.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  No matching tasks
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3" aria-live="polite">
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
            className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
            aria-label="Task pagination"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Previous
            </button>

            <p className="text-sm text-gray-500" aria-live="polite">
              Page {currentPage} of {totalPages}
            </p>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default Dashboard;

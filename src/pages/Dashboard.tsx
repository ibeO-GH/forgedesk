import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { filterTasks } from "../utils/taskFilters";
import TaskItem from "../components/tasks/TaskItem";

interface DashboardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
}

function Dashboard({
  tasks,
  onEditTask,
  onUpdateStatus,
  onDeleteTask,
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

  return (
    <main className="flex-1 p-6">
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

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tasks..."
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | Task["status"])
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value as "all" | Task["priority"],
                )
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            {statusFilter === "all"
              ? "No tasks yet. Create your first task."
              : "No tasks match this filter."}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {paginatedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDeleteTask}
              />
            ))}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;

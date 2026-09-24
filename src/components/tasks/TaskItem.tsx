import { useState } from "react";
import type { Task } from "../../types/task";
import TaskBadge from "./TaskBadge";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void | Promise<void>;
  isUpdatingStatus?: boolean;
  statusError?: Error | null;
  isDeleting?: boolean;
  deleteError?: Error | null;
}

function TaskItem({
  task,
  onEdit,
  onUpdateStatus,
  onDelete,
  isUpdatingStatus = false,
  statusError = null,
  isDeleting = false,
  deleteError = null,
}: TaskItemProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    try {
      await onDelete(task.id);
      setIsDeleteConfirmOpen(false);
    } catch {
      // The mutation error is displayed through deleteError.
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="break-words font-medium text-gray-900">{task.title}</p>

          <TaskBadge type="priority" value={task.priority} />
        </div>

        <div className="mt-2">
          <TaskBadge type="status" value={task.status} />
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">
        <label className="sr-only" htmlFor={`task-status-${task.id}`}>
          Status for {task.title}
        </label>

        <select
          id={`task-status-${task.id}`}
          value={task.status}
          disabled={isUpdatingStatus}
          onChange={(event) =>
            onUpdateStatus(task.id, event.target.value as Task["status"])
          }
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 sm:flex-none"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={isUpdatingStatus || isDeleting}
          aria-label={`Edit ${task.title}`}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:flex-none"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteConfirmOpen(true)}
          disabled={isUpdatingStatus || isDeleting}
          aria-label={`Delete ${task.title}`}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:flex-none"
        >
          Delete
        </button>
      </div>

      {statusError && (
        <div
          className="basis-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {statusError.message || "Failed to update task status."}
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-task-title"
          aria-describedby="delete-task-description"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="delete-task-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete task?
            </h2>

            <p
              id="delete-task-description"
              className="mt-2 text-sm text-gray-500"
            >
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>

            {deleteError && (
              <div
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {deleteError.message ||
                  "Failed to delete task. Please try again."}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                Cancel
              </button>

              <button
                type="button"
                aria-label={`Confirm delete ${task.title}`}
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;

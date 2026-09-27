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
    <>
      <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base"
                title={task.title}
              >
                {task.title}
              </p>

              <TaskBadge type="priority" value={task.priority} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </span>

              <TaskBadge type="status" value={task.status} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">
            <div className="min-w-0 sm:min-w-36">
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
                className="fd-input disabled:cursor-not-allowed"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => onEdit(task)}
              disabled={isUpdatingStatus || isDeleting}
              aria-label={`Edit ${task.title}`}
              className="fd-button-secondary"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={isUpdatingStatus || isDeleting}
              aria-label={`Delete ${task.title}`}
              className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition duration-200 hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {statusError && (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {statusError.message || "Failed to update task status."}
          </div>
        )}
      </article>

      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-task-title"
          aria-describedby="delete-task-description"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              !
            </div>

            <h2
              id="delete-task-title"
              className="mt-5 text-lg font-bold text-slate-900"
            >
              Delete task?
            </h2>

            <p
              id="delete-task-description"
              className="mt-2 text-sm leading-6 text-slate-500"
            >
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>

            {deleteError && (
              <div
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
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
                className="fd-button-secondary flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                aria-label={`Confirm delete ${task.title}`}
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskItem;

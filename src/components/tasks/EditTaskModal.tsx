import { useState } from "react";
import type { FormEvent } from "react";
import type { Task, TaskPriority } from "../../types/task";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (
    taskId: string,
    updates: Partial<Pick<Task, "title" | "priority">>,
  ) => void;
  isSubmitting?: boolean;
  error?: Error | null;
}

function EditTaskModal({
  task,
  onClose,
  onUpdate,
  isSubmitting = false,
  error = null,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || isSubmitting) {
      return;
    }

    onUpdate(task.id, {
      title: title.trim(),
      priority,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                ✎
              </div>

              <h2
                id="edit-task-title"
                className="mt-4 text-lg font-bold tracking-tight text-slate-900"
              >
                Edit Task
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the details of this task.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close edit task dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="edit-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Task title
            </label>

            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
              className="fd-input"
            />
          </div>

          <div>
            <label
              htmlFor="edit-priority"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Priority
            </label>

            <select
              id="edit-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              disabled={isSubmitting}
              className="fd-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error.message || "Failed to update task. Please try again."}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="fd-button-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="fd-button-primary flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;

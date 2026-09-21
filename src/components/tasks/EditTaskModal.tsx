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
}

function EditTaskModal({ task, onClose, onUpdate }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onUpdate(task.id, {
      title: title.trim(),
      priority,
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Task title
            </label>

            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="edit-priority"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>

            <select
              id="edit-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;

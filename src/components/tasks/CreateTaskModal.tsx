import { useState } from "react";
import type { FormEvent } from "react";
import type { TaskPriority } from "../../types/task";

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (title: string, priority: TaskPriority) => void;
}

function CreateTaskModal({ onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate(title.trim(), priority);
    setTitle("");
    setPriority("medium");
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Task</h2>

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
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Task title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build authentication"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>

            <select
              id="priority"
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

          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;

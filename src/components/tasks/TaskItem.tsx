import { useState } from "react";
import type { Task } from "../../types/task";
import TaskBadge from "./TaskBadge";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}

function TaskItem({ task, onEdit, onUpdateStatus, onDelete }: TaskItemProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="break-words font-medium text-gray-900">{task.title}</p>

          <TaskBadge type="priority" value={task.priority} />
        </div>
        <div className="mt-2">
          <TaskBadge type="status" value={task.status} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={task.status}
          onChange={(event) =>
            onUpdateStatus(task.id, event.target.value as Task["status"])
          }
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-900"
        >
          <option value="todo">To Do</option>{" "}
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteConfirmOpen(true)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Delete
        </button>
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete task?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(task.id);
                  setIsDeleteConfirmOpen(false);
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;

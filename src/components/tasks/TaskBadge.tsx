import type { TaskPriority, TaskStatus } from "../../types/task";

interface TaskBadgeProps {
  type: "status" | "priority";
  value: TaskStatus | TaskPriority;
}

function TaskBadge({ type, value }: TaskBadgeProps) {
  const label = value.replace("-", "");

  let badgeClassName =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize";

  if (type === "priority") {
    if (value === "high") {
      badgeClassName += "border-red-200 bg-red-100 text-red-700";
    } else if (value === "medium") {
      badgeClassName += "border-amber-200 bg-amber-100 text-amber-700";
    } else {
      badgeClassName += "border-gray-200 bg-gray-100 text-gray-700";
    }
  } else {
    if (value === "done") {
      badgeClassName += "border-green-200 bg-green-100 text-green-700";
    } else if (value === "in-progress") {
      badgeClassName += "border-blue-200 bg-blue-100 text-blue-700";
    } else {
      badgeClassName += "border-gray-200 bg-gray-100 text-gray-700";
    }
  }

  return <span className={badgeClassName}>{label}</span>;
}

export default TaskBadge;

import type { TaskPriority, TaskStatus } from "../../types/task";

interface TaskBadgeProps {
  type: "status" | "priority";
  value: TaskStatus | TaskPriority;
}

function TaskBadge({ type, value }: TaskBadgeProps) {
  const label = value === "in-progress" ? "In Progress" : value;

  let badgeClassName =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize";

  if (type === "priority") {
    if (value === "high") {
      badgeClassName += " border-red-200 bg-red-50 text-red-700";
    } else if (value === "medium") {
      badgeClassName += " border-amber-200 bg-amber-50 text-amber-700";
    } else {
      badgeClassName += " border-slate-200 bg-slate-50 text-slate-600";
    }
  } else {
    if (value === "done") {
      badgeClassName += " border-emerald-200 bg-emerald-50 text-emerald-700";
    } else if (value === "in-progress") {
      badgeClassName += " border-blue-200 bg-blue-50 text-blue-700";
    } else {
      badgeClassName += " border-slate-200 bg-slate-50 text-slate-600";
    }
  }

  return <span className={badgeClassName}>{label}</span>;
}

export default TaskBadge;

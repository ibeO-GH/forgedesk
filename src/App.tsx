import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import CreateTaskModal from "./components/tasks/CreateTaskModal";
import useTasks from "./hooks/useTasks";
import EditTaskModal from "./components/tasks/EditTaskModal";
import type { Task } from "./types/task";
import useTasksQuery from "./hooks/useTasksQuery";
import useCreateTask from "./hooks/useCreateTask";
import useUpdateTaskStatus from "./hooks/useUpdateTaskStatus";
import useUpdateTask from "./hooks/useUpdateTask";

function App() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { deleteTask } = useTasks();

  const { data: tasks = [], isLoading, isError, error } = useTasksQuery();

  const createTaskMutation = useCreateTask();

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const updateTaskMutation = useUpdateTask();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 sm:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onCreateTask={() => setIsCreateTaskOpen(true)} />
        <Dashboard
          tasks={tasks}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onEditTask={(task) => setEditingTask(task)}
          onUpdateStatus={(taskId, status) =>
            updateTaskStatusMutation.mutate({ taskId, status })
          }
          onDeleteTask={deleteTask}
        />
      </div>

      {isCreateTaskOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={(title, priority) => {
            createTaskMutation.mutate(
              { title, priority },
              {
                onSuccess: () => {
                  setIsCreateTaskOpen(false);
                },
              },
            );
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={(taskId, updates) => {
            updateTaskMutation.mutate(
              {
                taskId,
                title: updates.title ?? editingTask.title,
                priority: updates.priority ?? editingTask.priority,
              },
              {
                onSuccess: () => {
                  setEditingTask(null);
                },
              },
            );
          }}
        />
      )}
    </div>
  );
}

export default App;

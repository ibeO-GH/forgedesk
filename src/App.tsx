import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import CreateTaskModal from "./components/tasks/CreateTaskModal";
import useTasks from "./hooks/useTasks";
import EditTaskModal from "./components/tasks/EditTaskModal";
import type { Task } from "./types/task";

function App() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, createTask, updateTask, updateTaskStatus, deleteTask } =
    useTasks();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onCreateTask={() => setIsCreateTaskOpen(true)} />
        <Dashboard
          tasks={tasks}
          onEditTask={(task) => setEditingTask(task)}
          onUpdateStatus={updateTaskStatus}
          onDeleteTask={deleteTask}
        />
      </div>

      {isCreateTaskOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={createTask}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

export default App;

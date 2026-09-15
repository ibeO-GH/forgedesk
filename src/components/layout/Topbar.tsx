interface TopbarProps {
  onCreateTask: () => void;
}

function Topbar({ onCreateTask }: TopbarProps) {
  return (
    <header className="flex min-h-16 flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Here's what's happening with your workspace.
        </p>
      </div>

      <button
        onClick={onCreateTask}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
      >
        Create Task
      </button>
    </header>
  );
}

export default Topbar;

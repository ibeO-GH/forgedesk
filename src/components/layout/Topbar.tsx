interface TopbarProps {
  onCreateTask: () => void;
}

function Topbar({ onCreateTask }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Here's what's happening with your workspace.
        </p>
      </div>

      <button
        onClick={onCreateTask}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Create Task
      </button>
    </header>
  );
}

export default Topbar;

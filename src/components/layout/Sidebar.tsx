function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-gray-200 bg-white sm:w-64 sm:border-b-0 sm:border-r">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">ForgeDesk</h1>
      </div>

      <nav className="flex flex-row gap-2 overflow-x-auto p-4 sm:flex-1 sm:flex-col sm:space-y-1 ">
        <a
          href="#"
          className="block rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Projects
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Tasks
        </a>
      </nav>

      <div className="border-t border-gray-200 p-4 sm:block">
        <p className="text-sm font-medium text-gray-900">Okorafor Ibe</p>
        <p className="text-xs text-gray-500">Software Engineer</p>
      </div>
    </aside>
  );
}

export default Sidebar;

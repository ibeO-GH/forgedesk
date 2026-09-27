function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white sm:w-64 sm:border-b-0 sm:border-r">
      <div className="flex h-16 items-center border-b border-slate-100 px-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            F
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              ForgeDesk
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Worksapce
            </p>
          </div>
        </div>
      </div>

      <nav
        className="flex flex-row gap-1 overflow-x-auto p-2 sm:flex-1 sm:flex-col sm:gap-1 sm:p-4"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-2 py-2.5 text-xs font-semibold text-white shadow-sm sm:flex-none sm:justify-start sm:gap-3 sm:px-4 sm:text-sm"
          aria-current="page"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs">
            ▦
          </span>
          <span className="truncate">Dashboard</span>
        </a>

        <a
          href="#"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none sm:justify-start sm:gap-3 sm:px-4 sm:text-sm"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs">
            ◫
          </span>
          <span className="truncate">Projects</span>
        </a>

        <a
          href="#"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none sm:justify-start sm:gap-3 sm:px-4 sm:text-sm"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs">
            ✓
          </span>
          <span className="truncate">Tasks</span>
        </a>
      </nav>

      <div className="hidden border-t border-slate-100 p-4 sm:block">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            OI
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              Okorafor Ibe
            </p>
            <p className="truncate text-xs text-slate-500">Software Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/news", label: "Feed Berita" },
  { to: "/watchlist", label: "Watchlist" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#070b12] flex">
      <aside className="w-56 shrink-0 border-r border-[#1a2638] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="h-13 flex items-center gap-2.5 px-5 border-b border-[#1a2638]">
          <div className="flex items-center gap-1">
            <span className="text-[#38bdf8] font-semibold text-sm tracking-wide">Fare</span>
            <span className="text-[#d4dbe8] font-semibold text-sm tracking-wide">Econ</span>
          </div>
          <span className="text-[11px] text-[#6b7a90] border border-[#1a2638] px-1.5 py-0.5 rounded">
            BETA
          </span>
        </div>

        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-xs rounded transition-colors duration-150 ${
                  isActive
                    ? "text-[#38bdf8] bg-[#38bdf8]/10 font-medium"
                    : "text-[#6b7a90] hover:text-[#d4dbe8] hover:bg-[#1a2638]/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-[#1a2638]">
          <LiveDot />
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function LiveDot() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      <span className="text-[11px] text-[#6b7a90]">LIVE</span>
    </div>
  );
}

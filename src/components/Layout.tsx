import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/news", label: "Feed Berita" },
  { to: "/watchlist", label: "Watchlist" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#070b12] flex flex-col">
      <header className="border-b border-[#1a2638] bg-[#070b12] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 h-13 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <span className="text-[#38bdf8] font-semibold text-sm tracking-wide">Fare</span>
                <span className="text-[#d4dbe8] font-semibold text-sm tracking-wide">Econ</span>
              </div>
              <span className="text-[10px] text-[#6b7a90] border border-[#1a2638] px-1.5 py-0.5 rounded font-mono">
                BETA
              </span>
            </div>
            <div className="w-px h-4 bg-[#1a2638]" />
            <span className="text-[11px] text-[#6b7a90]">
              Indonesia Market Monitor
            </span>
          </div>

          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs transition-colors duration-150 rounded ${
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

          <LiveDot />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-[#1a2638] py-3">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <span className="text-[11px] text-[#6b7a90]">
            FareEcon — Data diperbarui otomatis dari Firestore
          </span>
          <span className="text-[11px] text-[#6b7a90]">
            Bukan saran investasi
          </span>
        </div>
      </footer>
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
      <span className="text-[10px] font-mono text-[#6b7a90]">LIVE</span>
    </div>
  );
}

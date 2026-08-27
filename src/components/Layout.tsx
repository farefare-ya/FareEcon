import { useEffect, useState } from "react";
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
        <div className="h-16 flex items-center px-5 border-b border-[#1a2638]">
          <span className="text-[#d4dbe8] font-semibold text-base tracking-tight">
            FareEcon
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
          <ClockDisplay />
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

// Jam berjalan — gantikan indikator "LIVE" yang ambigu (data di-update
// berkala tiap 30 menit/harian lewat cron, bukan real-time streaming, jadi
// label "LIVE" sebenarnya kurang akurat). Jam ini kasih referensi waktu
// yang jelas dan jujur ke user, sekaligus jadi elemen yang terasa hidup.
function ClockDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      <div className="text-xs text-[#d4dbe8] font-medium">{time}</div>
      <div className="text-[11px] text-[#6b7a90] mt-0.5">{date} WIB</div>
    </div>
  );
}

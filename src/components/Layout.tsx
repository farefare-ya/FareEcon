import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Newspaper, Star } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/news", label: "Feed Berita", icon: Newspaper },
  { to: "/watchlist", label: "Watchlist", icon: Star },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#070b12] flex flex-col md:flex-row">
      {/* Top bar — cuma tampil di mobile/tablet (di bawah breakpoint md) */}
      <div className="md:hidden h-14 shrink-0 flex items-center justify-between px-4 border-b border-[#1a2638] sticky top-0 bg-[#070b12] z-20">
        <span className="text-[#d4dbe8] font-semibold text-base tracking-tight">
          FareEcon
        </span>
        <ClockDisplay compact />
      </div>

      {/* Sidebar — cuma tampil di desktop (md ke atas) */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-[#1a2638] flex-col sticky top-0 h-screen overflow-y-auto">
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

      {/* Konten utama — padding lebih kecil di mobile, dan dikasih jarak
          bawah (pb-20) supaya gak ketutup bottom tab bar */}
      <main className="flex-1 min-w-0 px-4 py-4 pb-20 md:px-6 md:py-6 md:pb-6">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom tab bar — cuma tampil di mobile/tablet */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#1a2638] bg-[#070b12] flex items-stretch z-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-150 ${
                  isActive ? "text-[#38bdf8]" : "text-[#6b7a90]"
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

// Jam berjalan — gantikan indikator "LIVE" yang ambigu (data di-update
// berkala tiap 30 menit/harian lewat cron, bukan real-time streaming, jadi
// label "LIVE" sebenarnya kurang akurat). Jam ini kasih referensi waktu
// yang jelas dan jujur ke user, sekaligus jadi elemen yang terasa hidup.
function ClockDisplay({ compact = false }: { compact?: boolean }) {
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
    second: compact ? undefined : "2-digit",
  });

  if (compact) {
    return <div className="text-xs text-[#6b7a90] font-medium">{time}</div>;
  }

  return (
    <div>
      <div className="text-xs text-[#d4dbe8] font-medium">{time}</div>
      <div className="text-[11px] text-[#6b7a90] mt-0.5">{date} WIB</div>
    </div>
  );
}

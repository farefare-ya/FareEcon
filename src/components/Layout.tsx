import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Newspaper, Star, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";

export default function Layout() {
  const { t } = useLanguage();
  const navItems = [
    { to: "/", label: t.nav.dashboard, icon: LayoutDashboard },
    { to: "/news", label: t.nav.newsFeed, icon: Newspaper },
    { to: "/watchlist", label: t.nav.watchlist, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Top bar — cuma tampil di mobile/tablet (di bawah breakpoint md) */}
      <div className="md:hidden h-14 shrink-0 flex items-center justify-between px-4 border-b border-border sticky top-0 bg-background z-20">
        <span className="text-foreground font-semibold text-base tracking-tight">
          FareEcon
        </span>
        <div className="flex items-center gap-1">
          <ClockDisplay compact />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Sidebar — cuma tampil di desktop (md ke atas) */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <span className="text-foreground font-semibold text-base tracking-tight">
            FareEcon
          </span>
          <div className="flex items-center gap-0.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
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
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-border/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-border">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background flex items-stretch z-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-150 ${
                  isActive ? "text-accent" : "text-muted-foreground"
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

// Tombol ganti tema gelap/terang — preferensi disimpan otomatis (localStorage),
// jadi gak perlu dipilih ulang tiap buka app lagi.
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      className="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors duration-150"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

// Tombol ganti bahasa UI (ID/EN) — cuma teks antarmuka, bukan konten berita
// (yang tetap Bahasa Indonesia karena memang dihasilkan AI dalam bahasa itu).
function LanguageToggle() {
  const { toggleLang, t } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      aria-label={t.lang.switch}
      title={t.lang.switch}
      className="w-8 h-8 flex items-center justify-center gap-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors duration-150"
    >
      <Languages size={16} />
    </button>
  );
}

// Jam berjalan — gantikan indikator "LIVE" yang ambigu (data di-update
// berkala tiap 30 menit/harian lewat cron, bukan real-time streaming, jadi
// label "LIVE" sebenarnya kurang akurat). Jam ini kasih referensi waktu
// yang jelas dan jujur ke user, sekaligus jadi elemen yang terasa hidup.
function ClockDisplay({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(new Date());
  const { lang } = useLanguage();
  const locale = lang === "id" ? "id-ID" : "en-US";

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: compact ? undefined : "2-digit",
  });

  if (compact) {
    return <div className="text-xs text-muted-foreground font-medium">{time}</div>;
  }

  return (
    <div>
      <div className="text-xs text-foreground font-medium">{time}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{date} WIB</div>
    </div>
  );
}

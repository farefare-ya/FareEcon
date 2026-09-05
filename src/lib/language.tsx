import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import dict, { type Lang, type Translations } from "./i18n";
import { INSTRUMENT_IDS, CATEGORY_IDS, type InstrumentId, type Category } from "./types";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "fareecon-lang";

function getInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "id" || saved === "en") return saved;
  // Belum pernah pilih -> tebak dari bahasa browser, default Indonesia
  const browserLang = navigator.language?.toLowerCase() ?? "";
  return browserLang.startsWith("id") ? "id" : browserLang.startsWith("en") ? "en" : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "id" ? "en" : "id"));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage harus dipakai di dalam LanguageProvider");
  return ctx;
}

// Daftar instrumen dengan label & deskripsi sesuai bahasa aktif saat ini.
export function useInstrumentsList(): { id: InstrumentId; label: string; description: string }[] {
  const { t } = useLanguage();
  return INSTRUMENT_IDS.map((id) => ({ id, ...t.instruments[id] }));
}

// Cari 1 instrumen by id, dengan label sesuai bahasa aktif.
export function useInstrumentMeta(id: InstrumentId | undefined) {
  const list = useInstrumentsList();
  return list.find((i) => i.id === id);
}

// Daftar kategori dengan label sesuai bahasa aktif saat ini.
export function useCategoriesList(): { id: Category; label: string }[] {
  const { t } = useLanguage();
  return CATEGORY_IDS.map((id) => ({ id, label: t.categories[id] }));
}

// Cari label 1 kategori by id, dengan bahasa aktif.
export function useCategoryLabel(id: Category | undefined): string {
  const { t } = useLanguage();
  if (!id) return "";
  return t.categories[id] ?? id;
}

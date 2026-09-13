import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface TermsContextValue {
  agreed: boolean;
  modalOpen: boolean;
  openModal: () => void;
  // Cuma bisa menutup modal kalau sudah pernah setuju sebelumnya —
  // sebelum setuju, modal ini wajib diselesaikan (blocking gate).
  closeModal: () => void;
  agree: () => void;
}

const TermsContext = createContext<TermsContextValue | null>(null);

const STORAGE_KEY = "fareecon-tnc-agreed";

export function TermsProvider({ children }: { children: ReactNode }) {
  const [agreed, setAgreed] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) === "true");
  // Belum pernah setuju -> modal otomatis terbuka sejak awal (blocking).
  const [modalOpen, setModalOpen] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) !== "true");

  // Kunci scroll body selama modal terbuka, baik saat blocking maupun saat
  // dibuka manual lewat link "Syarat & Ketentuan".
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const agree = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAgreed(true);
    setModalOpen(false);
  };

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    if (agreed) setModalOpen(false);
    // Kalau belum setuju, panggilan ini sengaja diabaikan -> modal tetap terkunci.
  };

  return (
    <TermsContext.Provider value={{ agreed, modalOpen, openModal, closeModal, agree }}>
      {children}
    </TermsContext.Provider>
  );
}

export function useTerms() {
  const ctx = useContext(TermsContext);
  if (!ctx) throw new Error("useTerms harus dipakai di dalam TermsProvider");
  return ctx;
}

import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useTerms } from "@/lib/terms";
import { useLanguage } from "@/lib/language";

export default function TermsModal() {
  const { agreed, modalOpen, closeModal, agree } = useTerms();
  const { t } = useLanguage();

  // Escape cuma boleh nutup modal kalau sudah pernah setuju sebelumnya
  // (sesi "lihat lagi"). Selama belum setuju, modal ini tidak bisa
  // dilewati lewat Escape ataupun klik di luar area modal.
  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && agreed) closeModal();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, agreed, closeModal]);

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      onClick={() => closeModal()}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-border bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-1">
          <ShieldAlert size={22} className="text-accent shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <h2 id="terms-modal-title" className="text-lg font-semibold text-foreground leading-tight">
              {t.terms.modalTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">{t.terms.subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-foreground leading-relaxed mt-4 mb-4">{t.terms.intro}</p>

        <ol className="space-y-3 mb-5">
          {t.terms.points.map((point, i) => (
            <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2.5">
              <span className="text-accent font-semibold shrink-0">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ol>

        <div className="rounded border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] px-3 py-2.5 mb-5">
          <p className="text-xs text-[var(--risk-high-text)] leading-relaxed font-medium">
            {t.terms.warning}
          </p>
        </div>

        <div className="flex justify-end">
          {agreed ? (
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm rounded border border-border text-foreground hover:bg-border/50 transition-colors duration-150"
            >
              {t.terms.closeButton}
            </button>
          ) : (
            <button
              type="button"
              onClick={agree}
              className="px-4 py-2 text-sm rounded bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity duration-150"
            >
              {t.terms.agreeButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

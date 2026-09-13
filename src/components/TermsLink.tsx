import { useTerms } from "@/lib/terms";
import { useLanguage } from "@/lib/language";

// Link permanen untuk membuka kembali Syarat & Ketentuan kapan saja,
// bahkan setelah pernah disetujui. Warna biru (token --accent) dipakai
// konsisten sebagai penanda visual link, sesuai tema terang/gelap.
export default function TermsLink({ className = "" }: { className?: string }) {
  const { openModal } = useTerms();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={openModal}
      className={`text-accent hover:text-[var(--accent-hover)] hover:underline underline-offset-2 transition-colors duration-150 text-left ${className}`}
    >
      {t.terms.linkLabel}
    </button>
  );
}

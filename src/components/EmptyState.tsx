interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Belum ada data",
  description = "Tunggu sinkronisasi pertama dari crawler. Data akan muncul otomatis setelah job pertama selesai.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-8 h-8 rounded-full border border-border mb-4 mx-auto opacity-40" />
      <p className="text-sm font-medium text-foreground mb-2">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}

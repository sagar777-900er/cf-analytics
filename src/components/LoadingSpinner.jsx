export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--color-border)]" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-[var(--color-accent)] animate-spin" />
      </div>
      <p className="text-[var(--color-text-secondary)] text-sm font-medium tracking-wide">
        Analyzing profile...
      </p>
    </div>
  );
}

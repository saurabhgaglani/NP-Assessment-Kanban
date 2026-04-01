export default function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-border rounded-card p-3.5 space-y-2.5">
      <div className="h-3.5 rounded-full shimmer-bg animate-shimmer w-4/5" />
      <div className="h-3 rounded-full shimmer-bg animate-shimmer w-1/2" />
    </div>
  );
}

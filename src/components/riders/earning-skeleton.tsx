export default function EarningsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-muted p-4 space-y-2">
            <div className="h-3 w-24 rounded bg-muted-foreground/20" />
            <div className="h-7 w-20 rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border p-4 space-y-3" style={{ background: "#ffffff" }}>
        <div className="h-3 w-28 rounded bg-muted-foreground/20" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-t border-border">
            <div className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-muted-foreground/20" />
              <div className="h-2.5 w-20 rounded bg-muted-foreground/10" />
            </div>
            <div className="h-3 w-16 rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
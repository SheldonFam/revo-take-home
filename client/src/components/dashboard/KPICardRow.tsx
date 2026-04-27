export function KPICardRow() {
  return (
    <div className="col-span-12 grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl border border-border bg-card p-5" />
      ))}
    </div>
  );
}

export function formatSeconds(total: number): string {
  if (total < 60) return `${total}s`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

export function formatPercent(p: number, digits = 0): string {
  return `${(p * 100).toFixed(digits)}%`;
}

export function formatTimeAgo(iso: string, now: Date = new Date()): string {
  const t = new Date(iso).getTime();
  const diffMs = now.getTime() - t;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatTrend(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}%`;
}

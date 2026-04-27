import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function PageActionBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search flow, calls, records" className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-12 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          aria-label="Live status"
          className="flex h-10 w-12 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span className="flex items-center text-base font-mono leading-none tracking-tighter">
            <span aria-hidden>(</span>
            <span aria-hidden className="mx-0.5 inline-block h-1 w-1 rounded-full bg-current" />
            <span aria-hidden>)</span>
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-semibold text-white">
            TD
          </div>
          <div className="hidden text-left md:block">
            <div className="text-sm font-semibold leading-tight">Tasha Dervin</div>
            <div className="text-xs leading-tight text-muted-foreground">
              t.dervin@revolab.ai
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

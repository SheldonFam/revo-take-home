import { NavLink } from 'react-router-dom';
import { Search, Share2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TABS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workflow', label: 'Workflows' },
  { to: '/knowledge', label: 'Knowledge' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/test', label: 'Test' },
] as const;

export function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <nav className="flex items-center gap-1">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border border-border bg-card text-foreground shadow-sm'
                  : 'border border-transparent text-muted-foreground hover:text-foreground',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          <span>Publish</span>
        </Button>
      </div>
    </header>
  );
}

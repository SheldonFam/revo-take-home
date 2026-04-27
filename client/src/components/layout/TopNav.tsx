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
  { to: '/tool', label: 'Tool' },
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
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          <span>Publish</span>
        </Button>
        <div className="ml-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            TD
          </div>
          <div className="hidden text-right md:block">
            <div className="text-xs font-medium leading-tight">Tasha Dervis</div>
            <div className="text-[10px] leading-tight text-muted-foreground">tasha@revolab.ai</div>
          </div>
        </div>
      </div>
    </header>
  );
}

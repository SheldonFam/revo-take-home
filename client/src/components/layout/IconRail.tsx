import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Workflow as WorkflowIcon,
  BookOpen,
  Plug,
  BarChart3,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  icon: LucideIcon;
  label: string;
  to: string;
}

const ITEMS: NavItem[] = [
  { icon: LayoutGrid,   label: 'Dashboard',    to: '/dashboard' },
  { icon: WorkflowIcon, label: 'Workflows',    to: '/workflow' },
  { icon: BookOpen,     label: 'Knowledge',    to: '/knowledge' },
  { icon: Plug,         label: 'Integrations', to: '/integrations' },
  { icon: BarChart3,    label: 'Analytics',    to: '/analytics' },
  { icon: Wrench,       label: 'Test',         to: '/test' },
];

interface IconRailProps {
  expanded: boolean;
  onToggle: () => void;
}

export function IconRail({ expanded, onToggle }: IconRailProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <aside className="row-span-2 flex flex-col gap-1 overflow-hidden border-r border-border bg-card py-3">
        <div className={cn('mb-2 flex items-center', expanded ? 'px-3' : 'justify-center')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            R
          </div>
          {expanded ? (
            <span className="ml-2 truncate text-sm font-semibold text-foreground">Revolab</span>
          ) : null}
        </div>
        {ITEMS.map((item) => (
          <RailItem key={item.label} item={item} expanded={expanded} />
        ))}
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'mt-auto flex h-10 items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            expanded ? 'mx-2 gap-2 px-2' : 'mx-auto w-10 justify-center',
          )}
        >
          {expanded ? (
            <>
              <PanelLeftClose className="h-5 w-5 shrink-0" />
              <span className="truncate text-sm">Collapse</span>
            </>
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}

interface RailItemProps {
  item: NavItem;
  expanded: boolean;
}

function RailItem({ item, expanded }: RailItemProps) {
  const { icon: Icon, label, to } = item;
  const baseClasses = cn(
    'flex h-10 items-center rounded-lg transition-colors',
    'text-muted-foreground hover:bg-muted hover:text-foreground',
    'aria-[current=page]:bg-muted aria-[current=page]:text-foreground',
  );

  if (expanded) {
    return (
      <NavLink to={to} aria-label={label} className={cn('mx-2 gap-2 px-2', baseClasses)}>
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </NavLink>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={to}
          aria-label={label}
          className={cn('mx-auto w-10 justify-center', baseClasses)}
        >
          <Icon className="h-5 w-5" />
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

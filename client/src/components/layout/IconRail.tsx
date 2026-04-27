import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Workflow as WorkflowIcon,
  BookOpen,
  Plug,
  BarChart3,
  Wrench,
  Settings,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: WorkflowIcon, label: 'Workflows' },
  { icon: BookOpen, label: 'Knowledge' },
  { icon: Plug, label: 'Integrations' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Wrench, label: 'Tool' },
  { icon: Settings, label: 'Settings' },
] as const;

export function IconRail() {
  return (
    <TooltipProvider delayDuration={150}>
      <aside className="row-span-2 flex w-14 flex-col items-center gap-1 border-r border-border bg-card py-3">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          R
        </div>
        {ITEMS.map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={label}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground',
                  'hover:bg-muted hover:text-foreground transition-colors',
                )}
              >
                <Icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </aside>
    </TooltipProvider>
  );
}

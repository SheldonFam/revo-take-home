import { Activity, Phone, Users } from 'lucide-react';
import { toast } from 'sonner';
import { CardShell } from './CardShell';

const ACTIONS = [
  {
    icon: Phone,
    label: 'New call flow',
    blurb: 'Coming soon — start from Workflows.',
    iconClass: 'text-sky-400',
  },
  {
    icon: Users,
    label: 'Add AI agent',
    blurb: 'Coming soon.',
    iconClass: 'text-pink-400',
  },
  {
    icon: Activity,
    label: 'View analytics',
    blurb: 'Coming soon.',
    iconClass: 'text-emerald-400',
  },
] as const;

export function QuickActionsCard() {
  return (
    <CardShell title="Quick Actions" className="col-span-3">
      <div className="space-y-2">
        {ACTIONS.map(({ icon: Icon, label, blurb, iconClass }) => (
          <button
            key={label}
            type="button"
            onClick={() => toast.info(label, { description: blurb })}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Icon className={`h-4 w-4 ${iconClass}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </CardShell>
  );
}

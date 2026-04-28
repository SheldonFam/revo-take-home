import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  PhoneOff,
  UserCheck,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from '@/stores/workflow';
import type { Outcome, Step, Workflow } from '@/types';
import { nodeVisual } from './nodeIcon';

const TABS = ['Purpose', 'Behavior', 'Rules', 'Resources'] as const;
type Tab = (typeof TABS)[number];

export function NodePanel() {
  const workflow = useWorkflowStore((s) => s.workflow);
  const selectedStepId = useWorkflowStore((s) => s.selectedStepId);
  const closePanel = useWorkflowStore((s) => s.closePanel);

  const step = useMemo(
    () => (workflow && selectedStepId ? workflow.steps.find((s) => s.id === selectedStepId) : null),
    [workflow, selectedStepId],
  );

  const open = Boolean(step);

  return (
    <aside
      aria-hidden={!open}
      className={cn(
        'absolute right-0 top-0 z-10 flex h-full w-[360px] flex-col border-l border-border bg-card shadow-xl transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      )}
    >
      {step && workflow ? (
        <PanelBody step={step} workflow={workflow} onClose={closePanel} />
      ) : null}
    </aside>
  );
}

interface PanelBodyProps {
  step: Step;
  workflow: Workflow;
  onClose: () => void;
}

function PanelBody({ step, workflow, onClose }: PanelBodyProps) {
  return (
    <Tabs key={step.id} defaultValue="Purpose" className="flex h-full flex-col">
      <PanelHeader step={step} onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <TabsContent value="Purpose" className="mt-0">
          <PurposeTab step={step} workflow={workflow} />
        </TabsContent>
        {TABS.filter((t) => t !== 'Purpose').map((t) => (
          <TabsContent key={t} value={t} className="mt-0">
            <InertTab tab={t} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

interface PanelHeaderProps {
  step: Step;
  onClose: () => void;
}

function PanelHeader({ step, onClose }: PanelHeaderProps) {
  const { Icon } = nodeVisual(step);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#E879F9] text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <h2 className="truncate text-lg font-bold text-foreground">{step.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <Separator />
      <TabsList className="h-auto w-full justify-start gap-5 rounded-none border-b border-border bg-transparent px-5 pb-0 pt-3">
        {TABS.map((t) => (
          <TabsTrigger
            key={t}
            value={t}
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

interface PurposeTabProps {
  step: Step;
  workflow: Workflow;
}

function PurposeTab({ step, workflow }: PurposeTabProps) {
  const destinations = useMemo(
    () =>
      step.connections
        .map((id) => workflow.steps.find((s) => s.id === id))
        .filter((s): s is Step => Boolean(s)),
    [step, workflow],
  );

  return (
    <div className="space-y-5">
      <Section label="Step name">
        <StepNameField key={step.id} stepId={step.id} value={step.title} />
      </Section>

      <Section label="What this step is responsible for">
        <DescriptionField key={step.id} stepId={step.id} value={step.description} />
      </Section>

      {step.primaryOutcome ? (
        <Section label="Primary outcome">
          <OutcomeRow outcome={step.primaryOutcome} />
        </Section>
      ) : null}

      {step.secondaryOutcome ? (
        <Section label="Secondary outcome">
          <OutcomeRow outcome={step.secondaryOutcome} />
        </Section>
      ) : null}

      {destinations.length > 0 ? (
        <Section label="Connected to">
          <div className="grid grid-cols-2 gap-2">
            {destinations.map((dest) => (
              <ConnectedChip key={dest.id} step={dest} />
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

function InertTab({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <div className="text-sm font-medium text-foreground">{tab}</div>
      <div className="text-xs text-muted-foreground">
        {tab} configuration is coming soon.
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

interface StepFieldProps {
  stepId: string;
  value: string;
}

function StepNameField({ stepId, value }: StepFieldProps) {
  const updateStep = useWorkflowStore((s) => s.updateStep);
  const [draft, setDraft] = useState(value);

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) void updateStep(stepId, { title: draft });
      }}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40"
    />
  );
}

function DescriptionField({ stepId, value }: StepFieldProps) {
  const updateStep = useWorkflowStore((s) => s.updateStep);
  const [draft, setDraft] = useState(value);

  return (
    <Textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) void updateStep(stepId, { description: draft });
      }}
      rows={3}
      className="min-h-0 resize-none text-sm leading-relaxed [field-sizing:content] focus-visible:border-primary focus-visible:ring-primary/40"
    />
  );
}

const OUTCOME_ICONS: Record<string, { Icon: LucideIcon; tone: string }> = {
  PhoneOff:     { Icon: PhoneOff,     tone: 'bg-pink-500/15 text-pink-400' },
  UserPlus:     { Icon: UserPlus,     tone: 'bg-emerald-500/15 text-emerald-400' },
  UserCheck:    { Icon: UserCheck,    tone: 'bg-emerald-500/15 text-emerald-400' },
  CheckCircle2: { Icon: CheckCircle2, tone: 'bg-emerald-500/15 text-emerald-400' },
  AlertCircle:  { Icon: AlertCircle,  tone: 'bg-amber-500/15 text-amber-400' },
  ArrowRight:   { Icon: ArrowRight,   tone: 'bg-primary/15 text-primary' },
};

function OutcomeRow({ outcome }: { outcome: Outcome }) {
  const visual = OUTCOME_ICONS[outcome.icon] ?? OUTCOME_ICONS.ArrowRight!;
  const { Icon, tone } = visual;
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-sm">
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
          tone,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="truncate text-foreground">{outcome.label}</span>
    </div>
  );
}

function ConnectedChip({ step }: { step: Step }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground">
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{step.title}</span>
    </span>
  );
}

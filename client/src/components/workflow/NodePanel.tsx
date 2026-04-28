import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
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
  const [tab, setTab] = useState<Tab>('Purpose');

  return (
    <>
      <PanelHeader step={step} tab={tab} onTabChange={setTab} onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === 'Purpose' ? <PurposeTab step={step} workflow={workflow} /> : <InertTab tab={tab} />}
      </div>
    </>
  );
}

interface PanelHeaderProps {
  step: Step;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onClose: () => void;
}

function PanelHeader({ step, tab, onTabChange, onClose }: PanelHeaderProps) {
  const { Icon, tone } = nodeVisual(step);
  return (
    <div className="border-b border-border">
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', tone)}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h2 className="truncate text-base font-semibold text-foreground">{step.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="mt-3 flex gap-5 px-5">
        {TABS.map((t) => {
          const active = t === tab;
          const enabled = t === 'Purpose';
          return (
            <button
              key={t}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && onTabChange(t)}
              className={cn(
                'relative pb-2 text-sm transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground',
                enabled ? 'cursor-pointer hover:text-foreground' : 'cursor-not-allowed opacity-60',
              )}
            >
              {t}
              {active ? (
                <span className="absolute inset-x-1.5 -bottom-px h-0.5 rounded-full bg-primary" />
              ) : null}
            </button>
          );
        })}
      </nav>
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
          <OutcomeRow outcome={step.primaryOutcome} tone="primary" />
        </Section>
      ) : null}

      {step.secondaryOutcome ? (
        <Section label="Secondary outcome">
          <OutcomeRow outcome={step.secondaryOutcome} tone="muted" />
        </Section>
      ) : null}

      {destinations.length > 0 ? (
        <Section label="Connected to">
          <div className="flex flex-wrap gap-2">
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
    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {tab} configuration is not available in this prototype.
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
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };
    fit();
    // Re-fit after web fonts settle — text metrics differ from the fallback.
    void document.fonts?.ready.then(fit);
  }, [draft]);

  return (
    <textarea
      ref={ref}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) void updateStep(stepId, { description: draft });
      }}
      rows={3}
      className="-mx-1 w-[calc(100%+0.5rem)] resize-none rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm leading-relaxed text-foreground outline-none transition-colors hover:border-border/60 focus:border-primary focus:bg-background focus:px-3 focus:py-2 focus:ring-1 focus:ring-primary/40"
    />
  );
}

function OutcomeRow({ outcome, tone }: { outcome: Outcome; tone: 'primary' | 'muted' }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full',
          tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <ArrowRight className="h-3 w-3" />
      </span>
      <span className="text-foreground">{outcome.label}</span>
    </div>
  );
}

function ConnectedChip({ step }: { step: Step }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
      <ArrowRight className="h-3 w-3 text-primary" />
      {step.title}
    </span>
  );
}

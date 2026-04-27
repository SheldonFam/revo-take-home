export type StepKind = 'trigger' | 'process' | 'terminal';

export interface Outcome {
  label: string;
  icon: string;
}

export interface Step {
  id: string;
  kind: StepKind;
  title: string;
  description: string;
  position: { x: number; y: number };
  primaryOutcome: Outcome | null;
  secondaryOutcome: Outcome | null;
  connections: string[];
  likes: number;
  dislikes: number;
}

export interface Workflow {
  id: string;
  name: string;
  steps: Step[];
}

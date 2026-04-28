import {
  MessageCircle,
  PhoneCall,
  PhoneOff,
  UserPlus,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Step } from '@/types';

export interface NodeVisual {
  Icon: LucideIcon;
  /** Tailwind classes for the icon tile background + foreground. */
  tone: string;
}

const TONE_PURPLE = 'bg-primary/15 text-primary';
const TONE_BLUE = 'bg-sky-500/15 text-sky-400';
const TONE_AMBER = 'bg-amber-500/15 text-amber-400';
const TONE_GREEN = 'bg-emerald-500/15 text-emerald-400';
const TONE_PINK = 'bg-pink-500/15 text-pink-400';

export function nodeVisual(step: Step): NodeVisual {
  if (step.kind === 'trigger') return { Icon: MessageCircle, tone: TONE_PURPLE };

  switch (step.id) {
    case 'step_qualify':
      return { Icon: Workflow, tone: TONE_PURPLE };
    case 'step_valid':
      return { Icon: PhoneCall, tone: TONE_BLUE };
    case 'step_ineligible':
      return { Icon: PhoneCall, tone: TONE_AMBER };
    case 'step_route_human':
      return { Icon: UserPlus, tone: TONE_GREEN };
    case 'step_close':
      return { Icon: PhoneOff, tone: TONE_PINK };
    default:
      return { Icon: PhoneCall, tone: TONE_PURPLE };
  }
}

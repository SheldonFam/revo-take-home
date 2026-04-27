import { useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Plug, Wrench } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ComingSoon';

const PAGES = {
  '/knowledge': {
    icon: BookOpen,
    title: 'Knowledge',
    blurb: 'Source material your AI agents can pull from.',
  },
  '/integrations': {
    icon: Plug,
    title: 'Integrations',
    blurb: 'Connect Revolab to your existing tools.',
  },
  '/analytics': {
    icon: BarChart3,
    title: 'Analytics',
    blurb: 'Deeper reporting beyond the dashboard.',
  },
  '/test': {
    icon: Wrench,
    title: 'Test',
    blurb: 'Operator utilities and tuning.',
  },
} as const;

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const meta = PAGES[pathname as keyof typeof PAGES];
  if (!meta) return null;
  return <ComingSoon icon={meta.icon} title={meta.title} blurb={meta.blurb} />;
}

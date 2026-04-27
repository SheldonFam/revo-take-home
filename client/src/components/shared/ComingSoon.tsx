import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  blurb?: string;
}

export function ComingSoon({ icon: Icon, title, blurb }: ComingSoonProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {blurb ?? 'This area is intentionally not built for the assessment scope.'}
      </p>
    </div>
  );
}

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { IconRail } from './IconRail';
import { TopNav } from './TopNav';

export function AppShell() {
  const [railExpanded, setRailExpanded] = useState(false);
  const railWidth = railExpanded ? '200px' : '56px';

  return (
    <div
      className="grid h-screen grid-rows-[56px_1fr] bg-background transition-[grid-template-columns] duration-200 ease-out"
      style={{ gridTemplateColumns: `${railWidth} 1fr` }}
    >
      <IconRail expanded={railExpanded} onToggle={() => setRailExpanded((v) => !v)} />
      <TopNav />
      <main className="overflow-auto">
        <Outlet />
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

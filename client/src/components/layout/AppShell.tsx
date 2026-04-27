import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { IconRail } from './IconRail';
import { TopNav } from './TopNav';

export function AppShell() {
  return (
    <div className="grid h-screen grid-cols-[56px_1fr] grid-rows-[56px_1fr] bg-background">
      <IconRail />
      <TopNav />
      <main className="overflow-auto">
        <Outlet />
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

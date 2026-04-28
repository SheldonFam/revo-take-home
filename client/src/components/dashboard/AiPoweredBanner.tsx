import { Play, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function AiPoweredBanner() {
  return (
    <div className="relative col-span-3 flex min-h-[240px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#E879F9] p-5 text-white">
      {/* Decorative orbs — same size, side-by-side bottom-right, left orb slightly higher */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 -right-2 h-36 w-36 rounded-full bg-white/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-16 h-36 w-36 rounded-full bg-white/15"
      />

      <div className="relative">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide opacity-95">
          <Zap className="h-3.5 w-3.5 fill-white" />
          AI Powered
        </div>
        <h3 className="text-xl font-semibold leading-tight">
          Empower your<br />flows with AI
        </h3>
        <p className="mt-3 text-xs leading-relaxed opacity-90">
          Leverage AI to automatically refine prompts and boost conversation performance.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          toast.success('Tour starting soon', {
            description: 'Walkthrough not yet wired up.',
          })
        }
        className="relative mt-auto inline-flex items-center gap-2 self-start rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        <Play className="h-3.5 w-3.5 fill-white" />
        Take a tour
      </button>
    </div>
  );
}

import { PageActionBar } from '@/components/layout/PageActionBar';
import { FlowDistributionCard } from '@/components/dashboard/FlowDistributionCard';
import { CallDistributionCard } from '@/components/dashboard/CallDistributionCard';
import { KPICardRow } from '@/components/dashboard/KPICardRow';
import { LastConversationsCard } from '@/components/dashboard/LastConversationsCard';
import { CallsHandledCard } from '@/components/dashboard/CallsHandledCard';
import { TotalDurationCard } from '@/components/dashboard/TotalDurationCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { AiPoweredBanner } from '@/components/dashboard/AiPoweredBanner';

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 p-6">
      <PageActionBar />

      <div className="grid grid-cols-12 gap-4">
        <FlowDistributionCard />
        <CallDistributionCard />
        <KPICardRow />
        <LastConversationsCard />
        <CallsHandledCard />
        <TotalDurationCard />
        <QuickActionsCard />
        <AiPoweredBanner />
      </div>
    </div>
  );
}

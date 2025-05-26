import { AiSummaryView } from '@/components/ai/ai-summary-view';
import { PageTitle } from '@/components/shared/page-title';
import { mockRequests } from '@/lib/data'; // Using mock data
import type { BloodRequest } from '@/types';

// Fetch active requests (mocked for now)
async function getActiveRequests(): Promise<BloodRequest[]> {
  return mockRequests;
}

export default async function AiSummaryPage() {
  const activeRequests = await getActiveRequests();

  return (
    <div className="container mx-auto py-8">
      <PageTitle 
        title="AI Request Summary" 
        description="Get an AI-generated summary of all active blood requests on the platform." 
      />
      <AiSummaryView activeRequests={activeRequests} />
    </div>
  );
}

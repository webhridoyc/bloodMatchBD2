
import { AiSummaryView } from '@/components/ai/ai-summary-view';
import { PageTitle } from '@/components/shared/page-title';
import { getRequests as fetchRequestsFromDb } from '@/services/requestService'; // Using Firestore service
import type { BloodRequest } from '@/types';

// Fetch active requests from Firestore
async function getActiveRequests(): Promise<BloodRequest[]> {
  try {
    const requests = await fetchRequestsFromDb();
    return requests;
  } catch (error) {
    console.error("Failed to fetch requests for AiSummaryPage:", error);
    return [];
  }
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

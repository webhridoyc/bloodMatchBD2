
import { RequestList } from '@/components/request/request-list';
import { PageTitle } from '@/components/shared/page-title';
import { getRequests as fetchRequestsFromDb } from '@/services/requestService'; // Import Firestore service
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { BloodRequest } from '@/types';

// This page will be a server component fetching data from Firestore
async function getRequestsData(): Promise<BloodRequest[]> {
  try {
    const requests = await fetchRequestsFromDb();
    return requests;
  } catch (error) {
    console.error("Failed to fetch blood requests for RequestsPage:", error);
    // Depending on UI requirements, you might show an error message or an empty state
    return []; 
  }
}

export default async function RequestsPage() {
  const requests = await getRequestsData();

  return (
    <div className="container mx-auto py-8">
      <PageTitle
        title="Active Blood Requests"
        description="View current blood needs. Filters and sorting options are available."
        actions={
          <Link href="/request-blood" passHref>
            <Button variant="default">
              <PlusCircle size={18} className="mr-2" />
              Post a New Request
            </Button>
          </Link>
        }
      />
      <RequestList requests={requests} />
    </div>
  );
}

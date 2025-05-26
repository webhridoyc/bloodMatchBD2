import { RequestList } from '@/components/request/request-list';
import { PageTitle } from '@/components/shared/page-title';
import { mockRequests } from '@/lib/data'; // Using mock data
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

// This page will be a server component fetching data, then passing to client component RequestList
// For now, we use mock data directly.
async function getRequests() {
  // Replace with actual data fetching logic in the future
  return mockRequests;
}

export default async function RequestsPage() {
  const requests = await getRequests();

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

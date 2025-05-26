import { DonorList } from '@/components/donor/donor-list';
import { PageTitle } from '@/components/shared/page-title';
import { mockDonors } from '@/lib/data'; // Using mock data
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

// This page will be a server component fetching data, then passing to client component DonorList
// For now, we use mock data directly.
async function getDonors() {
  // Replace with actual data fetching logic in the future
  return mockDonors;
}

export default async function DonorsPage() {
  const donors = await getDonors();

  return (
    <div className="container mx-auto py-8">
      <PageTitle 
        title="Available Donors" 
        description="Find registered blood donors. Use filters to narrow down your search."
        actions={
          <Link href="/donor-registration" passHref>
            <Button variant="default">
              <PlusCircle size={18} className="mr-2" />
              Register as Donor
            </Button>
          </Link>
        }
      />
      <DonorList donors={donors} />
    </div>
  );
}

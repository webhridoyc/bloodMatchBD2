
import { DonorList } from '@/components/donor/donor-list';
import { PageTitle } from '@/components/shared/page-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getDonors as fetchDonorsFromDb } from '@/services/donorService'; // Import Firestore service
import type { Donor } from '@/types';

// This page will be a server component fetching data from Firestore
async function getDonorsData(): Promise<Donor[]> {
  try {
    const donors = await fetchDonorsFromDb();
    return donors;
  } catch (error) {
    console.error("Failed to fetch donors for DonorsPage:", error);
    return []; // Return empty array or handle error as appropriate for your UI
  }
}

export default async function DonorsPage() {
  const donors = await getDonorsData();

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

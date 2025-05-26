
import { AiMatcherForm } from '@/components/ai/ai-matcher-form';
import { PageTitle } from '@/components/shared/page-title';
import { getDonors as fetchDonorsFromDb } from '@/services/donorService'; // Import Firestore service
import type { Donor } from '@/types';

// Fetch available donors from Firestore
async function getAvailableDonors(): Promise<Donor[]> {
  try {
    const donors = await fetchDonorsFromDb();
    return donors;
  } catch (error) {
    console.error("Failed to fetch donors for AiMatcherPage:", error);
    return [];
  }
}

export default async function AiMatcherPage() {
  const availableDonors = await getAvailableDonors();

  return (
    <div className="container mx-auto py-8">
      <PageTitle 
        title="AI Donor Matcher" 
        description="Let our AI assist you in finding suitable blood donors based on compatibility and location." 
      />
      <AiMatcherForm availableDonors={availableDonors} />
    </div>
  );
}

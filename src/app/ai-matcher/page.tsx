import { AiMatcherForm } from '@/components/ai/ai-matcher-form';
import { PageTitle } from '@/components/shared/page-title';
import { mockDonors } from '@/lib/data'; // Using mock data
import type { Donor } from '@/types';

// Fetch available donors (mocked for now)
async function getAvailableDonors(): Promise<Donor[]> {
  return mockDonors;
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

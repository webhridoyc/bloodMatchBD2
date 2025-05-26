import { HospitalCard } from '@/components/hospital/hospital-card';
import { PageTitle } from '@/components/shared/page-title';
import { mockHospitals } from '@/lib/data'; // Using mock data
import type { Hospital } from '@/types';

// This page will be a server component fetching data.
// For now, we use mock data directly.
async function getHospitals(): Promise<Hospital[]> {
  // Replace with actual data fetching logic in the future
  return mockHospitals;
}

export default async function HospitalsPage() {
  const hospitals = await getHospitals();

  return (
    <div className="container mx-auto py-8">
      <PageTitle 
        title="Hospital Directory" 
        description="A curated list of major hospitals in Bangladesh."
      />
      {hospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No hospitals listed at the moment.</p>
          <p className="text-sm text-muted-foreground">Please check back later for updates.</p>
        </div>
      )}
    </div>
  );
}

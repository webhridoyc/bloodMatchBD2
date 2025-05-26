import { BloodRequestForm } from '@/components/request/blood-request-form';
import { PageTitle } from '@/components/shared/page-title';

export default function RequestBloodPage() {
  return (
    <div className="container mx-auto py-8">
      <PageTitle title="Request Blood" description="If you or someone you know needs blood, please fill out the form below." />
      <BloodRequestForm />
    </div>
  );
}

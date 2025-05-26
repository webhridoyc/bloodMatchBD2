import { DonorRegistrationForm } from '@/components/donor/donor-registration-form';
import { PageTitle } from '@/components/shared/page-title';

export default function DonorRegistrationPage() {
  return (
    <div className="container mx-auto py-8">
      <PageTitle title="Become a Donor" description="Your contribution can save lives. Please fill out the form below to register." />
      <DonorRegistrationForm />
    </div>
  );
}

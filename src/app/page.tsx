
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Users, Search, HandHeart, ListChecks, HospitalIcon, Brain, FileText } from 'lucide-react';
import { PageTitle } from '@/components/shared/page-title';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <PageTitle title={`Welcome to ${APP_NAME}!`} description={APP_DESCRIPTION} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Search size={24} /> Find a Donor
            </CardTitle>
            <CardDescription>Quickly search for available blood donors by blood group and location.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/donors" passHref>
              <Button className="w-full">Browse Donors</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <HandHeart size={24} /> Request Blood
            </CardTitle>
            <CardDescription>Post a blood request and reach out to potential donors in your area.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/request-blood" passHref>
              <Button className="w-full" variant="default">Post a Request</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users size={24} /> Become a Donor
            </CardTitle>
            <CardDescription>Register as a blood donor and save lives. Your contribution matters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/donor-registration" passHref>
              <Button className="w-full" variant="outline">Register Now</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ListChecks size={24} /> View Active Requests
            </CardTitle>
            <CardDescription>Browse all current blood requests from users across different locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/requests" passHref>
              <Button className="w-full" variant="outline">See Requests</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Explore More</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Hospital Directory", href: "/hospitals", icon: HospitalIcon, description: "Find hospitals near you." },
            { title: "AI Matcher", href: "/ai-matcher", icon: Brain, description: "Get AI-powered donor suggestions." },
            { title: "AI Summary", href: "/ai-summary", icon: FileText, description: "Overview of current requests." },
          ].map(item => (
            <Link href={item.href} key={item.title} passHref>
              <Card className="text-center hover:bg-accent/10 transition-colors">
                <CardContent className="p-6">
                  <item.icon className="w-10 h-10 mx-auto mb-2 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

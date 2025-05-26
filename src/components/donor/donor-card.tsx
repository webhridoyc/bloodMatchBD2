import type { Donor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Phone, Droplets } from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <User size={24} /> {donor.name}
          </CardTitle>
          <Badge variant="secondary" className="text-lg">{donor.bloodGroup}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 pt-1">
           <Droplets size={16} className="text-muted-foreground" /> Blood Group
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-muted-foreground" />
          <span>{donor.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-muted-foreground" />
          <a href={`tel:${donor.contact}`} className="hover:underline text-primary">{donor.contact}</a>
        </div>
      </CardContent>
    </Card>
  );
}

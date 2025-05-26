import type { Hospital as HospitalType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HospitalIcon, MapPin, Phone, Link as LinkIcon, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface HospitalCardProps {
  hospital: HospitalType;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {hospital.imageUrl && (
        <div className="relative h-48 w-full">
          <Image 
            src={hospital.imageUrl} 
            alt={hospital.name} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-t-lg"
            data-ai-hint="hospital building"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <HospitalIcon size={24} /> {hospital.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 pt-1">
           <MapPin size={16} className="text-muted-foreground" /> {hospital.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        {hospital.contact && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-muted-foreground" />
            <a href={`tel:${hospital.contact}`} className="hover:underline text-primary">{hospital.contact}</a>
          </div>
        )}
        {hospital.services && hospital.services.length > 0 && (
           <div className="flex items-start gap-2 text-sm">
            <Briefcase size={16} className="text-muted-foreground mt-1" />
            <div>
              <span className="font-medium">Services:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {hospital.services.slice(0, 3).map(service => (
                  <Badge key={service} variant="outline">{service}</Badge>
                ))}
                {hospital.services.length > 3 && <Badge variant="outline">...</Badge>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {hospital.website && (
        <CardFooter>
          <a 
            href={hospital.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            <LinkIcon size={14} /> Visit Website
          </a>
        </CardFooter>
      )}
    </Card>
  );
}

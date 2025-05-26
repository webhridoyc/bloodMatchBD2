import type { BloodRequest } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartHandshake, MapPin, Phone, Clock, Hospital, AlertTriangle, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  request: BloodRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const urgencyVariant = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'default'; // Consider an orange-like variant if primary is red
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
             <HeartHandshake size={24} /> For {request.patientName}
          </CardTitle>
          <Badge variant="secondary" className="text-lg">{request.bloodGroup}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 pt-1">
           <AlertTriangle size={16} className={request.urgency === 'High' ? 'text-destructive' : 'text-muted-foreground'} /> Urgency:
           <Badge variant={urgencyVariant(request.urgency)}>{request.urgency}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-muted-foreground" />
          <span>{request.location}</span>
        </div>
        {request.hospitalName && (
          <div className="flex items-center gap-2 text-sm">
            <Hospital size={16} className="text-muted-foreground" />
            <span>{request.hospitalName}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-muted-foreground" />
          <a href={`tel:${request.contact}`} className="hover:underline text-primary">{request.contact}</a>
        </div>
        {request.notes && (
          <div className="flex items-start gap-2 text-sm pt-1">
            <MessageSquare size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground italic">{request.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Posted {formatDistanceToNow(new Date(request.postedDate), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

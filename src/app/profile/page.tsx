
"use client";

import type { LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Mail, Phone, Fingerprint, Edit3, ChevronDown, ChevronUp, Droplets, CalendarClock, Award, MapPin, ActivityIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (parts[0] && parts[0].length >= 2) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (parts[0]) {
      return parts[0][0].toUpperCase();
    }
  }
  if (email && email.length >= 2) {
    return email.substring(0, 2).toUpperCase();
  }
  if (email && email.length > 0) {
    return email[0].toUpperCase();
  }
  return '??';
};

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number | React.ReactNode;
  valueHref?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, valueHref }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
    <div className="flex-grow">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {valueHref ? (
        <a href={valueHref} className="text-sm text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer">{value}</a>
      ) : (
        typeof value === 'string' || typeof value === 'number' ? <p className="text-sm break-all">{value}</p> : value
      )}
    </div>
  </div>
);


export default function ProfilePage() {
  const { user, logOut, loading: authLoading, loading: userLoading } = useAuth();
  const router = useRouter();
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // Placeholder for additional user profile data (normally fetched from Firestore)
  const userProfileData = {
    bloodGroup: "O+",
    lastDonationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Approx 60 days ago
    totalDonations: 7,
    location: "Gulshan, Dhaka", // This could come from a separate profile record
    availabilityStatus: "Available" as "Available" | "Unavailable", // Example type
  };

  if (userLoading || !user) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = getInitials(user.displayName, user.email);

  return (
    <div className="container mx-auto py-8">
      <PageTitle title="My Profile" />
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View and manage your account details and donation preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-3 pt-2">
            <Avatar className="h-24 w-24 text-3xl border-2 border-primary/50">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User avatar'} data-ai-hint="user avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {user.displayName && (
              <h2 className="text-2xl font-semibold text-primary">{user.displayName}</h2>
            )}
            {!user.displayName && user.email &&(
                <p className="text-lg text-muted-foreground">{user.email}</p>
            )}
          </div>
          
          <Separator />

          <div className="space-y-4 px-2">
            {user.email && <InfoItem icon={Mail} label="Email" value={user.email} valueHref={`mailto:${user.email}`} />}
            {user.phoneNumber && <InfoItem icon={Phone} label="Registered Phone" value={user.phoneNumber} valueHref={`tel:${user.phoneNumber}`} />}
            <InfoItem icon={Fingerprint} label="User ID" value={user.uid} />
          </div>

          <Separator />
          
          <div className="px-2">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              aria-expanded={showMoreDetails}
            >
              <span>{showMoreDetails ? "Show Less" : "Show More"} Details</span>
              {showMoreDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showMoreDetails && (
            <div className="space-y-4 px-2 pt-4 border-t mt-4">
              <InfoItem icon={Droplets} label="Blood Group" value={<Badge variant="secondary" className="text-base">{userProfileData.bloodGroup}</Badge>} />
              <InfoItem icon={CalendarClock} label="Last Donation Date" value={userProfileData.lastDonationDate} />
              <InfoItem icon={Award} label="Total Donations" value={userProfileData.totalDonations} />
              <InfoItem icon={MapPin} label="Primary Location" value={userProfileData.location} />
              <InfoItem 
                icon={ActivityIcon} 
                label="Availability for Donation" 
                value={
                  <Badge variant={userProfileData.availabilityStatus === "Available" ? "default" : "destructive"} className="bg-opacity-20">
                    {userProfileData.availabilityStatus}
                  </Badge>
                } 
              />
               {/* If contact in userProfileData is different or more specific, show it */}
              {userProfileData.location && user.phoneNumber !== userProfileData.location && ( /* Assuming contact is part of location data for now */
                 <InfoItem icon={Phone} label="Preferred Contact (Profile)" value={user.phoneNumber || "Not set"} />
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-3 px-2">
            <Button 
              className="w-full" 
              onClick={() => router.push('/profile/edit')} 
              aria-label="Edit Profile"
            >
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button 
              onClick={logOut} 
              className="w-full" 
              variant="outline" 
              disabled={authLoading}
              aria-label="Logout"
            >
              {authLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging out...</>
              ) : (
                <><LogOut className="mr-2 h-4 w-4" /> Logout</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

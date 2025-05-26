
"use client";

import type { LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut, Mail, Phone, Fingerprint, Edit3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  value: string;
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
        <p className="text-sm break-all">{value}</p>
      )}
    </div>
  </div>
);


export default function ProfilePage() {
  const { user, logOut, loading: authLoading, loading: userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

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
          <CardDescription>View your account details and manage your preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-3 pt-2">
            <Avatar className="h-24 w-24 text-3xl border-2 border-primary/50">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User avatar'} />
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
            {user.phoneNumber && <InfoItem icon={Phone} label="Phone Number" value={user.phoneNumber} valueHref={`tel:${user.phoneNumber}`} />}
            <InfoItem icon={Fingerprint} label="User ID" value={user.uid} />
          </div>

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


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut } from "lucide-react";

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
      <div className="container mx-auto py-8 flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageTitle title="My Profile" />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
          {user.displayName && (
             <div>
                <h3 className="text-sm font-medium text-muted-foreground">Display Name</h3>
                <p className="text-lg">{user.displayName}</p>
            </div>
          )}
          <Button onClick={logOut} className="w-full" variant="outline" disabled={authLoading}>
            {authLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging out...</>
            ) : (
                <><LogOut className="mr-2 h-4 w-4" /> Logout</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

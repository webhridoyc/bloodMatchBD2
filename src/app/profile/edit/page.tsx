
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, XCircle } from "lucide-react";
import { BloodGroupSelect, AvailabilityStatusSelect } from "@/components/shared/form-elements";
import type { BloodGroup, AvailabilityStatus } from "@/types";
import { BLOOD_GROUPS, AVAILABILITY_STATUSES } from "@/lib/constants";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";


// Zod schema for form validation
const formSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  photoURL: z.string().url({ message: "Please enter a valid URL for your photo." }).or(z.literal("")).optional(),
  bloodGroup: z.enum(BLOOD_GROUPS as [BloodGroup, ...BloodGroup[]], {
    required_error: "Blood group is required.",
  }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }).max(100, "Location too long"),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES as [AvailabilityStatus, ...AvailabilityStatus[]], {
    required_error: "Availability status is required.",
  }),
  // phoneNumber: z.string().regex(phoneRegex, { message: "Invalid phone number." }).optional(), // If you want to edit phone
});

// Placeholder for user profile data that would normally come from Firestore
const mockUserProfileData = {
  bloodGroup: "O+" as BloodGroup,
  location: "Gulshan, Dhaka",
  availabilityStatus: "Available" as AvailabilityStatus,
};


export default function EditProfilePage() {
  const { user, loading: authLoading, setLoading: setAuthContextLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      photoURL: "",
      bloodGroup: mockUserProfileData.bloodGroup, // Initial mock
      location: mockUserProfileData.location,     // Initial mock
      availabilityStatus: mockUserProfileData.availabilityStatus, // Initial mock
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        // For now, these are mock. In a real app, fetch from Firestore profile
        bloodGroup: mockUserProfileData.bloodGroup,
        location: mockUserProfileData.location,
        availabilityStatus: mockUserProfileData.availabilityStatus,
      });
    }
  }, [user, authLoading, router, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    setAuthContextLoading(true); // Indicate loading in auth context as well

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { // user is auth.currentUser, non-null asserted due to check
        displayName: values.displayName,
        photoURL: values.photoURL,
      });
      
      // TODO: Implement Firestore update for bloodGroup, location, availabilityStatus
      // For now, we'll just show a success toast for these.
      console.log("Updated Firestore fields (mock):", {
        bloodGroup: values.bloodGroup,
        location: values.location,
        availabilityStatus: values.availabilityStatus,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      router.push("/profile"); // Navigate back to profile page
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: (error as Error).message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setAuthContextLoading(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageTitle title="Edit Profile" description="Update your personal details and preferences." />
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Edit Your Information</CardTitle>
          <CardDescription>Make changes and click "Save Changes" when you're done.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photoURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-photo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <BloodGroupSelect
                      onChange={field.onChange as (value: BloodGroup) => void}
                      value={field.value as BloodGroup}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mirpur, Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability for Donation</FormLabel>
                    <AvailabilityStatusSelect
                      onChange={field.onChange as (value: AvailabilityStatus) => void}
                      value={field.value as AvailabilityStatus}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button type="submit" className="w-full sm:flex-1" disabled={isSubmitting || authLoading}>
                  {isSubmitting || authLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full sm:flex-1" onClick={() => router.push('/profile')}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
               <p className="text-xs text-muted-foreground pt-2">
                Note: Blood group, location, and availability updates are currently for demonstration and will be fully implemented with database integration later. Display name and photo URL are saved to your authentication profile.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

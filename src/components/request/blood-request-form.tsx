
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BloodGroupSelect, UrgencySelect } from "@/components/shared/form-elements";
import type { BloodGroup, UrgencyLevel } from "@/types";
import { useRouter } from "next/navigation";
import { addRequest, type NewRequestData } from "@/services/requestService"; // Import Firestore service
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name must be at least 2 characters." }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood group is required.",
  }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  urgency: z.enum(["High", "Medium", "Low"], {
    required_error: "Urgency level is required.",
  }),
  contact: z.string().regex(phoneRegex, { message: "Invalid contact number." }),
  hospitalName: z.string().optional(),
  notes: z.string().optional(),
});

export function BloodRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Get current user from auth context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      location: "",
      contact: "",
      hospitalName: "", // Ensure optional fields are initialized
      notes: "",       // Ensure optional fields are initialized
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const requestData: NewRequestData = {
        ...values,
        postedDate: new Date().toISOString(),
      };
      await addRequest(requestData);

      toast({
        title: "Request Posted Successfully",
        description: `Your blood request for ${values.patientName} has been posted. Redirecting...`,
      });
      console.log("Request successful, redirecting to /requests");
      router.push('/requests');
    } catch (error: any) { // Use 'any' to access potential 'digest' property
      console.error("Client-side blood request submission error:", error);
      let description = "Could not post request. Please try again.";
      if (error instanceof Error) {
        description = error.message;
        // Check for permission denied error specifically
        if (error.message.toLowerCase().includes("permission denied")) {
          console.log("Permission denied. Current user auth state:", user);
          // This description is already specific enough from the service
          // description = "Permission denied. Please ensure you are logged in and check Firestore security rules.";
        }
      } else if (typeof error === 'string') {
        description = error;
      } else if (typeof error === 'object' && error !== null && 'message'in error && typeof error.message === 'string') {
        description = error.message;
      }

      // If it's a Next.js server action error with a digest
      if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string') {
         description += ` (Server Error Digest: ${error.digest}. Check server logs for details.)`;
      }
      
      toast({
        title: "Request Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Post a Blood Request</CardTitle>
        <CardDescription>Fill in the details for the blood requirement.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Smith" {...field} />
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
                  <FormLabel>Required Blood Group</FormLabel>
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
                  <FormLabel>Location (City/Area)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mirpur, Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level</FormLabel>
                   <UrgencySelect
                    onChange={field.onChange as (value: UrgencyLevel) => void}
                    value={field.value as UrgencyLevel}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number (for coordination)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 01XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dhaka Medical College" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Specific requirements, patient condition" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
              ) : (
                "Post Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

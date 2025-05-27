
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BloodGroupSelect } from "@/components/shared/form-elements";
import type { BloodGroup } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { addDonor, type NewDonorData } from "@/services/donorService";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood group is required.",
  }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  contact: z.string().regex(phoneRegex, { message: "Invalid phone number." }),
});

export function DonorRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const donorData: NewDonorData = { ...values };
      await addDonor(donorData);

      toast({
        title: "Registration Successful",
        description: `Thank you, ${values.name}, for registering as a donor. Redirecting...`,
      });
      console.log("Donor registration successful, redirecting to /donors");
      router.push('/donors');
    } catch (error: any) {
      console.error('Client-side donor registration error:', error);
      let description = "Could not register donor. Please try again.";

      if (error instanceof Error) {
        // Use a more specific message if available and not just a generic fetch error
        if (error.message && !error.message.toLowerCase().includes("failed to fetch") && !error.message.toLowerCase().includes("error reaching server")) {
            description = error.message;
        } else {
            description = "A server communication error occurred. Please check your network and try again. If the problem persists, check server logs.";
        }
      } else if (typeof error === 'string') {
        description = error;
      } else if (error && typeof error.message === 'string') {
        description = error.message;
      } else {
        description = "A server communication error occurred. Please check your network and try again. If the problem persists, check server logs.";
      }

      if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string') {
         description += ` (Server Action Error Digest: ${error.digest}. Check server logs for details.)`;
      }
      
      toast({
        title: "Registration Failed",
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
        <CardTitle>Register as a Blood Donor</CardTitle>
        <CardDescription>Fill in your details to become a lifesaver.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
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
                    <Input placeholder="e.g. Dhaka, Bangladesh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 01XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


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
import { addDonor, type NewDonorData } from "@/services/donorService"; // Import Firestore service
import { Loader2 } from "lucide-react";
import { useState } from "react"; // Import useState

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Add isSubmitting state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
      // bloodGroup will be set by BloodGroupSelect
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set loading true
    try {
      const donorData: NewDonorData = {
        name: values.name,
        bloodGroup: values.bloodGroup,
        location: values.location,
        contact: values.contact,
      };
      await addDonor(donorData);
      
      toast({
        title: "Registration Successful",
        description: `${values.name} has been registered as a donor.`,
      });
      // form.reset(); // Optionally reset form fields
      router.push('/donors'); 
    } catch (error) {
      console.error("Client-side donor registration error:", error);
      let description = "Could not register donor. Please try again.";
      if (error instanceof Error && error.message) {
        description = error.message;
      } else if (typeof error === 'string') {
        // If the error is just a string
        description = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        // If it's an object with a message property
        description = (error as any).message;
      }
      toast({
        title: "Registration Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Set loading false
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

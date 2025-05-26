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
import { BloodGroupSelect, UrgencySelect } from "@/components/shared/form-elements";
import type { BloodGroup, Donor, UrgencyLevel } from "@/types";
import { suggestMatches, SuggestMatchesOutput } from "@/ai/flows/match-suggestions";
import { useState } from "react";
import { Loader2, UserCheck } from "lucide-react";

const formSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Requester's blood group is required.",
  }),
  location: z.string().min(2, { message: "Requester's location must be at least 2 characters." }),
  urgency: z.enum(["High", "Medium", "Low"], {
    required_error: "Urgency level is required.",
  }),
});

interface AiMatcherFormProps {
  availableDonors: Donor[]; // Pass available donors to the component
}

export function AiMatcherForm({ availableDonors }: AiMatcherFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestMatchesOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const donorBloodTypes = availableDonors.map(d => d.bloodGroup);
      const donorLocations = availableDonors.map(d => d.location);

      const result = await suggestMatches({
        bloodType: values.bloodType,
        location: values.location,
        urgency: values.urgency,
        donorBloodTypes,
        donorLocations,
      });
      setSuggestions(result);
      toast({
        title: "Match Suggestions Generated",
        description: "AI has provided potential donor matches.",
      });
    } catch (error) {
      console.error("Error getting AI match suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get AI match suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>AI-Powered Donor Matcher</CardTitle>
          <CardDescription>Enter requester details to find suitable donor matches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requester's Blood Group</FormLabel>
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
                    <FormLabel>Requester's Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dhanmondi, Dhaka" {...field} />
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Get Suggestions"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {suggestions && suggestions.suggestedDonors && suggestions.suggestedDonors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Donors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.suggestedDonors.map((donor, index) => (
              <Card key={index} className="bg-accent/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="text-primary" />
                  <h4 className="font-semibold">Potential Match {index + 1}</h4>
                </div>
                <p><strong>Blood Type:</strong> {donor.bloodType}</p>
                <p><strong>Location:</strong> {donor.location}</p>
                <p><strong>Reason:</strong> {donor.matchReason}</p>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
      {suggestions && suggestions.suggestedDonors && suggestions.suggestedDonors.length === 0 && !isLoading && (
         <Card>
          <CardHeader>
            <CardTitle>No Suggestions Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The AI could not find suitable matches based on the provided criteria and available donors.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

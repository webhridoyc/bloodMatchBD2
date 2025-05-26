"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { summarizeRequests, SummaryOfRequestsOutput } from "@/ai/flows/summary-of-requests";
import type { BloodRequest } from "@/types";
import { Loader2, FileText } from "lucide-react";

interface AiSummaryViewProps {
  activeRequests: BloodRequest[];
}

export function AiSummaryView({ activeRequests }: AiSummaryViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const formattedRequests = activeRequests.map(req => ({
        bloodGroup: req.bloodGroup,
        location: req.location,
        urgency: req.urgency,
        contactInformation: req.contact, // Assuming contact is sufficient for contactInformation
      }));

      if (formattedRequests.length === 0) {
        toast({
          title: "No Requests",
          description: "There are no active requests to summarize.",
        });
        setSummary("No active blood requests to summarize at this time.");
        setIsLoading(false);
        return;
      }

      const result: SummaryOfRequestsOutput = await summarizeRequests({ requests: formattedRequests });
      setSummary(result.summary);
      toast({
        title: "Summary Generated",
        description: "AI has summarized the active blood requests.",
      });
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Automatically generate summary on component mount if there are requests
  useEffect(() => {
    if (activeRequests.length > 0) {
      handleGenerateSummary();
    } else {
      setSummary("No active blood requests to summarize at this time.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Summary of Active Blood Requests</CardTitle>
        <CardDescription>
          An AI-generated overview of current blood needs. Click the button to refresh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading || activeRequests.length === 0} className="w-full sm:w-auto">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Refresh Summary"}
        </Button>
        
        {summary && (
          <Card className="bg-accent/10 p-4">
            <CardHeader className="p-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="text-primary"/> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            </CardContent>
          </Card>
        )}
        {!summary && !isLoading && activeRequests.length > 0 && (
            <p className="text-muted-foreground text-center py-4">Click "Refresh Summary" to generate the overview.</p>
        )}
      </CardContent>
    </Card>
  );
}

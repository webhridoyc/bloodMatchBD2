"use client";

import { useState, useMemo } from 'react';
import type { BloodRequest, BloodGroup, UrgencyLevel } from '@/types';
import { RequestCard } from './request-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOOD_GROUPS, URGENCY_LEVELS } from "@/lib/constants";
import { ListFilter, X, ArrowDownUp } from 'lucide-react';

interface RequestListProps {
  requests: BloodRequest[];
}

type SortOption = "urgency" | "recency";

export function RequestList({ requests: initialRequests }: RequestListProps) {
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | "all">("all");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("urgency");

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = initialRequests.filter(request => {
      const bloodGroupMatch = bloodGroupFilter === "all" || request.bloodGroup === bloodGroupFilter;
      const locationMatch = locationFilter === "" || request.location.toLowerCase().includes(locationFilter.toLowerCase());
      const urgencyMatch = urgencyFilter === "all" || request.urgency === urgencyFilter;
      return bloodGroupMatch && locationMatch && urgencyMatch;
    });

    if (sortOption === "urgency") {
      const urgencyOrder: Record<UrgencyLevel, number> = { High: 1, Medium: 2, Low: 3 };
      filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sortOption === "recency") {
      filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return filtered;
  }, [initialRequests, bloodGroupFilter, locationFilter, urgencyFilter, sortOption]);

  const clearFilters = () => {
    setBloodGroupFilter("all");
    setLocationFilter("");
    setUrgencyFilter("all");
  };

  return (
    <div>
      <div className="mb-6 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="bloodGroupFilterReq" className="block text-sm font-medium mb-1">Blood Group</label>
            <Select value={bloodGroupFilter} onValueChange={(v) => setBloodGroupFilter(v as BloodGroup | "all")}>
              <SelectTrigger id="bloodGroupFilterReq"><SelectValue placeholder="Filter by blood group" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="locationFilterReq" className="block text-sm font-medium mb-1">Location</label>
            <Input id="locationFilterReq" placeholder="Filter by location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
          </div>
          <div>
            <label htmlFor="urgencyFilterReq" className="block text-sm font-medium mb-1">Urgency</label>
            <Select value={urgencyFilter} onValueChange={(v) => setUrgencyFilter(v as UrgencyLevel | "all")}>
              <SelectTrigger id="urgencyFilterReq"><SelectValue placeholder="Filter by urgency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {URGENCY_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <label htmlFor="sortOptionReq" className="block text-sm font-medium mb-1">Sort By</label>
            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger id="sortOptionReq"><SelectValue placeholder="Sort requests" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">Urgency (High to Low)</SelectItem>
                <SelectItem value="recency">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
         <div className="mt-4">
            <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto flex items-center gap-2">
                <X size={16} /> Clear All Filters
            </Button>
         </div>
      </div>

      {filteredAndSortedRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <ListFilter size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No active requests match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}

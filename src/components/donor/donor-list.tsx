"use client";

import { useState, useMemo } from 'react';
import type { Donor, BloodGroup } from '@/types';
import { DonorCard } from './donor-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOOD_GROUPS } from "@/lib/constants";
import { ListFilter, X } from 'lucide-react';

interface DonorListProps {
  donors: Donor[];
}

export function DonorList({ donors }: DonorListProps) {
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | "all">("all");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const bloodGroupMatch = bloodGroupFilter === "all" || donor.bloodGroup === bloodGroupFilter;
      const locationMatch = locationFilter === "" || donor.location.toLowerCase().includes(locationFilter.toLowerCase());
      return bloodGroupMatch && locationMatch;
    });
  }, [donors, bloodGroupFilter, locationFilter]);

  const clearFilters = () => {
    setBloodGroupFilter("all");
    setLocationFilter("");
  };
  
  return (
    <div>
      <div className="mb-6 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="bloodGroupFilter" className="block text-sm font-medium mb-1">Blood Group</label>
            <Select 
              value={bloodGroupFilter} 
              onValueChange={(value) => setBloodGroupFilter(value as BloodGroup | "all")}
            >
              <SelectTrigger id="bloodGroupFilter">
                <SelectValue placeholder="Filter by blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                {BLOOD_GROUPS.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium mb-1">Location</label>
            <Input
              id="locationFilter"
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
            <X size={16} /> Clear Filters
          </Button>
        </div>
      </div>

      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <ListFilter size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No donors match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}

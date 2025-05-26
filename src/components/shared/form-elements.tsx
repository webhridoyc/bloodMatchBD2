
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS, URGENCY_LEVELS, AVAILABILITY_STATUSES } from "@/lib/constants";
import type { BloodGroup, UrgencyLevel, AvailabilityStatus } from "@/types";

interface BloodGroupSelectProps {
  value?: BloodGroup;
  onChange: (value: BloodGroup) => void;
  disabled?: boolean;
}

export function BloodGroupSelect({ value, onChange, disabled }: BloodGroupSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select Blood Group" />
      </SelectTrigger>
      <SelectContent>
        {BLOOD_GROUPS.map((group) => (
          <SelectItem key={group} value={group}>
            {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface UrgencySelectProps {
  value?: UrgencyLevel;
  onChange: (value: UrgencyLevel) => void;
  disabled?: boolean;
}

export function UrgencySelect({ value, onChange, disabled }: UrgencySelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select Urgency" />
      </SelectTrigger>
      <SelectContent>
        {URGENCY_LEVELS.map((level) => (
          <SelectItem key={level} value={level}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface AvailabilityStatusSelectProps {
  value?: AvailabilityStatus;
  onChange: (value: AvailabilityStatus) => void;
  disabled?: boolean;
}

export function AvailabilityStatusSelect({ value, onChange, disabled }: AvailabilityStatusSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select Availability Status" />
      </SelectTrigger>
      <SelectContent>
        {AVAILABILITY_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

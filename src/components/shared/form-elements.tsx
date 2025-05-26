"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS, URGENCY_LEVELS } from "@/lib/constants";
import type { BloodGroup, UrgencyLevel } from "@/types";

interface BloodGroupSelectProps {
  value?: BloodGroup;
  onChange: (value: BloodGroup) => void;
  disabled?: boolean;
}

export function BloodGroupSelect({ value, onChange, disabled }: BloodGroupSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
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
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
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

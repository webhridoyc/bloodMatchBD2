
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type UrgencyLevel = "High" | "Medium" | "Low";

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  location: string;
  contact: string;
  // availability: 'Available' | 'Unavailable'; // Future use
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  location: string;
  urgency: UrgencyLevel;
  contact: string;
  hospitalName?: string;
  postedDate: string; // ISO string for dates
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  contact?: string;
  services?: string[];
  imageUrl?: string;
  website?: string;
}

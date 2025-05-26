
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type UrgencyLevel = "High" | "Medium" | "Low";
export type AvailabilityStatus = "Available" | "Unavailable";

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

// Represents the structure of additional user profile data typically stored in Firestore
export interface UserProfile {
  uid: string; // Corresponds to Firebase Auth UID
  bloodGroup?: BloodGroup;
  location?: string;
  // contactNumber from user.phoneNumber or a separate profile field
  lastDonationDate?: string; // ISO string
  totalDonations?: number;
  availabilityStatus?: AvailabilityStatus;
  // Any other app-specific fields
}

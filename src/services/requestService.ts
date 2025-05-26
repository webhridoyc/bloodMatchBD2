
'use server';

import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { BloodRequest, BloodGroup, UrgencyLevel } from '@/types';
import { BLOOD_GROUPS, URGENCY_LEVELS } from "@/lib/constants"; // Import constants

const requestsCollectionRef = collection(db, 'requests');

export type NewRequestData = {
  patientName: string;
  bloodGroup: BloodGroup;
  location: string;
  urgency: UrgencyLevel;
  contact: string;
  hospitalName?: string;
  notes?: string;
  postedDate: string; // ISO String
};

export async function addRequest(requestData: NewRequestData): Promise<string> {
  try {
    const docRef = await addDoc(requestsCollectionRef, requestData);
    console.log("Blood request added with ID: ", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding blood request to Firestore: ", error);
    if (error.code === 'permission-denied') {
      throw new Error("Failed to post blood request: Permission denied. Please check your Firestore security rules.");
    }
    throw new Error("Failed to post blood request. Please try again.");
  }
}

export async function getRequests(): Promise<BloodRequest[]> {
  try {
    const q = query(requestsCollectionRef, orderBy("postedDate", "desc"));
    const querySnapshot = await getDocs(q);

    const requests = querySnapshot.docs.map(doc => {
      const data = doc.data();

      let validBloodGroup = data.bloodGroup as BloodGroup;
      if (!BLOOD_GROUPS.includes(data.bloodGroup)) {
        console.warn(`Invalid blood group '${data.bloodGroup}' for request ID ${doc.id}. Defaulting to A+.`);
        validBloodGroup = "A+";
      }

      let validUrgency = data.urgency as UrgencyLevel;
      if (!URGENCY_LEVELS.includes(data.urgency)) {
        console.warn(`Invalid urgency level '${data.urgency}' for request ID ${doc.id}. Defaulting to Low.`);
        validUrgency = "Low";
      }

      return {
        id: doc.id,
        patientName: data.patientName || 'N/A',
        bloodGroup: validBloodGroup,
        location: data.location || 'N/A',
        urgency: validUrgency,
        contact: data.contact || 'N/A',
        hospitalName: data.hospitalName,
        postedDate: data.postedDate || new Date().toISOString(),
        notes: data.notes,
      } as BloodRequest;
    });
    return requests;
  } catch (error) {
    console.error("Error fetching blood requests from Firestore in requestService: ", error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

import type { Donor, BloodRequest, Hospital } from '@/types';
import { BLOOD_GROUPS, URGENCY_LEVELS } from './constants';

export const mockDonors: Donor[] = [
  { id: 'DNR001', name: 'Karim Ahmed', bloodGroup: 'A+', location: 'Dhaka', contact: '01712345678' },
  { id: 'DNR002', name: 'Fatima Begum', bloodGroup: 'O-', location: 'Chittagong', contact: '01812345679' },
  { id: 'DNR003', name: 'Rahim Uddin', bloodGroup: 'B+', location: 'Sylhet', contact: '01912345680' },
  { id: 'DNR004', name: 'Ayesha Khanom', bloodGroup: 'AB+', location: 'Dhaka', contact: '01612345681' },
  { id: 'DNR005', name: 'Jamal Hossain', bloodGroup: 'O+', location: 'Rajshahi', contact: '01512345682' },
];

export const mockRequests: BloodRequest[] = [
  { 
    id: 'REQ001', 
    patientName: 'Layla Hasan', 
    bloodGroup: 'O-', 
    location: 'Dhaka', 
    urgency: 'High', 
    contact: '01776543210', 
    hospitalName: 'Dhaka Medical College', 
    postedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    notes: 'Urgent need for surgery.'
  },
  { 
    id: 'REQ002', 
    patientName: 'Rohan Chowdhury', 
    bloodGroup: 'A+', 
    location: 'Chittagong', 
    urgency: 'Medium', 
    contact: '01887654321', 
    hospitalName: 'Chittagong Medical College', 
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  { 
    id: 'REQ003', 
    patientName: 'Saima Akter', 
    bloodGroup: 'B-', 
    location: 'Sylhet', 
    urgency: 'High', 
    contact: '01998765432', 
    hospitalName: 'MAG Osmani Medical College', 
    postedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    notes: 'Accident victim, multiple units required.'
  },
  { 
    id: 'REQ004', 
    patientName: 'Farhan Islam', 
    bloodGroup: 'AB+', 
    location: 'Dhaka', 
    urgency: 'Low', 
    contact: '01665432109', 
    hospitalName: 'Square Hospital', 
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

export const mockHospitals: Hospital[] = [
  { 
    id: 'HOS001', 
    name: 'Dhaka Medical College Hospital', 
    location: 'Dhaka', 
    contact: '+880-2-55165001-10', 
    services: ['Emergency Care', 'Surgery', 'Blood Bank', 'ICU'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'http://dmc.gov.bd/'
  },
  { 
    id: 'HOS002', 
    name: 'Bangabandhu Sheikh Mujib Medical University (BSMMU)', 
    location: 'Dhaka', 
    contact: '+880-2-9661051-56', 
    services: ['Specialized Treatment', 'Research', 'Blood Transfusion Services'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'http://www.bsmmu.edu.bd/'
  },
  { 
    id: 'HOS003', 
    name: 'Square Hospitals Ltd.', 
    location: 'Dhaka', 
    contact: '10616', 
    services: ['Multi-disciplinary Care', 'Modern Diagnostics', '24/7 Pharmacy'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'https://www.squarehospital.com/'
  },
  { 
    id: 'HOS004', 
    name: 'Apollo Hospitals Dhaka (Evercare)', 
    location: 'Dhaka', 
    contact: '10678', 
    services: ['Cardiac Care', 'Oncology', 'Neurosciences', 'Emergency'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'https://www.evercarebd.com/'
  },
  { 
    id: 'HOS005', 
    name: 'Chittagong Medical College Hospital', 
    location: 'Chittagong', 
    contact: '+880-31-630952', 
    services: ['General Hospital', 'Teaching Hospital', 'Blood Bank'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'http://cmc.gov.bd/'
  },
  {
    id: 'HOS006',
    name: 'M.A.G. Osmani Medical College Hospital',
    location: 'Sylhet',
    contact: '+880-821-716766',
    services: ['Tertiary Care', 'Medical Education', 'Emergency Services'],
    imageUrl: 'https://placehold.co/600x400.png',
    website: 'http://magomch.gov.bd/' // Example, actual may vary
  }
];

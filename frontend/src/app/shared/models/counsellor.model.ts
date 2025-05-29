import { User } from './user.model';
import { Topic } from './topic.model';
import { Location } from './location.model';

export interface Counsellor extends User {
  specialization?: string;
  experience?: number;
  qualification?: string;
  qualifications?: string; // For backward compatibility
  languages?: string;
  bio?: string;
  topics?: Topic[];
  locations?: Location[];
  hourlyRate?: number;
  sessionRate?: number; // For backward compatibility
  packageRates?: {
    oneSession: number;
    fiveSession: number;
    tenSession: number;
  };
  availability?: {
    date: Date;
    slots: {
      startTime: string;
      endTime: string;
      isBooked: boolean;
    }[];
  }[];
  rating?: number;
  reviewCount?: number;
  isApproved?: boolean;
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

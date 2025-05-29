import { User } from './user.model';
import { Counsellor } from './counsellor.model';

export interface Session {
  id?: string;
  _id: string;
  user: User | string;
  counsellor: Counsellor | string;
  date: Date | string;
  startTime: string;
  endTime: string;
  duration?: number;
  mode?: 'online' | 'in-person' | 'phone';
  location?: string;
  topic?: string;
  status: 'pending' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  paymentId?: string;
  meetingLink?: string;
  package?: {
    id: string;
    name: string;
    sessions: number;
    price: number;
  };
  feedback?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

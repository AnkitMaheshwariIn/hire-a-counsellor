export interface TimeSlot {
  id?: string;
  counsellorId: string;
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  date?: string; // Optional, used for non-recurring slots
  isBooked?: boolean;
  status?: 'available' | 'booked' | 'unavailable';
}

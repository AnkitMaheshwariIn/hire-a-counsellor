export interface Location {
  _id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

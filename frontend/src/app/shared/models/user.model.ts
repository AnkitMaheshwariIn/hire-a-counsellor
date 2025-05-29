export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'counsellor' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

interface TokenPayload {
  id: string;
  role: UserRole;
}

// Generate JWT token
export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET as string;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.verify(token, secret) as TokenPayload;
};

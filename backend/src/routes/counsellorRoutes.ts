import express from 'express';
import { 
  registerCounsellor, 
  getCounsellorProfile, 
  updateCounsellorProfile, 
  setCounsellorAvailability, 
  getCounsellors, 
  getCounsellorById 
} from '../controllers/counsellorController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getCounsellors);
router.get('/:id', getCounsellorById);

// Protected routes - Counsellor only
router.post('/register', protect, registerCounsellor);
router.get('/profile', protect, authorize(UserRole.COUNSELLOR), getCounsellorProfile);
router.put('/profile', protect, authorize(UserRole.COUNSELLOR), updateCounsellorProfile);
router.put('/availability', protect, authorize(UserRole.COUNSELLOR), setCounsellorAvailability);

export default router;

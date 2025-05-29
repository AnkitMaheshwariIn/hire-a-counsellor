import express from 'express';
import { 
  bookSession, 
  getUserSessions, 
  getCounsellorSessions, 
  markSessionCompleted, 
  cancelSession 
} from '../controllers/sessionController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Protected routes - All authenticated users
router.post('/', protect, bookSession);
router.get('/', protect, getUserSessions);
router.put('/:id/cancel', protect, cancelSession);

// Protected routes - Counsellor only
router.get('/counsellor', protect, authorize(UserRole.COUNSELLOR), getCounsellorSessions);
router.put('/:id/complete', protect, authorize(UserRole.COUNSELLOR), markSessionCompleted);

export default router;

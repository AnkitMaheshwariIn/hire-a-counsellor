import express from 'express';
import { 
  getUsers, 
  getCounsellors, 
  updateCounsellorApproval, 
  updateUserStatus, 
  updateCounsellorStatus, 
  getAllSessions, 
  getDashboardStats 
} from '../controllers/adminController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize(UserRole.ADMIN));

// User management
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

// Counsellor management
router.get('/counsellors', getCounsellors);
router.put('/counsellors/:id/approval', updateCounsellorApproval);
router.put('/counsellors/:id/status', updateCounsellorStatus);

// Session management
router.get('/sessions', getAllSessions);

// Dashboard
router.get('/dashboard', getDashboardStats);

export default router;

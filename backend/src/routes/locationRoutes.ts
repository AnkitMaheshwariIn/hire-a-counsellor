import express from 'express';
import { 
  createLocation, 
  getLocations, 
  getLocation, 
  updateLocation, 
  deleteLocation 
} from '../controllers/locationController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getLocations);
router.get('/:id', getLocation);

// Admin only routes
router.post('/', protect, authorize(UserRole.ADMIN), createLocation);
router.put('/:id', protect, authorize(UserRole.ADMIN), updateLocation);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteLocation);

export default router;

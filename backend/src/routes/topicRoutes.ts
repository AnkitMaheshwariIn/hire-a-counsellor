import express from 'express';
import { 
  createTopic, 
  getTopics, 
  getTopic, 
  updateTopic, 
  deleteTopic 
} from '../controllers/topicController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopic);

// Admin only routes
router.post('/', protect, authorize(UserRole.ADMIN), createTopic);
router.put('/:id', protect, authorize(UserRole.ADMIN), updateTopic);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteTopic);

export default router;

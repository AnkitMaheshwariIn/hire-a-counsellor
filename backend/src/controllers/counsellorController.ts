import { Request, Response } from 'express';
import Counsellor from '../models/Counsellor';
import User, { UserRole } from '../models/User';
import { ErrorResponse } from '../utils/errorHandler';

// @desc    Register as a counsellor
// @route   POST /api/counsellors/register
// @access  Private
export const registerCounsellor = async (req: Request, res: Response) => {
  try {
    const { bio, topics, locations, pricing } = req.body;
    const userId = req.user._id;

    // Check if counsellor profile already exists
    const existingCounsellor = await Counsellor.findOne({ userId });

    if (existingCounsellor) {
      return res.status(400).json({
        success: false,
        message: 'Counsellor profile already exists for this user'
      });
    }

    // Create counsellor profile
    const counsellor = await Counsellor.create({
      userId,
      bio,
      topics,
      locations,
      pricing,
      availability: [],
      approvalStatus: 'pending'
    });

    // Update user role to counsellor
    await User.findByIdAndUpdate(userId, { role: UserRole.COUNSELLOR });

    res.status(201).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get counsellor profile
// @route   GET /api/counsellors/profile
// @access  Private
export const getCounsellorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const counsellor = await Counsellor.findOne({ userId })
      .populate('topics', 'name description')
      .populate('locations', 'city state pincode');

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor profile not found'
      });
    }

    res.json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update counsellor profile
// @route   PUT /api/counsellors/profile
// @access  Private
export const updateCounsellorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { bio, topics, locations, pricing } = req.body;

    const counsellor = await Counsellor.findOne({ userId });

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor profile not found'
      });
    }

    // Update fields
    if (bio) counsellor.bio = bio;
    if (topics) counsellor.topics = topics;
    if (locations) counsellor.locations = locations;
    if (pricing) counsellor.pricing = pricing;

    const updatedCounsellor = await counsellor.save();

    res.json({
      success: true,
      data: updatedCounsellor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Set counsellor availability
// @route   PUT /api/counsellors/availability
// @access  Private
export const setCounsellorAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { availability } = req.body;

    const counsellor = await Counsellor.findOne({ userId });

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor profile not found'
      });
    }

    counsellor.availability = availability;
    const updatedCounsellor = await counsellor.save();

    res.json({
      success: true,
      data: updatedCounsellor.availability
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all counsellors (with filters)
// @route   GET /api/counsellors
// @access  Public
export const getCounsellors = async (req: Request, res: Response) => {
  try {
    const { topic, location, page = 1, limit = 10 } = req.query;
    
    const query: any = { 
      approvalStatus: 'approved',
      status: 'active'
    };
    
    // Apply filters
    if (topic) {
      query.topics = { $in: [topic] };
    }
    
    if (location) {
      query.locations = { $in: [location] };
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const counsellors = await Counsellor.find(query)
      .populate('userId', 'name email')
      .populate('topics', 'name')
      .populate('locations', 'city state pincode')
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 });
    
    const total = await Counsellor.countDocuments(query);
    
    res.json({
      success: true,
      count: counsellors.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: counsellors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single counsellor by ID
// @route   GET /api/counsellors/:id
// @access  Public
export const getCounsellorById = async (req: Request, res: Response) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('topics', 'name description')
      .populate('locations', 'city state pincode');
    
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }
    
    // Only return approved and active counsellors
    if (counsellor.approvalStatus !== 'approved' || counsellor.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found or not available'
      });
    }
    
    res.json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

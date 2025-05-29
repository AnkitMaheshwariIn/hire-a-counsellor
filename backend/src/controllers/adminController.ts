import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import Counsellor from '../models/Counsellor';
import Session from '../models/Session';
import Topic from '../models/Topic';
import Location from '../models/Location';
import { ErrorResponse } from '../utils/errorHandler';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all counsellors with approval status
// @route   GET /api/admin/counsellors
// @access  Private (Admin only)
export const getCounsellors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, approvalStatus } = req.query;
    
    const query: any = {};
    
    // Filter by approval status if provided
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const counsellors = await Counsellor.find(query)
      .populate('userId', 'name email phone')
      .populate('topics', 'name')
      .populate('locations', 'city state pincode')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
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

// @desc    Approve or reject counsellor
// @route   PUT /api/admin/counsellors/:id/approval
// @access  Private (Admin only)
export const updateCounsellorApproval = async (req: Request, res: Response) => {
  try {
    const { approvalStatus } = req.body;
    
    if (!['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status. Must be either "approved" or "rejected"'
      });
    }
    
    const counsellor = await Counsellor.findById(req.params.id);
    
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }
    
    counsellor.approvalStatus = approvalStatus;
    await counsellor.save();
    
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

// @desc    Enable or disable user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent disabling admin users
    if (user.role === UserRole.ADMIN && !status) {
      return res.status(400).json({
        success: false,
        message: 'Cannot disable admin users'
      });
    }
    
    user.status = status;
    await user.save();
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Enable or disable counsellor
// @route   PUT /api/admin/counsellors/:id/status
// @access  Private (Admin only)
export const updateCounsellorStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "active" or "inactive"'
      });
    }
    
    const counsellor = await Counsellor.findById(req.params.id);
    
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }
    
    counsellor.status = status;
    await counsellor.save();
    
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

// @desc    Get all sessions (with filters)
// @route   GET /api/admin/sessions
// @access  Private (Admin only)
export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query: any = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const sessions = await Session.find(query)
      .populate('userId', 'name email phone')
      .populate({
        path: 'counsellorId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Session.countDocuments(query);
    
    res.json({
      success: true,
      count: sessions.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: sessions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const counsellorCount = await Counsellor.countDocuments();
    const pendingCounsellors = await Counsellor.countDocuments({ approvalStatus: 'pending' });
    const sessionCount = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const cancelledSessions = await Session.countDocuments({ status: 'cancelled' });
    
    // Get recent sessions
    const recentSessions = await Session.find()
      .populate('userId', 'name')
      .populate({
        path: 'counsellorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .limit(5)
      .sort({ createdAt: -1 });
    
    // Get recent users
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .limit(5)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        counts: {
          users: userCount,
          counsellors: counsellorCount,
          pendingCounsellors,
          sessions: sessionCount,
          completedSessions,
          cancelledSessions
        },
        recentSessions,
        recentUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

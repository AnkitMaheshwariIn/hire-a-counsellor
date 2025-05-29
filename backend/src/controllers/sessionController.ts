import { Request, Response } from 'express';
import Session from '../models/Session';
import Counsellor from '../models/Counsellor';
import { ErrorResponse } from '../utils/errorHandler';
import { sendEmail } from '../utils/emailService';

// @desc    Book a counselling session
// @route   POST /api/sessions
// @access  Private
export const bookSession = async (req: Request, res: Response) => {
  try {
    const { counsellorId, packageType, bookedSlots } = req.body;
    const userId = req.user._id;

    // Check if counsellor exists and is approved
    const counsellor = await Counsellor.findById(counsellorId);

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }

    if (counsellor.approvalStatus !== 'approved' || counsellor.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Counsellor is not available for booking'
      });
    }

    // Determine total sessions based on package type
    let totalSessions = 1;
    if (packageType === 'five') {
      totalSessions = 5;
    } else if (packageType === 'ten') {
      totalSessions = 10;
    }

    // Validate that the requested slots are available
    const unavailableSlots = [];
    for (const slot of bookedSlots) {
      const isSlotAvailable = counsellor.availability.some(
        availableSlot => 
          availableSlot.date.toISOString().split('T')[0] === new Date(slot.date).toISOString().split('T')[0] &&
          availableSlot.startTime === slot.startTime &&
          availableSlot.endTime === slot.endTime &&
          !availableSlot.isBooked
      );

      if (!isSlotAvailable) {
        unavailableSlots.push(slot);
      }
    }

    if (unavailableSlots.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some of the requested slots are not available',
        unavailableSlots
      });
    }

    // Create session
    const session = await Session.create({
      userId,
      counsellorId,
      packageType,
      totalSessions,
      completedSessions: 0,
      bookedSlots,
      status: 'booked',
      paymentStatus: 'pending'
    });

    // Update counsellor availability
    for (const slot of bookedSlots) {
      const availabilityIndex = counsellor.availability.findIndex(
        availableSlot => 
          availableSlot.date.toISOString().split('T')[0] === new Date(slot.date).toISOString().split('T')[0] &&
          availableSlot.startTime === slot.startTime &&
          availableSlot.endTime === slot.endTime
      );

      if (availabilityIndex !== -1) {
        counsellor.availability[availabilityIndex].isBooked = true;
      }
    }

    await counsellor.save();

    // Send confirmation email (in a real app, we would use proper email templates)
    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Counselling Session Booking Confirmation',
        text: `Your counselling session has been booked successfully. Package: ${packageType}, Total Sessions: ${totalSessions}`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user's sessions
// @route   GET /api/sessions
// @access  Private
export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const sessions = await Session.find({ userId })
      .populate('counsellorId', 'userId')
      .populate({
        path: 'counsellorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: sessions.length,
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

// @desc    Get counsellor's sessions
// @route   GET /api/sessions/counsellor
// @access  Private (Counsellor only)
export const getCounsellorSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Find counsellor profile
    const counsellor = await Counsellor.findOne({ userId });
    
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor profile not found'
      });
    }
    
    const sessions = await Session.find({ counsellorId: counsellor._id })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: sessions.length,
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

// @desc    Mark session as completed
// @route   PUT /api/sessions/:id/complete
// @access  Private (Counsellor only)
export const markSessionCompleted = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    
    // Find counsellor profile
    const counsellor = await Counsellor.findOne({ userId });
    
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor profile not found'
      });
    }
    
    // Find session
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Verify that this session belongs to the counsellor
    if (session.counsellorId.toString() !== counsellor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }
    
    // Update completed sessions count
    session.completedSessions += 1;
    
    // If all sessions are completed, mark the package as completed
    if (session.completedSessions >= session.totalSessions) {
      session.status = 'completed';
    } else {
      session.status = 'in-progress';
    }
    
    const updatedSession = await session.save();
    
    res.json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Cancel session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
export const cancelSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    
    // Find session
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Verify that this session belongs to the user
    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this session'
      });
    }
    
    // Only allow cancellation if session is not completed
    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed session'
      });
    }
    
    // Update session status
    session.status = 'cancelled';
    
    // Free up the counsellor's availability slots
    const counsellor = await Counsellor.findById(session.counsellorId);
    
    if (counsellor) {
      for (const bookedSlot of session.bookedSlots) {
        const availabilityIndex = counsellor.availability.findIndex(
          availableSlot => 
            availableSlot.date.toISOString().split('T')[0] === new Date(bookedSlot.date).toISOString().split('T')[0] &&
            availableSlot.startTime === bookedSlot.startTime &&
            availableSlot.endTime === bookedSlot.endTime
        );

        if (availabilityIndex !== -1) {
          counsellor.availability[availabilityIndex].isBooked = false;
        }
      }
      
      await counsellor.save();
    }
    
    const updatedSession = await session.save();
    
    res.json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

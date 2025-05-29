import { Request, Response } from 'express';
import Topic from '../models/Topic';
import { ErrorResponse } from '../utils/errorHandler';

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private (Admin only)
export const createTopic = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Check if topic already exists
    const existingTopic = await Topic.findOne({ name });

    if (existingTopic) {
      return res.status(400).json({
        success: false,
        message: 'Topic already exists'
      });
    }

    // Create topic
    const topic = await Topic.create({
      name,
      description,
      status: true
    });

    res.status(201).json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find({ status: true }).sort({ name: 1 });

    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
export const getTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private (Admin only)
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body;

    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== topic.name) {
      const existingTopic = await Topic.findOne({ name });

      if (existingTopic) {
        return res.status(400).json({
          success: false,
          message: 'Topic with that name already exists'
        });
      }
    }

    // Update fields
    topic.name = name || topic.name;
    topic.description = description || topic.description;
    if (typeof status === 'boolean') topic.status = status;

    await topic.save();

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private (Admin only)
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await topic.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

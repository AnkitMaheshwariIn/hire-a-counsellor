import { Request, Response } from 'express';
import Location from '../models/Location';
import { ErrorResponse } from '../utils/errorHandler';

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (Admin only)
export const createLocation = async (req: Request, res: Response) => {
  try {
    const { city, state, pincode } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({ city, state, pincode });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Location already exists'
      });
    }

    // Create location
    const location = await Location.create({
      city,
      state,
      pincode,
      status: true
    });

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
export const getLocations = async (req: Request, res: Response) => {
  try {
    const { state, city } = req.query;
    
    const query: any = { status: true };
    
    if (state) {
      query.state = state;
    }
    
    if (city) {
      query.city = city;
    }
    
    const locations = await Location.find(query).sort({ state: 1, city: 1 });

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin only)
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { city, state, pincode, status } = req.body;

    let location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Check if location details are being changed and if it already exists
    if ((city && city !== location.city) || 
        (state && state !== location.state) || 
        (pincode && pincode !== location.pincode)) {
      
      const existingLocation = await Location.findOne({
        city: city || location.city,
        state: state || location.state,
        pincode: pincode || location.pincode
      });

      if (existingLocation && existingLocation._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Location with these details already exists'
        });
      }
    }

    // Update fields
    location.city = city || location.city;
    location.state = state || location.state;
    location.pincode = pincode || location.pincode;
    if (typeof status === 'boolean') location.status = status;

    await location.save();

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin only)
export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    await location.deleteOne();

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

import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailabilitySlot {
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface IPricing {
  oneSession: number;
  fiveSession: number;
  tenSession: number;
}

export interface ICounsellor extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  topics: mongoose.Types.ObjectId[];
  locations: mongoose.Types.ObjectId[];
  availability: IAvailabilitySlot[];
  pricing: IPricing;
  status: string;
  approvalStatus: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const counsellorSchema = new Schema<ICounsellor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bio: {
      type: String,
      required: [true, 'Please add a bio'],
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    topics: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    locations: [{
      type: Schema.Types.ObjectId,
      ref: 'Location'
    }],
    availability: [
      {
        date: {
          type: Date,
          required: true
        },
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        },
        isBooked: {
          type: Boolean,
          default: false
        }
      }
    ],
    pricing: {
      oneSession: {
        type: Number,
        required: true
      },
      fiveSession: {
        type: Number,
        required: true
      },
      tenSession: {
        type: Number,
        required: true
      }
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICounsellor>('Counsellor', counsellorSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IBookedSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  counsellorId: mongoose.Types.ObjectId;
  packageType: string;
  totalSessions: number;
  completedSessions: number;
  bookedSlots: IBookedSlot[];
  status: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    counsellorId: {
      type: Schema.Types.ObjectId,
      ref: 'Counsellor',
      required: true
    },
    packageType: {
      type: String,
      enum: ['single', 'five', 'ten'],
      required: true
    },
    totalSessions: {
      type: Number,
      required: true
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    bookedSlots: [
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
        }
      }
    ],
    status: {
      type: String,
      enum: ['booked', 'in-progress', 'completed', 'cancelled'],
      default: 'booked'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISession>('Session', sessionSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  city: string;
  state: string;
  pincode: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    city: {
      type: String,
      required: [true, 'Please add a city name'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please add a state name'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please add a pincode'],
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for city, state, and pincode
locationSchema.index({ city: 1, state: 1, pincode: 1 }, { unique: true });

export default mongoose.model<ILocation>('Location', locationSchema);

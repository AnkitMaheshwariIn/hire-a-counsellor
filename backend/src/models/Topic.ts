import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: [true, 'Please add a topic name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
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

export default mongoose.model<ITopic>('Topic', topicSchema);

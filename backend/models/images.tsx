import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  public_id: string;
  url: string;
  username: string;
  createdAt: Date;
}

const imageSchema: Schema<IImage> = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Image ||
  mongoose.model<IImage>("Image", imageSchema);

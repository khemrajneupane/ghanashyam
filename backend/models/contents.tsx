// models/Content.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId; // Optional because required: false
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
  title: { type: String },
  description: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Content ||
  mongoose.model<IContent>("Content", ContentSchema);

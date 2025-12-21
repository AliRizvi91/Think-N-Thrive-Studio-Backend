// models/Review.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    comment: { type: String },
  },
  { timestamps: true }
);


export const Review_Model: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);

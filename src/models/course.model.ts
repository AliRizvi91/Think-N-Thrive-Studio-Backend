// models/Course.ts
import mongoose, { Document, Schema } from "mongoose";

// 🔹 Category type (single source of truth)
export type CourseCategory =
  | "English Speaking"
  | "O/A Levels English"
  | "MDCAT/ECAT English"
  | "IELTS"
  | "Literature"
  | "Public Speaking"
  | "Writing"
  | "History";

// Interface
export interface ICourse extends Document {
  image?: string;
  title: string;
  description: string;
  category: CourseCategory;
  duration: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const CourseSchema = new Schema<ICourse>(
  {
    image: { type: String, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 1700 },
    category: {
      type: String,
      enum: [
        "English Speaking",
        "O/A Levels English",
        "MDCAT/ECAT English",
        "IELTS",
        "Literature",
        "Public Speaking",
        "Writing",
        "History",
      ],
      required: true,
      default: "English Speaking",
    },
    duration: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

// Model
const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;

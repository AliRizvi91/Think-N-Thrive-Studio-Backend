import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAdmission extends Document {
  name: string;
  whatsappNumber: string;
  selectedCourses: Types.ObjectId[];
  educationLevel: "Matric" | "Intermediate" | "O/A Levels" | "Graduate" | "Other";
  age: string;
  referralSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    name: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },

    selectedCourses: [
      { type: Schema.Types.ObjectId, ref: "Course", required: true },
    ],

    educationLevel: {
      type: String,
      required: true,
    },

    age: { type: String, required: true },
    referralSource: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Admission ||
  mongoose.model<IAdmission>("Admission", AdmissionSchema);

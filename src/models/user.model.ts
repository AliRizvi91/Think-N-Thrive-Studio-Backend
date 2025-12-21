import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  image?: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Schema
const UserSchema = new Schema<IUser>(
  {
    image: { type: String, default: "" },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: function (this: any) {
        return this.role ? this.role : "user";
      },
    },


    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);


// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




// Compare password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Model
export const User_Model: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

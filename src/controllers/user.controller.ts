import type { Request, Response } from "express"; // ✅ type-only import
import { User_Model } from "../models/user.model";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { uploadOnCloudinary } from "../services/cloudinary/cloudinary";
import { sendmailer } from "../services/sendMails/mail";
import { sendPasswordResetEmail } from "../services/sendMails/resetPassword";

dotenv.config();

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

// 🔐 Token generator
const generateToken = (id: string, role?: string): string => {
  const secret = process.env.JWT_SECRET_KEY as string;

const options: SignOptions = {
  expiresIn: process.env.JWT_Expiry_Time
    ? (process.env.JWT_Expiry_Time as any)
    : "3d",
};


  return jwt.sign({ id, role }, secret, options);
};

// ================= GET ALL USERS =================
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User_Model.find();
    res.status(200).json(users);
  } catch {
    res.status(400).json({ message: "Failed to get all users" });
  }
};

// ================= GET USER =================
export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User_Model.findById(req.params.id);
    res.status(200).json(user);
  } catch {
    res.status(400).json({ message: "Failed to get user" });
  }
};

// ================= ADD USER =================
export const addUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const existingUser = await User_Model.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const imageLocalPath = (req as any).file?.path;
    let imageUrl: string | undefined;

if (imageLocalPath) {
  const uploadedImage = await uploadOnCloudinary(imageLocalPath);
  if (uploadedImage) {
    imageUrl = uploadedImage; // string only
  }
}


    const user = await User_Model.create({
      username,
      email,
      password,
      image: imageUrl,
      role,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({ user, token });
  } catch {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User_Model.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
};

// ================= LOGIN =================
export const Login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const user = await User_Model.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(user._id.toString(), user.role);
  await sendmailer(email, token, user.username);

  res.status(200).json({ message: "Login successful", token });
};

// ================= TOKEN VERIFY =================
export const TokenVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const decoded = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET_KEY as string
    ) as unknown as { id: string };

    const user = await User_Model.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Token valid", user });
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokens } = await client.getToken(req.body.code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(403).json({ message: "Invalid Google payload" });
      return;
    }

    let user = await User_Model.findOne({ email: payload.email });
    if (!user) {
      user = await User_Model.create({
        username: payload.name,
        email: payload.email,
        image: payload.picture,
      });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ user, token });
  } catch {
    res.status(500).json({ message: "Google login failed" });
  }
};

// ================= RESET PASSWORD =================
export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const decoded = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET_KEY as string
    ) as unknown as { id: string };

    const user = await User_Model.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User_Model.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  Object.assign(user, req.body);
  await user.save();

  res.status(200).json(user);
};

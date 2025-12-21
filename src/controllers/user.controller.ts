import { Request, Response } from "express";
import { User_Model, IUser } from "../models/user.model";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// Utility: Token generation
import jwt, { SignOptions } from "jsonwebtoken";
dotenv.config();
import { OAuth2Client } from "google-auth-library";

// Files
import { uploadOnCloudinary } from "../services/cloudinary/cloudinary";
import { sendmailer } from "../services/sendMails/mail";
import { sendPasswordResetEmail } from "../services/sendMails/resetPassword";

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" // required for auth code exchange
);



const generateToken = (id: string, role?: string): string => {
  const payload = { id, role };
  const secret = process.env.JWT_SECRET_KEY as string;

const options: SignOptions = {
  expiresIn: (process.env.JWT_Expiry_Time as unknown as number) || "3d",
};

  return jwt.sign(payload, secret, options);
};



//___---- Get All Users----___
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User_Model.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Failed to get all Users " });
  }
}

//___---- Get User by Id----___
export async function getUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = await User_Model.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Failed to get User by Id" });
  }
}

//___---- Create User ----___
export async function addUser(req: Request, res: Response) {
  try {
    const { username, email, password ,role } = req.body;
    const imageLocalPath = (req as any).file?.path;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    let imageUrl: string | undefined;

    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (uploadedImage) {
        imageUrl = uploadedImage;
      }
    }

    const userExists = await User_Model.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User_Model.create({
      username,
      email,
      password,
      image: imageUrl,
      role
    });

    const token = generateToken(newUser._id.toString());

    res.header("Location", `${req.originalUrl}/${newUser._id}`);
    return res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error: any) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to add user" });
  }
}


//___---- Delete User----___
export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log("Delete user",id);
    
    const deleted = await User_Model.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "User not found for deletion" });
    return res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Failed to delete User" });
  }
}

//___---- Login----___
export async function Login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const user = await User_Model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await user.save();

    const token = generateToken(user._id.toString(), (user as any).role);

    await sendmailer(email, token, user.username);

    res.status(200).json({ message: "Login successful" });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//___---- Resend Token----___
export async function ResendToken(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User_Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user._id.toString(), (user as any).role);

    await sendmailer(email, token, user.username);

    res.status(200).json({ message: "Token resent" });
  } catch (error: any) {
    console.error("ResendToken error:", error);
    return res.status(500).json({
      message: "Server error during ResendToken",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//___---- Token Verification----___
export async function TokenVerification(req: Request, res: Response) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      id: string;
    };

    const user = await User_Model.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Token verified successfully",
      user,
      token,
    });
  } catch (error: any) {
    console.error("Token verification error:", error);

    let message = "Token verification failed";
    if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    } else if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    }

    return res.status(403).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//___---- Google Login----___
export async function googleLogin(req: Request, res: Response) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Authorization code is required" });
  }

  try {
    const { tokens } = await client.getToken(code);
    const { id_token, access_token } = tokens;

    if (!tokens) {
      return res.status(402).json({ message: "Google tokens not verified" });
    }

    const ticket = await client.verifyIdToken({
      idToken: id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(403).json({ message: "Invalid Google payload" });
    }

    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(403).json({ message: "Google email not verified" });
    }

    let user = await User_Model.findOne({ email });
    if (!user) {
      user = await User_Model.create({
        username: name,
        email,
        image: picture,
      });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//___---- Send Mail for Reset Password----___
export async function SendMailForResetPassword(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  try {
    const user = await User_Model.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const token = jwt.sign(
      { id: user._id, role: (user as any).role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    await sendPasswordResetEmail(email, token, user.username);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error: any) {
    console.error("SendMailForResetPassword error:", error);
    return res.status(500).json({
      message: "Server error during password reset email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//___---- Reset Password----___
export async function ResetPassword(req: Request, res: Response) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both token and new password" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string };

    const user = await User_Model.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    console.error("Password reset error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.status(500).json({
      message: "Server error during password reset",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}


// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const user = await User_Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🖼️ Image handling (same as addUser)
    const imageLocalPath = (req as any).file?.path;

    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (uploadedImage) {
        user.image = uploadedImage;
      }
    }

    // ✏️ Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    // 🔐 Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

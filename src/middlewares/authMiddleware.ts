import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import { User_Model, IUser } from "../models/user.model";

dotenv.config();

/* =========================
   Express Request Augmentation
   ========================= */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

/* =========================
   PROTECT MIDDLEWARE
   ========================= */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as unknown as DecodedToken;

    const user = await User_Model.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   ADMIN AUTHORIZATION
   ========================= */
export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

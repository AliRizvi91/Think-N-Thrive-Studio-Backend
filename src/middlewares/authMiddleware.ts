import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { User_Model, IUser } from "../models/user.model";

dotenv.config();

// ✅ Correct module augmentation
declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Protect middleware
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as DecodedToken;

      req.user = await User_Model.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin authorization
export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
if (req.user?.role !== "admin") {
  return res.status(403).json({ message: "Forbidden" });
}

  next();
};

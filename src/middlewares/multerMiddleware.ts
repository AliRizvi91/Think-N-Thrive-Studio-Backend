import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

// Multer Setup
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/assets/");
    cb(null, uploadPath); // Correctly set destination path
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Optional: file filter for images only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/svg+xml" // ✅ Correct mimetype for SVG
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, .webp, and .svg files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
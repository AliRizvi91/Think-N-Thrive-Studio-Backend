"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer Setup
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../public/assets/");
        cb(null, uploadPath); // Correctly set destination path
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// Optional: file filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "image/svg+xml" // ✅ Correct mimetype for SVG
    ) {
        cb(null, true);
    }
    else {
        cb(new Error("Only .jpeg, .jpg, .png, .webp, and .svg files are allowed!"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
});

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECERET_KEY,
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string): Promise<string | null> => {
  try {
    if (!localFilePath) return null;

    const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response.secure_url; // safer than response.url
  } catch (error) {
    console.error("Upload Error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Clean up the temporary file on error
    }

    return null;
  }
};

export { uploadOnCloudinary };
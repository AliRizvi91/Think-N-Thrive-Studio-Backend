// controllers/courseController.ts
import { Request, Response } from "express";
import Course, { ICourse } from "../models/course.model";
import { uploadOnCloudinary } from "../services/cloudinary/cloudinary";
import { logger } from "../config/logger.config";



//___---- Get All Courses ----___
export const getAllCourses = async (req: Request, res: Response): Promise<Response> => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
};

//___---- Get Course by ID ----___
export const getCourseById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch course" });
  }
};



//___---- Create a New Course ----___
export const createCourse = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, category, duration, author } = req.body;

    
    if (!title || !category || !duration || !author) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    

    const imageLocalPath = (req as any).file?.path;
    let imageUrl: string | undefined | null;

    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      imageUrl = uploadedImage; // directly assign, no .secure_url
    }
    

    const newCourse = await Course.create({
      title,
      description,
      category,
      duration,
      author,
      image: imageUrl,
    });



    res.header("Location", `${req.originalUrl}/${newCourse._id}`);
    return res.status(201).json(newCourse);
  } catch (error) {
    console.error("CREATE COURSE ERROR 👉", error);
    return res.status(500).json({ message: "Failed to create course" });
  }
};




//___---- Update Course ----___
export const updateCourse = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<ICourse> = req.body;

    const imageLocalPath = (req as any).file?.path;
    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (uploadedImage) updateData.image = uploadedImage;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update course" });
  }
};


//___---- Delete Course ----___
export const deleteCourse = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json(deletedCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete course" });
  }
};

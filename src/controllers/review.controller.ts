// controllers/reviewController.ts
import { Request, Response } from "express";
import { Review_Model, IReview } from "../models/review.model";

//___---- Get All Reviews ----___
export const getAllReviews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reviews = await Review_Model.find().populate('user').populate('course')
    return res.status(200).json(reviews);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

//___---- Get Reviews by Course ----___
export const getReviewsByCourse = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { courseId } = req.params;
    const reviews = await Review_Model.find({ course: courseId }).populate('user')
    return res.status(200).json(reviews);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to fetch course reviews" });
  }
};


//___---- Create Review ----___
export const createReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user, course, comment } = req.body;
    const review = await Review_Model.create({ user, course, comment });
    return res.status(201).json(review);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to create review" });
  }
};



//___---- Update Review ----___
export const updateReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IReview> = req.body;

    const updatedReview = await Review_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedReview) return res.status(404).json({ message: "Review not found" });
    return res.status(200).json(updatedReview);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to update review" });
  }
};

//___---- Delete Review ----___
export const deleteReview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedReview = await Review_Model.findByIdAndDelete(id);
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });
    return res.status(200).json(deletedReview);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to delete review" });
  }
};

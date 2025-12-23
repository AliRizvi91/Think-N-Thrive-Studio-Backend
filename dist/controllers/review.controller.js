"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewsByCourse = exports.getAllReviews = void 0;
const review_model_1 = require("../models/review.model");
//___---- Get All Reviews ----___
const getAllReviews = async (req, res) => {
    try {
        const reviews = await review_model_1.Review_Model.find().populate('user').populate('course');
        return res.status(200).json(reviews);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch reviews" });
    }
};
exports.getAllReviews = getAllReviews;
//___---- Get Reviews by Course ----___
const getReviewsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await review_model_1.Review_Model.find({ course: courseId }).populate('user');
        return res.status(200).json(reviews);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch course reviews" });
    }
};
exports.getReviewsByCourse = getReviewsByCourse;
//___---- Create Review ----___
const createReview = async (req, res) => {
    try {
        const { user, course, comment } = req.body;
        const review = await review_model_1.Review_Model.create({ user, course, comment });
        return res.status(201).json(review);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to create review" });
    }
};
exports.createReview = createReview;
//___---- Update Review ----___
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedReview = await review_model_1.Review_Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedReview)
            return res.status(404).json({ message: "Review not found" });
        return res.status(200).json(updatedReview);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to update review" });
    }
};
exports.updateReview = updateReview;
//___---- Delete Review ----___
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await review_model_1.Review_Model.findByIdAndDelete(id);
        if (!deletedReview)
            return res.status(404).json({ message: "Review not found" });
        return res.status(200).json(deletedReview);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to delete review" });
    }
};
exports.deleteReview = deleteReview;

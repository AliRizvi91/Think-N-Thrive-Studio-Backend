// routes/reviewRoutes.ts
import express, { Router } from "express";
import {
  getAllReviews,
  getReviewsByCourse,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/review.controller";

const ReviewRouter: Router = express.Router();

ReviewRouter.route("/")
  .get(getAllReviews)
  .post(createReview);

ReviewRouter.route("/course/:courseId")
  .get(getReviewsByCourse);

ReviewRouter.route("/:id")
  .put(updateReview)
  .delete(deleteReview);

export default ReviewRouter;

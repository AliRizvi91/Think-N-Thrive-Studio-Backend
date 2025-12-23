"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/reviewRoutes.ts
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const ReviewRouter = express_1.default.Router();
ReviewRouter.route("/")
    .get(review_controller_1.getAllReviews)
    .post(review_controller_1.createReview);
ReviewRouter.route("/course/:courseId")
    .get(review_controller_1.getReviewsByCourse);
ReviewRouter.route("/:id")
    .put(review_controller_1.updateReview)
    .delete(review_controller_1.deleteReview);
exports.default = ReviewRouter;

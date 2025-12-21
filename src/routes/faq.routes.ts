// routes/faqRoutes.ts
import express, { Router } from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
} from "../controllers/faqs.controller";

const FaqRouter: Router = express.Router();

FaqRouter.route("/")
  .get(getAllFaqs)
  .post(createFaq);

FaqRouter.route("/:id")
  .get(getFaqById)
  .put(updateFaq)
  .delete(deleteFaq);

export default FaqRouter;

// routes/courseRoutes.ts
import express, { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/course.controller";

import { upload } from "../middlewares/multerMiddleware";

const CourseRouter: Router = express.Router();

CourseRouter.route("/")
  .get(getAllCourses)
  .post(upload.single("image"), createCourse);

CourseRouter.route("/:id")
  .get(getCourseById)
  .put(upload.single("image"), updateCourse)
  .delete(deleteCourse);

export default CourseRouter;

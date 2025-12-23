"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/courseRoutes.ts
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const CourseRouter = express_1.default.Router();
CourseRouter.route("/")
    .get(course_controller_1.getAllCourses)
    .post(multerMiddleware_1.upload.single("image"), course_controller_1.createCourse);
CourseRouter.route("/:id")
    .get(course_controller_1.getCourseById)
    .put(multerMiddleware_1.upload.single("image"), course_controller_1.updateCourse)
    .delete(course_controller_1.deleteCourse);
exports.default = CourseRouter;

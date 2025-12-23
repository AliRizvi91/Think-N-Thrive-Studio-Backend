"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const cloudinary_1 = require("../services/cloudinary/cloudinary");
//___---- Get All Courses ----___
const getAllCourses = async (req, res) => {
    try {
        const courses = await course_model_1.default.find();
        return res.status(200).json(courses);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch courses" });
    }
};
exports.getAllCourses = getAllCourses;
//___---- Get Course by ID ----___
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.default.findById(id);
        if (!course)
            return res.status(404).json({ message: "Course not found" });
        return res.status(200).json(course);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch course" });
    }
};
exports.getCourseById = getCourseById;
//___---- Create a New Course ----___
const createCourse = async (req, res) => {
    try {
        const { title, description, category, duration, author } = req.body;
        if (!title || !category || !duration || !author) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        const imageLocalPath = req.file?.path;
        let imageUrl;
        if (imageLocalPath) {
            const uploadedImage = await (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath);
            imageUrl = uploadedImage; // directly assign, no .secure_url
        }
        const newCourse = await course_model_1.default.create({
            title,
            description,
            category,
            duration,
            author,
            image: imageUrl,
        });
        res.header("Location", `${req.originalUrl}/${newCourse._id}`);
        return res.status(201).json(newCourse);
    }
    catch (error) {
        console.error("CREATE COURSE ERROR 👉", error);
        return res.status(500).json({ message: "Failed to create course" });
    }
};
exports.createCourse = createCourse;
//___---- Update Course ----___
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const imageLocalPath = req.file?.path;
        if (imageLocalPath) {
            const uploadedImage = await (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath);
            if (uploadedImage)
                updateData.image = uploadedImage;
        }
        const updatedCourse = await course_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCourse)
            return res.status(404).json({ message: "Course not found" });
        return res.status(200).json(updatedCourse);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update course" });
    }
};
exports.updateCourse = updateCourse;
//___---- Delete Course ----___
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await course_model_1.default.findByIdAndDelete(id);
        if (!deletedCourse)
            return res.status(404).json({ message: "Course not found" });
        return res.status(200).json(deletedCourse);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete course" });
    }
};
exports.deleteCourse = deleteCourse;

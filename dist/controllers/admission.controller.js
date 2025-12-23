"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmission = exports.updateAdmission = exports.createAdmission = exports.getAdmissionById = exports.getAllAdmissions = void 0;
const Admission_model_1 = __importDefault(require("../models/Admission.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
// ___---- Get All Admissions ----___
const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission_model_1.default.find().populate("selectedCourses", "title category duration author");
        return res.status(200).json(admissions);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch admissions" });
    }
};
exports.getAllAdmissions = getAllAdmissions;
// ___---- Get Admission by ID ----___
const getAdmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const admission = await Admission_model_1.default.findById(id).populate("selectedCourses", "title category duration author");
        if (!admission)
            return res.status(404).json({ message: "Admission not found" });
        return res.status(200).json(admission);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch admission" });
    }
};
exports.getAdmissionById = getAdmissionById;
// ___---- Create a New Admission ----___
const createAdmission = async (req, res) => {
    try {
        const { name, whatsappNumber, selectedCourses, educationLevel, age, referralSource, } = req.body;
        if (!name ||
            !whatsappNumber ||
            !selectedCourses ||
            !educationLevel ||
            !age) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        const validCourses = await course_model_1.default.find({
            _id: { $in: selectedCourses },
        });
        if (validCourses.length !== selectedCourses.length) {
            return res
                .status(400)
                .json({ message: "One or more selected courses are invalid" });
        }
        const admission = await Admission_model_1.default.create({
            name,
            whatsappNumber,
            selectedCourses,
            educationLevel,
            age,
            referralSource,
        });
        return res.status(201).json(admission);
    }
    catch (error) {
        console.error("CREATE ADMISSION ERROR 👉", error);
        return res.status(500).json({ message: "Failed to create admission" });
    }
};
exports.createAdmission = createAdmission;
// ___---- Update Admission ----___
const updateAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // If updating selectedCourses, validate them
        if (updateData.selectedCourses) {
            const validAdmissions = await Admission_model_1.default.find({ _id: { $in: updateData.selectedCourses } });
            if (validAdmissions.length !== updateData.selectedCourses.length) {
                return res.status(400).json({ message: "One or more selected Admissions are invalid" });
            }
        }
        const updatedAdmission = await Admission_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).populate("selectedCourses", "title category duration author");
        if (!updatedAdmission)
            return res.status(404).json({ message: "Admission not found" });
        return res.status(200).json(updatedAdmission);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update admission" });
    }
};
exports.updateAdmission = updateAdmission;
// ___---- Delete Admission ----___
const deleteAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmission = await Admission_model_1.default.findByIdAndDelete(id);
        if (!deletedAdmission)
            return res.status(404).json({ message: "Admission not found" });
        return res.status(200).json(deletedAdmission);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete admission" });
    }
};
exports.deleteAdmission = deleteAdmission;

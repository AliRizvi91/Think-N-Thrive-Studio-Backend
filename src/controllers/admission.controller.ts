// controllers/admissionController.ts
import { Request, Response } from "express";
import Admission, { IAdmission } from "../models/Admission.model";
import Course from "../models/course.model";


// ___---- Get All Admissions ----___
export const getAllAdmissions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const admissions = await Admission.find().populate("selectedCourses", "title category duration author");
    return res.status(200).json(admissions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch admissions" });
  }
};

// ___---- Get Admission by ID ----___
export const getAdmissionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id).populate("selectedCourses", "title category duration author");
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    return res.status(200).json(admission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch admission" });
  }
};

// ___---- Create a New Admission ----___

export const createAdmission = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      whatsappNumber,
      selectedCourses,
      educationLevel,
      age,
      referralSource,
    } = req.body;

    if (
      !name ||
      !whatsappNumber ||
      !selectedCourses ||
      !educationLevel ||
      !age
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const validCourses = await Course.find({
      _id: { $in: selectedCourses },
    });

    if (validCourses.length !== selectedCourses.length) {
      return res
        .status(400)
        .json({ message: "One or more selected courses are invalid" });
    }

    const admission = await Admission.create({
      name,
      whatsappNumber,
      selectedCourses,
      educationLevel,
      age,
      referralSource,
    });

    return res.status(201).json(admission);
  } catch (error) {
    console.error("CREATE ADMISSION ERROR 👉", error);
    return res.status(500).json({ message: "Failed to create admission" });
  }
};

// ___---- Update Admission ----___
export const updateAdmission = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IAdmission> = req.body;

    // If updating selectedCourses, validate them
    if (updateData.selectedCourses) {
      const validAdmissions = await Admission.find({ _id: { $in: updateData.selectedCourses } });
      if (validAdmissions.length !== updateData.selectedCourses.length) {
        return res.status(400).json({ message: "One or more selected Admissions are invalid" });
      }
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "selectedCourses",
      "title category duration author"
    );

    if (!updatedAdmission) return res.status(404).json({ message: "Admission not found" });

    return res.status(200).json(updatedAdmission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update admission" });
  }
};

// ___---- Delete Admission ----___
export const deleteAdmission = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedAdmission = await Admission.findByIdAndDelete(id);
    if (!deletedAdmission) return res.status(404).json({ message: "Admission not found" });
    return res.status(200).json(deletedAdmission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete admission" });
  }
};

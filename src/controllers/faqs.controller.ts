// controllers/faqController.ts
import { Request, Response } from "express";
import { Faq_Model, IFaq } from "../models/faqs.model";

//___---- Get All FAQs ----___
export const getAllFaqs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const faqs = await Faq_Model.find().sort({ createdAt: 1 }); // sorted by creation
    return res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

//___---- Get FAQ by ID ----___
export const getFaqById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const faq = await Faq_Model.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch FAQ" });
  }
};

//___---- Create FAQ ----___
export const createFaq = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { question, answer } = req.body;
    const newFaq = await Faq_Model.create({ question, answer });
    return res.status(201).json(newFaq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create FAQ" });
  }
};

//___---- Update FAQ ----___
export const updateFaq = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IFaq> = req.body;
    const updatedFaq = await Faq_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFaq) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json(updatedFaq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update FAQ" });
  }
};

//___---- Delete FAQ ----___
export const deleteFaq = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedFaq = await Faq_Model.findByIdAndDelete(id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });
    return res.status(200).json(deletedFaq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete FAQ" });
  }
};

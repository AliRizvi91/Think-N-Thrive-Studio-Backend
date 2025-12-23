"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaqById = exports.getAllFaqs = void 0;
const faqs_model_1 = require("../models/faqs.model");
//___---- Get All FAQs ----___
const getAllFaqs = async (req, res) => {
    try {
        const faqs = await faqs_model_1.Faq_Model.find().sort({ createdAt: 1 }); // sorted by creation
        return res.status(200).json(faqs);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch FAQs" });
    }
};
exports.getAllFaqs = getAllFaqs;
//___---- Get FAQ by ID ----___
const getFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await faqs_model_1.Faq_Model.findById(id);
        if (!faq)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json(faq);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch FAQ" });
    }
};
exports.getFaqById = getFaqById;
//___---- Create FAQ ----___
const createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newFaq = await faqs_model_1.Faq_Model.create({ question, answer });
        return res.status(201).json(newFaq);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to create FAQ" });
    }
};
exports.createFaq = createFaq;
//___---- Update FAQ ----___
const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedFaq = await faqs_model_1.Faq_Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedFaq)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json(updatedFaq);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to update FAQ" });
    }
};
exports.updateFaq = updateFaq;
//___---- Delete FAQ ----___
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFaq = await faqs_model_1.Faq_Model.findByIdAndDelete(id);
        if (!deletedFaq)
            return res.status(404).json({ message: "FAQ not found" });
        return res.status(200).json(deletedFaq);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to delete FAQ" });
    }
};
exports.deleteFaq = deleteFaq;

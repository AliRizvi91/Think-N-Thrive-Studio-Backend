"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.createContact = exports.getContactById = exports.getAllContacts = void 0;
const contact_model_1 = require("../models/contact.model");
//___---- Get All Contacts ----___
const getAllContacts = async (req, res) => {
    try {
        const contacts = await contact_model_1.Contact_Model.find().sort({ createdAt: -1 }); // latest first
        return res.status(200).json(contacts);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch contacts" });
    }
};
exports.getAllContacts = getAllContacts;
//___---- Get Contact by ID ----___
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contact_model_1.Contact_Model.findById(id);
        if (!contact)
            return res.status(404).json({ message: "Contact not found" });
        return res.status(200).json(contact);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch contact" });
    }
};
exports.getContactById = getContactById;
//___---- Create Contact ----___
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const newContact = await contact_model_1.Contact_Model.create({
            name,
            email,
            phone,
            message,
        });
        return res.status(201).json(newContact);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create contact' });
    }
};
exports.createContact = createContact;
//___---- Update Contact ----___
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedContact = await contact_model_1.Contact_Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedContact)
            return res.status(404).json({ message: "Contact not found" });
        return res.status(200).json(updatedContact);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to update contact" });
    }
};
exports.updateContact = updateContact;
//___---- Delete Contact ----___
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await contact_model_1.Contact_Model.findByIdAndDelete(id);
        if (!deletedContact)
            return res.status(404).json({ message: "Contact not found" });
        return res.status(200).json(deletedContact);
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to delete contact" });
    }
};
exports.deleteContact = deleteContact;

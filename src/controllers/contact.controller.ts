// controllers/contactController.ts
import { Request, Response } from "express";
import { Contact_Model, IContact } from "../models/contact.model";

//___---- Get All Contacts ----___
export const getAllContacts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contacts = await Contact_Model.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json(contacts);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

//___---- Get Contact by ID ----___
export const getContactById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const contact = await Contact_Model.findById(id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    return res.status(200).json(contact);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to fetch contact" });
  }
};

//___---- Create Contact ----___
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Required fields missing' })
    }

    const newContact = await Contact_Model.create({
      name,
      email,
      phone,
      message,
    })

    return res.status(201).json(newContact)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create contact' })
  }
}


//___---- Update Contact ----___
export const updateContact = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IContact> = req.body;
    const updatedContact = await Contact_Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedContact) return res.status(404).json({ message: "Contact not found" });
    return res.status(200).json(updatedContact);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to update contact" });
  }
};

//___---- Delete Contact ----___
export const deleteContact = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact_Model.findByIdAndDelete(id);
    if (!deletedContact) return res.status(404).json({ message: "Contact not found" });
    return res.status(200).json(deletedContact);
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to delete contact" });
  }
};

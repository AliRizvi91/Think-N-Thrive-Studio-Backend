// routes/contactRoutes.ts
import express, { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contact.controller";

const ContactRouter: Router = express.Router();

ContactRouter.route("/")
  .get(getAllContacts)
  .post(createContact);

ContactRouter.route("/:id")
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

export default ContactRouter;

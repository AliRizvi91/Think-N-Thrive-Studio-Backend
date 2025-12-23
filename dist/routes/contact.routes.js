"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/contactRoutes.ts
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const ContactRouter = express_1.default.Router();
ContactRouter.route("/")
    .get(contact_controller_1.getAllContacts)
    .post(contact_controller_1.createContact);
ContactRouter.route("/:id")
    .get(contact_controller_1.getContactById)
    .put(contact_controller_1.updateContact)
    .delete(contact_controller_1.deleteContact);
exports.default = ContactRouter;

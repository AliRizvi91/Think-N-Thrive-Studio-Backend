"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/AdmissionRoutes.ts
const express_1 = __importDefault(require("express"));
const admission_controller_1 = require("../controllers/admission.controller");
const AdmissionRouter = express_1.default.Router();
AdmissionRouter.route("/")
    .get(admission_controller_1.getAllAdmissions)
    .post(admission_controller_1.createAdmission);
AdmissionRouter.route("/:id")
    .get(admission_controller_1.getAdmissionById)
    .put(admission_controller_1.updateAdmission)
    .delete(admission_controller_1.deleteAdmission);
exports.default = AdmissionRouter;

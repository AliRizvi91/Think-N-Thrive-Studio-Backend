// routes/AdmissionRoutes.ts
import express, { Router } from "express";
import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission
} from "../controllers/admission.controller";

const AdmissionRouter: Router = express.Router();

AdmissionRouter.route("/")
  .get(getAllAdmissions)
  .post(createAdmission);

AdmissionRouter.route("/:id")
  .get(getAdmissionById)
  .put(updateAdmission)
  .delete(deleteAdmission);

export default AdmissionRouter;

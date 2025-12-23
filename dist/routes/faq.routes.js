"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/faqRoutes.ts
const express_1 = __importDefault(require("express"));
const faqs_controller_1 = require("../controllers/faqs.controller");
const FaqRouter = express_1.default.Router();
FaqRouter.route("/")
    .get(faqs_controller_1.getAllFaqs)
    .post(faqs_controller_1.createFaq);
FaqRouter.route("/:id")
    .get(faqs_controller_1.getFaqById)
    .put(faqs_controller_1.updateFaq)
    .delete(faqs_controller_1.deleteFaq);
exports.default = FaqRouter;

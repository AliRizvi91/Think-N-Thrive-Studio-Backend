"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admission_route_1 = __importDefault(require("./Admission.route"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const course_routes_1 = __importDefault(require("./course.routes"));
const faq_routes_1 = __importDefault(require("./faq.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const user_router_1 = __importDefault(require("./user.router"));
const router = (0, express_1.Router)();
router.use('/api/studio/admission', Admission_route_1.default);
router.use('/api/studio/contact', contact_routes_1.default);
router.use('/api/studio/course', course_routes_1.default);
router.use('/api/studio/faqs', faq_routes_1.default);
router.use('/api/studio/review', review_routes_1.default);
router.use('/api/studio/user', user_router_1.default);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy' });
});
// Root route
router.get('/', (_req, res) => {
    res.json({
        message: "Welcome to Raza Tech Solution API",
        status: 'operational'
    });
});
exports.default = router;

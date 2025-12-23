"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const user_controller_1 = require("../controllers/user.controller");
const User_R = express_1.default.Router();
//___---- Get All Users ----___
User_R.route("/")
    .get(user_controller_1.getAllUsers);
//___---- Signup ----___
User_R.route("/signup")
    .post(multerMiddleware_1.upload.single("image"), user_controller_1.addUser);
//___---- Profile ----___
User_R.get("/profile", authMiddleware_1.protect, async (req, res) => {
    try {
        // req.user is added by protect middleware (we should extend Express.Request type)
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No user data found" });
        }
        res.status(200).json({
            user: req.user,
        });
    }
    catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({
            message: "Internal server error while retrieving profile",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
//___---- Auth & Tokens ----___
User_R.post("/login", user_controller_1.Login);
User_R.post("/google-login", user_controller_1.googleLogin);
User_R.post("/resend-token", user_controller_1.ResendToken);
User_R.post("/mail-for-reset-password", user_controller_1.SendMailForResetPassword);
User_R.post("/reset-password", user_controller_1.ResetPassword);
User_R.post("/verify-token", user_controller_1.TokenVerification);
//___---- CRUD by Id ----___
User_R.route("/:id")
    .get(user_controller_1.getUser)
    .delete(user_controller_1.deleteUser)
    .put(multerMiddleware_1.upload.single("image"), user_controller_1.updateUser);
exports.default = User_R;

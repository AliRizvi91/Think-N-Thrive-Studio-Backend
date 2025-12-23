"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.Login = Login;
exports.ResendToken = ResendToken;
exports.TokenVerification = TokenVerification;
exports.googleLogin = googleLogin;
exports.SendMailForResetPassword = SendMailForResetPassword;
exports.ResetPassword = ResetPassword;
const user_model_1 = require("../models/user.model");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Utility: Token generation
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const google_auth_library_1 = require("google-auth-library");
// Files
const cloudinary_1 = require("../services/cloudinary/cloudinary");
const mail_1 = require("../services/sendMails/mail");
const resetPassword_1 = require("../services/sendMails/resetPassword");
// Google OAuth client
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage" // required for auth code exchange
);
const generateToken = (id, role) => {
    const payload = { id, role };
    const secret = process.env.JWT_SECRET_KEY;
    const options = {
        expiresIn: process.env.JWT_Expiry_Time || "3d",
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
//___---- Get All Users----___
async function getAllUsers(req, res) {
    try {
        const users = await user_model_1.User_Model.find();
        return res.status(200).json(users);
    }
    catch (error) {
        
        return res.status(400).json({ message: "Failed to get all Users " });
    }
}
//___---- Get User by Id----___
async function getUser(req, res) {
    try {
        const id = req.params.id;
        const user = await user_model_1.User_Model.findById(id);
        return res.status(200).json(user);
    }
    catch (error) {
        
        return res.status(400).json({ message: "Failed to get User by Id" });
    }
}
//___---- Create User ----___
async function addUser(req, res) {
    try {
        const { username, email, password, role } = req.body;
        const imageLocalPath = req.file?.path;
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ message: "Username, email and password are required" });
        }
        let imageUrl;
        if (imageLocalPath) {
            const uploadedImage = await (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath);
            if (uploadedImage) {
                imageUrl = uploadedImage;
            }
        }
        const userExists = await user_model_1.User_Model.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser = await user_model_1.User_Model.create({
            username,
            email,
            password,
            image: imageUrl,
            role
        });
        const token = generateToken(newUser._id.toString());
        res.header("Location", `${req.originalUrl}/${newUser._id}`);
        return res.status(201).json({
            user: newUser,
            token,
        });
    }
    catch (error) {
        
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to add user" });
    }
}
//___---- Delete User----___
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const deleted = await user_model_1.User_Model.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: "User not found for deletion" });
        return res.status(200).json(deleted);
    }
    catch (error) {
        
        return res.status(400).json({ message: "Failed to delete User" });
    }
}
//___---- Login----___
async function Login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
        const user = await user_model_1.User_Model.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        await user.save();
        const token = generateToken(user._id.toString(), user.role);
        await (0, mail_1.sendmailer)(email, token, user.username);
        res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error during login",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
//___---- Resend Token----___
async function ResendToken(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await user_model_1.User_Model.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = generateToken(user._id.toString(), user.role);
        await (0, mail_1.sendmailer)(email, token, user.username);
        res.status(200).json({ message: "Token resent" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error during ResendToken",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
//___---- Token Verification----___
async function TokenVerification(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = await user_model_1.User_Model.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "Token verified successfully",
            user,
            token,
        });
    }
    catch (error) {
        let message = "Token verification failed";
        if (error.name === "JsonWebTokenError") {
            message = "Invalid token";
        }
        else if (error.name === "TokenExpiredError") {
            message = "Token has expired";
        }
        return res.status(403).json({
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
//___---- Google Login----___
async function googleLogin(req, res) {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: "Authorization code is required" });
    }
    try {
        const { tokens } = await client.getToken(code);
        const { id_token, access_token } = tokens;
        if (!tokens) {
            return res.status(402).json({ message: "Google tokens not verified" });
        }
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(403).json({ message: "Invalid Google payload" });
        }
        const { email, name, picture, email_verified } = payload;
        if (!email_verified) {
            return res.status(403).json({ message: "Google email not verified" });
        }
        let user = await user_model_1.User_Model.findOne({ email });
        if (!user) {
            user = await user_model_1.User_Model.create({
                username: name,
                email,
                image: picture,
            });
        }
        const token = generateToken(user._id.toString());
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Authentication failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
//___---- Send Mail for Reset Password----___
async function SendMailForResetPassword(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Please provide an email" });
    }
    try {
        const user = await user_model_1.User_Model.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        await (0, resetPassword_1.sendPasswordResetEmail)(email, token, user.username);
        res.status(200).json({ message: "Password reset email sent" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error during password reset email",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
//___---- Reset Password----___
async function ResetPassword(req, res) {
    const { token, password } = req.body;
    if (!token || !password) {
        return res
            .status(400)
            .json({ message: "Please provide both token and new password" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = await user_model_1.User_Model.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        return res.status(500).json({
            message: "Server error during password reset",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;
        const user = await user_model_1.User_Model.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 🖼️ Image handling (same as addUser)
        const imageLocalPath = req.file?.path;
        if (imageLocalPath) {
            const uploadedImage = await (0, cloudinary_1.uploadOnCloudinary)(imageLocalPath);
            if (uploadedImage) {
                user.image = uploadedImage;
            }
        }
        // ✏️ Update fields if provided
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (role)
            user.role = role;
        // 🔐 Hash new password if provided
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(password, salt);
        }
        const updatedUser = await user.save();
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        
        return res.status(500).json({ message: error.message });
    }
};
exports.updateUser = updateUser;

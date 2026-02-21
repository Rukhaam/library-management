import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import { 
    getAllUsersModel, 
    checkEmailExists, 
    registerAdminModel 
} from '../models/userModels.js'; 
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { ErrorHandler } from '../middleware/errorMiddlewares.js';

// 1. GET ALL USERS (Admin Only)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await getAllUsersModel();

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

// 2. REGISTER NEW ADMIN
// 2. REGISTER NEW ADMIN
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password } = req.body;

    // Validate text fields
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide name, email, and password", 400));
    }

    // Check if email already exists
    const userExists = await checkEmailExists(email);
    if (userExists) {
        return next(new ErrorHandler("Email is already registered", 400));
    }

    let avatar_url = null;

    if (req.files && req.files.avatar) {
        const { avatar } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        
        // Check format
        if(!allowedFormats.includes(avatar.mimetype)){
             return next(new ErrorHandler("File format not supported. Please upload a PNG, JPG, or WEBP.", 400));
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "library_avatars_admins", 
        });
        
        if(!cloudinaryResponse || cloudinaryResponse.error) {
            console.error(
                "Cloudinary error:", 
                cloudinaryResponse?.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
        }
        
        avatar_url = cloudinaryResponse.secure_url; // Grab the live HTTPS URL
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to Database
    const newAdminId = await registerAdminModel({
        name,
        email,
        phone: phone || null, 
        hashedPassword,
        avatar_url
    });

    res.status(201).json({
        success: true,
        message: "New Admin registered successfully!",
        adminId: newAdminId,
        avatar: avatar_url || "No avatar uploaded"
    });
});
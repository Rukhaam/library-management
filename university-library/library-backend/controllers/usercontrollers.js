import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import { 
    getAllUsersModel, 
    checkEmailExists, 
    registerAdminModel ,
    promoteUserToAdminModel
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
export const promoteUserToAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      await promoteUserToAdminModel(id);
      res.status(200).json({ message: "User promoted to Admin successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to promote user." });
    }
  };

// 2. REGISTER NEW ADMIN
// 2. REGISTER NEW ADMIN
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    // 👇 Added 'avatar' to the destructured req.body
    const { name, email, phone, password, avatar } = req.body;

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

    // 👇 Cloudinary can upload Base64 strings directly!
    if (avatar) {
        const cloudinaryResponse = await cloudinary.uploader.upload(avatar, {
            folder: "library_avatars_admins", 
            width: 150,
            crop: "scale"
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
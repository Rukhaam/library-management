import { generateToken } from '../models/userModels.js';

export const sendToken = (user, statusCode, message, res) => {
    // Generate the JWT token
    const token = generateToken(user);

    // Options for the cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // Send the response
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
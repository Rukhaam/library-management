import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { catchAsyncErrors } from './catchAsyncErrors.js';
import { ErrorHandler } from './errorMiddlewares.js';

// 1. Check if the user is authenticated (Logged In)
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // Get the token from cookies
    const { token } = req.cookies;

    // If there's no token, the user is not logged in
    if (!token) {
        return next(new ErrorHandler("User is not authenticated. Please log in.", 401));
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the MySQL database using the ID from the decoded token
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    // If the user was deleted from the database but still has a token
    if (users.length === 0) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Attach the user object to the request so it can be accessed in controllers
    req.user = users[0];
    
    // Move to the next middleware or controller
    next();
});

// 2. Check if the user has the correct role (e.g., Admin)
export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        // req.user is set by the isAuthenticated middleware above
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
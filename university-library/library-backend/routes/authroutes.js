import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    verifyOTP, 
    getUserProfile,
    forgotPassword,
    resetPassword,
    updatePasswordLoggedIn 
} from '../controllers/authcontroller.js';
import { registerLimiter, loginLimiter } from '../middleware/rateLimiters.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { updateAvatar } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/register', registerLimiter, registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginLimiter, loginUser);
router.get('/logout',isAuthenticated, logoutUser); 
router.get('/me', isAuthenticated, getUserProfile);
// Add this import at the top with your other auth controllers


// Add this route
router.put('/avatar/update', isAuthenticated, updateAvatar);
// Password Management Routes
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticated, updatePasswordLoggedIn);

export default router;
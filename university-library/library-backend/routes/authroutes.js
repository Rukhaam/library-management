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

const router = express.Router();

router.post('/register', registerLimiter, registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginLimiter, loginUser);
router.get('/logout',isAuthenticated, logoutUser); 
router.get('/me', isAuthenticated, getUserProfile);

// Password Management Routes
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticated, updatePasswordLoggedIn);

export default router;
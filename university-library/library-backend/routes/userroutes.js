import express from 'express';
import { getAllUsers, registerNewAdmin } from '../controllers/usercontrollers.js';
import { isAuthenticated, isAuthorized } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only an existing admin can view all users or create new admins
router.get('/all', isAuthenticated, isAuthorized("admin"), getAllUsers);
router.post('/admin/new', isAuthenticated, isAuthorized("admin"), registerNewAdmin);

export default router;
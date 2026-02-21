import express from 'express';
import { createBook, getAllBooks, deleteBook,updateBook } from '../controllers/bookcontrollers.js';
import { isAuthenticated, isAuthorized } from '../middleware/authMiddleware.js'; // Fixed relative path!

const router = express.Router(); // Changed to 'router' to match your routes below

// POST /api/books/admin/add
// Fixed the typo: Changed the second 'isAuthenticated' to 'isAuthorized'
router.post('/admin/add', isAuthenticated, isAuthorized("admin"), createBook);

// GET /api/books/all
router.get('/all', isAuthenticated, getAllBooks);
// PUT /api/books/admin/update/:id
router.put('/admin/update/:id', isAuthenticated, isAuthorized("admin"), updateBook);
// DELETE /api/books/delete/:id
router.delete("/delete/:id", isAuthenticated, isAuthorized("admin"), deleteBook);

export default router;
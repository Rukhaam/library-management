import express from 'express';
import { 
    borrowBook, 
    getMyBorrowedBooks, 
    getBorrowedBooksForAdmin, 
    returnBorrowedBooks 
} from '../controllers/borrowcontrollers.js';
import { isAuthenticated, isAuthorized } from '../middleware/authMiddleware.js';

const router = express.Router();

// =====USERROUTES========
// 1. Borrow a book: POST /api/borrow/add/:bookId
router.post('/add/:bookId', isAuthenticated, borrowBook);

// 2. See my current borrowed books: GET /api/borrow/my-books
router.get('/my-books', isAuthenticated, getMyBorrowedBooks);

// 3. Return a book: PUT /api/borrow/return/:bookId
router.put('/return/:bookId', isAuthenticated, returnBorrowedBooks);


// =========ADMIN ROUTES===============
// 4. See all library borrow records: GET /api/borrow/admin/all
router.get('/admin/all', isAuthenticated, isAuthorized("admin"), getBorrowedBooksForAdmin);

export default router;
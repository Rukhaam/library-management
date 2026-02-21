import { 
    checkActiveBorrow, 
    borrowBookModel, 
    getUserActiveBorrowsModel, 
    getAllBorrowRecordsModel, 
    returnBookModel 
} from '../models/borrowModels.js'; // Added the missing 3 imports
import { getBookByIdModel } from '../models/bookModels.js'; 
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { ErrorHandler } from '../middleware/errorMiddlewares.js';
import { calculateFine } from '../utils/fineCalculator.js';
// 1. BORROW A BOOK
export const borrowBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const userId = req.user.id; 

    // 1. Check if the book exists
    const book = await getBookByIdModel(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }

    // 2. Check if the book is available
    if (book.quantity < 1 || !book.is_available) {
        return next(new ErrorHandler("Sorry, this book is currently out of stock", 400));
    }

    // 3. Check if the user is ALREADY borrowing this exact book
    const alreadyBorrowed = await checkActiveBorrow(userId, bookId);
    if (alreadyBorrowed) {
        return next(new ErrorHandler("You have already borrowed this book. Please return it first.", 400));
    }

    // 4. Calculate the due date (14 days from right now)
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // 5. Process the borrow transaction
    await borrowBookModel(userId, bookId, book.quantity, dueDate);

    res.status(200).json({
        success: true,
        message: `You have successfully borrowed '${book.title}'. It is due back on ${dueDate.toDateString()}.`
    });
});
export const getMyBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await getUserActiveBorrowsModel(req.user.id);

    res.status(200).json({
        success: true,
        count: books.length,
        books
    });
});

// 2. GET ALL BORROW RECORDS (Admin Only)
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const records = await getAllBorrowRecordsModel();

    res.status(200).json({
        success: true,
        count: records.length,
        records
    });
});


// 3. RETURN A BOOK
export const returnBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if the user actually has this book borrowed
    const record = await checkActiveBorrow(userId, bookId);
    if (!record) {
        return next(new ErrorHandler("You do not have an active borrow record for this book", 404));
    }

    const book = await getBookByIdModel(bookId);

    const fine = calculateFine(record.due_date); // Defaults to 5 per day!

    await returnBookModel(record.id, bookId, book.quantity, fine);

    res.status(200).json({
        success: true,
        message: "Book returned successfully",
        fine: fine > 0 ? `Late fee of ${fine} applied.` : "No fine applied."
    });
});
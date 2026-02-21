import { createBookModel, getAllBooksModel ,deleteBookModel,updateBookModel,getBookByIdModel } from '../models/bookModels.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { ErrorHandler } from '../middleware/errorMiddlewares.js';

// 1. CREATE NEW BOOK (Admin only later, but open for testing now)
export const createBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity } = req.body|| {};

    // Basic validation
    if (!title || !author || !price || quantity === undefined) {
        return next(new ErrorHandler("Please provide title, author, price, and quantity", 400));
    }

    // Call the model to save to database
    const newBookId = await createBookModel({
        title,
        author,
        description,
        price,
        quantity
    });

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        bookId: newBookId
    });
});

// 2. GET ALL BOOKS
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await getAllBooksModel();

    res.status(200).json({
        success: true,
        count: books.length,
        books
    });
});
// 4. UPDATE BOOK (Admin Only)
export const updateBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check if the book actually exists first
    const existingBook = await getBookByIdModel(id);
    if (!existingBook) {
        return next(new ErrorHandler(`Book not found with ID: ${id}`, 404));
    }

    // 2. Merge the old data with the new data from the request body
    const updatedData = {
        title: req.body.title || existingBook.title,
        author: req.body.author || existingBook.author,
        description: req.body.description || existingBook.description,
        price: req.body.price || existingBook.price,
        // Quantity can be 0, so we check if it's explicitly provided, otherwise keep old
        quantity: req.body.quantity !== undefined ? req.body.quantity : existingBook.quantity
    };

    // 3. Save the updates to the database
    await updateBookModel(id, updatedData);

    res.status(200).json({
        success: true,
        message: "Book updated successfully"
    });
});
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const affectedRows = await deleteBookModel(id);

    // If affectedRows is 0, it means no book with that ID existed
    if (affectedRows === 0) {
        return next(new ErrorHandler(`Book not found with ID: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
});
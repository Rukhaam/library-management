import { createBookModel, getAllBooksModel ,deleteBookModel,updateBookModel,getBookByIdModel } from '../models/bookModels.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { ErrorHandler } from '../middleware/errorMiddlewares.js';
import db from '../config/db.js';

// 1. ADD NEW BOOK
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
// UPDATE BOOK
// UPDATE BOOK
export const updateBook = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, author, description, price, quantity } = req.body;
  
      const newQuantity = Number(quantity);
      const newPrice = Number(price);
  
      // 1. Check if book exists
      const [existingBooks] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
      
      if (existingBooks.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // 2. Find out how many copies are currently in the hands of students
      const [activeBorrows] = await db.query(
        "SELECT COUNT(*) as borrowed_count FROM borrow_records WHERE book_id = ? AND return_date IS NULL",
        [id]
      );
      const borrowedCount = activeBorrows[0].borrowed_count;
  
      // 3. Block update if admin tries to set total quantity lower than what is already borrowed
      if (newQuantity < borrowedCount) {
        return res.status(400).json({ 
          message: `Cannot lower quantity to ${newQuantity}. There are currently ${borrowedCount} copies borrowed by students.` 
        });
      }
  
      // 4. Calculate if it should still be marked as "available" (true/false)
      const isAvailable = newQuantity > borrowedCount;
  
      // 5. Update the database using your EXACT schema columns
      await db.query(
        "UPDATE books SET title=?, author=?, description=?, price=?, quantity=?, is_available=? WHERE id=?",
        [title, author, description, newPrice, newQuantity, isAvailable, id] 
      );
  
      res.status(200).json({
        success: true,
        message: "Book updated successfully!",
      });
  
    } catch (error) {
      console.log("🔥 BACKEND CRASH DETECTED 🔥");
      console.log(error.message);
      res.status(500).json({ message: "Backend error: " + error.message });
    }
  };
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const affectedRows = await deleteBookModel(id);
    if (affectedRows === 0) {
        return next(new ErrorHandler(`Book not found with ID: ${id}`, 404));
    }
    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
});
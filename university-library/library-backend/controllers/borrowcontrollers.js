import {
  checkActiveBorrow,
  borrowBookModel,
  getUserActiveBorrowsModel,
  getAllBorrowRecordsModel,
  returnBookModel,
  settleUserFinesModel
} from "../models/borrowModels.js";
import { getBookByIdModel } from "../models/bookModels.js";
import { findUserByEmail } from "../models/userModels.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../middleware/errorMiddlewares.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const borrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body; // Grab email if sent by Admin via Record Popup

  let userId = req.user.id;
  if (email) {
    const targetUser = await findUserByEmail(email);
    if (!targetUser) {
      return next(new ErrorHandler("User with this email not found", 404));
    }
    userId = targetUser.id; // Use the student's ID instead of Admin's
  }

  // 1. Check if the book exists
  const book = await getBookByIdModel(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // 2. Check if the book is available
  if (book.quantity < 1 || !book.is_available) {
    return next(
      new ErrorHandler("Sorry, this book is currently out of stock", 400)
    );
  }

  // 3. Check if the user is ALREADY borrowing this exact book
  const alreadyBorrowed = await checkActiveBorrow(userId, bookId);
  if (alreadyBorrowed) {
    return next(
      new ErrorHandler("This user has already borrowed this book.", 400)
    );
  }

  // 4. Calculate the due date (14 days from right now)
  const dueDate = new Date(Date.now()  +14 * 24 * 60 * 60 * 1000);

  // 5. Process the borrow transaction
  await borrowBookModel(userId, bookId, book.quantity, dueDate);

  res.status(200).json({
    success: true,
    message: `Successfully recorded borrow for '${
      book.title
    }'. Due back on ${dueDate.toDateString()}.`,
  });
});

// GET MY BORROWED BOOKS (Standard User)
export const getMyBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await getUserActiveBorrowsModel(req.user.id);

  res.status(200).json({
    success: true,
    count: books.length,
    books,
  });
});

// 2. GET ALL BORROW RECORDS (Admin Only)
export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const records = await getAllBorrowRecordsModel();

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  }
);

// 3. RETURN A BOOK
export const returnBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  let userId = req.user.id;

  if (email) {
    const targetUser = await findUserByEmail(email);
    if (!targetUser) {
      return next(new ErrorHandler("User with this email not found", 404));
    }
    userId = targetUser.id;
  }

  const record = await checkActiveBorrow(userId, bookId);
  if (!record) {
    return next(
      new ErrorHandler(
        "You do not have an active borrow record for this book",
        404
      )
    );
  }

  const book = await getBookByIdModel(bookId);
  const fine = calculateFine(record.due_date);
  await returnBookModel(record.id, bookId, book.quantity, fine);

  const fineText = fine > 0 ? ` Late fee of $${fine} applied! 💸` : "";

  res.status(200).json({
    success: true,
    message: "Book returned successfully!" + fineText, // React will now show the fine!
  });
});
// DELETE BOOK
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 1. Check if the book exists
  const [book] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
  if (book.length === 0) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // 2. Check if the book is currently borrowed (return_date is NULL)
  const [activeBorrows] = await db.query(
    "SELECT * FROM borrow_records WHERE book_id = ? AND return_date IS NULL",
    [id]
  );

  if (activeBorrows.length > 0) {
    return next(
      new ErrorHandler(
        "Cannot delete this book because it is currently borrowed by a student.",
        400
      )
    );
  }

  // 3. Clear past borrow history to prevent MySQL Foreign Key constraint errors
  await db.query("DELETE FROM borrow_records WHERE book_id = ?", [id]);

  // 4. Delete the actual book
  await db.query("DELETE FROM books WHERE id = ?", [id]);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully!",
  });
});
export const settleUserFines = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // This is the user ID

  const result = await settleUserFinesModel(id);

  if (result.affectedRows === 0) {
    return next(new ErrorHandler("No unpaid fines found for this user.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Fines settled successfully! The student's dues are now clear. 💸",
  });
});

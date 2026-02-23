import db from '../config/db.js';
export const checkActiveBorrow = async (userId, bookId) => {
    const [rows] = await db.query(
        'SELECT * FROM borrow_records WHERE user_id = ? AND book_id = ? AND return_date IS NULL',
        [userId, bookId]
    );
    return rows[0];
};
export const getUserActiveBorrowsModel = async (userId) => {
    const [rows] = await db.query(
        'SELECT b.title, b.author, b.description, br.* FROM borrow_records br JOIN books b ON br.book_id = b.id WHERE br.user_id = ? ORDER BY br.borrow_date DESC',
        [userId]
    );
    return rows;
};

export const getAllBorrowRecordsModel = async () => {
    const [rows] = await db.query(
        'SELECT u.name as user_name, u.email as user_email, b.title as book_title, br.* FROM borrow_records br JOIN users u ON br.user_id = u.id JOIN books b ON br.book_id = b.id WHERE br.return_date IS NULL ORDER BY br.borrow_date DESC'
    );
    return rows;
};

export const returnBookModel = async (recordId, bookId, currentQuantity, fine) => {
    // Mark as returned
    await db.query(
        'UPDATE borrow_records SET return_date = CURRENT_TIMESTAMP, fine = ? WHERE id = ?',
        [fine, recordId]
    );

    // Increase book quantity
    await db.query(
        'UPDATE books SET quantity = ?, is_available = 1 WHERE id = ?',
        [currentQuantity + 1, bookId]
    );
};

export const borrowBookModel = async (userId, bookId, currentQuantity, dueDate) => {
    const newQuantity = currentQuantity - 1;
    const is_available = newQuantity > 0;

    await db.query(
        'INSERT INTO borrow_records (user_id, book_id, due_date) VALUES (?, ?, ?)',
        [userId, bookId, dueDate]
    );

    await db.query(
        'UPDATE books SET quantity = ?, is_available = ? WHERE id = ?',
        [newQuantity, is_available, bookId]
    );
};
export const settleUserFinesModel = async (userId) => {
    const [result] = await db.query(
      "UPDATE borrow_records SET fine_status = 'Paid' WHERE user_id = ? AND fine_status = 'Unpaid' AND fine > 0",
      [userId]
    );
    return result;
  };
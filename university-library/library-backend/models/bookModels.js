import db from '../config/db.js';

// Add a new book to the database
export const createBookModel = async (bookData) => {
    const { title, author, description, price, quantity } = bookData;
    const is_available = quantity > 0; 

    const [result] = await db.query(
        'INSERT INTO books (title, author, description, price, quantity, is_available) VALUES (?, ?, ?, ?, ?, ?)',
        [title, author, description, price, quantity, is_available]
    );
    
    return result.insertId;
};
// Get a single book by ID
export const getBookByIdModel = async (id) => {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0]; // Returns the book object, or undefined if not found
};

// Update a book by ID
export const updateBookModel = async (id, bookData) => {
    const { title, author, description, price, quantity } = bookData;
    
    // Auto-update availability based on the new quantity
    const is_available = quantity > 0;

    const [result] = await db.query(
        'UPDATE books SET title = ?, author = ?, description = ?, price = ?, quantity = ?, is_available = ? WHERE id = ?',
        [title, author, description, price, quantity, is_available, id]
    );
    
    return result.affectedRows;
};
// Get all books
export const getAllBooksModel = async () => {
    const [rows] = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
};
// Delete a book by ID
export const deleteBookModel = async (id) => {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows; // Returns how many rows were deleted (0 if not found)
};

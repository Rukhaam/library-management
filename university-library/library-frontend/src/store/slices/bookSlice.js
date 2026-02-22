import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // ==========================
    // FETCH ALL BOOKS
    // ==========================
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload.books; 
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // ADD NEW BOOK
    // ==========================
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // DELETE BOOK
    // ==========================
    deleteBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    deleteBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // RESET UTILITY
    // ==========================
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const {
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksFailed,
  addBookRequest,
  addBookSuccess,
  addBookFailed,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailed,
  resetBookSlice: resetBookSliceAction,
} = bookSlice.actions;

export default bookSlice.reducer;

// ==========================================
// THUNKS (Async Actions)
// ==========================================

export const resetBookSlice = () => (dispatch) => {
  dispatch(resetBookSliceAction());
};

// 1. Fetch All Books
export const fetchAllBooks = () => async (dispatch) => {
  try {
    dispatch(fetchBooksRequest());
    const res = await axios.get("http://localhost:5000/api/books/all", {
      withCredentials: true,
    });
    dispatch(fetchBooksSuccess(res.data));
  } catch (err) {
    dispatch(fetchBooksFailed(err.response?.data?.message || "Failed to fetch books"));
  }
};

// 2. Add New Book (Supports image upload via FormData)
export const addNewBook = (data) => async (dispatch) => {
    try {
      dispatch(addBookRequest());
      
      const res = await axios.post("http://localhost:5000/api/books/admin/add", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }, // 👈 Change this to JSON
      });
      
      dispatch(addBookSuccess(res.data));
      dispatch(fetchAllBooks()); 
    } catch (err) {
      dispatch(addBookFailed(err.response?.data?.message || "Failed to add book"));
    }
  };

// 3. Delete a Book
export const deleteBook = (bookId) => async (dispatch) => {
  try {
    dispatch(deleteBookRequest());
    
    const res = await axios.delete(`http://localhost:5000/api/books/delete/${bookId}`, {
      withCredentials: true,
    });
    
    dispatch(deleteBookSuccess(res.data));
    dispatch(fetchAllBooks()); // Refresh the library instantly
  } catch (err) {
    dispatch(deleteBookFailed(err.response?.data?.message || "Failed to delete book"));
  }
};
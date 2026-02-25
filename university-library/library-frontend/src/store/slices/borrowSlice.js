import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchAllUsers } from "./userSlice";
const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    myBorrowedBooks: [], // For standard users
    allBorrowedBooks: [], // For admins (The Catalog)
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // FETCH BORROWED BOOKS
    fetchBorrowedRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMyBorrowedSuccess(state, action) {
      state.loading = false;
      state.myBorrowedBooks = action.payload.books || [];
    },
    fetchAllBorrowedSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload.records || [];
    },
    fetchBorrowedFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // BORROW A BOOK
    borrowBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    borrowBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    borrowBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // RETURN A BOOK
    // ==========================
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // RESET UTILITY
    // ==========================
    resetBorrowSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const {
  fetchBorrowedRequest,
  fetchMyBorrowedSuccess,
  fetchAllBorrowedSuccess,
  fetchBorrowedFailed,
  borrowBookRequest,
  borrowBookSuccess,
  borrowBookFailed,
  returnBookRequest,
  returnBookSuccess,
  returnBookFailed,
  
  resetBorrowSlice: resetBorrowSliceAction,
} = borrowSlice.actions;

export default borrowSlice.reducer;

// THUNKS (Async Actions)

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(resetBorrowSliceAction());
};

// 1. Fetch logged-in user's borrowed books
export const fetchMyBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(fetchBorrowedRequest());
    const res = await axios.get("http://localhost:5000/api/borrow/my-books", {
      withCredentials: true,
    });
    dispatch(fetchMyBorrowedSuccess(res.data));
  } catch (err) {
    dispatch(fetchBorrowedFailed(err.response?.data?.message || "Failed to fetch your books"));
  }
};

// 2. Fetch ALL borrowed books (Admin Only - For Catalog)
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(fetchBorrowedRequest());
    const res = await axios.get("http://localhost:5000/api/borrow/admin/all", {
      withCredentials: true,
    });
    dispatch(fetchAllBorrowedSuccess(res.data));
  } catch (err) {
    dispatch(fetchBorrowedFailed(err.response?.data?.message || "Failed to fetch catalog"));
  }
};

// 3. Borrow a Book
export const borrowBook = ({ bookId, email }) => async (dispatch) => {
    try {
      dispatch(borrowBookRequest()); 
      
      const res = await axios.post(`http://localhost:5000/api/borrow/add/${bookId}`, { email }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      
      dispatch(borrowBookSuccess(res.data));
      dispatch(fetchMyBorrowedBooks()); // Refresh
    } catch (err) {
      dispatch(borrowBookFailed(err.response?.data?.message || "Failed to borrow book"));
    }
  };
// 4. Return a Book
export const returnBook = ({ bookId, email }) => async (dispatch) => {
  try {
    dispatch(returnBookRequest());
    
    const res = await axios.put(`http://localhost:5000/api/borrow/return/${bookId}`, { email }, {
      withCredentials: true,
    });
    
    dispatch(returnBookSuccess(res.data));
    dispatch(fetchMyBorrowedBooks()); 
    dispatch(fetchAllBorrowedBooks()); 
  } catch (err) {
    dispatch(returnBookFailed(err.response?.data?.message || "Failed to return book"));
  }
};
// SETTLE USER FINES
export const settleUserFines = (userId) => async (dispatch) => {
  try {
    dispatch(borrowBookRequest()); 
    
    const res = await axios.put(`http://localhost:5000/api/borrow/admin/users/${userId}/pay-fines`, {}, {
      withCredentials: true,
    });
    
    dispatch(borrowBookSuccess({ message: "Fine collected successfully! 💸" },res));
    
    dispatch(fetchAllUsers()); 
  } catch (err) {
    dispatch(borrowBookFailed(err.response?.data?.message || "Failed to settle fines"));
  }
};
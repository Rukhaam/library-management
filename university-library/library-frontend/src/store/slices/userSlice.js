import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // ==========================
    // FETCH ALL USERS
    // ==========================
    fetchUsersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users; // Ensure your backend sends it inside a 'users' array
    },
    fetchUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // ADD NEW ADMIN
    // ==========================
    addNewAdminRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewAdminSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    addNewAdminFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ==========================
    // RESET UTILITY
    // ==========================
    resetUserSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailed,
  addNewAdminRequest,
  addNewAdminSuccess,
  addNewAdminFailed,
  resetUserSlice: resetUserSliceAction,
} = userSlice.actions;

export default userSlice.reducer;

// ==========================================
// THUNKS (Async Actions)
// ==========================================

export const resetUserSlice = () => (dispatch) => {
  dispatch(resetUserSliceAction());
};

// 1. Fetch All Users (Admin Only)
export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(fetchUsersRequest());
    const res = await axios.get("http://localhost:5000/api/users/all", {
      withCredentials: true,
    });
    dispatch(fetchUsersSuccess(res.data));
  } catch (err) {
    dispatch(fetchUsersFailed(err.response?.data?.message || "Failed to fetch users"));
  }
};

// 2. Add New Admin
export const addNewAdmin = (data) => async (dispatch) => {
  try {
    dispatch(addNewAdminRequest());
    
    // ⚠️ CRITICAL: Notice the Content-Type! 
    // Because we are uploading an Avatar image file, it MUST be multipart/form-data
    const res = await axios.post("http://localhost:5000/api/users/admin/new", data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    dispatch(addNewAdminSuccess(res.data));
  } catch (err) {
    dispatch(addNewAdminFailed(err.response?.data?.message || "Failed to add admin"));
  }
};
// Add this right below your addNewAdmin thunk
export const promoteToAdmin = (userId) => async (dispatch) => {
    try {
      dispatch(addNewAdminRequest()); 
      const res = await axios.put(`http://localhost:5000/api/users/promote/${userId}`, {}, {
        withCredentials: true,
      });
      
      dispatch(addNewAdminSuccess({ message: res.data.message }));
      dispatch(fetchAllUsers()); 
    } catch (err) {
      // 👇 ADD THIS LINE TO DEBUG:
      console.error("PROMOTE ERROR:", err.response || err); 
      
      dispatch(addNewAdminFailed(err.response?.data?.message || "Failed to promote user"));
    }
  };
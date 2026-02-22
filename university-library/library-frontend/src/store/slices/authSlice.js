import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
// initialState: {
//     loading: false,
//     error: null,
//     message: null,
//     // 👇 Temporarily hardcode a user to test the UI!
//     user: { 
//        name: "Test Admin", 
//        role: "admin", // Change this to "user" to see the other menu!
//        avatar: { url: "" } 
//     },
//     isAuthenticated: true, // 👇 Temporarily set to true
//   },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    otpVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
     
    },
  },
});

// Exporting actions destructured makes the thunks below much cleaner to read
export const {
  registerRequest, registerSuccess, registerFailed,
  otpVerificationRequest, otpVerificationSuccess, otpVerificationFailed,
  loginRequest, loginSuccess, loginFailed,
  logoutRequest, logoutSuccess, logoutFailed,
  getUserRequest, getUserSuccess, getUserFailed,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailed,
  resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed,
  resetAuthSlice: resetAuthSliceAction
} = authSlice.actions;

export default authSlice.reducer;

// ==========================================
// THUNKS (Using clean try/catch)
// ==========================================

export const resetAuthSlice = () => (dispatch) => {
  dispatch(resetAuthSliceAction());
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const res = await axios.post("http://localhost:5000/api/auth/register", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(registerSuccess(res.data));
  } catch (err) {
    dispatch(registerFailed(err.response?.data?.message || "Registration Failed"));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());
    const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(otpVerificationSuccess(res.data));
  } catch (err) {
    dispatch(otpVerificationFailed(err.response?.data?.message || "Verification Failed"));
  }
};

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginRequest()); // Fixed copy-paste bug here
    const res = await axios.post("http://localhost:5000/api/auth/login", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message || "Login Failed"));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest()); // Fixed copy-paste bug here
    const res = await axios.get("http://localhost:5000/api/auth/logout", {
      withCredentials: true,
    });
    dispatch(logoutSuccess(res.data.message));
    dispatch(resetAuthSliceAction());
  } catch (err) {
    dispatch(logoutFailed(err.response?.data?.message || "Logout Failed"));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest()); // Fixed copy-paste bug here
    const res = await axios.get("http://localhost:5000/api/auth/me", {
      withCredentials: true,
    });
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailed(err.response?.data?.message || "Failed to load user"));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest()); // Fixed copy-paste bug here
    const res = await axios.post("http://localhost:5000/api/auth/password/forgot", { email }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(forgotPasswordSuccess(res.data));
  } catch (err) {
    dispatch(forgotPasswordFailed(err.response?.data?.message || "Request Failed"));
  }
};

export const resetPassword = (data, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    // Fixed: Removed {email} parameter overload. Axios PUT is (url, data, config)
    const res = await axios.put(`http://localhost:5000/api/auth/password/reset/${token}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(resetPasswordSuccess(res.data));
  } catch (err) {
    dispatch(resetPasswordFailed(err.response?.data?.message || "Reset Failed"));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const res = await axios.put("http://localhost:5000/api/auth/password/update", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" } // Standard JSON header!
    });
    dispatch(updatePasswordSuccess(res.data.message));
  } catch (err) {
    dispatch(updatePasswordFailed(err.response?.data?.message || "Update Failed"));
  }
};
import React, { useEffect } from "react"; // Fixed lowercase 'react'
import { Button } from "./components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import Register from "./pages/Register.page";
import ForgotPassword from "./pages/ForgotPassword.page";
import OTP from "./pages/OTP.page";
import ResetPassword from "./pages/ResetPassword.page";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks } from "./store/slices/borrowSlice";
import { getUser } from "./store/slices/authSlice";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // 1. 👇 FETCH USER ON APP LOAD
  // This runs once when the app starts. It checks the browser for a cookie 
  // and silently logs the user back in if the cookie is still valid!
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // 2. FETCH ADMIN DATA
  useEffect(() => {
    // Make sure we are authenticated AND an admin before fetching all books
    if (isAuthenticated && user?.role === "admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer theme="colored" />
    </Router>
  );
};

export default App;
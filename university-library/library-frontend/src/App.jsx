import react,{useEffect} from "react";
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
      const {user,isAuthenticated} = useSelector((state)=>state.auth)
const dispatch = useDispatch()
useEffect(() => {
  if (user?.role === "admin") {
    dispatch(fetchAllBorrowedBooks());
  }
}); 


useEffect(() => {
  if (user?.role === "admin") {
    dispatch(fetchAllBorrowedBooks());
  }
}, [dispatch, user]);
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
      <ToastContainer theme="colored"/>
    </Router>
  );
};

export default App;

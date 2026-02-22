import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetAuthSlice } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { Library, KeySquare, ArrowLeft } from "lucide-react"; 

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Grab the secure token from the URL (e.g., /password/reset/:token)
  const { token } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab the global auth state from Redux
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 1. If successfully reset (and automatically logged in), redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }

    // 2. Handle Errors (e.g., Token expired, passwords don't match backend validation)
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice()); 
    }

    // 3. Handle Success Message 
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, isAuthenticated, navigate, dispatch]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    // Quick frontend validation before hitting the backend
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Dispatch the thunk from authSlice
    // Note: Our thunk expects (data, token) where data is an object
    dispatch(resetPassword({ password, confirmPassword }, token));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      
      {/* ==================================== */}
      {/* ⬅️ LEFT SIDE: Branding (Hidden on Mobile) */}
      {/* ==================================== */}
      <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col justify-center items-center p-8 rounded-tr-[80px] rounded-br-[80px] z-10 shadow-2xl">
        <div className="text-center mb-12 flex flex-col items-center">
          <KeySquare size={80} className="mb-6 text-brand-primary drop-shadow-[0_0_15px_rgba(33,212,30,0.8)]" />
          <h1 className="text-5xl font-bold tracking-wider mb-4">Create New Password</h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Almost there! Please choose a strong password that you haven't used before.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">Remembered it suddenly?</p>
          <Link
            to="/login"
            className="border-2 border-white px-8 py-2 rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* ==================================== */}
      {/* ➡️ RIGHT SIDE: Reset Form */}
      {/* ==================================== */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        
        {/* Back Button */}
        <Link 
          to="/login" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="w-full max-w-md mt-12 md:mt-0">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex md:hidden justify-center items-center gap-2 mb-8 text-black">
             <Library size={32} className="text-brand-primary" />
             <h2 className="text-3xl font-bold">LibSys</h2>
          </div>

          <h3 className="text-4xl font-bold mb-2 text-color-text-secondary">Reset Password</h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please enter your new password below.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* New Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

             {/* Confirm Password Input */}
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all duration-300
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl"
                }
              `}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
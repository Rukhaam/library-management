import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { ShieldCheck, MailOpen, ArrowLeft } from "lucide-react"; // Sleek security icons

const OTP = () => {
  const [otp, setOtp] = useState("");
  
  // Grab the email parameter from the URL (e.g., /otp-verification/user@email.com)
  const { email } = useParams(); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab the global auth state
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 1. If user is successfully authenticated (OTP was correct), send to dashboard
    if (isAuthenticated) {
      navigate("/");
    }

    // 2. Handle Errors
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }

    // 3. Handle Success Message (e.g., "Account verified successfully!")
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, isAuthenticated, navigate, dispatch]);

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    
    // Ensure OTP isn't blank
    if (!otp.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    // Dispatch the thunk we wrote in authSlice
    dispatch(otpVerification(email, otp));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      
      {/* ==================================== */}
      {/* ⬅️ LEFT SIDE: Branding (Hidden on Mobile) */}
      {/* ==================================== */}
      <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col justify-center items-center p-8 rounded-tr-[80px] rounded-br-[80px] z-10 shadow-2xl">
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Security Shield Icon */}
          <ShieldCheck size={80} className="mb-6 text-brand-primary drop-shadow-[0_0_15px_rgba(33,212,30,0.8)]" />
          <h1 className="text-5xl font-bold tracking-wider mb-4">Secure Login</h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            We've sent a 6-digit verification code to your email to ensure your account's security.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">Didn't receive the code?</p>
          <button
            onClick={() => toast.info("Resend functionality coming soon!")}
            className="border-2 border-white px-8 py-2 rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Resend Code
          </button>
        </div>
      </div>

      {/* ==================================== */}
      {/* ➡️ RIGHT SIDE: OTP Form */}
      {/* ==================================== */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        
        {/* Back Button (Absolute positioned at top left of right section) */}
        <Link 
          to="/register" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="w-full max-w-md mt-12 md:mt-0">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex md:hidden justify-center items-center gap-2 mb-8 text-black">
             <ShieldCheck size={32} className="text-brand-primary" />
             <h2 className="text-3xl font-bold">Verification</h2>
          </div>

          <div className="flex items-center gap-3 mb-2">
             <MailOpen className="text-brand-primary" size={28} />
             <h3 className="text-4xl font-bold text-color-text-secondary">Check Email</h3>
          </div>
          
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please enter the verification code sent to <br/>
            <span className="font-bold text-black">{email || "your email"}</span>
          </p>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="number"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                // Hide arrows on number input for a cleaner look
                className="w-full px-4 py-4 border-2 border-border rounded-lg text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-4 rounded-lg font-bold text-white text-lg transition-all duration-300
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl"
                }
              `}
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default OTP;
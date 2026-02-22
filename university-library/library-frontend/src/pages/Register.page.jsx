import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, resetAuthSlice } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { Library } from "lucide-react"; // Using Lucide icon for the logo

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab the global auth state
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 1. If user is already logged in, redirect them to the dashboard
    if (isAuthenticated) {
      navigate("/");
    }

    // 2. Handle Errors
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }

    // 3. Handle Success (Redirect to OTP page)
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      // We pass the email in the URL so the OTP page knows who is verifying
      navigate(`/otp-verification/${email}`); 
    }
  }, [error, message, isAuthenticated, navigate, dispatch, email]);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      
      {/* ==================================== */}
      {/* ⬅️ LEFT SIDE: Branding (Hidden on Mobile) */}
      {/* ==================================== */}
      <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col justify-center items-center p-8 rounded-tr-[80px] rounded-br-[80px] z-10 shadow-2xl">
        <div className="text-center mb-12 flex flex-col items-center">
          <Library size={80} className="mb-6 text-brand-primary drop-shadow-[0_0_15px_rgba(33,212,30,0.8)]" />
          <h1 className="text-5xl font-bold tracking-wider mb-4">LibSys</h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Your premier digital library for borrowing, reading, and managing books.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">Already have an account?</p>
          <Link
            to="/login"
            className="border-2 border-white px-8 py-2 rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Sign In Now
          </Link>
        </div>
      </div>

      {/* ==================================== */}
      {/* ➡️ RIGHT SIDE: Registration Form */}
      {/* ==================================== */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex md:hidden justify-center items-center gap-2 mb-8 text-black">
             <Library size={32} className="text-brand-primary" />
             <h2 className="text-3xl font-bold">LibSys</h2>
          </div>

          <h3 className="text-4xl font-bold mb-2 text-color-text-secondary">Sign Up</h3>
          <p className="text-gray-500 mb-8">
            Please provide your information to create an account.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Mobile Footer Link (Only visible on small screens) */}
          <div className="mt-8 text-center md:hidden block">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-black hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
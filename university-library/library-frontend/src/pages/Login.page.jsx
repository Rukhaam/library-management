import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { Library, LogIn } from "lucide-react"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab the global auth state from Redux
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 1. If user is already logged in, redirect them immediately to the dashboard
    if (isAuthenticated) {
      navigate("/");
    }

    // 2. Handle Login Errors (e.g., Wrong password)
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice()); // Clear the error so it doesn't loop
    }

    // 3. Handle Success Message 
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, isAuthenticated, navigate, dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Dispatch the thunk from authSlice
    dispatch(login({ email, password }));
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
            Welcome back! Access your digital library to borrow, read, and explore.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">New to our platform?</p>
          <Link
            to="/register"
            className="border-2 border-white px-8 py-2 rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* ==================================== */}
      {/* ➡️ RIGHT SIDE: Login Form */}
      {/* ==================================== */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex md:hidden justify-center items-center gap-2 mb-8 text-black">
             <Library size={32} className="text-brand-primary" />
             <h2 className="text-3xl font-bold">LibSys</h2>
          </div>

          <div className="flex items-center gap-3 mb-2">
             <LogIn className="text-brand-primary" size={32} />
             <h3 className="text-4xl font-bold text-color-text-secondary">Sign In</h3>
          </div>

          <p className="text-gray-500 mb-8">
            Please enter your credentials to log in.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-semibold text-gray-700">
                   Password
                 </label>
                 {/* Forgot Password Link */}
                 <Link 
                   to="/password/forgot" 
                   className="text-sm font-bold text-brand-primary hover:underline"
                 >
                   Forgot Password?
                 </Link>
              </div>
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
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Mobile Footer Link (Only visible on small screens) */}
          <div className="mt-8 text-center md:hidden block">
            <p className="text-gray-600 text-sm">
              New to our platform?{" "}
              <Link to="/register" className="font-bold text-black hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
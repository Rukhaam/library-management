import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "@/store/slices/popupSlice";
import { updatePassword } from "@/store/slices/authSlice"; // 👈 Imported your thunk!
import { Settings, X, Lock, Save } from "lucide-react";
import { toast } from "react-toastify";

const SettingPopup = () => {
  const dispatch = useDispatch();
  
  // Grab loading state from auth slice to disable button while submitting
  const { loading } = useSelector((state) => state.auth);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleUpdatePassword = (e) => {
    e.preventDefault();

    // 1. Frontend Validation
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    // 2. Package it as a standard JSON object instead of FormData!
    const data = {
        oldPassword: currentPassword, // ✅ Maps your React state to the backend's expected name!
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };
    // 3. Dispatch to backend
    dispatch(updatePassword(data));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/20 p-2 rounded-lg text-brand-primary">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Settings</h3>
          </div>
          <button 
            onClick={() => dispatch(toggleSettingPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-600">
            <Lock size={18} />
            <h4 className="text-lg font-bold">Update Password</h4>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <input 
                type="password" 
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
              />
            </div>

            {/* Confirm New Password */}
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
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => dispatch(toggleSettingPopup())}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-md flex items-center gap-2 transition-colors ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                <Save size={16} />
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingPopup;
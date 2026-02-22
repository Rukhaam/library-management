import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "@/store/slices/popupSlice";
import { updatePassword, updateAvatar, resetAuthSlice } from "@/store/slices/authSlice"; 
import { Settings, X, Lock, Save, UploadCloud, User } from "lucide-react";
import { toast } from "react-toastify";

const SettingPopup = () => {
  const dispatch = useDispatch();
  
  const { user, loading, error, message } = useSelector((state) => state.auth);

  // ==========================
  // TAB STATE
  // ==========================
  const [activeTab, setActiveTab] = useState("avatar"); // Toggles between 'avatar' and 'password'

  // ==========================
  // PASSWORD STATES
  // ==========================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================
  // AVATAR STATES
  // ==========================
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || "");
  const [avatarData, setAvatarData] = useState("");

  // ==========================
  // NOTIFICATIONS (Toasts)
  // ==========================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      dispatch(toggleSettingPopup()); // Close popup on any success!
    }
  }, [error, message, dispatch]);

  // ==========================
  // HANDLERS
  // ==========================
  
  // 1. Password Handler
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      toast.error("New password must be between 8 and 16 characters.");
      return;
    }
    const data = {
      oldPassword: currentPassword, 
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };
    dispatch(updatePassword(data));
  };

  // 2. Avatar Selection Handler (Base64 Conversion)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatarData(reader.result); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Avatar Submit Handler
  const handleUpdateAvatar = (e) => {
    e.preventDefault();
    if (!avatarData) {
      toast.warning("Please select a new image first!");
      return;
    }
    dispatch(updateAvatar(avatarData));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
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

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("avatar")}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
              activeTab === "avatar" ? "border-b-2 border-brand-primary text-brand-primary" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Profile Picture
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
              activeTab === "password" ? "border-b-2 border-brand-primary text-brand-primary" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Security
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* ================================== */}
          {/* TAB 1: AVATAR UPLOAD FORM          */}
          {/* ================================== */}
          {activeTab === "avatar" && (
            <form onSubmit={handleUpdateAvatar} className="flex flex-col items-center">
              <div className="relative group cursor-pointer mt-4">
                <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-50 flex justify-center items-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-300" />
                  )}
                </div>
                
                {/* Hover Upload Overlay */}
                <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <UploadCloud size={24} className="mb-1" />
                  <span className="text-xs font-bold">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Click your avatar to select a new image.<br />Max size: 2MB.
              </p>

              <div className="mt-8 w-full flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading || !avatarData}
                  className={`w-full py-2.5 text-sm font-bold text-white rounded-lg shadow-md flex justify-center items-center gap-2 transition-colors ${
                    loading || !avatarData ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                  }`}
                >
                  <Save size={16} />
                  {loading ? "Uploading..." : "Save Avatar"}
                </button>
              </div>
            </form>
          )}

          {/* ================================== */}
          {/* TAB 2: UPDATE PASSWORD FORM        */}
          {/* ================================== */}
          {activeTab === "password" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <Lock size={18} />
                <h4 className="text-md font-bold">Update Credentials</h4>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" 
                />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="submit" disabled={loading}
                  className={`w-full py-2.5 text-sm font-bold text-white rounded-lg shadow-md flex justify-center items-center gap-2 transition-colors ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                  }`}
                >
                  <Save size={16} />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
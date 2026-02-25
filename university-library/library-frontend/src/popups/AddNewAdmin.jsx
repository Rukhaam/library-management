import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserPlus, X, ImagePlus } from "lucide-react";
import { toggleAddNewAdminPopup } from "@/store/slices/popupSlice";
import { addNewAdmin, fetchAllUsers, resetUserSlice } from "@/store/slices/userSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();

  // Component State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Avatar States
  const [avatar, setAvatar] = useState(""); 
  const [avatarPreview, setAvatarPreview] = useState("");

  // Redux State
  const { loading, error, message } = useSelector((state) => state.user);

  // Handle Notifications & Auto-close on success
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
      dispatch(fetchAllUsers());
      dispatch(toggleAddNewAdminPopup()); 
    }
  }, [error, message, dispatch]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();

    const adminData = {
      name,
      email,
      phone,
      password,
      avatar 
    };

    dispatch(addNewAdmin(adminData));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/20 p-2 rounded-lg text-brand-primary">
              <UserPlus size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Add New Admin</h3>
          </div>
          <button 
            onClick={() => dispatch(toggleAddNewAdminPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body (Scrollable if needed) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleAddNewAdmin} className="space-y-5">
            
            {/* 📸 Avatar Upload Section */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 group-hover:border-brand-primary transition-colors shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 group-hover:border-brand-primary group-hover:text-brand-primary transition-colors">
                    <ImagePlus size={28} className="mb-1" />
                    <span className="text-xs font-semibold">Upload</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                  Change
                </div>
              </label>
              
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-400 mt-2">Optional: Choose a profile picture</p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@libsys.com"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Phone Input (Added specifically for your MySQL DB) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Temporary Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-black hover:bg-gray-800 shadow-md"
                }`}
              >
                {loading ? "Registering..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddNewAdmin;
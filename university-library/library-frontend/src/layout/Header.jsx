import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "@/store/slices/popupSlice"; // Import popup action
import { Settings, User } from "lucide-react"; // Using Lucide icons for consistency

const Header = () => {
  const dispatch = useDispatch();
  
  // Grab the logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  // States for live clock
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // --- FORMAT TIME (12-hour clock) ---
      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Converts 0 (midnight) to 12
      const minutes = now.getMinutes().toString().padStart(2, "0"); // Adds leading zero (e.g., 05)
      
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // --- FORMAT DATE (e.g., Oct 24, 2023) ---
      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    // 1. Call it immediately so there's no 1-second delay/blank space
    updateDateTime(); 

    // 2. Set up the interval to run every 1 second (1000ms)
    const intervalId = setInterval(updateDateTime, 1000);

    // 3. Cleanup function to stop the timer if the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-border w-full py-4 px-6 flex justify-between items-center z-10 sticky top-0">
      
      {/* ⬅️ LEFT SIDE: User Info */}
      <div className="flex items-center gap-3">
        {user?.avatar?.url ? (
          <img 
            src={user.avatar.url} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-300">
            <User size={20} />
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="text-sm font-bold text-color-text-secondary leading-none">
            {user?.name || "Guest User"}
          </span>
          <span className="text-xs text-brand-secondary capitalize mt-1 tracking-wider">
            {user?.role || "Visitor"}
          </span>
        </div>
      </div>

      {/* ➡️ RIGHT SIDE: Date/Time & Settings */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Real-time Clock (Hidden on super small mobile screens for space) */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-color-text-secondary leading-none">
            {currentTime}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {currentDate}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

        {/* Settings Button */}
        <button 
          onClick={() => dispatch(toggleSettingPopup())}
          className="p-2 rounded-full hover:bg-gray-100 transition-all text-gray-600 hover:text-brand-primary cursor-pointer hover:shadow-glow"
          title="Settings"
        >
          <Settings size={24} />
        </button>
        
      </div>
    </header>
  );
};

export default Header;
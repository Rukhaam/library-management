import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "@/store/slices/authSlice";
import {
  toggleSettingPopup,
  toggleAddNewAdminPopup,
} from "@/store/slices/popupSlice";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  X,
  Library,
  Users,
  BookText,
  BookMarked,
  UserPlus,
} from "lucide-react";
import AddNewAdmin from "@/popups/AddNewAdmin";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  selectedComponent,
  setSelectedComponent,
}) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup } = useSelector((state) => state.popup);

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSignOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, dispatch, isAuthenticated]);

  // Helper function to figure out if a button is active and return the right CSS
  const getLinkClasses = (componentName) => {
    const isActive = selectedComponent === componentName;
    return `flex items-center w-full text-left gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 font-semibold ${
      isActive
        ? "bg-brand-primary text-white shadow-glow"
        : "text-gray-600 hover:bg-gray-100 hover:text-color-text-secondary"
    }`;
  };

  // Base classes for popup buttons (they don't get an "active" highlighted state)
  const popupClasses =
    "flex items-center w-full text-left gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 font-semibold text-gray-600 hover:bg-gray-100 hover:text-color-text-secondary";

  return (
    <>
      {/* 📱 Mobile Overlay */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      {/* 🖥️ Sidebar Container */}
      <aside
        className={`fixed md:relative z-50 w-64 h-full bg-white border-r border-border transition-transform duration-300 ease-in-out flex flex-col
        ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header / Logo Area */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2 text-heading">
            <Library size={28} />
            <h2 className="text-2xl font-bold tracking-wider">LibSys</h2>
          </div>
          <X
            className="md:hidden cursor-pointer text-gray-500 hover:text-black transition-colors"
            onClick={() => setIsSideBarOpen(false)}
          />
        </div>

        {/* User Info Quick View */}
        {user && (
          <div className="p-4 flex flex-col items-center border-b border-border">
            <img
              // 👇 It will check for direct MySQL string, OR a nested object, OR fallback
              src={
                user?.avatar_url ||
                user?.avatar?.url ||
                "/placeholder-avatar.png"
              }
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary shadow-glow mb-2"
            />
            <span className="font-bold text-color-text-secondary">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              {user.role}
            </span>
          </div>
        )}

        {/* 🧭 Explicit Navigation Links */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {/* ==================================== */}
          {/* 👑 ADMIN VIEW */}
          {/* ==================================== */}
          {isAuthenticated && user?.role === "admin" && (
            <>
              <button
                className={getLinkClasses("Dashboard")}
                onClick={() => {
                  setSelectedComponent("Dashboard");
                  setIsSideBarOpen(false);
                }}
              >
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </button>

              <button
                className={getLinkClasses("Books")}
                onClick={() => {
                  setSelectedComponent("Books");
                  setIsSideBarOpen(false);
                }}
              >
                <BookOpen size={22} />
                <span>Books</span>
              </button>

              <button
                className={getLinkClasses("Catalog")}
                onClick={() => {
                  setSelectedComponent("Catalog");
                  setIsSideBarOpen(false);
                }}
              >
                <BookText size={22} />
                <span>Catalog</span>
              </button>

              <button
                className={getLinkClasses("Users")}
                onClick={() => {
                  setSelectedComponent("Users");
                  setIsSideBarOpen(false);
                }}
              >
                <Users size={22} />
                <span>Users</span>
              </button>

              <button
                className={popupClasses}
                onClick={() => {
                  dispatch(toggleAddNewAdminPopup());
                  setIsSideBarOpen(false);
                }}
              >
                <UserPlus size={22} />
                <span>Add New Admin</span>
              </button>

              <button
                className={popupClasses}
                onClick={() => {
                  dispatch(toggleSettingPopup());
                  setIsSideBarOpen(false);
                }}
              >
                <Settings size={22} />
                <span>Update Connection</span>
              </button>
            </>
          )}

          {/* ==================================== */}
          {/* 🧑 NORMAL USER VIEW */}
          {/* ==================================== */}
          {isAuthenticated && user?.role === "user" && (
            <>
              <button
                className={getLinkClasses("Dashboard")}
                onClick={() => {
                  setSelectedComponent("Dashboard");
                  setIsSideBarOpen(false);
                }}
              >
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </button>

              <button
                className={getLinkClasses("My Borrowed Books")}
                onClick={() => {
                  setSelectedComponent("My Borrowed Books");
                  setIsSideBarOpen(false);
                }}
              >
                <BookMarked size={22} />
                <span>My Borrowed Books</span>
              </button>

              <button
                className={popupClasses}
                onClick={() => {
                  dispatch(toggleSettingPopup());
                  setIsSideBarOpen(false);
                }}
              >
                <Settings size={22} />
                <span>Update Connection</span>
              </button>
            </>
          )}
        </nav>

        {/* 🚪 Logout Section */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full p-3 rounded-xl cursor-pointer transition-all duration-300 font-bold text-red-600 hover:bg-red-50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            <LogOut size={22} />
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
      {addNewAdminPopup && <AddNewAdmin></AddNewAdmin>}
    </>
  );
};

export default SideBar;

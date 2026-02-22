import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react"; 

// Layout
import SideBar from "../layout/SideBar";

// Dynamic Components 
import AdminDashboard from "../components/mainComponents/AdminDashBoard.component";
import UserDashboard from "../components/mainComponents/userDashBoard.component";
import BookManagement from "../components/mainComponents/BookManagement.component";
import Catalog from "../components/mainComponents/catalog.component";
import Users from "../components/mainComponents/User.component";
import MyBorrowedBooks from "../components/mainComponents/MyBorrowedBooks.component";

// 👇 1. IMPORT YOUR POPUPS HERE
import SettingPopup from "../popups/SettingPopup";
import AddNewAdminPopup from "../popups/AddNewAdmin"; 

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  // Grab  state
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { settingPopup, addNewAdminPopup } = useSelector((state) => state.popup);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
      case "Books":
        return <BookManagement />;
      case "Catalog":
        return user?.role === "admin" ? <Catalog /> : <Navigate to="/" />;
      case "Users":
        return user?.role === "admin" ? <Users /> : <Navigate to="/" />;
      case "My Borrowed Books":
        return <MyBorrowedBooks />; 
      default:
        return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <div className="relative flex h-screen bg-gray-50 overflow-hidden text-color-text-secondary">
      
      {/* Mobile Hamburger Menu Button */}
      <div 
        className="md:hidden absolute top-4 right-4 z-50 p-2 bg-brand-primary text-white rounded-md cursor-pointer shadow-glow transition-all"
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
      >
        <Menu size={24} />
      </div>

      {/* Sidebar Navigation */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full overflow-y-auto transition-all duration-300">
        {renderComponent()}
      </main>
 {settingPopup && <SettingPopup />}
      {addNewAdminPopup && <AddNewAdminPopup />}
    </div>
  );
};

export default Home;
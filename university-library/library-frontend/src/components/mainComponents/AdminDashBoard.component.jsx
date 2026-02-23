import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks } from "@/store/slices/bookSlice";
import { fetchAllBorrowedBooks } from "@/store/slices/borrowSlice";
import { fetchAllUsers } from "@/store/slices/userSlice";
import Header from "../../layout/Header";
import { BookOpen, Users, AlertCircle, BookmarkCheck } from "lucide-react";
import { settleUserFines } from "../../store/slices/borrowSlice"; // Adjust path as needed
// Chart.js Imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Grab all states
  const { user } = useSelector((state) => state.auth);
  const { books, loading: booksLoading } = useSelector((state) => state.book);
  const { allBorrowedBooks, loading: borrowLoading } = useSelector(
    (state) => state.borrow
  );
  const { users, loading: usersLoading } = useSelector((state) => state.user);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const isLoading = booksLoading || borrowLoading || usersLoading;

  // ==========================
  // CALCULATE STATISTICS
  // ==========================
  const safeBorrows = Array.isArray(allBorrowedBooks)
    ? allBorrowedBooks
    : allBorrowedBooks?.records || [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeBooks = Array.isArray(books) ? books : [];
  const currentDate = new Date();

  // 1. Total Registered Students (Filtering out admins)
  const totalStudents = safeUsers.filter((u) => u.role === "user").length;

  // 2. Total Unique Books in Library
  const totalBookTitles = safeBooks.length;

  // 3. Active Borrows (Not returned, within due date)
  const activeBorrowsCount = safeBorrows.filter((item) => {
    const isNotReturned = item.return_date === null;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate >= currentDate;
  }).length;

  // 4. Overdue Books (Not returned, past due date)
  const overdueCount = safeBorrows.filter((item) => {
    const isNotReturned = item.return_date === null;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate < currentDate;
  }).length;

  // ==========================
  // CHART CONFIGURATION
  // ==========================
  const chartData = {
    labels: ["Total Books", "Registered Users", "Active Borrows", "Overdue Books"],
    datasets: [
      {
        label: "Library Statistics",
        data: [totalBookTitles, totalStudents, activeBorrowsCount, overdueCount],
        backgroundColor: [
          "#8B5CF6", // Purple
          "#3B82F6", // Blue
          "#10B981", // Emerald
          "#EF4444", // Red
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for a cleaner look since labels are on the X axis
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Force whole numbers on the Y axis
        },
      },
    },
  };

  const recentActivity = safeBorrows.slice(0, 5);

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-y-auto bg-gray-50">
      <Header />

      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-8 mt-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Dashboard 📊
          </h2>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}. Here is the current status of your library.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-10">
            <p className="text-gray-500 font-semibold animate-pulse">
              Gathering library statistics...
            </p>
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Users Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalStudents}</h3>
                </div>
              </div>

              {/* Books Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Book Titles</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalBookTitles}</h3>
                </div>
              </div>

              {/* Active Borrows Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg">
                  <BookmarkCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Borrows</p>
                  <h3 className="text-2xl font-bold text-gray-800">{activeBorrowsCount}</h3>
                </div>
              </div>

              {/* Overdue Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Overdue Books</p>
                  <h3 className="text-2xl font-bold text-red-500">{overdueCount}</h3>
                </div>
              </div>
            </div>

            {/* CHART & RECENT ACTIVITY SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              
              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">
                  System Overview
                </h3>
                <div className="w-full h-72 relative">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">
                  Recent Borrows
                </h3>
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 py-4">No recent activity.</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((record, index) => (
                      <div 
                        key={record.id || index} 
                        className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-gray-800 truncate pr-2">
                            {record.book_title || "Unknown Book"}
                          </h4>
                          {record.return_date ? (
                            <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Returned</span>
                          ) : new Date(record.due_date) < currentDate ? (
                            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Overdue</span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Active</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          By: <span className="font-semibold text-gray-700">{record.user_name || "Unknown User"}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
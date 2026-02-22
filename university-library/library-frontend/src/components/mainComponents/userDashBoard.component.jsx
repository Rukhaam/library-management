import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBorrowedBooks } from "@/store/slices/borrowSlice";
import Header from "../../layout/Header";
import { BookOpen, CheckCircle, AlertCircle, Clock } from "lucide-react";

// Chart.js Imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const dispatch = useDispatch();

  // Grab State
  const { user } = useSelector((state) => state.auth);
  const { myBorrowedBooks, loading } = useSelector((state) => state.borrow);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchMyBorrowedBooks());
  }, [dispatch]);

  // ==========================
  // CALCULATE STATISTICS
  // ==========================
  const safeBooks = Array.isArray(myBorrowedBooks) ? myBorrowedBooks : [];
  const currentDate = new Date();

  // 1. Total Books Borrowed (All time)
  const totalBorrowed = safeBooks.length;

  // 2. Returned Books
  const returnedBooksCount = safeBooks.filter(
    (item) => item.return_date !== null
  ).length;

  // 3. Active (Not returned, due date in the future)
  const activeBooksCount = safeBooks.filter((item) => {
    const isNotReturned = item.return_date === null;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate >= currentDate;
  }).length;

  // 4. Overdue (Not returned, due date in the past)
  const overdueBooksCount = safeBooks.filter((item) => {
    const isNotReturned = item.return_date === null;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate < currentDate;
  }).length;

  // ==========================
  // CHART CONFIGURATION
  // ==========================
  const chartData = {
    labels: ["Returned", "Active Borrows", "Overdue"],
    datasets: [
      {
        label: "Books",
        data: [returnedBooksCount, activeBooksCount, overdueBooksCount],
        backgroundColor: [
          "#10B981", // Emerald Green for Returned
          "#3B82F6", // Blue for Active
          "#EF4444", // Red for Overdue
        ],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            weight: "bold",
          },
        },
      },
    },
  };

  // Get the 5 most recent borrows for the activity list
  const recentBorrows = safeBooks.slice(0, 5);

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-y-auto bg-gray-50">
      <Header />

      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || "Student"}! 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Here is an overview of your reading activity and library account.
          </p>
        </div>

        {loading && safeBooks.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p className="text-gray-500 font-semibold animate-pulse">
              Loading your dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalBorrowed}</h3>
                </div>
              </div>

              {/* Active Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Reading</p>
                  <h3 className="text-2xl font-bold text-gray-800">{activeBooksCount}</h3>
                </div>
              </div>

              {/* Returned Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Returned Books</p>
                  <h3 className="text-2xl font-bold text-gray-800">{returnedBooksCount}</h3>
                </div>
              </div>

              {/* Overdue Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Overdue Books</p>
                  <h3 className="text-2xl font-bold text-red-500">{overdueBooksCount}</h3>
                </div>
              </div>
            </div>

            {/* CHART & RECENT ACTIVITY SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              
              {/* Doughnut Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-gray-800 self-start w-full border-b pb-4 mb-4">
                  Reading Status
                </h3>
                {totalBorrowed === 0 ? (
                  <p className="text-gray-400 py-10">No borrowing history yet.</p>
                ) : (
                  <div className="w-full h-64 relative">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>

              {/* Recent Borrows List */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">
                  Recent Activity
                </h3>
                {recentBorrows.length === 0 ? (
                  <p className="text-gray-500 py-4">No recent activity.</p>
                ) : (
                  <div className="space-y-4">
                    {recentBorrows.map((book, index) => (
                      <div 
                        key={book.id || index} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold">
                            {book.title?.charAt(0) || "B"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{book.title}</h4>
                            <p className="text-xs text-gray-500">
                              Borrowed on {new Date(book.borrow_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          {book.return_date ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              Returned
                            </span>
                          ) : new Date(book.due_date) < currentDate ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              Overdue
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              Active
                            </span>
                          )}
                        </div>
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

export default UserDashboard;
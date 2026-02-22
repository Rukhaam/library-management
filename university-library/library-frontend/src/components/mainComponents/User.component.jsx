import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, resetUserSlice, promoteToAdmin } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";
import Header from "../../layout/Header";

const Users = () => {
  const dispatch = useDispatch();

  // Grab users and status from the Redux store
  const { users, loading, error, message } = useSelector(
    (state) => state.user
  );

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const normalUsers = users?.filter((u) => u.role === "user") || [];

  const totalPages = Math.ceil(normalUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = normalUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle errors and success messages from the userSlice
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
    }
  }, [error, message, dispatch]);

  // ==========================================
  // 🕒 CUSTOM DATE FORMATTER (WITH SAFETY CHECK)
  // ==========================================
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const dateObj = new Date(timestamp);

    if (isNaN(dateObj.getTime())) return "N/A";
    
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const paddedHours = hours.toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${paddedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="relative flex flex-col flex-1 h-full bg-gray-50">
      <Header />

      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-color-text-secondary">
            Registered Users
          </h2>
        </div>

        {loading && normalUsers.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p className="text-gray-500 font-semibold animate-pulse">Loading users...</p>
          </div>
        ) : normalUsers.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6 font-bold">#</th>
                    <th className="py-4 px-6 font-bold">Name</th>
                    <th className="py-4 px-6 font-bold">Email Address</th>
                    <th className="py-4 px-6 font-bold text-center">Role</th>
                    <th className="py-4 px-6 font-bold text-center">Books Borrowed</th>
                    <th className="py-4 px-6 font-bold text-right">Registered On</th>
                    <th className="py-4 px-6 font-bold text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.id || user._id}
                      className={`text-gray-600 transition-colors hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="py-4 px-6 font-medium text-black">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 text-brand-primary">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-brand-primary">
                        {user.borrowedBooksCount || 0}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-gray-500">
                        {formatDateTime(user.createdAt || user.created_at)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => dispatch(promoteToAdmin(user.id))}
                          className="flex items-center justify-center gap-1 mx-auto px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-colors"
                          title="Promote to Admin"
                        >
                          <ShieldCheck size={14} />
                          Promote
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, normalUsers.length)} of {normalUsers.length} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center flex flex-col items-center">
            <h3 className="text-2xl text-gray-400 font-bold mb-2">
              No Registered Users Found
            </h3>
            <p className="text-gray-500">
              There are currently no standard users registered in the library.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
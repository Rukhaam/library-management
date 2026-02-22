import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBorrowedBooks } from "@/store/slices/borrowSlice";
import { toggleReturnBookPopup } from "@/store/slices/popupSlice";
import { Library, CheckSquare, CornerDownLeft } from "lucide-react";
import Header from "../../layout/Header";
import ReturnBookPopup from "../../popups/ReturnBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();

  // 1. Grab State from Redux
  // Make sure your store.js has 'borrow: borrowReducer' for this to work!
  const { allBorrowedBooks, loading } = useSelector((state) => state.borrow);
  const { returnBookPopup } = useSelector((state) => state.popup);

  // 2. Local State
  const [filter, setFilter] = useState("Borrowed");
  const [returnBookId, setReturnBookId] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");

  // ==========================================
  // THE FIX: FETCH THE BOOKS ON MOUNT
  // ==========================================
  useEffect(() => {
    // This guarantees the backend is called every time you open the Catalog
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  // ==========================================
  // INSTRUCTOR'S CUSTOM DATE FORMATTERS
  // ==========================================
  const formatDateAndTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDateOnly = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // ==========================================
  // INSTRUCTOR'S FILTER LOGIC
  // ==========================================
  const currentDate = new Date();

  // 1. Active Borrows (Not returned AND Due Date is in the future)
  // ==========================
  // FILTER LOGIC
  // ==========================

  // 🚨 THE BULLETPROOF FIX: 
  // If it's already an array, use it. If it's an object, dig into common backend keys to find the array.
  const safeBooks = Array.isArray(allBorrowedBooks) 
    ? allBorrowedBooks 
    : allBorrowedBooks?.data || allBorrowedBooks?.borrowedBooks || allBorrowedBooks?.results || [];

  // 1. Active Borrows (Not returned AND Due Date is in the future)
  const borrowedBooks = safeBooks.filter((item) => {
    const isNotReturned = !item.returned && !item.return_date;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate >= currentDate;
  });

  // 2. Overdue Books (Not returned AND Due Date is in the past)
  const overdueBooks = safeBooks.filter((item) => {
    const isNotReturned = !item.returned && !item.return_date;
    const dueDate = new Date(item.due_date);
    return isNotReturned && dueDate < currentDate;
  });

  // Determine which array to map over based on the active tab
  const booksToDisplay = filter === "Borrowed" ? borrowedBooks : overdueBooks;

  // ==========================================
  // HANDLERS
  // ==========================================
  const openReturnPopup = (id, email) => {
    setReturnBookId(id);
    setBorrowerEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-y-auto bg-gray-50">
      <Header />

      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
        {/* Sub Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Library size={28} className="text-brand-primary" />
              Library Catalog
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitor all active borrows and track overdue books.
            </p>
          </div>
        </div>

        {/* Toggle Buttons (Matching the video styling) */}
        <div className="flex items-center mb-6 shadow-sm w-fit rounded-lg">
          <button
            onClick={() => setFilter("Borrowed")}
            className={`px-6 py-2.5 text-sm font-bold border-2 transition-colors rounded-l-lg ${
              filter === "Borrowed"
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Active Borrows
          </button>
          <button
            onClick={() => setFilter("Overdue")}
            className={`px-6 py-2.5 text-sm font-bold border-2 border-l-0 transition-colors rounded-r-lg ${
              filter === "Overdue"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Overdue Books
          </button>
        </div>

        {/* Table Container */}
        {loading && (!allBorrowedBooks || allBorrowedBooks.length === 0) ? (
          <div className="flex justify-center mt-10">
            <p className="text-gray-500 font-semibold animate-pulse">
              Loading catalog...
            </p>
          </div>
        ) : booksToDisplay.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6 font-bold">#</th>
                    <th className="py-4 px-6 font-bold">User</th>
                    <th className="py-4 px-6 font-bold">Book Title</th>
                    <th className="py-4 px-6 font-bold">Borrow Date</th>
                    <th className="py-4 px-6 font-bold">Due Date</th>
                    <th className="py-4 px-6 font-bold text-center">Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {booksToDisplay.map((item, index) => (
                    <tr
                      key={item.id || item._id || index}
                      className={`text-gray-600 transition-colors hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {item.user?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.user?.email || item.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-black">
                        {item.book?.title || item.title || "Unknown Book"}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {formatDateAndTime(item.borrow_date || item.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-red-500">
                        {formatDateOnly(item.due_date)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.returned || item.return_date ? (
                          <div
                            className="flex justify-center text-green-500"
                            title="Returned"
                          >
                            <CheckSquare size={20} />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              openReturnPopup(
                                item.id || item._id,
                                item.user?.email || item.email
                              )
                            }
                            className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-colors inline-flex justify-center items-center"
                            title="Mark as Returned"
                          >
                            <CornerDownLeft size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-16 text-center flex flex-col items-center mt-6">
            <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
              <Library size={48} />
            </div>
            <h3 className="text-2xl text-gray-700 font-bold mb-2">
              No {filter} Books Found
            </h3>
            <p className="text-gray-500 max-w-md">
              {filter === "Overdue"
                ? "Great news! There are no overdue books at the moment."
                : "There are currently no active borrowed books in the system."}
            </p>
          </div>
        )}
      </div>

      {/* RENDER POPUP HERE */}
      {returnBookPopup && (
        <ReturnBookPopup
          returnBookId={returnBookId}
          borrowerEmail={borrowerEmail}
        />
      )}
    </main>
  );
};

export default Catalog;

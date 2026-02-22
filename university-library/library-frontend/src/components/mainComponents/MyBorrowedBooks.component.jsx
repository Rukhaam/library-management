import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBorrowedBooks } from "@/store/slices/borrowSlice";
import { toggleReadBookPopup } from "@/store/slices/popupSlice";
import { BookOpen } from "lucide-react";
import Header from "../../layout/Header";

// Import Popups
import ReadBookPopup from "../../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  // 1. Grab State from Redux
  const { myBorrowedBooks, loading } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  // 2. Local State
  const [filter, setFilter] = useState("Borrowed");
  const [readBook, setReadBook] = useState({});

  // 3. Fetch data on mount
  useEffect(() => {
    dispatch(fetchMyBorrowedBooks());
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

  // ==========================
  // FILTER LOGIC
  // ==========================
  // Bulletproof fallback to an array
  const safeBooks = Array.isArray(myBorrowedBooks) ? myBorrowedBooks : [];

  // Filter based on whether a return_date exists in MySQL
  const returnedBooks = safeBooks.filter((item) => item.return_date !== null);
  const nonReturnedBooks = safeBooks.filter((item) => item.return_date === null);

  const booksToDisplay = filter === "Returned" ? returnedBooks : nonReturnedBooks;

  // ==========================
  // HANDLERS
  // ==========================
  const openReadPopup = (bookData) => {
    // Pass the flat MySQL object directly into the read popup
    setReadBook(bookData);
    dispatch(toggleReadBookPopup());
  };

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-y-auto bg-gray-50">
      <Header />

      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto mt-6">
        {/* Sub Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen size={28} className="text-brand-primary" />
              Borrowed Books
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track the books you are currently reading and your past history.
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
            Non-Returned Books
          </button>
          <button
            onClick={() => setFilter("Returned")}
            className={`px-6 py-2.5 text-sm font-bold border-2 border-l-0 transition-colors rounded-r-lg ${
              filter === "Returned"
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Returned Books
          </button>
        </div>

        {/* Table Container */}
        {loading && safeBooks.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p className="text-gray-500 font-semibold animate-pulse">Loading your books...</p>
          </div>
        ) : booksToDisplay.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6 font-bold">#</th>
                    <th className="py-4 px-6 font-bold">Book Title</th>
                    <th className="py-4 px-6 font-bold">Borrow Date</th>
                    <th className="py-4 px-6 font-bold">Due Date</th>
                    <th className="py-4 px-6 font-bold text-center">Returned</th>
                    <th className="py-4 px-6 font-bold text-center">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {booksToDisplay.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className={`text-gray-600 transition-colors hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-medium text-black">
                        {item.title}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {formatDateAndTime(item.borrow_date)}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-red-500">
                        {formatDateOnly(item.due_date)}
                      </td>
                      <td className="py-4 px-6 text-center font-bold">
                        {item.return_date ? (
                           <span className="text-green-600">Yes</span>
                        ) : (
                           <span className="text-red-500">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => openReadPopup(item)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Read Book Details"
                        >
                          <BookOpen size={18} />
                        </button>
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
              <BookOpen size={48} />
            </div>
            <h3 className="text-2xl text-gray-700 font-bold mb-2">
              No {filter === "Borrowed" ? "Non-Returned" : "Returned"} Books Found
            </h3>
          </div>
        )}
      </div>

      {/* RENDER POPUP HERE */}
      {readBookPopup && <ReadBookPopup readBook={readBook} />}
    </main>
  );
};

export default MyBorrowedBooks;
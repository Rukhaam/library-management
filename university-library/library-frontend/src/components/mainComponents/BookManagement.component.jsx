import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks, resetBookSlice } from "@/store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "@/store/slices/borrowSlice";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "@/store/slices/popupSlice";
import { toast } from "react-toastify";
import Header from "../../layout/Header";

// Popups
import AddBookPopup from "../../popups/AddBookPopup";
import ReadBookPopup from "../../popups/ReadBookPopup";
import RecordBookPopup from "../../popups/RecordBookPopup";

// Icons (Using Lucide-react as requested previously)
import { BookOpen, NotebookPen } from "lucide-react"; 

const BookManagement = () => {
  const dispatch = useDispatch();

  // 1. Grab Auth State
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 2. Grab Book State
  const {
    books,
    loading: bookLoading,
    error: bookError,
    message: bookMessage,
  } = useSelector((state) => state.book);

  // 3. Grab Borrow State (Renamed strictly as he did in the video to prevent variable conflicts)
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  // 4. Grab Popup States
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );

  // 5. Local States
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // ==========================
  // HANDLERS & FILTERS
  // ==========================
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  // Filter books dynamically based on the search keyword
  const searchedBooks = books?.filter((book) =>
    book.title?.toLowerCase().includes(searchKeyword)
  );

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id || book.id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // ==========================
  // LIFECYCLE & TOASTS
  // ==========================
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (bookMessage || borrowSliceMessage) {
      toast.success(bookMessage || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (bookError || borrowSliceError) {
      toast.error(bookError || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [bookMessage, borrowSliceMessage, bookError, borrowSliceError, dispatch]);

  return (
    <main className="relative flex-1 p-6 md:p-10 h-full overflow-y-auto bg-gray-50">
      <Header />

      {/* Sub Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-8">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-gray-800">
          {isAuthenticated && user?.role === "admin"
            ? "Book Management"
            : "Books"}
        </h2>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Add Book Button (Admin Only) */}
          {isAuthenticated && user?.role === "admin" && (
            <button
              onClick={() => dispatch(toggleAddBookPopup())}
              className="relative w-full sm:w-52 flex items-center justify-center gap-4 py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-white text-black rounded-full absolute left-5 text-xl font-bold">
                +
              </span>
              Add Book
            </button>
          )}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Books..."
            value={searchKeyword}
            onChange={handleSearch}
            className="w-full sm:w-52 border border-gray-300 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Table Container */}
      {searchedBooks && searchedBooks.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg border border-gray-200">
          <table className="min-w-full border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-4 px-4 text-left font-semibold">ID</th>
                <th className="py-4 px-4 text-left font-semibold">Name</th>
                <th className="py-4 px-4 text-left font-semibold">Author</th>
                {isAuthenticated && user?.role === "admin" && (
                  <th className="py-4 px-4 text-center font-semibold">Quantity</th>
                )}
                <th className="py-4 px-4 text-center font-semibold">Price</th>
                <th className="py-4 px-4 text-center font-semibold">Availability</th>
                <th className="py-4 px-4 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {searchedBooks.map((book, index) => (
                <tr
                  key={book._id || book.id}
                  className={(index + 1) % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-4 px-4">{index + 1}</td>
                  <td className="py-4 px-4 font-medium">{book.title}</td>
                  <td className="py-4 px-4 text-gray-600">{book.author}</td>

                  {/* Quantity is only visible to Admin */}
                  {isAuthenticated && user?.role === "admin" && (
                    <td className="py-4 px-4 text-center">
                      {book.quantity || book.available_copies || 0}
                    </td>
                  )}

                  <td className="py-4 px-4 text-center text-green-700 font-medium">
                    ${book.price || 0}
                  </td>

                  <td className="py-4 px-4 text-center">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      book.quantity > 0 || book.available_copies > 0 || book.availability
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {book.quantity > 0 || book.available_copies > 0 || book.availability ? "Available" : "Un-available"}
  </span>
</td>

                  <td className="py-4 px-4 flex justify-center items-center gap-4">
                    {/* View/Read Book Icon */}
                    <button
                      onClick={() => openReadPopup(book._id || book.id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Read Book"
                    >
                      <BookOpen size={20} />
                    </button>

                    {/* Record Book Icon (Admin Only) */}
                    {isAuthenticated && user?.role === "admin" && (
                      <button
                        onClick={() => openRecordBookPopup(book._id || book.id)}
                        className="text-gray-800 hover:text-black transition"
                        title="Record Borrow"
                      >
                        <NotebookPen size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center p-10">
          <h3 className="text-2xl mt-5 font-medium text-gray-500">
            No books found in the library.
          </h3>
        </div>
      )}

      {/* ========================== */}
      {/* POPUPS RENDERED HERE */}
      {/* ========================== */}
      {addBookPopup && <AddBookPopup />}
{readBookPopup && <ReadBookPopup readBook={readBook} />}           
{recordBookPopup && <RecordBookPopup borrowBookId={borrowBookId} />}
    </main>
  );
};

export default BookManagement;
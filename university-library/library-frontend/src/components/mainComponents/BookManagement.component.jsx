import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks, resetBookSlice ,deleteBook} from "@/store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "@/store/slices/borrowSlice";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "@/store/slices/popupSlice";
import { toast } from "react-toastify";
import Header from "../../layout/Header";
import { toggleEditBookPopup } from "@/store/slices/popupSlice"; 
import EditBookPopup from "../../popups/updateBookPopup"; 
// Popups
import AddBookPopup from "../../popups/AddBookPopup";
import ReadBookPopup from "../../popups/ReadBookPopup";
import RecordBookPopup from "../../popups/RecordBookPopup";
import { toggleDeleteBookPopup } from "@/store/slices/popupSlice";
import DeleteBookPopup from "@/popups/deleteBookPopup";
// Icons
import { BookOpen, NotebookPen ,Trash2,Pencil} from "lucide-react"; 

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
  const handleDeleteBook = (id) => {
    // Built-in browser confirmation popup
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      dispatch(deleteBook(id));
    }
  };
  // 3. Grab Borrow State
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  // 4. Grab Popup States
  const { addBookPopup, readBookPopup, recordBookPopup,deleteBookPopup ,editBookPopup} = useSelector(
    (state) => state.popup
  );

  // 5. Local States
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==========================
  // HANDLERS & FILTERS
  // ==========================
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Filter books dynamically based on the search keyword
  const searchedBooks = books?.filter((book) =>
    book.title?.toLowerCase().includes(searchKeyword)
  );

  // PAGINATION MATH
  const totalPages = Math.ceil((searchedBooks?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = searchedBooks?.slice(indexOfFirstItem, indexOfLastItem) || [];

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
      <div className="flex mt-4 flex-col gap-3 md:flex-row md:justify-between md:items-center mb-8">
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
        <div className="mt-6 flex flex-col bg-white rounded-md shadow-lg border border-gray-200">
          <div className="overflow-x-auto">
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
                {currentBooks.map((book, index) => (
                  <tr
                    key={book._id || book.id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-4 px-4">{indexOfFirstItem + index + 1}</td>
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

                      {/* Admin-Only Actions */}
                      {isAuthenticated && user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => openRecordBookPopup(book._id || book.id)}
                            className="text-gray-800 hover:text-black transition"
                            title="Record Borrow"
                          >
                            <NotebookPen size={20} />
                          </button>
                          <button
                            onClick={() => dispatch(toggleEditBookPopup(book))}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit Book"
                          >
                            <Pencil size={20} />
                          </button>
                          
                          {/* NEW DELETE BUTTON */}
                          <button
                            onClick={() => dispatch(toggleDeleteBookPopup(book._id || book.id))}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete Book"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, searchedBooks.length)} of {searchedBooks.length} entries
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
        <div className="mt-10 flex flex-col items-center justify-center p-10">
          <h3 className="text-2xl mt-5 font-medium text-gray-500">
            No books found in the library.
          </h3>
        </div>
      )}

      {/* POPUPS RENDERED HERE */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup readBook={readBook} />}           
      {recordBookPopup && <RecordBookPopup borrowBookId={borrowBookId} />}
      {deleteBookPopup && <DeleteBookPopup />}
      {editBookPopup && <EditBookPopup />}
    </main>
  );
};

export default BookManagement;
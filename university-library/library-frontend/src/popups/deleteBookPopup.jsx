import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDeleteBookPopup } from "@/store/slices/popupSlice";
import { deleteBook } from "@/store/slices/bookSlice";
import { AlertTriangle, X } from "lucide-react";

const DeleteBookPopup = () => {
  const dispatch = useDispatch();

  // Get the book ID we saved in the popupSlice
  const { bookToDelete } = useSelector((state) => state.popup);
  
  // Get the loading state so we can disable the button while deleting
  const { loading } = useSelector((state) => state.book);

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      dispatch(deleteBook(bookToDelete)); // Fire the delete API
      dispatch(toggleDeleteBookPopup());  // Close the popup immediately
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
        
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Text Details */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Delete Book
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this book? This action cannot be undone and will permanently remove it from the library catalog.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => dispatch(toggleDeleteBookPopup())}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirmDelete}
            disabled={loading}
            className={`flex-1 px-4 py-2 font-bold text-white rounded-lg transition-colors ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-primary hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteBookPopup;
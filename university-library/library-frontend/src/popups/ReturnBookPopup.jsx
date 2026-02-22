import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "@/store/slices/popupSlice";
import { returnBook } from "@/store/slices/borrowSlice";
import { X, CornerDownLeft } from "lucide-react";

const ReturnBookPopup = ({ returnBookId, borrowerEmail }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.borrow);

  const handleReturnBook = (e) => {
    e.preventDefault();
    
    // Dispatch the return thunk (assuming it takes the borrow ID or book ID)
    dispatch(returnBook(returnBookId));
    dispatch(toggleReturnBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Process Return</h3>
          <button
            onClick={() => dispatch(toggleReturnBookPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleReturnBook} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Borrower's Email</label>
            {/* Disabled input so the admin can review the email but not change it */}
            <input
              type="email"
              disabled
              value={borrowerEmail || "Unknown"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2">
              Confirm you are receiving the book back from this user.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => dispatch(toggleReturnBookPopup())}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              <CornerDownLeft size={16} />
              {loading ? "Processing..." : "Confirm Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleRecordBookPopup } from "@/store/slices/popupSlice";
import { borrowBook } from "@/store/slices/borrowSlice"; // Or recordBorrowBook if you named it that in the slice
import { X, Send } from "lucide-react";

const RecordBookPopup = ({ borrowBookId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.borrow);

  const [email, setEmail] = useState("");

  const handleRecordBook = (e) => {
    e.preventDefault();
    
    // Dispatch the action to record the borrow. 
    // Modify the payload format if your backend expects `{ bookId, email }` instead.
    dispatch(borrowBook({ bookId: borrowBookId, email }));
    dispatch(toggleRecordBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Record Borrow</h3>
          <button
            onClick={() => dispatch(toggleRecordBookPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRecordBook} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">User's Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="user@example.com"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the email of the user who is borrowing this book.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => dispatch(toggleRecordBookPopup())}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              <Send size={16} />
              {loading ? "Recording..." : "Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
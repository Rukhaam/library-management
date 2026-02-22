import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "@/store/slices/popupSlice";
import { X } from "lucide-react";

const ReadBookPopup = ({ readBook }) => {
  const dispatch = useDispatch();

  // Safety check in case the object is empty
  if (!readBook || Object.keys(readBook).length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Book Information</h3>
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-4 bg-gray-50">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Book Title</label>
            <p className="bg-white p-3 rounded-lg border border-gray-200 text-gray-800 font-semibold mt-1">
              {readBook.title}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
            <p className="bg-white p-3 rounded-lg border border-gray-200 text-gray-800 mt-1">
              {readBook.author}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-700 text-sm mt-1 max-h-32 overflow-y-auto">
              {readBook.description || "No description provided."}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
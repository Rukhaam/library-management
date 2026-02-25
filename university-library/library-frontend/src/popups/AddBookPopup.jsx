import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup } from "@/store/slices/popupSlice";
import { addNewBook } from "@/store/slices/bookSlice";
import { X, Save } from "lucide-react";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();

    // Change this to a standard object!
    const data = {
      title,
      author,
      price,
      quantity,
      description,
    };

    dispatch(addNewBook(data));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Add New Book</h3>
          <button
            onClick={() => dispatch(toggleAddBookPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddBook} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., JavaScript in 30 Days"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Author Name"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.00"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                value={quantity< 0 ? 0 : quantity}
                onChange={(e) => setQuantity(
                    e.target.value 
                )}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Brief summary of the book..."
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              <Save size={16} />
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;

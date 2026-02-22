import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleEditBookPopup } from "@/store/slices/popupSlice";
import { updateBook } from "@/store/slices/bookSlice";
import { X, Save } from "lucide-react";

const EditBookPopup = () => {
  const dispatch = useDispatch();
  const { bookToEdit } = useSelector((state) => state.popup);
  const { loading } = useSelector((state) => state.book);

  // 👇 Removed category and isbn
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || "",
        author: bookToEdit.author || "",
        price: bookToEdit.price || "",
        quantity: bookToEdit.quantity || "",
        description: bookToEdit.description || "",
      });
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const id = bookToEdit?.id || bookToEdit?._id;
    
    // 👇 ADD THIS LINE TO DEBUG:
    console.log("BOOK ID WE ARE TRYING TO UPDATE:", id);
    console.log("FORM DATA:", formData);

    if (!id) {
      toast.error("Error: Book ID is missing!");
      return;
    }

    await dispatch(updateBook(id, formData));
    dispatch(toggleEditBookPopup()); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Edit Book</h3>
          <button
            onClick={() => dispatch(toggleEditBookPopup())}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
              <input type="text" name="author" required value={formData.author} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
              <input type="number" name="price" min="0" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Quantity</label>
              <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary" />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" rows="3" required value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand-primary"></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => dispatch(toggleEditBookPopup())} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}>
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPopup;
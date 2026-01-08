import { useState } from "react";
import api from "../api/axios";
import { X, Save, Lock, Globe, Loader2, Feather } from "lucide-react";
import toast from "react-hot-toast";

const EditPoemModal = ({ poem, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: poem.title,
    content: poem.content,
    tags: poem.tags.join(", "), // Display array as comma string
    visibility: poem.visibility,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert string back to array
    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    try {
      const { data } = await api.put(`/poems/${poem._id}`, {
        ...formData,
        tags: tagArray,
      });
      onUpdate(data); // Update parent state instantly
      toast.success("Poem revised successfully.");
      onClose();
    } catch (err) {
      toast.error("Failed to update poem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        {/* Ink Strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
            <Feather size={24} /> Revise Work
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-2xl font-serif font-bold border-b border-gray-300 focus:border-gray-900 focus:outline-none py-2 placeholder-gray-300 transition-colors"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows="6"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 font-serif text-lg leading-relaxed resize-none"
              required
            />
          </div>

          {/* Tags & Visibility */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Visibility
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, visibility: !formData.visibility })
                }
                className={`w-full p-3 rounded-lg border flex items-center justify-between transition ${
                  formData.visibility
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-gray-100 border-gray-200 text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2 font-bold text-sm">
                  {formData.visibility ? (
                    <Globe size={16} />
                  ) : (
                    <Lock size={16} />
                  )}
                  {formData.visibility ? "Public" : "Private"}
                </span>
                <span className="text-xs opacity-70">
                  {formData.visibility ? "Everyone sees this" : "Only you"}
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black flex items-center gap-2 transition"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Revisions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPoemModal;

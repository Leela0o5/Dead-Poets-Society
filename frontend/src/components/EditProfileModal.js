import { useState } from "react";
import api from "../api/axios";
import { X, Save, User, Loader2, Feather } from "lucide-react";
import toast from "react-hot-toast";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    toast.dismiss();

    try {
      const { data } = await api.put("/auth/profile", formData);
      onUpdate(data);
      toast.success("Profile updated successfully.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100">
        {/* Decorative Ink Strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <Feather size={24} className="text-gray-700" />
              Edit Identity
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Update your society credentials.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-2">
          {/* Username */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-medium"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-serif leading-relaxed placeholder-gray-400 resize-none"
              placeholder="Tell us your story..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

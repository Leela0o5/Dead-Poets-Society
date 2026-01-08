import { Flame } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Trash2 } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-200">
        {/* Warning Ink Strip (Red) */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <Flame size={32} />
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Burning...
                </>
              ) : (
                <>
                  <Trash2 size={18} /> {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

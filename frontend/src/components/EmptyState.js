import { FileText } from "lucide-react";

const EmptyState = ({ message, subMessage }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      <FileText size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-1">{message}</h3>
    <p className="text-gray-500 text-sm max-w-xs mx-auto">{subMessage}</p>
  </div>
);

export default EmptyState;

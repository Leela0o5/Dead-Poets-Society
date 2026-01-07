import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-blue-600">
    <Loader2 size={48} className="animate-spin mb-4" />
    <p className="text-gray-500 font-medium animate-pulse">Loading poetry...</p>
  </div>
);

export default LoadingSpinner;

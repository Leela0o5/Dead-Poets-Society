import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user is found, redirect to Login
  // replace prevents them from hitting "Back" to return to the protected page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (The Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
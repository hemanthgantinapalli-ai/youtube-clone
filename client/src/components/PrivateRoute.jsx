import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — wraps a component to only allow authenticated access.
 * Redirects to /auth if the user is not logged in.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yt-dark">
        <div className="w-10 h-10 border-4 border-yt-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;

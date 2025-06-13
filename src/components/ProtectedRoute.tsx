
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!currentUser) {
    console.log('🔐 [PROTECTED] User not authenticated, redirecting to login');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('🔐 [PROTECTED] User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;

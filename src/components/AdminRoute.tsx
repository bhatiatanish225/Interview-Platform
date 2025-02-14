import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/instructions" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
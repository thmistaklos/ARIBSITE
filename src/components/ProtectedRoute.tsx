import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dairy-cream">
        <Loader2 className="h-10 w-10 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // You can add role-based checks here if needed
  // e.g., if (user.user_metadata.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
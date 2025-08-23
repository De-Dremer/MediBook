import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {
    const { user, loading, token } = useAuth();
    const location = useLocation();

    console.log('🔍 ProtectedRoute Check:', {
        user: !!user,
        userRole: user?.role,
        token: !!token,
        loading,
        requiredRole,
        path: location.pathname
    });

    // ✅ Wait for auth to finish loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // ✅ If no user or token, redirect to login
    if (!user || !token) {
        console.log('❌ No authenticated user, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ✅ Check role permissions
    if (requiredRole) {
        const userRole = user.role.toLowerCase();
        const required = requiredRole.toLowerCase();

        if (userRole !== required) {
            console.log('❌ Role mismatch, redirecting based on user role');
            // Redirect to appropriate dashboard based on user's actual role
            const redirectPath = userRole === 'doctor' ? '/doctor/dashboard' : '/dashboard';
            return <Navigate to={redirectPath} replace />;
        }
    }

    console.log('✅ User authorized, rendering protected content');
    return <>{children}</>;
};

export default ProtectedRoute;

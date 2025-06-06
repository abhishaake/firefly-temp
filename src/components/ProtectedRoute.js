import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuthStore();
    const location = useLocation();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (requiredRole && user?.role !== requiredRole) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};

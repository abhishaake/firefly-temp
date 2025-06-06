import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ManageClassesPage } from './pages/ManageClassesPage';
import { CustomMainLayout } from './layouts/CustomMainLayout';
import { WorkoutPage } from './pages/WorkoutPage';
import { CreateWorkoutPage } from './pages/CreateWorkoutPage';
import { CreateClassPage } from './pages/CreateClassPage';
import { ViewClassPage } from './pages/VIewClassPage';
// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsxs(MantineProvider, { children: [_jsx(Notifications, {}), _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/manage-classes", element: _jsx(ProtectedRoute, { children: _jsx(CustomMainLayout, { children: _jsx(ManageClassesPage, {}) }) }) }), _jsx(Route, { path: "/workout", element: _jsx(ProtectedRoute, { children: _jsx(CustomMainLayout, { children: _jsx(WorkoutPage, {}) }) }) }), _jsx(Route, { path: "/workout/create", element: _jsx(ProtectedRoute, { children: _jsx(CustomMainLayout, { children: _jsx(CreateWorkoutPage, {}) }) }) }), _jsx(Route, { path: "/classes/create", element: _jsx(ProtectedRoute, { children: _jsx(CustomMainLayout, { children: _jsx(CreateClassPage, {}) }) }) }), _jsx(Route, { path: "/classes/:classId", element: _jsx(ProtectedRoute, { children: _jsx(ViewClassPage, {}) }) }), _jsx(Route, { path: "/customers", element: _jsx(ProtectedRoute, { children: _jsx(CustomMainLayout, { children: _jsx("div", { children: "Customers Page" }) }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/manage-classes", replace: true }) })] }) })] }), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
export default App;

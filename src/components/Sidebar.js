import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/sidebar.css';
const navItems = [
    {
        label: 'Home',
        icon: '🏠',
        path: '/',
    },
    {
        label: 'Manage Classes',
        icon: '📅',
        path: '/manage-classes',
    },
    {
        label: 'Workout',
        icon: '💪',
        path: '/workout',
    },
    {
        label: 'Manage Trainer',
        icon: '🧑‍🏫',
        path: '/manage-trainer',
    },
    {
        label: 'Members',
        icon: '👥',
        path: '/members',
    },
    {
        label: 'Reports',
        icon: '📊',
        path: '/reports',
    },
];
export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "sidebar-root", children: [_jsxs("div", { className: "sidebar-logo", style: { marginTop: '-16px' }, children: [_jsx("img", { src: "/assets/figma-icons/page_logo.png", style: { width: '40px' }, alt: "Firefly Logo", className: "sidebar-logo-img" }), _jsx("img", { src: "/assets/figma-icons/page_logo_name.png", style: { width: '180px', marginLeft: '10px' }, alt: "Firefly", className: "sidebar-logo-img" })] }), _jsx("nav", { className: "sidebar-nav", children: navItems.map((item) => (_jsxs("div", { className: `sidebar-nav-item${location.pathname === item.path ? ' active' : ''}`, onClick: () => navigate(item.path), children: [_jsx("span", { className: "sidebar-nav-icon", children: item.icon }), _jsx("span", { className: "sidebar-nav-label", children: item.label })] }, item.path))) }), _jsx("div", { className: "sidebar-logout-wrapper", children: _jsxs("div", { className: "sidebar-nav-item logout", onClick: handleLogout, children: [_jsx("span", { className: "sidebar-nav-icon", children: "\uD83D\uDEAA" }), _jsx("span", { className: "sidebar-nav-label", children: "Logout" })] }) })] }));
};

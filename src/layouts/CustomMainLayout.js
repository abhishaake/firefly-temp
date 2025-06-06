import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Sidebar } from '../components/Sidebar';
import '../styles/theme.css';
import '../styles/manage-classes.css';
import '../styles/sidebar.css';
import '../styles/custom-layout.css';
export const CustomMainLayout = ({ children }) => {
    return (_jsxs("div", { className: "custom-layout-root", children: [_jsx("aside", { className: "custom-layout-sidebar", children: _jsx(Sidebar, {}) }), _jsxs("div", { className: "custom-layout-content", children: [_jsx("header", { className: "custom-layout-header" }), _jsx("main", { className: "custom-layout-main", children: children })] })] }));
};

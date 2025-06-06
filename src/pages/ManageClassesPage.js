import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ClassTable } from '../components/ClassTable';
import { useNavigate } from 'react-router-dom';
import { useAvailableClassesQuery } from '../hooks/useApi';
export const ManageClassesPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useAvailableClassesQuery();
    console.log("data", data);
    const handleEdit = (id) => {
        // open edit modal
    };
    const handleDelete = (id) => {
        // open confirm dialog
    };
    return (_jsxs("div", { className: "manage-classes-container", children: [_jsxs("div", { className: "manage-classes-header", children: [_jsx("h1", { children: "Manage Classes" }), _jsx("button", { className: "add-class-btn", onClick: () => navigate('/classes/create'), children: "+ Create New Class" })] }), _jsx("div", { className: "scheduled-classes-title", children: "Scheduled Classes" }), _jsxs("div", { className: "class-table-wrapper", children: [isLoading && _jsx("div", { children: "Loading..." }), error && _jsx("div", { children: "Error loading classes" }), data && _jsx(ClassTable, { classes: data?.classes, onEdit: handleEdit, onDelete: handleDelete })] })] }));
};

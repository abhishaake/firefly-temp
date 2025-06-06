import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ClassTableHeader } from './ClassTableHeader';
import { ClassTableRow } from './ClassTableRow';
export const ClassTable = ({ classes, onEdit, onDelete }) => (_jsxs("div", { className: "class-table", children: [_jsx("div", { className: "class-table-header-fixed", children: _jsx(ClassTableHeader, {}) }), _jsx("div", { className: "class-table-body-scroll", children: classes.map((item) => (_jsx(ClassTableRow, { classItem: item, onEdit: onEdit, onDelete: onDelete }, item.id))) })] }));

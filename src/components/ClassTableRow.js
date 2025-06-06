import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
function formatTime(epoch) {
    const date = new Date(epoch * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}
export const ClassTableRow = ({ classItem, onEdit, onDelete }) => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "class-table-row", children: [_jsx("div", { children: classItem.className }), _jsx("div", { children: classItem.date }), _jsx("div", { children: formatTime(Number(classItem.startTimeEpoch)) }), _jsx("div", { children: classItem.trainer }), _jsx("div", { children: "Dublin Central" }), _jsx("div", { children: classItem.workoutName }), _jsx("div", { children: _jsx("button", { style: { color: 'blue' }, className: "icon-btn", onClick: () => navigate(`/classes/${classItem.classId}`), title: "View", children: 'View' }) })] }));
};

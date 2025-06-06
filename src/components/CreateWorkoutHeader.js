import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/workout.css';
export const CreateWorkoutHeader = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "create-workout-header", children: [_jsx("button", { className: "back-arrow-btn", "aria-label": "Back", onClick: () => navigate('/workout'), children: _jsx("svg", { width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M18 24L10 16L18 8", stroke: "#353535", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("span", { className: "header-title", children: "Build Workout Block" })] }));
};

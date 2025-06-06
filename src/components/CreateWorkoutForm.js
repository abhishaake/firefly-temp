import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import '../styles/workout.css';
export const CreateWorkoutForm = ({ initialWorkout }) => {
    const [title, setTitle] = useState(initialWorkout?.name || '');
    const [className, setClassName] = useState(initialWorkout?.description || '');
    useEffect(() => {
        setTitle(initialWorkout?.name || '');
        setClassName(initialWorkout?.description || '');
    }, [initialWorkout]);
    return (_jsxs("div", { className: "create-workout-form", children: [_jsx("div", { className: "form-title", children: "Create Workout" }), _jsx("div", { className: "form-section", children: _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Workout Title" }), _jsx("input", { className: "form-input", type: "text", placeholder: "Enter workout title", value: title, onChange: e => setTitle(e.target.value) })] }) })] }));
};

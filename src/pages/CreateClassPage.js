import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import '../styles/create-class.css';
import { useWorkoutsQuery } from '../hooks/useWorkoutsQuery';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const CreateClassHeader = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "create-class-header-row", children: [_jsx("button", { className: "back-arrow-btn", "aria-label": "Back", onClick: () => navigate('/'), children: _jsx("svg", { width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M18 24L10 16L18 8", stroke: "#353535", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("span", { className: "create-class-title", children: "Create New Class" })] }));
};
const ClassDetailsSection = () => (_jsxs("div", { className: "class-details-section", children: [_jsx("div", { className: "class-details-label", children: "Class Details" }), _jsxs("div", { className: "class-details-fields", children: [_jsx("div", { className: "class-details-row", children: _jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Class Name" }), _jsx("input", { style: { width: '500px' }, type: "text", placeholder: "Enter class name" })] }) }), _jsxs("div", { className: "class-details-row", children: [_jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Location" }), _jsx("input", { style: { width: '500px' }, type: "text", placeholder: "Enter Location name" })] }), _jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Trainer" }), _jsx("input", { style: { width: '500px' }, type: "text", placeholder: "Enter trainer name" })] })] }), _jsxs("div", { className: "class-details-row", children: [_jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Date" }), _jsx("input", { style: { width: '500px' }, type: "date" })] }), _jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Time" }), _jsx("input", { style: { width: '500px' }, type: "time" })] })] })] })] }));
export const CreateClassPage = () => {
    // Form state
    const [className, setClassName] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [maxCapacity, setMaxCapacity] = useState(20);
    const [userId, setUserId] = useState(25); // Placeholder, update as needed
    const [gymLocation, setGymLocation] = useState(2); // Placeholder, update as needed
    const [workoutId, setWorkoutId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // Save handler
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        // Convert date and time to epoch (seconds)
        const date = startDateTime ? startDateTime.toISOString().slice(0, 10) : '';
        const startEpoch = startDateTime ? Math.floor(startDateTime.getTime() / 1000) : undefined;
        const endEpoch = endDateTime ? Math.floor(endDateTime.getTime() / 1000) : undefined;
        const payload = {
            className,
            description,
            date,
            startTime: startEpoch,
            endTime: endEpoch,
            maxCapacity,
            userId,
            gymLocation,
            workoutId,
        };
        try {
            const response = await fetch('https://firefly-admin.cozmotech.ie/api/v1/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'FfbhuYx_pSVRl7npG8wQIw',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/manageClass');
            }
            else {
                setError(data.message || 'Failed to create class');
            }
        }
        catch (err) {
            setError(err.message || 'Failed to create class');
        }
        finally {
            setSaving(false);
        }
    };
    // AssignWorkoutSection as inner component to access setWorkoutId
    const AssignWorkoutSection = () => {
        const { data, isLoading, error } = useWorkoutsQuery();
        const workouts = data?.data?.workouts || [];
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const selectedWorkout = workouts.find((w) => w.workoutId === workoutId);
        return (_jsxs("div", { className: "assign-workout-section", children: [_jsx("div", { className: "assign-workout-label", children: "Assign Workout" }), _jsxs("div", { className: "assign-workout-card", style: { position: 'relative' }, children: [_jsxs("div", { className: "assign-workout-card-row", onClick: () => setDropdownOpen(v => !v), style: { cursor: 'pointer' }, children: [_jsx("span", { className: "assign-workout-card-title", children: selectedWorkout ? selectedWorkout.name : 'Select Workout' }), _jsx("span", { className: "assign-workout-card-dropdown", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M7 10L12 15L17 10", stroke: "#353535", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] }), dropdownOpen && (_jsxs("div", { style: {
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: '#fff',
                                border: '1px solid #E0E0E0',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(53,53,53,0.08)',
                                zIndex: 10,
                                marginTop: 4,
                                maxHeight: 200,
                                overflowY: 'auto',
                            }, children: [isLoading && _jsx("div", { style: { padding: '12px 16px', color: '#888' }, children: "Loading..." }), error && _jsx("div", { style: { padding: '12px 16px', color: '#e74c3c' }, children: "Error loading workouts" }), workouts.map((w) => (_jsx("div", { style: { padding: '12px 16px', cursor: 'pointer', color: '#353535', fontFamily: 'Lato, Arial, sans-serif', fontSize: 16, background: workoutId === w.workoutId ? '#F9F5FD' : '#fff' }, onClick: () => { setWorkoutId(w.workoutId); setDropdownOpen(false); }, children: w.name }, w.workoutId))), !isLoading && workouts.length === 0 && _jsx("div", { style: { padding: '12px 16px', color: '#888' }, children: "No workouts found" })] }))] })] }));
    };
    return (_jsxs("div", { className: "create-class-page-root", children: [saving && (_jsxs("div", { style: { width: '100%', height: 4, background: '#F3E8FF', position: 'fixed', top: 0, left: 0, zIndex: 1000 }, children: [_jsx("div", { style: { width: '100%', height: '100%', background: '#A259FF', animation: 'loadingBar 1s linear infinite' } }), _jsx("style", { children: `
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          ` })] })), _jsx(CreateClassHeader, {}), _jsxs("div", { className: "class-details-section", children: [_jsx("div", { className: "class-details-label", children: "Class Details" }), _jsxs("div", { className: "class-details-fields", children: [_jsx("div", { className: "class-details-row", children: _jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Class Name" }), _jsx("input", { style: { width: '500px' }, type: "text", placeholder: "Enter class name", value: className, onChange: e => setClassName(e.target.value) })] }) }), _jsxs("div", { className: "class-details-row", children: [_jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "Start Date & Time" }), _jsx(DatePicker, { selected: startDateTime, onChange: (date) => setStartDateTime(date), showTimeSelect: true, timeFormat: "HH:mm", timeIntervals: 5, dateFormat: "yyyy-MM-dd HH:mm", placeholderText: "Select start date and time", className: "your-custom-class", popperPlacement: "bottom" })] }), _jsxs("div", { className: "class-details-group", children: [_jsx("label", { children: "End Date & Time" }), _jsx(DatePicker, { selected: endDateTime, onChange: (date) => setEndDateTime(date), showTimeSelect: true, showDateSelect: false, timeFormat: "HH:mm", timeIntervals: 5, dateFormat: "yyyy-MM-dd HH:mm", placeholderText: "Select end date and time", className: "your-custom-class", popperPlacement: "bottom" })] })] })] })] }), _jsx(AssignWorkoutSection, {}), _jsxs("div", { style: { marginTop: 32, textAlign: 'center' }, children: [_jsx("button", { className: "footer-save-btn", onClick: handleSave, disabled: saving, children: saving ? 'Saving...' : 'Save Class' }), error && _jsx("div", { style: { color: 'red', marginTop: 8 }, children: error })] })] }));
};

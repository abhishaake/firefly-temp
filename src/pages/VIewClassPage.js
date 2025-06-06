import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassBookingDetailsQuery } from '../hooks/useApi';
import { Card, Loader } from '@mantine/core';
import '../styles/manage-classes.css';
import '../styles/custom-layout.css';
import '../styles/view-class-page.css';
export const ViewClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { data: classBooking, isLoading } = useClassBookingDetailsQuery(classId);
    // Figma-matching header info (fallbacks for demo)
    const className = classBooking?.className || '-';
    const location = classBooking?.classLocation || '';
    const time = classBooking?.startEpoch
        ? new Date(Number(classBooking.startEpoch) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
        : '';
    const bookingUsers = classBooking?.bookingUsers || [];
    // Countdown timer logic
    const nowEpoch = Math.floor(Date.now() / 1000);
    const initialDuration = classBooking?.startEpoch ? Math.max(classBooking.startEpoch - nowEpoch, 0) : 0;
    const [remaining, setRemaining] = useState(initialDuration || 0);
    const timerRef = useRef(null);
    const [ergSelections, setErgSelections] = useState({});
    // Handler for dropdown change
    const handleErgChange = (userIdx, ergIdx, value) => {
        setErgSelections(prev => {
            const userErgs = prev[userIdx] ? [...prev[userIdx]] : [1, 1, 1];
            userErgs[ergIdx] = value;
            return { ...prev, [userIdx]: userErgs };
        });
    };
    useEffect(() => {
        setRemaining(initialDuration);
    }, [initialDuration]);
    useEffect(() => {
        if (remaining <= 0) {
            if (timerRef.current)
                clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    if (timerRef.current)
                        clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [remaining]);
    function formatTime(secs) {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    return (_jsxs("div", { className: "view-class-root", children: [isLoading && (_jsxs("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    background: '#F3E8FF',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                }, children: [_jsx("div", { style: {
                            width: '100%',
                            height: '100%',
                            background: '#A259FF',
                            animation: 'loadingBar 1s linear infinite'
                        } }), _jsx("style", { children: `
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          ` })] })), _jsxs(Card, { radius: 24, shadow: "md", className: "view-class-card", children: [_jsxs("div", { className: "view-class-header", children: [_jsxs("div", { className: "view-class-header-row", children: [_jsx("button", { "aria-label": "Back", className: "icon-btn", style: { background: 'none', border: 'none', cursor: 'pointer', marginRight: 16 }, onClick: () => navigate(-1), children: _jsx("svg", { width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M20 26L12 16L20 6", stroke: "#FAFAFA", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("span", { className: "view-class-header-title", children: "Class View" })] }), _jsxs("div", { className: "view-class-header-info", children: [_jsx("span", { children: className }), _jsx("span", { className: "view-class-header-info-sep", children: "-" }), _jsx("span", { children: location }), _jsx("span", { className: "view-class-header-info-sep", children: "-" }), _jsx("span", { children: time })] })] }), _jsxs("div", { className: "view-class-main", children: [_jsxs("div", { className: "view-class-table-section", children: [_jsxs("div", { className: "view-class-table-header", children: [_jsx("div", { className: "view-class-table-cell", children: "Clients" }), _jsx("div", { className: "view-class-table-cell", children: "Checked In" }), _jsx("div", { className: "view-class-table-cell", children: "ERG 1" }), _jsx("div", { className: "view-class-table-cell", children: "ERG 2" }), _jsx("div", { className: "view-class-table-cell", children: "ERG 3" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 9 }, children: isLoading ? (_jsx("div", { style: { padding: 32, textAlign: 'center' }, children: _jsx(Loader, {}) })) : (bookingUsers.length === 0 ? (_jsx("div", { style: { padding: 32, textAlign: 'center', color: '#888' }, children: "No users booked for this class." })) : (bookingUsers.map((user, idx) => (_jsxs("div", { className: `view-class-table-row ${idx % 2 === 0 ? 'even' : 'odd'}`, children: [_jsx("div", { className: "view-class-table-cell", children: user.userName || '-' }), _jsx("div", { className: "view-class-table-cell view-class-table-cell-center", children: user.checkedInStatus ?? '-' }), [0, 1, 2].map(i => (_jsxs("div", { className: "view-class-erg-cell", children: [_jsx("span", { children: user.machineAssigned }), _jsxs("select", { style: { marginLeft: 8, width: 120, height: 50, fontWeight: 600, borderRadius: 4, padding: '2px 4px', backgroundColor: 'transparent', border: '0', color: '#353535' }, value: ergSelections[idx]?.[i] || i, onChange: e => handleErgChange(idx, i, Number(e.target.value)), children: [_jsx("option", { value: 1, children: "1" }), _jsx("option", { value: 2, children: "2" }), _jsx("option", { value: 3, children: "3" })] })] }, i)))] }, idx))))) })] }), _jsxs("div", { className: "view-class-timer-section", children: [_jsx("div", { className: "view-class-timer-circle", children: _jsx("span", { className: "view-class-timer-time", children: formatTime(remaining) }) }), _jsxs("button", { className: "view-class-stop-btn", children: [_jsx("span", { className: "view-class-stop-btn-icon", children: "\u25A0" }), "Stop"] })] })] })] })] }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import '../styles/workout.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useWorkoutDetailsQuery } from '../hooks/useWorkoutsQuery';
const PROMPT_OPTIONS = ['WARMUP', 'RECOVERY', 'REST', 'STAIRS', 'HOLD'];
const METRIC_OPTIONS = ['WATTS', 'METERS', 'CALORIES'];
// --- CreateWorkoutFooterBar (already in this file) ---
const CreateWorkoutFooterBar = ({ onSave }) => (_jsxs("div", { className: "create-workout-footer-bar", children: [_jsx("div", { className: "footer-bar-time", children: "Time : 600/2700 Sec" }), _jsxs("div", { className: "footer-bar-actions", children: [_jsx("button", { className: "footer-cancel-btn", children: "Cancel" }), _jsx("button", { className: "footer-save-btn", onClick: onSave, children: "Save & Publish" })] })] }));
// --- Main Page ---
export const CreateWorkoutPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    let workoutId = params.workoutId ? Number(params.workoutId) : location.state?.workoutId;
    if (!workoutId && location.search) {
        const searchParams = new URLSearchParams(location.search);
        const idFromQuery = searchParams.get('workoutId');
        if (idFromQuery) {
            workoutId = Number(idFromQuery);
        }
    }
    // Only call the API if workoutId is present
    const { data: workoutDetails, isLoading: isDetailsLoading } = useWorkoutDetailsQuery(workoutId ? workoutId : undefined);
    // Single source of truth for all data
    const [workoutDTO, setWorkoutDTO] = useState(() => {
        if (workoutDetails) {
            return JSON.parse(JSON.stringify(workoutDetails));
        }
        return {
            workoutId: 0,
            name: '',
            description: '',
            duration: '0',
            createdBy: '',
            workoutRounds: [],
        };
    });
    const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    // Sync workoutDTO with API data if it changes
    React.useEffect(() => {
        if (workoutDetails) {
            setWorkoutDTO(JSON.parse(JSON.stringify(workoutDetails)));
            setSelectedRoundIndex(0);
        }
    }, [workoutDetails]);
    // Form field handlers
    const handleFieldChange = (field, value) => {
        setWorkoutDTO(prev => ({ ...prev, [field]: value }));
    };
    // Round handlers
    const handleAddRound = () => {
        setWorkoutDTO(prev => {
            const nextSeq = (prev.workoutRounds?.length || 0) + 1;
            return {
                ...prev,
                workoutRounds: [
                    ...(prev.workoutRounds || []),
                    { name: `Round ${nextSeq}`, sequenceNo: nextSeq, workoutBlocks: [] }
                ]
            };
        });
        setSelectedRoundIndex(workoutDTO.workoutRounds.length);
    };
    const handleSelectRound = (idx) => {
        setSelectedRoundIndex(idx);
    };
    const handleRoundNameChange = (idx, value) => {
        setWorkoutDTO(prev => ({
            ...prev,
            workoutRounds: prev.workoutRounds.map((r, i) => i === idx ? { ...r, name: value } : r)
        }));
    };
    // Block handlers
    const handleAddBlock = (roundIdx) => {
        setWorkoutDTO(prev => {
            const rounds = prev.workoutRounds.map((r, i) => {
                if (i !== roundIdx)
                    return r;
                const nextSeq = r.workoutBlocks.length + 1;
                const newBlock = {
                    workoutRoundId: r.sequenceNo,
                    sequenceNo: nextSeq,
                    blockName: `Block ${nextSeq}`,
                    blockType: '',
                    durationSeconds: 0,
                    multiplier: 1,
                    gear: 1,
                    targetMetric: '',
                    targetValue: 0,
                    scoring: '',
                };
                return {
                    ...r,
                    workoutBlocks: [...r.workoutBlocks, newBlock]
                };
            });
            return { ...prev, workoutRounds: rounds };
        });
    };
    const handleBlockFieldChange = (roundIdx, blockIdx, field, value) => {
        setWorkoutDTO(prev => {
            const rounds = prev.workoutRounds.map((r, i) => {
                if (i !== roundIdx)
                    return r;
                return {
                    ...r,
                    workoutBlocks: r.workoutBlocks.map((b, j) => j === blockIdx ? { ...b, [field]: value } : b)
                };
            });
            return { ...prev, workoutRounds: rounds };
        });
    };
    const handleDeleteBlock = (roundIdx, blockIdx) => {
        setWorkoutDTO(prev => {
            const rounds = prev.workoutRounds.map((r, i) => {
                if (i !== roundIdx)
                    return r;
                return {
                    ...r,
                    workoutBlocks: r.workoutBlocks.filter((_, j) => j !== blockIdx)
                };
            });
            return { ...prev, workoutRounds: rounds };
        });
    };
    // Save handler
    const handleSave = async () => {
        if (workoutId) {
            // If editing an existing workout, do not save
            return;
        }
        setSaving(true);
        setError(null);
        const { name, description, workoutRounds } = workoutDTO;
        const roundRequests = workoutRounds.map(round => ({
            name: round.name,
            sequenceNo: round.sequenceNo,
            workoutBlockRequests: round.workoutBlocks.map(block => ({
                workoutId: 9007199254740991, // Placeholder, update as needed
                sequenceNo: block.sequenceNo,
                blockName: block.blockName,
                blockType: block.blockType,
                durationSeconds: block.durationSeconds,
                multiplier: block.multiplier,
                gear: block.gear,
                targetMetric: block.targetMetric || 'WATTS',
                targetValue: block.targetValue,
                scoring: block.scoring,
            }))
        }));
        const payload = { name, description, roundRequests };
        try {
            const response = await fetch('http://localhost:8080/api/v1/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'FfbhuYx_pSVRl7npG8wQIw',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/workout');
            }
            else {
                setError(data.message || 'Failed to create workout');
            }
        }
        catch (error) {
            setError(error.message || 'Failed to create workout');
        }
        finally {
            setSaving(false);
        }
    };
    // Show loading banner if waiting for API
    if (workoutId && isDetailsLoading) {
        return _jsx("div", { style: { padding: 32, textAlign: 'center', fontWeight: 600 }, children: "Loading workout details..." });
    }
    const currentRound = workoutDTO.workoutRounds[selectedRoundIndex];
    return (_jsxs("div", { className: "workout-outer-card", children: [saving && (_jsxs("div", { style: { width: '100%', height: 4, background: '#F3E8FF', position: 'fixed', top: 0, left: 0, zIndex: 1000 }, children: [_jsx("div", { style: { width: '100%', height: '100%', background: '#A259FF', animation: 'loadingBar 1s linear infinite' } }), _jsx("style", { children: `
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          ` })] })), _jsxs("div", { className: "create-workout-header", children: [_jsx("button", { className: "back-arrow-btn", "aria-label": "Back", onClick: () => navigate('/workout'), children: _jsx("svg", { width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M18 24L10 16L18 8", stroke: "#353535", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("span", { className: "header-title", children: "Build Workout Block" })] }), _jsxs("div", { className: "create-workout-page-container", children: [_jsxs("div", { className: "create-workout-form", children: [_jsx("div", { className: "form-title", children: "Create Workout" }), _jsxs("div", { className: "form-section", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Workout Title" }), _jsx("input", { className: "form-input", type: "text", placeholder: "Enter workout title", value: workoutDTO.name, onChange: e => handleFieldChange('name', e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Description" }), _jsx("input", { className: "form-input", type: "text", placeholder: "Enter description", value: workoutDTO.description, onChange: e => handleFieldChange('description', e.target.value) })] })] })] }), _jsxs("div", { className: "figma-header-row", children: [_jsxs("div", { className: "figma-header-left", children: [workoutDTO.workoutRounds.map((round, idx) => (_jsx("div", { className: `figma-header-card${selectedRoundIndex === idx ? ' filled' : ' outlined'}`, onClick: () => handleSelectRound(idx), style: { cursor: 'pointer' }, children: _jsx("input", { className: "figma-header-card-input", value: round.name, onChange: e => handleRoundNameChange(idx, e.target.value), style: { border: 'none', background: 'transparent', fontWeight: 'bold', width: 80 } }) }, round.name + idx))), _jsx("div", { className: "figma-header-plus", onClick: handleAddRound, style: { cursor: 'pointer' }, children: _jsx("span", { children: "+" }) })] }), _jsx("div", { className: "figma-header-menu", children: _jsx("span", { children: "\u22EE" }) })] }), _jsxs("div", { className: "create-workout-table", children: [_jsxs("div", { className: "table-header-row", children: [_jsx("div", { className: "table-header-col flex2", children: "Interval" }), _jsx("div", { className: "table-header-col flex2", children: "Prompt" }), _jsx("div", { className: "table-header-col flex2", children: "Time (Sec)" }), _jsx("div", { className: "table-header-col flex2", children: "Base Multiplier" }), _jsx("div", { className: "table-header-col flex2", children: "Gear" }), _jsx("div", { className: "table-header-col flex2", children: "Metric" }), _jsx("div", { className: "table-header-col flex2", children: "Target" }), _jsx("div", { className: "table-header-col flex2", children: "Scoring" }), _jsx("div", { className: "table-header-col flex2", children: "Action" })] }), _jsx("div", { className: "table-body", children: currentRound && currentRound.workoutBlocks.length > 0 ? (currentRound.workoutBlocks.map((block, blockIdx) => (_jsxs("div", { className: "table-row", children: [_jsx("div", { className: "table-col flex2", children: block.sequenceNo }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("select", { className: "custom-select", value: block.blockName, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'blockName', e.target.value), children: PROMPT_OPTIONS.map(opt => _jsx("option", { value: opt, children: opt }, opt)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "number", value: block.durationSeconds, min: 0, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'durationSeconds', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "number", value: block.multiplier, min: 1, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'multiplier', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "number", value: block.gear, min: 1, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'gear', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("select", { className: "custom-select", value: block.targetMetric, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'targetMetric', e.target.value), children: METRIC_OPTIONS.map(opt => _jsx("option", { value: opt, children: opt }, opt)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "number", value: block.targetValue, min: 0, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'targetValue', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: block.scoring, onChange: e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'scoring', e.target.value) }) }), _jsx("div", { className: "table-col flex2", style: { display: 'flex', gap: 8 }, children: _jsx("button", { className: "icon-btn", title: "Delete Row", tabIndex: -1, onClick: () => handleDeleteBlock(selectedRoundIndex, blockIdx), children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "5", y: "5", width: "10", height: "10", rx: "2", stroke: "#353535", strokeWidth: "1.5" }), _jsx("path", { d: "M8 8L12 12M12 8L8 12", stroke: "#353535", strokeWidth: "1.5", strokeLinecap: "round" })] }) }) })] }, block.sequenceNo)))) : (_jsx("div", { className: "table-row", children: _jsx("div", { className: "table-col flex2", style: { textAlign: 'center', width: '100%' }, children: "No blocks found." }) })) }), _jsx("div", { className: "table-action-row", children: _jsx("button", { className: "add-exercise-btn", onClick: () => handleAddBlock(selectedRoundIndex), children: "+ Add Exercise" }) })] })] }), _jsx(CreateWorkoutFooterBar, { onSave: handleSave }), error && _jsx("div", { style: { color: 'red', marginTop: 8, textAlign: 'center' }, children: error })] }));
};

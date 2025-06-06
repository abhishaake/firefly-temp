import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState, useEffect } from 'react';
import '../styles/workout.css';
const PROMPT_OPTIONS = ['WARMUP', 'RECOVERY', 'REST', 'STAIRS', 'HOLD'];
const METRIC_OPTIONS = ['WATTS', 'METERS', 'CALORIES'];
export const CreateWorkoutTable = ({ initialWorkout, selectedRoundIndex, onAddBlock }) => {
    // Flatten all blocks from all rounds
    const blocks = useMemo(() => {
        if (!initialWorkout?.workoutRounds)
            return [];
        return initialWorkout.workoutRounds.flatMap(round => round.workoutBlocks.map(block => ({
            ...block,
            roundName: round.name,
            roundSequence: round.sequenceNo,
        })));
    }, [initialWorkout]);
    // If no prior data, use local state for editable rows
    const [editableRows, setEditableRows] = useState(() => {
        if (blocks.length > 0) {
            return blocks.map(block => ({
                sequenceNo: block.sequenceNo,
                blockName: block.blockName,
                durationSeconds: block.durationSeconds,
                multiplier: block.multiplier,
                gear: block.gear,
                targetMetric: block.targetMetric,
                targetValue: block.targetValue,
                scoring: block.scoring,
            }));
        }
        return [];
    });
    // Sync editableRows with blocks if blocks change (e.g. on round switch)
    useEffect(() => {
        if (blocks.length > 0) {
            setEditableRows(blocks.map(block => ({
                sequenceNo: block.sequenceNo,
                blockName: block.blockName,
                durationSeconds: block.durationSeconds,
                multiplier: block.multiplier,
                gear: block.gear,
                targetMetric: block.targetMetric,
                targetValue: block.targetValue,
                scoring: block.scoring,
            })));
        }
        else {
            setEditableRows([]);
        }
    }, [blocks]);
    const handleAddEditableRow = () => {
        setEditableRows(prev => {
            const nextSeq = prev.length > 0 ? Math.max(...prev.map(r => r.sequenceNo)) + 1 : 1;
            return [
                ...prev,
                {
                    sequenceNo: nextSeq,
                    blockName: PROMPT_OPTIONS[0],
                    durationSeconds: 0,
                    multiplier: 1,
                    gear: 1,
                    targetMetric: METRIC_OPTIONS[0],
                    targetValue: 0,
                    scoring: '',
                },
            ];
        });
    };
    const handleEditRow = (seqNo, field, value) => {
        setEditableRows(prev => prev.map(row => row.sequenceNo === seqNo ? { ...row, [field]: value } : row));
    };
    const handleDeleteRow = (seqNo) => {
        setEditableRows(prev => prev.filter(row => row.sequenceNo !== seqNo));
    };
    return (_jsxs("div", { className: "create-workout-table", children: [_jsxs("div", { className: "table-header-row", children: [_jsx("div", { className: "table-header-col flex2", children: "Interval" }), _jsx("div", { className: "table-header-col flex2", children: "Prompt" }), _jsx("div", { className: "table-header-col flex2", children: "Time (Sec)" }), _jsx("div", { className: "table-header-col flex2", children: "Base Multiplier" }), _jsx("div", { className: "table-header-col flex2", children: "Gear" }), _jsx("div", { className: "table-header-col flex2", children: "Metric" }), _jsx("div", { className: "table-header-col flex2", children: "Target" }), _jsx("div", { className: "table-header-col flex2", children: "Scoring" }), _jsx("div", { className: "table-header-col flex2", children: "Action" })] }), _jsx("div", { className: "table-body", children: editableRows.length > 0 ? (editableRows.map((row) => (_jsxs("div", { className: "table-row", children: [_jsx("div", { className: "table-col flex2", children: row.sequenceNo }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("select", { className: "custom-select", value: row.blockName, onChange: e => handleEditRow(row.sequenceNo, 'blockName', e.target.value), children: PROMPT_OPTIONS.map(opt => _jsx("option", { value: opt, children: opt }, opt)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: row.durationSeconds, min: 0, onChange: e => handleEditRow(row.sequenceNo, 'durationSeconds', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: row.multiplier, min: 1, onChange: e => handleEditRow(row.sequenceNo, 'multiplier', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: row.gear, min: 1, onChange: e => handleEditRow(row.sequenceNo, 'gear', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("select", { className: "custom-select", value: row.targetMetric, onChange: e => handleEditRow(row.sequenceNo, 'targetMetric', e.target.value), children: METRIC_OPTIONS.map(opt => _jsx("option", { value: opt, children: opt }, opt)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: row.targetValue, min: 0, onChange: e => handleEditRow(row.sequenceNo, 'targetValue', Number(e.target.value)) }) }), _jsx("div", { className: "table-col flex2 cell-style", children: _jsx("input", { className: "cell-input", type: "text", value: row.scoring, onChange: e => handleEditRow(row.sequenceNo, 'scoring', e.target.value) }) }), _jsxs("div", { className: "table-col flex2", style: { display: 'flex', gap: 8 }, children: [_jsx("button", { className: "icon-btn", title: "Copy Row", tabIndex: -1, children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "5", y: "5", width: "10", height: "10", rx: "2", stroke: "#353535", strokeWidth: "1.5" }), _jsx("rect", { x: "2.5", y: "2.5", width: "10", height: "10", rx: "2", stroke: "#353535", strokeWidth: "1.5" })] }) }), _jsx("button", { className: "icon-btn", title: "Delete Row", tabIndex: -1, onClick: () => handleDeleteRow(row.sequenceNo), children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "5", y: "5", width: "10", height: "10", rx: "2", stroke: "#353535", strokeWidth: "1.5" }), _jsx("path", { d: "M8 8L12 12M12 8L8 12", stroke: "#353535", strokeWidth: "1.5", strokeLinecap: "round" })] }) })] })] }, row.sequenceNo)))) : (_jsx("div", { className: "table-row", children: _jsx("div", { className: "table-col flex2", style: { textAlign: 'center', width: '100%' }, children: "No blocks found." }) })) }), _jsx("div", { className: "table-action-row", children: _jsx("button", { className: "add-exercise-btn", onClick: () => onAddBlock && onAddBlock(selectedRoundIndex ?? 0), children: "+ Add Exercise" }) })] }));
};

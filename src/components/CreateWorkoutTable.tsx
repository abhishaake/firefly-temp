import React, { useMemo, useState, useEffect } from 'react';
import '../styles/workout.css';
import type { Workout } from '../types/workout';

interface CreateWorkoutFormProps {
  initialWorkout?: Partial<Workout>;
  selectedRoundIndex: number | undefined;
  onAddBlock?: (index: number) => void;
}

const PROMPT_OPTIONS = ['WARMUP', 'RECOVERY', 'REST', 'STAIRS', 'HOLD'];
const METRIC_OPTIONS = ['WATTS', 'METERS', 'CALORIES'];

interface EditableBlock {
  sequenceNo: number;
  blockName: string;
  durationSeconds: number;
  multiplier: number;
  gear: number;
  targetMetric: string;
  targetValue: number;
  scoring: string;
}

export const CreateWorkoutTable: React.FC<CreateWorkoutFormProps> = ({ initialWorkout, selectedRoundIndex, onAddBlock }) => {
  // Flatten all blocks from all rounds
  const blocks = useMemo(() => {
    if (!initialWorkout?.workoutRounds) return [];
    return initialWorkout.workoutRounds.flatMap(round => round.workoutBlocks.map(block => ({
      ...block,
      roundName: round.name,
      roundSequence: round.sequenceNo,
    })));
  }, [initialWorkout]);

  // If no prior data, use local state for editable rows
  const [editableRows, setEditableRows] = useState<EditableBlock[]>(() => {
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
    } else {
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

  const handleEditRow = (seqNo: number, field: keyof EditableBlock, value: any) => {
    setEditableRows(prev => prev.map(row => row.sequenceNo === seqNo ? { ...row, [field]: value } : row));
  };

  const handleDeleteRow = (seqNo: number) => {
    setEditableRows(prev => prev.filter(row => row.sequenceNo !== seqNo));
  };

  return (
    <div className="create-workout-table">
      <div className="table-header-row">
        <div className="table-header-col flex2">Interval</div>
        <div className="table-header-col flex2">Prompt</div>
        <div className="table-header-col flex2">Time (Sec)</div>
        <div className="table-header-col flex2">Base Multiplier</div>
        <div className="table-header-col flex2">Gear</div>
        <div className="table-header-col flex2">Metric</div>
        <div className="table-header-col flex2">Target</div>
        <div className="table-header-col flex2">Scoring</div>
        <div className="table-header-col flex2">Action</div>
      </div>
        <div className="table-body">
          {editableRows.length > 0 ? (
            editableRows.map((row) => (
              <div className="table-row" key={row.sequenceNo}>
                <div className="table-col flex2">{row.sequenceNo}</div>
                <div className="table-col flex2 cell-style">
                  <select className="custom-select" value={row.blockName} onChange={e => handleEditRow(row.sequenceNo, 'blockName', e.target.value)}>
                    {PROMPT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="table-col flex2 cell-style">
                  <input className="cell-input" type="text" value={row.durationSeconds} min={0} onChange={e => handleEditRow(row.sequenceNo, 'durationSeconds', Number(e.target.value))} />
                </div>
                <div className="table-col flex2 cell-style">
                  <input className="cell-input" type="text" value={row.multiplier} min={1} onChange={e => handleEditRow(row.sequenceNo, 'multiplier', Number(e.target.value))} />
                </div>
                <div className="table-col flex2 cell-style">
                  <input className="cell-input" type="text" value={row.gear} min={1} onChange={e => handleEditRow(row.sequenceNo, 'gear', Number(e.target.value))} />
                </div>
                <div className="table-col flex2 cell-style">
                  <select className="custom-select" value={row.targetMetric} onChange={e => handleEditRow(row.sequenceNo, 'targetMetric', e.target.value)}>
                    {METRIC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="table-col flex2 cell-style">
                  <input className="cell-input" type="text" value={row.targetValue} min={0} onChange={e => handleEditRow(row.sequenceNo, 'targetValue', Number(e.target.value))} />
                </div>
                <div className="table-col flex2 cell-style">
                  <input className="cell-input" type="text" value={row.scoring} onChange={e => handleEditRow(row.sequenceNo, 'scoring', e.target.value)} />
                </div>
                <div className="table-col flex2" style={{display:'flex',gap:8}}>
                  <button className="icon-btn" title="Copy Row" tabIndex={-1}>
                    {/* Copy SVG */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="10" rx="2" stroke="#353535" strokeWidth="1.5"/><rect x="2.5" y="2.5" width="10" height="10" rx="2" stroke="#353535" strokeWidth="1.5"/></svg>
                  </button>
                  <button className="icon-btn" title="Delete Row" tabIndex={-1} onClick={() => handleDeleteRow(row.sequenceNo)}>
                    {/* Delete SVG */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="10" rx="2" stroke="#353535" strokeWidth="1.5"/><path d="M8 8L12 12M12 8L8 12" stroke="#353535" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-col flex2" style={{ textAlign: 'center', width: '100%' }}>
                No blocks found.
              </div>
            </div>
          )}
        </div>
      <div className="table-action-row">
        <button className="add-exercise-btn" onClick={() => onAddBlock && onAddBlock(selectedRoundIndex ?? 0)}>+ Add Exercise</button>
      </div>
    </div>
  );
}; 
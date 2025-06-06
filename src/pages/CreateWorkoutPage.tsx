import React, { useState } from 'react';
import '../styles/workout.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useWorkoutDetailsQuery } from '../hooks/useWorkoutsQuery';
import type { Workout } from '../types/workout';
import type { WorkoutRound } from '../types/workoutRounds';
import type { WorkoutBlock } from '../types/workoutBlocks';

const PROMPT_OPTIONS = ['WARMUP', 'RECOVERY', 'REST', 'STAIRS', 'HOLD'];
const METRIC_OPTIONS = ['WATTS', 'METERS', 'CALORIES'];

// --- CreateWorkoutFooterBar (already in this file) ---
const CreateWorkoutFooterBar: React.FC<{ onSave: () => void }> = ({ onSave }) => (
  <div className="create-workout-footer-bar">
    <div className="footer-bar-time">Time : 600/2700 Sec</div>
    <div className="footer-bar-actions">
      <button className="footer-cancel-btn">Cancel</button>
      <button className="footer-save-btn" onClick={onSave}>Save & Publish</button>
    </div>
  </div>
);

// --- Main Page ---
export const CreateWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ workoutId?: string }>();
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
  const {
    data: workoutDetails,
    isLoading: isDetailsLoading
  } = useWorkoutDetailsQuery(workoutId ? workoutId : undefined);

  // Single source of truth for all data
  const [workoutDTO, setWorkoutDTO] = useState<Workout>(() => {
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
    } as Workout;
  });
  const [selectedRoundIndex, setSelectedRoundIndex] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync workoutDTO with API data if it changes
  React.useEffect(() => {
    if (workoutDetails) {
      setWorkoutDTO(JSON.parse(JSON.stringify(workoutDetails)));
      setSelectedRoundIndex(0);
    }
  }, [workoutDetails]);

  // Form field handlers
  const handleFieldChange = (field: keyof Workout, value: any) => {
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
  const handleSelectRound = (idx: number) => {
    setSelectedRoundIndex(idx);
  };
  const handleRoundNameChange = (idx: number, value: string) => {
    setWorkoutDTO(prev => ({
      ...prev,
      workoutRounds: prev.workoutRounds.map((r, i) => i === idx ? { ...r, name: value } : r)
    }));
  };
  // Block handlers
  const handleAddBlock = (roundIdx: number) => {
    setWorkoutDTO(prev => {
      const rounds = prev.workoutRounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const nextSeq = r.workoutBlocks.length + 1;
        const newBlock: WorkoutBlock = {
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
  const handleBlockFieldChange = (roundIdx: number, blockIdx: number, field: keyof WorkoutBlock, value: any) => {
    setWorkoutDTO(prev => {
      const rounds = prev.workoutRounds.map((r, i) => {
        if (i !== roundIdx) return r;
        return {
          ...r,
          workoutBlocks: r.workoutBlocks.map((b, j) => j === blockIdx ? { ...b, [field]: value } : b)
        };
      });
      return { ...prev, workoutRounds: rounds };
    });
  };
  const handleDeleteBlock = (roundIdx: number, blockIdx: number) => {
    setWorkoutDTO(prev => {
      const rounds = prev.workoutRounds.map((r, i) => {
        if (i !== roundIdx) return r;
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
      } else {
        setError(data.message || 'Failed to create workout');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create workout');
    } finally {
      setSaving(false);
    }
  };

  // Show loading banner if waiting for API
  if (workoutId && isDetailsLoading) {
    return <div style={{ padding: 32, textAlign: 'center', fontWeight: 600 }}>Loading workout details...</div>;
  }

  const currentRound = workoutDTO.workoutRounds[selectedRoundIndex];

  return (
    <div className="workout-outer-card">
      {/* Loading bar at the top */}
      {saving && (
        <div style={{ width: '100%', height: 4, background: '#F3E8FF', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
          <div style={{ width: '100%', height: '100%', background: '#A259FF', animation: 'loadingBar 1s linear infinite' }} />
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
      <div className="create-workout-header">
        <button className="back-arrow-btn" aria-label="Back" onClick={() => navigate('/workout')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="header-title">Build Workout Block</span>
      </div>
      <div className="create-workout-page-container">
        <div className="create-workout-form">
          <div className="form-title">Create Workout</div>
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Workout Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter workout title"
                value={workoutDTO.name}
                onChange={e => handleFieldChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter description"
                value={workoutDTO.description}
                onChange={e => handleFieldChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="figma-header-row">
          <div className="figma-header-left">
            {workoutDTO.workoutRounds.map((round, idx) => (
              <div
                key={round.name + idx}
                className={`figma-header-card${selectedRoundIndex === idx ? ' filled' : ' outlined'}`}
                onClick={() => handleSelectRound(idx)}
                style={{ cursor: 'pointer' }}
              >
                <input
                  className="figma-header-card-input"
                  value={round.name}
                  onChange={e => handleRoundNameChange(idx, e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 'bold', width: 80 }}
                />
              </div>
            ))}
            <div className="figma-header-plus" onClick={handleAddRound} style={{cursor:'pointer'}}><span>+</span></div>
          </div>
          <div className="figma-header-menu"><span>⋮</span></div>
        </div>
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
            {currentRound && currentRound.workoutBlocks.length > 0 ? (
              currentRound.workoutBlocks.map((block, blockIdx) => (
                <div className="table-row" key={block.sequenceNo}>
                  <div className="table-col flex2">{block.sequenceNo}</div>
                  <div className="table-col flex2 cell-style">
                    <select className="custom-select" value={block.blockName} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'blockName', e.target.value)}>
                      {PROMPT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="number" value={block.durationSeconds} min={0} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'durationSeconds', Number(e.target.value))} />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="number" value={block.multiplier} min={1} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'multiplier', Number(e.target.value))} />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="number" value={block.gear} min={1} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'gear', Number(e.target.value))} />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <select className="custom-select" value={block.targetMetric} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'targetMetric', e.target.value)}>
                      {METRIC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="number" value={block.targetValue} min={0} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'targetValue', Number(e.target.value))} />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="text" value={block.scoring} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'scoring', e.target.value)} />
                  </div>
                  <div className="table-col flex2" style={{display:'flex',gap:8}}>
                    <button className="icon-btn" title="Delete Row" tabIndex={-1} onClick={() => handleDeleteBlock(selectedRoundIndex, blockIdx)}>
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
            <button className="add-exercise-btn" onClick={() => handleAddBlock(selectedRoundIndex)}>+ Add Exercise</button>
          </div>
        </div>
      </div>
      <CreateWorkoutFooterBar onSave={handleSave} />
      {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}; 
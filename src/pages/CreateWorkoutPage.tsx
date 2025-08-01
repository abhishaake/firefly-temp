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
const CreateWorkoutFooterBar: React.FC<{ onSave: () => void; currentTime: number; totalTime: number }> = ({ onSave, currentTime, totalTime }) => (
  <div className="create-workout-footer-bar">
    <div className="footer-bar-time">Time : {currentTime}/{totalTime} Sec</div>
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
  let cloneFromWorkoutId: number | undefined;

  if (!workoutId && location.search) {
    const searchParams = new URLSearchParams(location.search);
    const idFromQuery = searchParams.get('workoutId');
    const cloneIdFromQuery = searchParams.get('cloneFromWorkoutId');
    if (idFromQuery) {
      workoutId = Number(idFromQuery);
    } else if (cloneIdFromQuery) {
      cloneFromWorkoutId = Number(cloneIdFromQuery);
    }
  }

  // Load workout data for editing or cloning
  const sourceWorkoutId = workoutId || cloneFromWorkoutId;
  const {
    data: workoutDetails,
    isLoading: isDetailsLoading
  } = useWorkoutDetailsQuery(sourceWorkoutId ? sourceWorkoutId : undefined);

  // Single source of truth for all data
  const [workoutDTO, setWorkoutDTO] = useState<Workout>(() => {
    if (workoutDetails) {
      const clonedData = JSON.parse(JSON.stringify(workoutDetails));
      // If this is a clone operation, remove all IDs to make it a new workout
      if (cloneFromWorkoutId) {
        clonedData.workoutId = 0;
        clonedData.name = `Copy of ${clonedData.name}`;
        clonedData.workoutRounds = clonedData.workoutRounds.map((round: any) => ({
          ...round,
          roundId: 0,
          workoutBlocks: round.workoutBlocks.map((block: any) => ({
            ...block,
            blockId: 0
          }))
        }));
      }
      return clonedData;
    }
    // For new workouts, start with 3 rounds
    const defaultRounds = [
      { roundId: 0, name: 'Row', sequenceNo: 1, workoutBlocks: [], type: 'ROW' },
      { roundId: 0, name: 'Bike', sequenceNo: 2, workoutBlocks: [], type: 'BIKE' },
      { roundId: 0, name: 'Ski', sequenceNo: 3, workoutBlocks: [], type: 'SKI' },
    ];
    return {
      workoutId: 0,
      name: '',
      description: '',
      duration: '0',
      createdBy: '',
      workoutRounds: defaultRounds,
    } as Workout;
  });
  const [selectedRoundIndex, setSelectedRoundIndex] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync workoutDTO with API data if it changes
  React.useEffect(() => {
    if (workoutDetails) {
      const clonedData = JSON.parse(JSON.stringify(workoutDetails));
      // If this is a clone operation, remove all IDs to make it a new workout
      if (cloneFromWorkoutId) {
        clonedData.workoutId = 0;
        clonedData.name = `Copy of ${clonedData.name}`;
        clonedData.workoutRounds = clonedData.workoutRounds.map((round: any) => ({
          ...round,
          roundId: 0,
          workoutBlocks: round.workoutBlocks.map((block: any) => ({
            ...block,
            blockId: 0
          }))
        }));
      }
      setWorkoutDTO(clonedData);
      setSelectedRoundIndex(0);
    }
  }, [workoutDetails, cloneFromWorkoutId]);

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
          { roundId: 0, name: `Round ${nextSeq}`, sequenceNo: nextSeq, workoutBlocks: [] }
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
          blockId: null,
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

  // Helper function to handle numeric input validation
  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, roundIdx: number, blockIdx: number, field: keyof WorkoutBlock) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleBlockFieldChange(roundIdx, blockIdx, field, value === '' ? 0 : Number(value));
    }
  };

  // Helper function to prevent non-numeric key presses
  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down arrows
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 190) {
      e.preventDefault();
    }
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
    // Validate that each round has exactly 2 minutes (120 seconds)
    const validationErrors: string[] = [];
    workoutDTO.workoutRounds.forEach((round, index) => {
      const totalDuration = round.workoutBlocks.reduce((sum, block) => sum + block.durationSeconds, 0);
      if (totalDuration !== 120) {
        validationErrors.push(`${round.name} total duration is ${totalDuration} seconds. It must be exactly 120 seconds (2 minutes).`);
      }
    });

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    setSaving(true);
    setError(null);
    const { name, description, workoutRounds } = workoutDTO;
    const roundRequests = workoutRounds.map(round => ({
      name: round.name,
      roundId: round.roundId,
      sequenceNo: round.sequenceNo,
      type: round.name === 'Row' ? 'ROW' : round.name === 'Bike' ? 'BIKE' : 'SKI',
      workoutBlockRequests: round.workoutBlocks.map(block => ({
        workoutId: (workoutId && !cloneFromWorkoutId) ? workoutId : null, // Use actual workoutId only when editing, not cloning
        blockId: block.blockId,
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
      let response;
      // Only use PUT endpoint if we have workoutId AND it's not a clone operation
      if (workoutId && !cloneFromWorkoutId) {
        // Edit existing workout - use PUT endpoint
        response = await fetch(`https://firefly-admin.cozmotech.ie/api/v1/workouts/${workoutId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'token': 'FfbhuYx_pSVRl7npG8wQIw',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new workout (including clones) - use POST endpoint
        response = await fetch('https://firefly-admin.cozmotech.ie/api/v1/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': 'FfbhuYx_pSVRl7npG8wQIw',
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (response.ok) {
        navigate('/workouts');
      } else {
        const isEdit = workoutId && !cloneFromWorkoutId;
        setError(data.message || `Failed to ${isEdit ? 'update' : 'create'} workout`);
      }
    } catch (error: any) {
      const isEdit = workoutId && !cloneFromWorkoutId;
      setError(error.message || `Failed to ${isEdit ? 'update' : 'create'} workout`);
    } finally {
      setSaving(false);
    }
  };



  // Show loading banner if waiting for API
  if (sourceWorkoutId && isDetailsLoading) {
    return <div style={{ padding: 32, textAlign: 'center', fontWeight: 600 }}>Loading workout details...</div>;
  }

  const currentRound = workoutDTO.workoutRounds[selectedRoundIndex];

  // Calculate total time from all rounds and blocks
  const currentTotalTime = workoutDTO.workoutRounds.reduce((total, round) => {
    return total + round.workoutBlocks.reduce((roundTotal, block) => roundTotal + block.durationSeconds, 0);
  }, 0);

  // Expected total time (2 minutes per round)
  const expectedTotalTime = workoutDTO.workoutRounds.length * 120;

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
        <button className="back-arrow-btn" aria-label="Back" onClick={() => navigate('/workouts')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                {round.name}
                {/* <input
                  className="figma-header-card-input"
                  value={round.name}
                  // onChange={e => handleRoundNameChange(idx, e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 'bold', width: 80 }}
                /> */}
              </div>
            ))}
            <div className="figma-header-plus" onClick={handleAddRound} style={{ cursor: 'pointer' }}><span>+</span></div>
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
                    <input
                      className="cell-input"
                      type="text"
                      value={block.durationSeconds}
                      placeholder="Enter seconds"
                      onChange={e => handleNumericInputChange(e, selectedRoundIndex, blockIdx, 'durationSeconds')}
                      onKeyDown={handleNumericKeyDown}
                    />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input
                      className="cell-input"
                      type="text"
                      value={block.multiplier}
                      placeholder="Enter multiplier"
                      onChange={e => handleNumericInputChange(e, selectedRoundIndex, blockIdx, 'multiplier')}
                      onKeyDown={handleNumericKeyDown}
                    />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input
                      className="cell-input"
                      type="text"
                      value={block.gear}
                      placeholder="Enter gear"
                      onChange={e => handleNumericInputChange(e, selectedRoundIndex, blockIdx, 'gear')}
                      onKeyDown={handleNumericKeyDown}
                    />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <select className="custom-select" value={block.targetMetric} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'targetMetric', e.target.value)}>
                      {METRIC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input
                      className="cell-input"
                      type="text"
                      value={block.targetValue}
                      placeholder="Enter target value"
                      onChange={e => handleNumericInputChange(e, selectedRoundIndex, blockIdx, 'targetValue')}
                      onKeyDown={handleNumericKeyDown}
                    />
                  </div>
                  <div className="table-col flex2 cell-style">
                    <input className="cell-input" type="text" value={block.scoring} onChange={e => handleBlockFieldChange(selectedRoundIndex, blockIdx, 'scoring', e.target.value)} />
                  </div>
                  <div className="table-col flex2" style={{ display: 'flex', gap: 8 }}>
                    <button className="icon-btn" title="Delete Row" tabIndex={-1} onClick={() => handleDeleteBlock(selectedRoundIndex, blockIdx)}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="10" rx="2" stroke="#353535" strokeWidth="1.5" /><path d="M8 8L12 12M12 8L8 12" stroke="#353535" strokeWidth="1.5" strokeLinecap="round" /></svg>
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
      <CreateWorkoutFooterBar onSave={handleSave} currentTime={currentTotalTime} totalTime={expectedTotalTime} />
      {error && <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</div>}
    </div>
  );
}; 
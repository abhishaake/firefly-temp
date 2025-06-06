import React, { useState } from 'react';
import '../styles/create-class.css';
import { useWorkoutsQuery } from '../hooks/useWorkoutsQuery';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateClassHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="create-class-header-row">
      <button className="back-arrow-btn" aria-label="Back" onClick={() => navigate('/') }>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="create-class-title">Create New Class</span>
    </div>
  );
};

const ClassDetailsSection: React.FC = () => (
  <div className="class-details-section">
    <div className="class-details-label">Class Details</div>
    <div className="class-details-fields">
    <div className="class-details-row">
        <div className="class-details-group">
          <label>Class Name</label>
          <input style={{width: '500px'}} type="text" placeholder="Enter class name" />
        </div>
      </div>
      <div className="class-details-row">
      <div className="class-details-group">
          <label>Location</label>
          <input style={{width: '500px'}} type="text" placeholder="Enter Location name" />
        </div>
        <div className="class-details-group">
          <label>Trainer</label>
          <input style={{width: '500px'}} type="text" placeholder="Enter trainer name" />
        </div>
      </div>
      <div className="class-details-row">
      <div className="class-details-group"> 
          <label>Date</label>
          <input style={{width: '500px'}} type="date" />
        </div>
        <div className="class-details-group">
          <label>Time</label>
          <input style={{width: '500px'}} type="time" />
        </div>
        
      </div>
    </div>
  </div>
);

export const CreateClassPage: React.FC = () => {
  // Form state
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [userId, setUserId] = useState(25); // Placeholder, update as needed
  const [gymLocation, setGymLocation] = useState(2); // Placeholder, update as needed
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      } else {
        setError(data.message || 'Failed to create class');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  };

  // AssignWorkoutSection as inner component to access setWorkoutId
  const AssignWorkoutSection: React.FC = () => {
    const { data, isLoading, error } = useWorkoutsQuery();
    const workouts = data?.data?.workouts || [];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedWorkout = workouts.find((w: any) => w.workoutId === workoutId);
    return (
      <div className="assign-workout-section">
        <div className="assign-workout-label">Assign Workout</div>
        <div className="assign-workout-card" style={{ position: 'relative' }}>
          <div className="assign-workout-card-row" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer' }}>
            <span className="assign-workout-card-title">
              {selectedWorkout ? selectedWorkout.name : 'Select Workout'}
            </span>
            <span className="assign-workout-card-dropdown">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="#353535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          {dropdownOpen && (
            <div style={{
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
            }}>
              {isLoading && <div style={{ padding: '12px 16px', color: '#888' }}>Loading...</div>}
              {error && <div style={{ padding: '12px 16px', color: '#e74c3c' }}>Error loading workouts</div>}
              {workouts.map((w: any) => (
                <div
                  key={w.workoutId}
                  style={{ padding: '12px 16px', cursor: 'pointer', color: '#353535', fontFamily: 'Lato, Arial, sans-serif', fontSize: 16, background: workoutId === w.workoutId ? '#F9F5FD' : '#fff' }}
                  onClick={() => { setWorkoutId(w.workoutId); setDropdownOpen(false); }}
                >
                  {w.name}
                </div>
              ))}
              {!isLoading && workouts.length === 0 && <div style={{ padding: '12px 16px', color: '#888' }}>No workouts found</div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="create-class-page-root">
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
      <CreateClassHeader />
      <div className="class-details-section">
        <div className="class-details-label">Class Details</div>
        <div className="class-details-fields">
          <div className="class-details-row">
            <div className="class-details-group">
              <label>Class Name</label>
              <input style={{width: '500px'}} type="text" placeholder="Enter class name" value={className} onChange={e => setClassName(e.target.value)} />
            </div>
          </div>
          <div className="class-details-row">
            <div className="class-details-group">
              <label>Start Date & Time</label>
              <DatePicker
                selected={startDateTime}
                onChange={(date: Date | null) => setStartDateTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start date and time"
                className="your-custom-class"
                popperPlacement="bottom"
              />
            </div>
            <div className="class-details-group">
              <label>End Date & Time</label>
              <DatePicker
                selected={endDateTime}
                onChange={(date: Date | null) => setEndDateTime(date)}
                showTimeSelect
                showDateSelect={false}
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end date and time"
                className="your-custom-class"
                popperPlacement="bottom"
              />
            </div>
          </div>
          
        </div>
      </div>
      <AssignWorkoutSection />
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button className="footer-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Class'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
} 
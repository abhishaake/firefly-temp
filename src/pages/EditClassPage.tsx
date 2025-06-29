import React, { useState, useEffect } from 'react';
import '../styles/edit-class.css';
import { useWorkoutsQuery } from '../hooks/useWorkoutsQuery';
import { useGymLocationsQuery } from '../hooks/useGymLocationsQuery';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassDetailsQuery } from '../hooks/useApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditClassHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="edit-class-header-row">
      <button className="back-arrow-btn" aria-label="Back" onClick={() => navigate('/manage-classes')}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="edit-class-title">Edit Class</span>
    </div>
  );
};

export const EditClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  
  // Fetch existing class data
  const { data: classData, isLoading: isLoadingClass, error: classError } = useClassDetailsQuery(classId);
  
  // Form state
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [userId, setUserId] = useState(25); // Placeholder, update as needed
  const [selectedGymLocationId, setSelectedGymLocationId] = useState<number | null>(null);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Pre-fill form when class data is loaded
  useEffect(() => {
    if (classData) {
      setClassName(classData.className || '');
      setDescription(classData.description || '');
      
      // Convert epoch to Date object
      if (classData.startTimeEpoch) {
        const startDate = new Date(parseInt(classData.startTimeEpoch) * 1000);
        setStartDateTime(startDate);
      }
      
      // Parse gym location and workout from the class data
      // Note: You may need to adjust this based on your actual data structure
      // For now, we'll set defaults and let the user select from dropdowns
      setSelectedGymLocationId(parseInt(classData.gymLocation));
      setWorkoutId(classData.workoutId);
    }
  }, [classData]);

  // Save handler
  const handleSave = async () => {
    if (!classId) {
      showError('Class ID is missing.');
      return;
    }
    
    // Validate required fields
    if (!selectedGymLocationId) {
      showError('Please select a gym location.');
      return;
    }
    if (!workoutId) {
      showError('Please select a workout.');
      return;
    }
    
    setSaving(true);
    // Convert date and time to epoch (seconds)
    const date = startDateTime ? startDateTime.toISOString().slice(0, 10) : '';
    const startEpoch = startDateTime ? Math.floor(startDateTime.getTime() / 1000) : undefined;
    const endEpoch = startEpoch + 2700; // 45 minutes later
    
    const payload = {
      className,
      description,
      date,
      startTime: startEpoch,
      endTime: endEpoch,
      maxCapacity,
      userId,
      gymLocation: selectedGymLocationId,
      workoutId,
    };
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/class/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': 'FfbhuYx_pSVRl7npG8wQIw',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        showSuccess('Class updated successfully!');
        navigate('/manage-classes');
      } else {
        showError(data.message || 'Failed to update class');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update class');
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

  // AssignGymLocationSection as inner component to access setSelectedGymLocationId
  const AssignGymLocationSection: React.FC = () => {
    const { data, isLoading, error } = useGymLocationsQuery();
    const gymLocations = data?.data || [];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedGymLocation = gymLocations.find((g: any) => g.id === selectedGymLocationId);
    
    return (
      <div className="assign-workout-section">
        <div className="assign-workout-label">Select Gym Location</div>
        <div className="assign-workout-card" style={{ position: 'relative' }}>
          <div className="assign-workout-card-row" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer' }}>
            <span className="assign-workout-card-title">
              {selectedGymLocation ? selectedGymLocation.name : 'Select Gym Location'}
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
              {error && <div style={{ padding: '12px 16px', color: '#e74c3c' }}>Error loading gym locations</div>}
              {gymLocations.map((g: any) => (
                <div
                  key={g.id}
                  style={{ padding: '12px 16px', cursor: 'pointer', color: '#353535', fontFamily: 'Lato, Arial, sans-serif', fontSize: 16, background: selectedGymLocationId === g.id ? '#F9F5FD' : '#fff' }}
                  onClick={() => { setSelectedGymLocationId(g.id); setDropdownOpen(false); }}
                >
                  {g.name}
                </div>
              ))}
              {!isLoading && gymLocations.length === 0 && <div style={{ padding: '12px 16px', color: '#888' }}>No gym locations found</div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoadingClass) {
    return (
      <div className="edit-class-page-root">
        <div>Loading class details...</div>
      </div>
    );
  }

  if (classError) {
    return (
      <div className="edit-class-page-root">
        <div>Error loading class details</div>
      </div>
    );
  }

  return (
    <div className="edit-class-page-root">
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
      <EditClassHeader />
      <div className="class-details-section">
        <div className="class-details-label">Class Details</div>
        <div className="class-details-fields">
          <div className="class-details-row">
            <div className="class-details-group">
              <label>Class Name</label>
              <input 
                style={{width: '500px'}} 
                type="text" 
                placeholder="Enter class name" 
                value={className} 
                onChange={e => setClassName(e.target.value)} 
              />
            </div>
          </div>
          <div className="class-details-row">
            <div className="class-details-group">
              <label>Start Date & Time</label>
              <DatePicker
                selected={startDateTime}
                onChange={(date: Date | null) => setStartDateTime(date)}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={5}
                dateFormat="yyyy-MM-dd h:mm aa"
                placeholderText="Select start date and time"
                className="your-custom-class"
                popperPlacement="bottom-start"
                minDate={new Date()}
                filterTime={(time) => {
                  const now = new Date();
                  const minTime = new Date(now.getTime() + 5 * 60 * 1000);
                  const selectedDate = startDateTime || new Date();
                  
                  // If selected date is today, filter out times before (now + 5 minutes)
                  if (selectedDate.toDateString() === now.toDateString()) {
                    return time.getTime() >= minTime.getTime();
                  }
                  
                  // For future dates, allow all times
                  return true;
                }}
                popperContainer={({ children }) => (
                  <div style={{ position: 'relative', zIndex: 1000 }}>
                    {children}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AssignWorkoutSection />
        <AssignGymLocationSection />
      </div>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button className="footer-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Updating...' : 'Update Class'}
        </button>
      </div>
    </div>
  );
}; 
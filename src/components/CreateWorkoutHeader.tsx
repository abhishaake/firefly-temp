import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/workout.css';

export const CreateWorkoutHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="create-workout-header">
      <button className="back-arrow-btn" aria-label="Back" onClick={() => navigate('/workout')}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="header-title">Build Workout Block</span>
    </div>
  );
}; 
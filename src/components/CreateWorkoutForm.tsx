import React, { useState, useEffect } from 'react';
import '../styles/workout.css';
import type { Workout } from '../types/workout';

interface CreateWorkoutFormProps {
  initialWorkout?: Partial<Workout>;
}

export const CreateWorkoutForm: React.FC<CreateWorkoutFormProps> = ({ initialWorkout }) => {
  const [title, setTitle] = useState(initialWorkout?.name || '');
  const [className, setClassName] = useState(initialWorkout?.description || '');

  useEffect(() => {
    setTitle(initialWorkout?.name || '');
    setClassName(initialWorkout?.description || '');
  }, [initialWorkout]);

  return (
    <div className="create-workout-form">
      <div className="form-title">Create Workout</div>
      <div className="form-section">
        <div className="form-group">
          <label className="form-label">Workout Title</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter workout title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}; 
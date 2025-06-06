import React from 'react';
import '../styles/workout.css';

export const CreateWorkoutMusicRow: React.FC = () => (
  <div className="music-row">
    <div className="music-card">
      <div className="music-card-icon">
        {/* Music SVG from Figma */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="12" fill="#76628A"/>
          <path d="M28 14V26C28 27.1046 27.1046 28 26 28H14C12.8954 28 12 27.1046 12 26V14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14Z" fill="#F9F5FD"/>
          <circle cx="20" cy="20" r="6" fill="#76628A"/>
        </svg>
      </div>
      <span className="music-card-label">Add Music</span>
    </div>
    <div className="music-card">
      <div className="music-card-icon">
        {/* Music SVG from Figma (duplicate for demo) */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="12" fill="#76628A"/>
          <path d="M28 14V26C28 27.1046 27.1046 28 26 28H14C12.8954 28 12 27.1046 12 26V14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14Z" fill="#F9F5FD"/>
          <circle cx="20" cy="20" r="6" fill="#76628A"/>
        </svg>
      </div>
      <span className="music-card-label">Add Music</span>
    </div>
  </div>
); 
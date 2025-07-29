import React from 'react';
import type { UserProfile } from '../../types';

interface PersonalBestsProps {
  userProfile: UserProfile;
}

export const PersonalBests: React.FC<PersonalBestsProps> = ({ userProfile }) => {
  if (!userProfile) return null;
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (value: number): string => {
    return Math.round(value).toLocaleString();
  };

  return (
    <div className="personal-bests">
      <h2 className="personal-bests-title">Personal Bests</h2>
      <div className="personal-bests-grid">
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>MAX</div>
            <div>WATTAGE</div>
          </div>
          <div className="personal-best-value">{formatNumber(userProfile.maxWatt)}</div>
        </div>
        
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>TOTAL</div>
            <div>METERS</div>
          </div>
          <div className="personal-best-value">{formatNumber(userProfile.totalMeters)}</div>
        </div>
        
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>MAX</div>
            <div>CALORIES</div>
          </div>
          <div className="personal-best-value">{formatNumber(userProfile.maxCalories)}</div>
        </div>
        
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>1000 M</div>
          </div>
          <div className="personal-best-value">{formatTime(userProfile.time1000)}</div>
        </div>
        
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>500 M</div>
          </div>
          <div className="personal-best-value">{formatTime(userProfile.time500)}</div>
        </div>
        
        <div className="personal-best-card">
          <div className="personal-best-label">
            <div>250 M</div>
          </div>
          <div className="personal-best-value">{formatTime(userProfile.time250)}</div>
        </div>
      </div>
    </div>
  );
}; 
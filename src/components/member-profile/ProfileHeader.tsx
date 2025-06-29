import React from 'react';
import type { UserInfo } from '../../types';

interface ProfileHeaderProps {
  userInfo: UserInfo;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo }) => {
  const getLevel = () => {
    // Extract numeric age from string like "25 years"
    const ageMatch = userInfo.age.match(/\d+/);
    const age = ageMatch ? parseInt(ageMatch[0]) : 25;
    // Simple level calculation based on age
    return Math.floor(age / 5);
  };

  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {userInfo.profilePicture ? (
                <img src={userInfo.profilePicture} alt={userInfo.fullName} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {userInfo.fullName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="profile-name-section">
            <h1 className="profile-name">{userInfo.fullName}</h1>
            <p className="profile-level">Level {getLevel()}</p>
          </div>
        </div>
        
        <div className="personal-info-section">
          <h2 className="personal-info-title">Personal Information</h2>
          <div className="personal-info-grid">
            <div className="personal-info-column">
              <p className="personal-info-item">Age - {userInfo.age}</p>
              <p className="personal-info-item">Weight - {userInfo.weight}</p>
            </div>
            <div className="personal-info-column">
              <p className="personal-info-item">Sex - {userInfo.gender}</p>
              <p className="personal-info-item">Height - {userInfo.height}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
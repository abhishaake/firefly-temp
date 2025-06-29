import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ServiceFactory } from '../services/ServiceFactory';
import { ProfileHeader } from '../components/member-profile/ProfileHeader';
import { MachineChart } from '../components/member-profile/MachineChart';
import { PersonalBests } from '../components/member-profile/PersonalBests';
import '../styles/member-profile.css';

export const MemberProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const memberProfileService = ServiceFactory.getMemberProfileService();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['memberProfile', userId],
    queryFn: () => memberProfileService.getMemberProfile(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="member-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData?.success) {
    return (
      <div className="member-profile-page">
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>Unable to load member profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { userInfo, machineSummaryList, userProfile } = profileData.data;

  return (
    <div className="member-profile-page">
      <div className="member-profile-header">
        <div className="member-profile-header-back-button">
                <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => navigate('/members')}>
                    <svg width="19" height="18" color="white" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.1671 7.83327H4.13548L9.82881 2.13994C10.2838 1.68494 10.2838 0.938274 9.82881 0.483274C9.72088 0.37512 9.59268 0.289315 9.45154 0.23077C9.31041 0.172225 9.15911 0.14209 9.00632 0.14209C8.85352 0.14209 8.70222 0.172225 8.56109 0.23077C8.41995 0.289315 8.29175 0.37512 8.18382 0.483274L0.495482 8.17161C0.387328 8.27954 0.301522 8.40774 0.242977 8.54888C0.184432 8.69002 0.154297 8.84131 0.154297 8.99411C0.154297 9.1469 0.184432 9.2982 0.242977 9.43934C0.301522 9.58047 0.387328 9.70868 0.495482 9.81661L8.18382 17.5049C8.29183 17.613 8.42006 17.6986 8.56118 17.7571C8.70231 17.8155 8.85356 17.8456 9.00632 17.8456C9.15907 17.8456 9.31032 17.8155 9.45145 17.7571C9.59257 17.6986 9.7208 17.613 9.82881 17.5049C9.93683 17.3969 10.0225 17.2687 10.081 17.1276C10.1394 16.9865 10.1695 16.8352 10.1695 16.6824C10.1695 16.5297 10.1394 16.3784 10.081 16.2373C10.0225 16.0962 9.93683 15.968 9.82881 15.8599L4.13548 10.1666H17.1671C17.8088 10.1666 18.3338 9.64161 18.3338 8.99994C18.3338 8.35828 17.8088 7.83327 17.1671 7.83327Z" fill="black"/>
          </svg>

                </button>
        </div>
            <div className="member-profile-header-title">
                Profile
            </div>
        </div>
      <div className="member-profile-container">
        <ProfileHeader userInfo={userInfo} />
        
        <div className="machine-charts-section">
          <div className="machine-charts-grid">
            {machineSummaryList.map((machineSummary, index) => (
              <MachineChart 
                key={`${machineSummary.machineType}-${index}`} 
                machineSummary={machineSummary} 
              />
            ))}
          </div>
          
          <PersonalBests userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
}; 
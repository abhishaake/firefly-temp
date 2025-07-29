import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/sidebar.css';

const navItems = [
  // {
  //   label: 'Home',
  //   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   <path d="M9 22L9.00192 17.9976C9.00236 17.067 9.00258 16.6017 9.15462 16.2347C9.35774 15.7443 9.74746 15.3547 10.2379 15.1519C10.6051 15 11.0704 15 12.001 15C12.9319 15 13.3974 15 13.7647 15.152C14.2553 15.355 14.645 15.7447 14.848 16.2353C15 16.6026 15 17.0681 15 17.999V22" stroke="#FBFBFA" stroke-width="1.5"/>
  //   <path d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z" stroke="#FBFBFA" stroke-width="1.5" stroke-linejoin="round"/>
  //   </svg>
  //   ,
  //   path: '/',
  // },
  {
    label: 'Manage Classes',
    icon: <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2013 1H3.79864C2.34088 1 1.0619 1.9847 1.00348 3.40355C0.929968 5.18879 2.18552 6.37422 3.50423 7.4871C5.32849 9.0266 6.24063 9.7964 6.3363 10.7708C6.35127 10.9233 6.35127 11.0767 6.3363 11.2292C6.24063 12.2036 5.3285 12.9734 3.50423 14.5129C2.1492 15.6564 0.926178 16.7195 1.00348 18.5964C1.0619 20.0153 2.34088 21 3.79864 21H14.2013C15.659 21 16.938 20.0153 16.9964 18.5964C17.0429 17.4668 16.6243 16.342 15.7351 15.56C15.3297 15.2034 14.9088 14.8615 14.4957 14.5129C12.6714 12.9734 11.7593 12.2036 11.6636 11.2292C11.6486 11.0767 11.6486 10.9233 11.6636 10.7708C11.7593 9.7964 12.6714 9.0266 14.4957 7.4871C15.8365 6.35558 17.0728 5.25809 16.9964 3.40355C16.938 1.9847 15.659 1 14.2013 1Z" stroke="white" stroke-width="1.5"/>
    </svg>
    ,
    path: '/manage-classes',
  },
  {
    label: 'Workout',
    icon: <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2013 1H3.79864C2.34088 1 1.0619 1.9847 1.00348 3.40355C0.929968 5.18879 2.18552 6.37422 3.50423 7.4871C5.32849 9.0266 6.24063 9.7964 6.3363 10.7708C6.35127 10.9233 6.35127 11.0767 6.3363 11.2292C6.24063 12.2036 5.3285 12.9734 3.50423 14.5129C2.1492 15.6564 0.926178 16.7195 1.00348 18.5964C1.0619 20.0153 2.34088 21 3.79864 21H14.2013C15.659 21 16.938 20.0153 16.9964 18.5964C17.0429 17.4668 16.6243 16.342 15.7351 15.56C15.3297 15.2034 14.9088 14.8615 14.4957 14.5129C12.6714 12.9734 11.7593 12.2036 11.6636 11.2292C11.6486 11.0767 11.6486 10.9233 11.6636 10.7708C11.7593 9.7964 12.6714 9.0266 14.4957 7.4871C15.8365 6.35558 17.0728 5.25809 16.9964 3.40355C16.938 1.9847 15.659 1 14.2013 1Z" stroke="white" stroke-width="1.5"/>
    </svg>
    
    
    ,
    path: '/workouts',
  },
  {
    label: 'Manage Trainer',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    ,
    path: '/manage-trainer',
  },
  {
    label: 'Members',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    ,
    path: '/members',
  },
  {
    label: 'Reports',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 17V13" stroke="#FBFBFA" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M12 17V7" stroke="#FBFBFA" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M17 17V11" stroke="#FBFBFA" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#FBFBFA" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
    ,
    // path: '/reports',
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar-root">
      <div className="sidebar-logo" style={{marginTop:'-16px'}}>
      <img src="/assets/figma-icons/page_logo.png" style={{width: '40px'}} alt="Firefly Logo" className="sidebar-logo-img" />
      <img src="/assets/figma-icons/page_logo_name.png" style={{width: '180px', marginLeft: '10px'}} alt="Firefly" className="sidebar-logo-img" />

      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-nav-item${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-logout-wrapper">
        <div className="sidebar-nav-item logout" onClick={handleLogout}>
          <span className="sidebar-nav-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373V11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501" stroke="#FBFBFA" stroke-width="1.5" stroke-linecap="round"/>
<path d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="#FBFBFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>
          <span className="sidebar-nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
}; 
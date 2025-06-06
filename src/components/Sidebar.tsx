import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/sidebar.css';

const navItems = [
  {
    label: 'Home',
    icon: '🏠',
    path: '/',
  },
  {
    label: 'Manage Classes',
    icon: '📅',
    path: '/manage-classes',
  },
  {
    label: 'Workout',
    icon: '💪',
    path: '/workout',
  },
  {
    label: 'Manage Trainer',
    icon: '🧑‍🏫',
    path: '/manage-trainer',
  },
  {
    label: 'Members',
    icon: '👥',
    path: '/members',
  },
  {
    label: 'Reports',
    icon: '📊',
    path: '/reports',
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
          <span className="sidebar-nav-icon">🚪</span>
          <span className="sidebar-nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
}; 
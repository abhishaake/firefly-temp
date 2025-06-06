import React from 'react';
import { Sidebar } from '../components/Sidebar';
import '../styles/theme.css';
import '../styles/manage-classes.css';
import '../styles/sidebar.css';
import '../styles/custom-layout.css';

interface CustomMainLayoutProps {
  children: React.ReactNode;
}

export const CustomMainLayout: React.FC<CustomMainLayoutProps> = ({ children }) => {
  return (
    <div className="custom-layout-root">
      <aside className="custom-layout-sidebar">
        <Sidebar />
      </aside>
      <div className="custom-layout-content">
        <header className="custom-layout-header">
          {/* Add user info, page title, etc. here if needed */}
        </header>
        <main className="custom-layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}; 
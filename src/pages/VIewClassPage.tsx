import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassBookingDetailsQuery } from '../hooks/useApi';
import { Card, Loader } from '@mantine/core';
import '../styles/manage-classes.css';
import '../styles/custom-layout.css';
import '../styles/view-class-page.css';

// Add type for booking user
interface BookingUser {
  userName: string;
  checkedInStatus: string | null;
  machineAssigned: string | null;
}

export const ViewClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { data: classBooking, isLoading } = useClassBookingDetailsQuery(classId);

  // Figma-matching header info (fallbacks for demo)
  const className = classBooking?.className || '-';
  const location = classBooking?.classLocation || '';
  const time = classBooking?.startEpoch
    ? new Date(Number(classBooking.startEpoch) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
    : '';

  const bookingUsers: BookingUser[] = classBooking?.bookingUsers || [];

  // Countdown timer logic
  const nowEpoch = Math.floor(Date.now() / 1000);
  const initialDuration = classBooking?.startEpoch ? Math.max(classBooking.startEpoch - nowEpoch, 0) : 0;
  const [remaining, setRemaining] = useState<number>(initialDuration || 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [ergSelections, setErgSelections] = useState<{ [userIdx: number]: number[] }>({});

  // Handler for dropdown change
  const handleErgChange = (userIdx: number, ergIdx: number, value: number) => {
    setErgSelections(prev => {
      const userErgs = prev[userIdx] ? [...prev[userIdx]] : [1, 1, 1];
      userErgs[ergIdx] = value;
      return { ...prev, [userIdx]: userErgs };
    });
  };

  useEffect(() => {
    setRemaining(initialDuration);
  }, [initialDuration]);

  useEffect(() => {
    if (remaining <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remaining]);

  function formatTime(secs: number) {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <div className="view-class-root">
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: '#F3E8FF',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#A259FF',
            animation: 'loadingBar 1s linear infinite'
          }} />
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
      <Card radius={24} shadow="md" className="view-class-card">
        {/* Navigation/Header */}
        <div className="view-class-header">
          <div className="view-class-header-row">
            <button
              aria-label="Back"
              className="icon-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 16 }}
              onClick={() => navigate(-1)}
            >
              {/* Placeholder for Figma back icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 26L12 16L20 6" stroke="#FAFAFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="view-class-header-title">Class View</span>
          </div>
          <div className="view-class-header-info">
            <span>{className}</span>
            <span className="view-class-header-info-sep">-</span>
            <span>{location}</span>
            <span className="view-class-header-info-sep">-</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Main content: Table and Timer */}
        <div className="view-class-main">
          {/* Clients/ERG Table */}
          <div className="view-class-table-section">
            <div className="view-class-table-header">
              <div className="view-class-table-cell">Clients</div>
              <div className="view-class-table-cell">Checked In</div>
              <div className="view-class-table-cell">ERG 1</div>
              <div className="view-class-table-cell">ERG 2</div>
              <div className="view-class-table-cell">ERG 3</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {/* Example static rows, replace with API data if available */}
              {isLoading ? (
                <div style={{ padding: 32, textAlign: 'center' }}><Loader /></div>
              ) : (
                bookingUsers.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>No users booked for this class.</div>
                ) : (
                  bookingUsers.map((user: BookingUser, idx: number) => (
                    <div
                      key={idx}
                      className={`view-class-table-row ${idx % 2 === 0 ? 'even' : 'odd'}`}
                    >
                      <div className="view-class-table-cell">{user.userName || '-'}</div>
                      <div className="view-class-table-cell view-class-table-cell-center">{user.checkedInStatus ?? '-'}</div>
                      {/* ERG columns: show machineAssigned or '-' for all 3 columns for now */}
                      {[0,1,2].map(i => (
                        <div key={i} className="view-class-erg-cell">
                          {/* Placeholder for dropdown icon */}
                          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 10L12 15L17 10" stroke="#353535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
                          <span>{user.machineAssigned}</span>
                          <select
                            style={{ marginLeft: 8, width: 120, height: 50, fontWeight: 600, borderRadius: 4, padding: '2px 4px', backgroundColor: 'transparent', border: '0', color: '#353535' }}
                            value={ergSelections[idx]?.[i] || i}
                            onChange={e => handleErgChange(idx, i, Number(e.target.value))}
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ))
                )
              )}
            </div>
          </div>
          {/* Timer/Stats Card */}
          <div className="view-class-timer-section">
            <div className="view-class-timer-circle">
              {/* Placeholder for timer SVG/circular progress */}
              <span className="view-class-timer-time">{formatTime(remaining)}</span>
            </div>
            {/* <div className="view-class-timer-label">Total 59 Seconds</div> */}
            <button className="view-class-stop-btn">
              {/* Placeholder for stop icon */}
              <span className="view-class-stop-btn-icon">■</span>Stop
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

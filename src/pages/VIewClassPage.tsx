import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Loader } from '@mantine/core';
import '../styles/manage-classes.css';
import '../styles/custom-layout.css';
import '../styles/view-class-page.css';

// Updated interfaces based on new API response
interface BookingUser {
  userName: string;
  checkedInStatus: string;
  machineAssigned: string | null;
  round1Machine: string;
  round2Machine: string;
  round3Machine: string;
}

interface ClassBookingDetails {
  className: string;
  classLocation: string;
  startEpoch: number;
  duration: number;
  endEpoch: number;
  bookingUsers: BookingUser[];
}

interface ClassBookingResponse {
  data: {
    classBooking: ClassBookingDetails;
  };
  success: boolean;
  statusCode: number;
  message: string;
}

export const ViewClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery<ClassBookingResponse>({
    queryKey: ['class-booking-details', classId],
    queryFn: async () => {
      const res = await fetch(`https://firefly-admin.cozmotech.ie/api/v1/class-bookings/details?classId=${classId}`, {
        headers: {
          'token': 'FfbhuYx_pSVRl7npG8wQIw',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch class details');
      return res.json();
    },
    enabled: !!classId,
  });

  const classBooking = response?.data?.classBooking;

  // Figma-matching header info (fallbacks for demo)
  const className = classBooking?.className || '-';
  const location = classBooking?.classLocation || '';
  const time = classBooking?.startEpoch
    ? new Date(Number(classBooking.startEpoch) * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '')
    : '';

  const bookingUsers: BookingUser[] = classBooking?.bookingUsers || [];

  // Timer logic - countdown to start, then elapsed time
  const nowEpoch = Math.floor(Date.now() / 1000);
  const classStartEpoch = classBooking?.startEpoch || 0;
  const classEndEpoch = classBooking?.endEpoch || 0;
  const hasClassStarted = nowEpoch >= classStartEpoch;
  const hasClassEnded = nowEpoch >= classEndEpoch;

  const initialCountdown = 0;
  const initialElapsed = 0;

  const [countdown, setCountdown] = useState<number>(initialCountdown);
  const [elapsed, setElapsed] = useState<number>(initialElapsed);
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
    setCountdown(initialCountdown);
    setElapsed(initialElapsed);
  }, [initialCountdown, initialElapsed]);

  useEffect(() => {
    if (!classStartEpoch) return;

    timerRef.current = setInterval(() => {
      const currentNow = Math.floor(Date.now() / 1000);

      if (currentNow < classStartEpoch) {
        // Before class starts - countdown
        setCountdown(Math.max(classStartEpoch - currentNow, 0));
      } else if (currentNow < classEndEpoch) {
        // After class starts - elapsed time
        setElapsed(currentNow - classStartEpoch);
        setCountdown(0);
      } else {
        setElapsed(classEndEpoch - classStartEpoch);
        setCountdown(0);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [classStartEpoch]);

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
                <path d="M20 26L12 16L20 6" stroke="#FAFAFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
          {/* Modern Clients/ERG Table */}
          <div className="modern-table-container">
            <div className="modern-table-header">
              <h3 className="table-title">Class Participants</h3>
              <div className="participants-count">
                {bookingUsers.length} {bookingUsers.length === 1 ? 'participant' : 'participants'}
              </div>
            </div>

            <div className="modern-table">
              <div className="view-class-table-header-row">
                <div className="view-class-table-header-cell">Name</div>
                <div className="view-class-table-header-cell">Status</div>
                <div className="view-class-table-header-cell">Round 1</div>
                <div className="view-class-table-header-cell">Round 2</div>
                <div className="view-class-table-header-cell">Round 3</div>
              </div>

              <div className="view-class-table-body">
                {isLoading ? (
                  <div className="view-class-table-loading">
                    <Loader size="md" />
                    <span>Loading participants...</span>
                  </div>
                ) : bookingUsers.length === 0 ? (
                  <div className="view-class-table-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p>No participants booked for this class</p>
                  </div>
                ) : (
                  bookingUsers.map((user: BookingUser, idx: number) => (
                    <div key={idx} className={`view-class-table-row ${user.checkedInStatus === 'CHECKED_IN' ? 'checked-in' : 'not-checked-in'}`}>
                      <div className="view-class-table-cell view-class-client-cell">
                        <div className="client-avatar">
                          {user.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="client-name">{user.userName}</span>
                      </div>

                      <div className="view-class-table-cell view-class-status-cell">
                        <span className={`status-badge ${user.checkedInStatus.toLowerCase()}`}>
                          {user.checkedInStatus === 'CREATED' ? 'Booked' : user.checkedInStatus}
                        </span>
                      </div>

                      <div className="view-class-table-cell view-class-machine-cell">
                        <div className="machine-assignment">
                          <span className="machine-name">{user.round1Machine || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="view-class-table-cell view-class-machine-cell">
                        <div className="machine-assignment">
                          <span className="machine-name">{user.round2Machine || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="view-class-table-cell view-class-machine-cell">
                        <div className="machine-assignment">
                          <span className="machine-name">{user.round3Machine || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Timer/Stats Card */}
          <div className="view-class-timer-section">
            <div className="view-class-timer-circle">
              {/* Placeholder for timer SVG/circular progress */}
              <span className="view-class-timer-time">
                {hasClassStarted ? formatTime(elapsed) : formatTime(countdown)}
              </span>
              <span className="view-class-timer-label">
                {hasClassStarted ? 'Elapsed' : 'Starts in'}
              </span>
            </div>
            {/* <div className="view-class-timer-label">Total 59 Seconds</div> */}
            {!hasClassEnded && <button className="view-class-stop-btn">
              {/* Placeholder for stop icon */}
              <span className="view-class-stop-btn-icon">■</span>Stop
            </button>}
          </div>
        </div>
      </Card>
    </div>
  );
};

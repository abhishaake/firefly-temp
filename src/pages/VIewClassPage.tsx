import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Loader, Button } from '@mantine/core';
import { services } from '../services';
import { useToast } from '../contexts/ToastContext';
import '../styles/manage-classes.css';
import '../styles/custom-layout.css';
import '../styles/view-class-page.css';

// Updated interfaces based on new API response
interface BookingUser {
  userName: string;
  checkedInStatus: string;
  machineAssigned: string | null;
  round1MachineId: number;
  round2MachineId: number;
  round3MachineId: number;
  round1Machine: string;
  round2Machine: string;
  round3Machine: string;
  userId: number; // Added userId for API calls
}

interface ClassBookingDetails {
  className: string;
  classLocation: string;
  startEpoch: number;
  duration: number;
  endEpoch: number;
  bookingUsers: BookingUser[];
  soundFileUrl?: string;
  status: string;
}

interface ClassBookingResponse {
  data: {
    classBooking: ClassBookingDetails;
  };
  success: boolean;
  statusCode: number;
  message: string;
}

interface AvailableAssignment {
  id: number;
  classId: number;
  machineId: number;
  machine: string;
  roundId: number;
  userId: number;
}

interface AssignmentsResponse {
  data: {
    available: AvailableAssignment[];
  };
  success: boolean;
  statusCode: number;
  message: string;
  displayMessage: string;
}

export const ViewClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: response, isLoading } = useQuery<ClassBookingResponse>({
    queryKey: ['class-booking-details', classId],
    queryFn: async () => {
      const res = await services.getClassService().getClassBookingDetails(classId!);
      return {
        data: res.data,
        success: res.status === 200,
        statusCode: res.status,
        message: res.message,
      };
    },
    enabled: !!classId,
  });

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

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

  // Audio control functions
  const handleAudioPlay = () => {
    if (!classBooking?.soundFileUrl) return;

    if (isAudioPlaying) {
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsAudioPlaying(false);
      return;
    }

    // Play audio
    const audio = new Audio(classBooking.soundFileUrl);
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => {
      setIsAudioPlaying(false);
    });

    audio.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
      setIsAudioPlaying(false);
    });

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsAudioPlaying(false);
    });

    setIsAudioPlaying(true);
  };

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
  
  // Edit state management
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [availableAssignments, setAvailableAssignments] = useState<{ [roundId: number]: AvailableAssignment[] }>({});
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);

  // Handler for dropdown change
  const handleErgChange = (userIdx: number, ergIdx: number, value: number) => {
    setErgSelections(prev => {
      const userErgs = prev[userIdx] ? [...prev[userIdx]] : [1, 1, 1];
      userErgs[ergIdx] = value;
      return { ...prev, [userIdx]: userErgs };
    });
  };

  // Load available assignments for a specific round
  const loadAvailableAssignments = async (roundId: number) => {
    if (!classId) return;
    
    setIsLoadingAssignments(true);
    try {
      const res = await services.getClassService().getAvailableAssignments(classId, roundId);
      if (res.success) {
        let availableAssignments = res.data.available || [];
        availableAssignments.push({
          id: -1,
          classId: parseInt(classId),
          machineId: -1,
          machine: 'Clear',
          roundId: roundId,
        })
        setAvailableAssignments(prev => ({
          ...prev,
          [roundId]: res.data.available || []
        }));
      } else {
        console.error('Failed to load assignments:', res.message);
      }
    } catch (error) {
      console.error('Failed to load available assignments:', error);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const stopClass = async () => {
    if (!classId) return;
    const res = await services.getClassService().stopClass(classId);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['class-booking-details', classId] });
    } else {
      showError(res.message);
    }
  };

  // Handle edit button click
  const handleEditClick = (userIdx: number) => {
    if (editingUser === userIdx) {
      setAvailableAssignments({});
      setEditingUser(null);
    } else {
      setAvailableAssignments({});
      setEditingUser(userIdx);
      // Load assignments for all rounds when editing starts
      [1, 2, 3].forEach(roundId => {
        if (!availableAssignments[roundId]) {
          loadAvailableAssignments(roundId);
        }
      });
    }
  };

  const handleEditRound = (roundId: number, userIdx: number) => {
    setEditingUser(userIdx);
    setAvailableAssignments({});
    setEditingRound(roundId);
    loadAvailableAssignments(roundId);
  }

  const handleCloseRound = (roundId: number, userIdx: number) => {
    setAvailableAssignments({});
    setEditingUser(null);
    setEditingRound(null);
  }


  // Handle machine assignment change
  const handleMachineChange = async (user: BookingUser, roundId: number, machineId: number | null, originalMachineId: number | null) => {
    if (!classId || !machineId) return;
    
    setIsUpdatingAssignment(true);
    try {

      if (machineId == -1) {
        if (originalMachineId != null){
          handleClearAssignment(user, roundId, originalMachineId);
        }
        return;
      }

      const assignmentData = {
        classId: parseInt(classId),
        machineId,
        roundId,
        userId: user.userId
      };

      const res = await services.getClassService().createAssignment(assignmentData);
      if (res.success) {
        // Refresh the class booking details
        queryClient.invalidateQueries({ queryKey: ['class-booking-details', classId] });
      } else {
        showError(res.message);
        console.error('Failed to create assignment:', res.message);
      }
    } catch (error) {
      console.error('Failed to create assignment:', error);
    } finally {
      setEditingUser(null);
      setAvailableAssignments({});
      setEditingRound(null);
      setIsUpdatingAssignment(false);
    }
  };

  // Handle clear assignment
  const handleClearAssignment = async (user: BookingUser, roundId: number, machineId: number) => {
    if (!classId) return;
    
    if (!user) return;

    setIsUpdatingAssignment(true);
    try {
      const assignmentData = {
        classId: parseInt(classId),
        machineId,
        roundId,
        userId: user.userId
      };

      const res = await services.getClassService().clearAssignment(assignmentData);
      if (res.success) {
        // Refresh the class booking details
        queryClient.invalidateQueries({ queryKey: ['class-booking-details', classId] });
      } else {
        console.error('Failed to clear assignment:', res.message);
      }
    } catch (error) {
      console.error('Failed to clear assignment:', error);
    } finally {
      setEditingUser(null);
      setAvailableAssignments({});
      setEditingRound(null);
      setIsUpdatingAssignment(false);
    }
  };

  // Get current machine assignment for a user and round
  const getCurrentMachineAssignment = (user: BookingUser, roundId: number): string => {
    switch (roundId) {
      case 1: return user.round1Machine || 'N/A';
      case 2: return user.round2Machine || 'N/A';
      case 3: return user.round3Machine || 'N/A';
      default: return 'N/A';
    }
  };

  // Get machine ID for current assignment
  const getCurrentMachineId = (user: BookingUser, roundId: number): number | null => {
    // Find the machine ID from available assignments based on current machine name
    const currentMachineName = getCurrentMachineAssignment(user, roundId);
    if (currentMachineName === 'N/A') return null;
    
    const assignments = availableAssignments[roundId] || [];
    const assignment = assignments.find(a => a.machine === currentMachineName);
    return assignment ? assignment.machineId : null;
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

  const editIcon = () => {
    return (
      <svg width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{cursor: 'pointer'}}>
          <g>
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/>
          </g>
      </svg>
    )
  };

  const closeIcon = () => {
    return (
        <svg width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{cursor: 'pointer'}}>
        <g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.414 1.414L12 13.414l2.828 2.829 1.414-1.414L13.414 12l2.829-2.828-1.414-1.414L12 10.586z"/>
        </g>
      </svg>
    )
  };

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
                        {editingUser === idx && editingRound === 1 ? (
                          <div className="machine-assignment-editable">
                            {isLoadingAssignments ? (
                              <div className="machine-assignment-loading">
                                <Loader size="xs" />
                                <span>Loading machines...</span>
                              </div>
                            ) : (
                              <>
                                <select
                                  className="machine-select-dropdown"
                                  value={getCurrentMachineAssignment(user, 1) !== 'N/A' ? getCurrentMachineAssignment(user, 1) : ''}
                                  onChange={(e) => handleMachineChange(user, 1, e.target.value ? parseInt(e.target.value) : null, user.round1MachineId)}
                                  disabled={isUpdatingAssignment || availableAssignments[1]?.length === 0}
                                >
                                  <option value="">{availableAssignments[1]?.length === 0 ? "No machines available" : "Select machine"}</option>
                                  {availableAssignments[1]?.map(assignment => (
                                    <option key={assignment.machineId} value={assignment.machineId}>
                                      {assignment.machine}
                                    </option>
                                  ))}
                                </select>
                                {(
                                  (<div
                                    color="black"
                                    onClick={() => handleCloseRound(1, idx)}
                                  >
                                    {closeIcon()}
                                  </div>)
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="machine-assignment" >
                            <span className="machine-name">{user.round1Machine || 'N/A'}</span>
                            { editingUser === idx && editingRound === 1 ?
                              <div onClick={() => handleCloseRound(1, idx)}>
                                {closeIcon()}
                              </div> 
                              :
                              <div onClick={() => handleEditRound(1, idx)}>
                                {editIcon()}
                              </div>
                            }
                            
                          </div>
                        )}
                      </div>

                      <div className="view-class-table-cell view-class-machine-cell">
                        {editingUser === idx && editingRound === 2 ? (
                          <div className="machine-assignment-editable">
                            {isLoadingAssignments ? (
                              <div className="machine-assignment-loading">
                                <Loader size="xs" />
                                <span>Loading machines...</span>
                              </div>
                            ) : (
                              <>
                                <select
                                  className="machine-select-dropdown"
                                  value={getCurrentMachineAssignment(user, 2) !== 'N/A' ? getCurrentMachineAssignment(user, 2) : ''}
                                  onChange={(e) => handleMachineChange(user, 2, e.target.value ? parseInt(e.target.value) : null, user.round2MachineId)}
                                  disabled={isUpdatingAssignment || availableAssignments[2]?.length === 0}
                                >
                                  <option value="">{availableAssignments[2]?.length === 0 ? "No machines available" : "Select machine"}</option>
                                  {availableAssignments[2]?.map(assignment => (
                                    <option key={assignment.machineId} value={assignment.machineId}>
                                      {assignment.machine}
                                    </option>
                                  ))}
                                </select>
                                         {(<div
                                    color="black"
                                    onClick={() => handleCloseRound(1, idx)}
                                  >
                                    {closeIcon()}
                                  </div>)}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="machine-assignment">
                            <span className="machine-name">{user.round2Machine || 'N/A'}</span>
                            {editingUser === idx && editingRound === 2 ?
                              <div onClick={() => handleCloseRound(2, idx)}>
                                {closeIcon()}
                              </div> 
                              :
                              <div onClick={() => handleEditRound(2, idx)}>
                                {editIcon()}
                              </div>
                            }
                          </div>
                        )}
                      </div>

                      <div className="view-class-table-cell view-class-machine-cell">
                        {editingUser === idx && editingRound === 3 ? (
                          <div className="machine-assignment-editable">
                            {isLoadingAssignments ? (
                              <div className="machine-assignment-loading">
                                <Loader size="xs" />
                                <span>Loading machines...</span>
                              </div>
                            ) : (
                              <>
                                <select
                                  className="machine-select-dropdown"
                                  value={getCurrentMachineAssignment(user, 3) !== 'N/A' ? getCurrentMachineAssignment(user, 3) : ''}
                                  onChange={(e) => handleMachineChange(user, 3, e.target.value ? parseInt(e.target.value) : null, user.round3MachineId)}
                                  disabled={isUpdatingAssignment || availableAssignments[3]?.length === 0}
                                >
                                  <option value="">{availableAssignments[3]?.length === 0 ? "No machines available" : "Select machine"}</option>
                                  {availableAssignments[3]?.map(assignment => (
                                    <option key={assignment.machineId} value={assignment.machineId}>
                                      {assignment.machine}
                                    </option>
                                  ))}
                                </select>
                                {(<div
                                    color="black"
                                    onClick={() => handleCloseRound(1, idx)}
                                  >
                                    {closeIcon()}
                                  </div>)}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="machine-assignment">
                            <span className="machine-name">{user.round3Machine || 'N/A'}</span>
                            {editingUser === idx && editingRound === 3 ?
                              <div onClick={() => handleCloseRound(3, idx)}>
                                {closeIcon()}
                              </div> 
                              :
                              <div onClick={() => handleEditRound(3, idx)}>
                                {editIcon()}
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Timer/Stats Card */}
          
          <div className="view-class-timer-section">
          <div className="view-class-audio-section">
            {classBooking?.soundFileUrl && (
              <div className="view-class-audio-controls">
                <button 
                  className={`view-class-audio-btn ${isAudioPlaying ? 'playing' : ''}`}
                  onClick={handleAudioPlay}
                  disabled={!classBooking.soundFileUrl}
                >
                  <div className="view-class-audio-icon">
                    {isAudioPlaying ? '⏸️' : '▶️'}
                  </div>
                  <span className="view-class-audio-label">
                    {isAudioPlaying ? 'Pause Audio' : 'Play Audio'}
                  </span>
                </button>
              </div>
            )}
          </div>
            <div className="view-class-timer-circle">
              {/* Placeholder for timer SVG/circular progress */}
              {classBooking?.status !== 'COMPLETED' &&<span className="view-class-timer-time">
                {hasClassStarted ? formatTime(elapsed) : formatTime(countdown)}
              </span>}
              <span className="view-class-timer-label">
                {classBooking?.status !== 'COMPLETED' ? (hasClassStarted ? 'Elapsed' : 'Starts in') : 'Completed'}
              </span>
            </div>
            {/* <div className="view-class-timer-label">Total 59 Seconds</div> */}
            {!hasClassEnded && classBooking?.status !== 'COMPLETED' && <button 
            className="view-class-stop-btn"
            onClick={stopClass}
            >
              {/* Placeholder for stop icon */}
              <span className="view-class-stop-btn-icon">■</span>Stop
            </button>}
          </div>
        </div>
      </Card>
    </div>
  );
};

import React from 'react';
import '../styles/workout.css';
import { useNavigate } from 'react-router-dom';
import { useWorkoutsQuery } from '../hooks/useWorkoutsQuery';
import type { Workout } from '../types/workout';

const WorkoutResourceCard: React.FC<{ resource: { id: string; icon: React.ReactNode; filename: string } }> = ({ resource }) => (
  <div className="workout-resource-card">
    <div className="workout-resource-icon-wrapper">{resource.icon}</div>
    <div className="workout-resource-filename">{resource.filename}</div>
  </div>
);

const WorkoutCard: React.FC<{ data: Workout }> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="figma-workout-card">
      <div className="figma-workout-card-top">
        <div className="figma-workout-card-title-meta">
          <div className="figma-workout-card-title">{data.name}</div>
          <div className="figma-workout-card-last-edited">{ }</div>
        </div>
        <div className="figma-workout-card-tag" style={{ background: '#03C203' }}>Workout</div>
      </div>
      <div className="figma-workout-card-level-row">
        <div className="figma-workout-card-erg-row">
          <div className="figma-workout-card-erg">ERG 1</div>
          <div className="figma-workout-card-erg">ERG 2</div>
          <div className="figma-workout-card-erg">ERG 3</div>
        </div>
        <div className="figma-workout-card-level">{ }</div>
      </div>

      <div className="figma-workout-card-level-row" style={{ justifyContent: 'space-evenly' }}>
        <WorkoutResourceCard resource={{
          id: "1", icon: <div><svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.99976 0.375C6.834 0.375 6.67503 0.440848 6.55782 0.558058C6.44061 0.675268 6.37476 0.83424 6.37476 1V10.3833C5.74978 9.85315 4.96026 9.55614 4.14079 9.54292C3.32132 9.5297 2.52263 9.80109 1.88087 10.3108C1.23911 10.8206 0.793996 11.5371 0.621412 12.3383C0.448827 13.1395 0.559454 13.9758 0.934432 14.7045C1.30941 15.4333 1.92553 16.0095 2.67777 16.3348C3.43 16.6601 4.27178 16.7145 5.05963 16.4887C5.84747 16.2628 6.5326 15.7707 6.99823 15.0963C7.46386 14.4218 7.68116 13.6067 7.6131 12.79C7.62004 12.7492 7.62394 12.708 7.62476 12.6667V4.95833H11.9998C12.6076 4.95833 13.1904 4.71689 13.6202 4.28712C14.05 3.85735 14.2914 3.27445 14.2914 2.66667C14.2914 2.05888 14.05 1.47598 13.6202 1.04621C13.1904 0.616443 12.6076 0.375 11.9998 0.375H6.99976Z" fill="#584769" />
          </svg>
          </div>, filename: "song.mp3"
        }} />
        <WorkoutResourceCard resource={{
          id: "1", icon: <div><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12.8333C8.07167 12.8333 7.28417 12.51 6.6375 11.8633C5.99028 11.2156 5.66667 10.4278 5.66667 9.5C5.66667 8.57222 5.99028 7.78472 6.6375 7.1375C7.28472 6.49028 8.07222 6.16667 9 6.16667C9.92778 6.16667 10.7156 6.49028 11.3633 7.1375C12.0111 7.78472 12.3344 8.57222 12.3333 9.5C12.3322 10.4278 12.0089 11.2156 11.3633 11.8633C10.7178 12.5111 9.93 12.8344 9 12.8333ZM3.16667 9.5C3.16667 9.73012 2.98012 9.91667 2.75 9.91667H0.666667C0.436548 9.91667 0.25 9.73012 0.25 9.5C0.25 9.26988 0.436548 9.08333 0.666667 9.08333H2.75C2.98012 9.08333 3.16667 9.26988 3.16667 9.5ZM17.75 9.5C17.75 9.73012 17.5635 9.91667 17.3333 9.91667H15.25C15.0199 9.91667 14.8333 9.73012 14.8333 9.5C14.8333 9.26988 15.0199 9.08333 15.25 9.08333H17.3333C17.5635 9.08333 17.75 9.26988 17.75 9.5ZM9 3.66667C8.76988 3.66667 8.58333 3.48012 8.58333 3.25V1.16667C8.58333 0.936548 8.76988 0.75 9 0.75C9.23012 0.75 9.41667 0.936548 9.41667 1.16667V3.25C9.41667 3.48012 9.23012 3.66667 9 3.66667ZM9 18.25C8.76988 18.25 8.58333 18.0635 8.58333 17.8333V15.75C8.58333 15.5199 8.76988 15.3333 9 15.3333C9.23012 15.3333 9.41667 15.5199 9.41667 15.75V17.8333C9.41667 18.0635 9.23012 18.25 9 18.25ZM4.90195 5.36282C4.74859 5.5309 4.48659 5.5388 4.32338 5.38027L3.11697 4.2085C2.95293 4.04916 2.94649 3.78786 3.10249 3.62064C3.26528 3.44614 3.54055 3.44214 3.70834 3.61184L4.89082 4.80776C5.04167 4.96032 5.04656 5.20432 4.90195 5.36282ZM14.8983 15.3794C14.7356 15.5539 14.4603 15.5579 14.2925 15.3882L13.1074 14.1897C12.9556 14.0361 12.9517 13.7902 13.0987 13.632C13.2526 13.4663 13.5126 13.4596 13.6748 13.6172L14.8839 14.7915C15.0479 14.9508 15.0543 15.2121 14.8983 15.3794ZM13.1372 5.40111C12.9691 5.24775 12.9612 4.98576 13.1197 4.82254L14.2915 3.61614C14.4508 3.45209 14.7121 3.44566 14.8794 3.60166C15.0539 3.76444 15.0579 4.03972 14.8882 4.20751L13.6922 5.38998C13.5397 5.54084 13.2957 5.54573 13.1372 5.40111ZM3.10274 15.3969C2.93707 15.2335 2.93686 14.9663 3.10228 14.8026L4.3094 13.6085C4.46225 13.4573 4.7082 13.4568 4.86161 13.6074C5.01507 13.7581 5.01905 14.0041 4.87055 14.1597L3.69812 15.3879C3.53701 15.5567 3.26887 15.5608 3.10274 15.3969Z" fill="#584769" />
          </svg>
          </div>, filename: "visual.xml"
        }} />
      </div>

      <div className="figma-workout-card-actions-row">
        <span className="figma-workout-card-meta">Create by: {data.createdBy}</span>
        <div className="figma-workout-card-action-club">
          <button className="figma-workout-card-action" onClick={() => navigate(`/workout/create?workoutId=${data.workoutId}`)}>Edit</button>
          <button className="figma-workout-card-action" onClick={() => navigate(`/workout/create?cloneFromWorkoutId=${data.workoutId}`)}>Clone</button>
          {/* <button className="figma-workout-card-action">Delete</button> */}
        </div>
      </div>
    </div>
  );
};

export const WorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useWorkoutsQuery();
  const workouts = data?.workouts || [];
  console.log("data", workouts);

  return (
    <div className="workout-page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="figma-workout-page-title">Workout</h1>
        <button
          className="add-class-btn"
          style={{ minWidth: 160, height: 40, fontSize: 16, background: '#584769', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          onClick={() => navigate('/workout/create')}
        >
          + Create Workout
        </button>
      </div>
      <div className="figma-workout-list">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading workouts</div>}
        {Array.isArray(workouts) && workouts.map((workout: Workout) => (
          <WorkoutCard key={workout.workoutId} data={workout} />
        ))}
      </div>
    </div>
  );
}; 
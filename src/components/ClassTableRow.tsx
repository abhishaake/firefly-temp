import React from 'react';
import type { ClassItem } from '../types/class';
import { useNavigate } from 'react-router-dom';

interface Props {
  classItem: ClassItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatTime(epoch: number) {
  const date = new Date(epoch * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

export const ClassTableRow: React.FC<Props> = ({ classItem, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="class-table-row">
      <div>{classItem.className}</div>
      <div>{classItem.date}</div>
      <div>{formatTime(Number(classItem.startTimeEpoch))}</div>
      <div>{classItem.trainer}</div>
      <div>{"Dublin Central"}</div>
      <div>{classItem.workoutName}</div>
      <div>
        <button style={{color:'blue'}}className="icon-btn" onClick={() => navigate(`/classes/${classItem.classId}`)} title="View">
          {'View'}
        </button>
        {/* <button className="icon-btn" onClick={() => onDelete(classItem.id)} title="Delete">
          🗑️
        </button> */}
      </div>
    </div>
  );
}; 
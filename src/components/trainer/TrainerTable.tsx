import React from 'react';
import { TrainerTableHeader } from './TrainerTableHeader';
import { TrainerTableRow } from './TrainerTableRow';
import type { Trainer } from '../../types/trainer';

interface TrainerTableProps {
  trainers: Trainer[];
  onViewProfile: (trainerId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const TrainerTable: React.FC<TrainerTableProps> = ({
  trainers,
  onViewProfile,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="manage-trainer-table-container">
        <div className="manage-trainer-loading">Loading trainers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-trainer-table-container">
        <div className="manage-trainer-error">Error: {error}</div>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="manage-trainer-table-container">
        <div className="manage-trainer-empty">No trainers found</div>
      </div>
    );
  }

  return (
    <div className="manage-trainer-table-container">
      <table className="manage-trainer-table">
        <TrainerTableHeader />
        <tbody className="manage-trainer-table-body">
          {trainers.map((trainer) => (
            <TrainerTableRow
              key={trainer.id}
              trainer={trainer}
              onViewProfile={onViewProfile}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}; 
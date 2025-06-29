import React from 'react';
import type { Trainer } from '../../types/trainer';

interface TrainerTableRowProps {
  trainer: Trainer;
  onViewProfile: (trainerId: string) => void;
}

export const TrainerTableRow: React.FC<TrainerTableRowProps> = ({ 
  trainer, 
  onViewProfile 
}) => {
  return (
    <tr className="manage-trainer-table-row">
      <td className="manage-trainer-name-cell">{trainer.lastName}</td>
      <td className="manage-trainer-name-cell">{trainer.firstName}</td>
      <td className="manage-trainer-email-cell">{trainer.email}</td>
      {/* <td>
        <button
          className="manage-trainer-action-link"
          onClick={() => onViewProfile(trainer.id)}
        >
          View profile
        </button>
      </td> */}
    </tr>
  );
}; 
import React from 'react';
import type { Member } from '../../types/member';

interface MemberTableRowProps {
  member: Member;
  onViewProfile: (memberId: string) => void;
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({ 
  member, 
  onViewProfile 
}) => {
  return (
    <tr className="manage-members-table-row">
      <td className="manage-members-name-cell">{member.lastName || member.fullName.split(' ').slice(1).join(' ')}</td>
      <td className="manage-members-name-cell">{member.firstName || member.fullName.split(' ')[0]}</td>
      <td className="manage-members-email-cell">{member.email}</td>
      <td>
        <button
          className="manage-members-action-link"
          onClick={() => onViewProfile(member.userId)}
        >
          View profile
        </button>
      </td>
    </tr>
  );
}; 
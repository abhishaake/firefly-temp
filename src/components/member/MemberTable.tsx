import React from 'react';
import { MemberTableHeader } from './MemberTableHeader';
import { MemberTableRow } from './MemberTableRow';
import { Pagination } from './Pagination';
import type { Member } from '../../types/member';

interface MemberTableProps {
  members: Member[];
  onViewProfile: (memberId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onViewProfile,
  isLoading = false,
  error = null,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="manage-members-table-container">
        <div className="manage-members-loading">Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-members-table-container">
        <div className="manage-members-error">Error: {error}</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="manage-members-table-container">
        <div className="manage-members-empty">No members found</div>
      </div>
    );
  }

  return (
    <>
      <div className="manage-members-table-container">
        <table className="manage-members-table">
          <MemberTableHeader />
          <tbody className="manage-members-table-body">
            {members.map((member) => (
              <MemberTableRow
                key={member.userId}
                member={member}
                onViewProfile={onViewProfile}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </>
  );
}; 
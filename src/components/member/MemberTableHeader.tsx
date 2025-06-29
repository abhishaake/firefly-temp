import React from 'react';

export const MemberTableHeader: React.FC = () => {
  return (
    <thead className="manage-members-table-header">
      <tr>
        <th>Last Name</th>
        <th>First Name</th>
        <th>Email</th>
        <th>Action</th>
      </tr>
    </thead>
  );
}; 
import React from 'react';

export const TrainerTableHeader: React.FC = () => {
  return (
    <thead className="manage-trainer-table-header">
      <tr>
        <th>Last Name</th>
        <th>First Name</th>
        <th>Email</th>
        {/* <th>Action</th> */}
      </tr>
    </thead>
  );
}; 
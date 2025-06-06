import React from 'react';
import { ClassTable } from '../components/ClassTable';
import type { ClassItem } from '../types/class';
import { useNavigate } from 'react-router-dom';
import { useAvailableClassesQuery } from '../hooks/useApi';

export const ManageClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAvailableClassesQuery();
  console.log("data", data);

  const handleEdit = (id: string) => {
    // open edit modal
  };

  const handleDelete = (id: string) => {
    // open confirm dialog
  };

  return (
    <div className="manage-classes-container">
      <div className="manage-classes-header">
        <h1>Manage Classes</h1>
        <button className="add-class-btn" onClick={() => navigate('/classes/create')}>+ Create New Class</button>
      </div>
      <div className="scheduled-classes-title">Scheduled Classes</div>  
      <div className="class-table-wrapper">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading classes</div>}
        {data && <ClassTable classes={data?.classes} onEdit={handleEdit} onDelete={handleDelete} />}
      </div>
    </div>
  );
}; 
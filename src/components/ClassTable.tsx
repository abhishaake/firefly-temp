import React from 'react';
import { ClassTableHeader } from './ClassTableHeader';
import { ClassTableRow } from './ClassTableRow';
import type { ClassItem } from '../types/class';

interface Props {
  classes: ClassItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClassTable: React.FC<Props> = ({ classes, onEdit, onDelete }) => (
  <div className="class-table">
    <div className="class-table-header-fixed">
      <ClassTableHeader />
    </div>
    <div className="class-table-body-scroll">
      {classes.map((item) => (
        <ClassTableRow key={item.classId} classItem={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  </div>
); 
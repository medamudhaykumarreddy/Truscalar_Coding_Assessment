import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const ClassroomsPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Classroom & Resource Management"
      moduleSubtitle="Lecture halls, computer laboratories, seating capacities, and multimedia equipment allocations."
      plannedTable="public.classrooms"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'room_number VARCHAR(30) UNIQUE NOT NULL',
        'building VARCHAR(100) NOT NULL',
        'capacity INTEGER NOT NULL CHECK (capacity > 0)',
        'room_type VARCHAR(30) (LECTURE_HALL, LAB, SEMINAR_ROOM, COMPUTER_LAB)',
        'has_projector BOOLEAN DEFAULT TRUE',
        'is_active BOOLEAN DEFAULT TRUE'
      ]}
      plannedValidations={[
        'Prevents double-booking: A room cannot host multiple batches at the same time slot',
        'Capacity validation: Classroom capacity must accommodate student batch strength',
        'Room-type enforcement: Practical sessions must be assigned to Lab-type rooms'
      ]}
    />
  );
};

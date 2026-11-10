import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const AvailabilityPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Faculty Availability Matrix"
      moduleSubtitle="Weekly preferred teaching hours, non-available slots, research leaves, and administrative duties."
      plannedTable="public.faculty_availability"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE',
        'day_of_week VARCHAR(10) (MONDAY - FRIDAY)',
        'start_time TIME NOT NULL',
        'end_time TIME NOT NULL',
        'is_available BOOLEAN DEFAULT TRUE',
        'reason VARCHAR(100)'
      ]}
      plannedValidations={[
        'Strict constraint: Never assign faculty during marked unavailable hours',
        'Working hour adherence: Scheduling only between 08:30 and 17:30',
        'Maximum daily load cap per faculty member'
      ]}
    />
  );
};

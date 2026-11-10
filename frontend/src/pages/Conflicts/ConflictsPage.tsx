import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const ConflictsPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Conflict Detection & Validation Engine"
      moduleSubtitle="Automated audit of 9 core scheduling collision rules across academic timetable entries."
      plannedTable="public.schedule_conflicts"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'conflict_type VARCHAR(50) NOT NULL',
        'severity VARCHAR(20) (CRITICAL_HARD, WARNING_SOFT)',
        'entry_id_1 UUID REFERENCES timetable_entries(id)',
        'entry_id_2 UUID REFERENCES timetable_entries(id)',
        'description TEXT NOT NULL',
        'resolved BOOLEAN DEFAULT FALSE'
      ]}
      plannedValidations={[
        'Rule 1: Faculty assigned to overlapping classes simultaneously',
        'Rule 2: Same classroom booked for multiple batches at same slot',
        'Rule 3: Same batch assigned multiple subjects at same slot',
        'Rule 4: Faculty assigned during documented unavailable hours',
        'Rule 5: Class scheduled outside working hours or during lunch breaks',
        'Rule 6: Assigned classroom with insufficient capacity for batch strength',
        'Rule 7: Practical/lab subjects assigned to incompatible standard lecture rooms',
        'Rule 8: Exceeding weekly lecture limit of a subject',
        'Rule 9: Updating existing timetable entries without revalidating dependencies'
      ]}
    />
  );
};

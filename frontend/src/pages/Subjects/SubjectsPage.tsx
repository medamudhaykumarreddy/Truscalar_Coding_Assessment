import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const SubjectsPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Subject Management"
      moduleSubtitle="Course curriculum, weekly lecture hours requirement, subject types (Theory / Lab), and credit allocations."
      plannedTable="public.subjects"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'code VARCHAR(30) UNIQUE NOT NULL',
        'name VARCHAR(150) NOT NULL',
        'department_id UUID REFERENCES departments(id)',
        'subject_type VARCHAR(20) CHECK (subject_type IN (THEORY, PRACTICAL, TUTORIAL))',
        'weekly_hours_required INTEGER CHECK (weekly_hours_required > 0)',
        'credits INTEGER NOT NULL DEFAULT 3'
      ]}
      plannedValidations={[
        'Prevents exceeding weekly lecture limits in timetable slots',
        'Enforces room compatibility: Lab subjects require computer/specialized labs',
        'Subject hours must balance evenly across 5-day academic week'
      ]}
    />
  );
};

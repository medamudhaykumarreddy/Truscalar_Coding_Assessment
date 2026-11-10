import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const BatchesPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Student Batches Management"
      moduleSubtitle="Student cohorts, academic semesters, student headcount strength, and departmental sections."
      plannedTable="public.student_batches"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'name VARCHAR(100) UNIQUE NOT NULL (e.g. CSE-2024-B1)',
        'department_id UUID REFERENCES departments(id)',
        'semester INTEGER CHECK (semester >= 1 AND semester <= 8)',
        'academic_year VARCHAR(20) NOT NULL',
        'strength INTEGER CHECK (strength > 0)'
      ]}
      plannedValidations={[
        'Batch conflict prevention: No batch can have multiple classes scheduled simultaneously',
        'Capacity verification: Batch strength <= Assigned classroom capacity',
        'Continuous lecture limits: Maximum consecutive hours without a break'
      ]}
    />
  );
};

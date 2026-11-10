import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const AutoGeneratePage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Automatic Timetable Generation"
      moduleSubtitle="Constraint Satisfaction Problem (CSP) solver engine using Minimum Remaining Values (MRV) and forward checking backtracking."
      plannedTable="public.generation_runs"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'academic_year VARCHAR(20) NOT NULL',
        'status VARCHAR(30) (RUNNING, SUCCESS, INFEASIBLE, FAILED)',
        'hard_constraints_evaluated INTEGER',
        'conflicts_encountered JSONB',
        'execution_duration_ms INTEGER',
        'created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'
      ]}
      plannedValidations={[
        'Hard Constraints: Faculty clashes, Room overlaps, Batch double-bookings, Capacity overflow',
        'Soft Constraints: Preferred morning slots for heavy theory, balanced teacher distribution',
        'Conflict explanation tree: Exact reason reported when no conflict-free solution is mathematically possible'
      ]}
    />
  );
};

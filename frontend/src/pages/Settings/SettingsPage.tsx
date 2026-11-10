import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const SettingsPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="Academic Settings & Parameters"
      moduleSubtitle="Working days, daily start/end hours, lecture duration slots, lunch break windows, and maximum daily student hours."
      plannedTable="public.academic_settings"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'academic_year VARCHAR(20) NOT NULL',
        'working_days VARCHAR[] DEFAULT ARRAY[MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]',
        'day_start_time TIME DEFAULT 08:30:00',
        'day_end_time TIME DEFAULT 17:30:00',
        'slot_duration_minutes INTEGER DEFAULT 60',
        'lunch_break_start TIME DEFAULT 12:30:00',
        'lunch_break_end TIME DEFAULT 13:30:00',
        'updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'
      ]}
      plannedValidations={[
        'Lunch break immunity: All scheduling engines must respect configured break window',
        'Daily slot calculation: (End Time - Start Time - Lunch) / Slot Duration',
        'Audit configuration changes in public.audit_logs'
      ]}
    />
  );
};

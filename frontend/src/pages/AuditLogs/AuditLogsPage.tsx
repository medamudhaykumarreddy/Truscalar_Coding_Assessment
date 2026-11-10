import React from 'react';
import { PendingModuleView } from '../../components/PendingModuleView.tsx';

export const AuditLogsPage: React.FC = () => {
  return (
    <PendingModuleView
      moduleName="System Audit Logs"
      moduleSubtitle="Immutable audit trail tracking all modifications, rescheduling operations, and administrative overrides."
      plannedTable="public.audit_logs"
      plannedFields={[
        'id UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        'action VARCHAR(50) (CREATE, UPDATE, DELETE, OVERRIDE)',
        'entity_name VARCHAR(50) (faculty, timetable_entries, classrooms)',
        'entity_id UUID',
        'actor_id UUID REFERENCES users(id)',
        'details JSONB (contains diff of previous and new state)',
        'ip_address VARCHAR(45)',
        'created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'
      ]}
      plannedValidations={[
        'Append-only security: Audit log records cannot be updated or deleted by any user',
        'Capture user ID, IP address, and payload delta for forensic trace',
        'Automatic indexing on entity_id and created_at for fast compliance filtering'
      ]}
    />
  );
};

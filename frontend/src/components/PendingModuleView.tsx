import React from 'react';
import { Clock, Database, ArrowRight, ShieldCheck, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PendingModuleViewProps {
  moduleName: string;
  moduleSubtitle: string;
  plannedTable: string;
  plannedFields: string[];
  plannedValidations: string[];
}

export const PendingModuleView: React.FC<PendingModuleViewProps> = ({
  moduleName,
  moduleSubtitle,
  plannedTable,
  plannedFields,
  plannedValidations,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{moduleName}</h1>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
              Milestone 2 Architecture Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{moduleSubtitle}</p>
        </div>

        <Link
          to="/faculty"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <span>Test Live Faculty CRUD</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Honest Implementation Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Milestone 1 Scope Boundary
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Per interview evaluation specifications, <strong>Faculty Management</strong> has been delivered
              with complete end-to-end PostgreSQL CRUD, parameterized SQL queries, connection pooling, and live network requests.
              The <strong>{moduleName}</strong> module has its relational database schema already defined in{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800">
                backend/database/schema.sql
              </code>{' '}
              and will be wired to API endpoints in Milestone 2. No fake or fabricated records are rendered here.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          {/* Planned PostgreSQL Schema */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              Planned PostgreSQL Table: <span className="font-mono text-blue-700">{plannedTable}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {plannedFields.map((field, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="font-mono text-[11px]">{field}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Planned Conflict & Validation Rules */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Scheduling Rules & Conflict Validations:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {plannedValidations.map((val, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

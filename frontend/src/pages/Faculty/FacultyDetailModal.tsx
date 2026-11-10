import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  Briefcase,
  Award,
  Hash,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
} from 'lucide-react';
import { Faculty } from '../../types/faculty.ts';

interface FacultyDetailModalProps {
  faculty: Faculty | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (faculty: Faculty) => void;
}

export const FacultyDetailModal: React.FC<FacultyDetailModalProps> = ({
  faculty,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !faculty) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Active Faculty
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <PauseCircle className="h-3.5 w-3.5 text-amber-500" /> On Academic Leave
          </span>
        );
      case 'INACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400" /> Inactive
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm">
              {faculty.full_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{faculty.full_name}</h3>
                {getStatusBadge(faculty.status)}
              </div>
              <p className="text-xs font-medium text-slate-500">
                {faculty.designation} • {faculty.department_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/80 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Faculty Code
              </span>
              <span className="mt-1 block text-sm font-bold font-mono text-blue-700">
                {faculty.faculty_code}
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Max Teaching Load
              </span>
              <span className="mt-1 block text-sm font-bold text-slate-800">
                {faculty.max_weekly_hours} Hours / Week
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Department Code
              </span>
              <span className="mt-1 block text-sm font-bold text-slate-800">
                {faculty.department_code}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            <div className="flex items-center px-4 py-3 bg-white">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Academic Email
              </div>
              <div className="font-medium text-slate-900 select-all">{faculty.email}</div>
            </div>

            <div className="flex items-center px-4 py-3 bg-slate-50/30">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
              </div>
              <div className="font-medium text-slate-900">
                {faculty.phone || <span className="text-slate-400 italic">Not provided</span>}
              </div>
            </div>

            <div className="flex items-center px-4 py-3 bg-white">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Building className="h-3.5 w-3.5 text-slate-400" /> Campus Location
              </div>
              <div className="font-medium text-slate-900">
                {faculty.department_name}
                {faculty.building && <span className="text-slate-500"> ({faculty.building})</span>}
              </div>
            </div>

            <div className="flex items-center px-4 py-3 bg-slate-50/30">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Award className="h-3.5 w-3.5 text-slate-400" /> Specialization
              </div>
              <div className="font-medium text-slate-900">
                {faculty.specialization || (
                  <span className="text-slate-400 italic">General Academic Discipline</span>
                )}
              </div>
            </div>

            <div className="flex items-center px-4 py-3 bg-white">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Hash className="h-3.5 w-3.5 text-slate-400" /> PostgreSQL UUID
              </div>
              <div className="font-mono text-[11px] text-slate-600 select-all truncate">
                {faculty.id}
              </div>
            </div>

            <div className="flex items-center px-4 py-3 bg-slate-50/30">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Created At
              </div>
              <div className="text-slate-700">{formatDate(faculty.created_at)}</div>
            </div>

            <div className="flex items-center px-4 py-3 bg-white">
              <div className="flex w-36 shrink-0 items-center gap-2 text-slate-500 font-semibold">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Last Modified
              </div>
              <div className="text-slate-700">{formatDate(faculty.updated_at)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Table: public.faculty
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(faculty);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

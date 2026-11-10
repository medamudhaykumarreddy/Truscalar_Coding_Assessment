import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import { Faculty } from '../../types/faculty.ts';

interface DeleteFacultyDialogProps {
  faculty: Faculty | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteFacultyDialog: React.FC<DeleteFacultyDialogProps> = ({
  faculty,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !faculty) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(faculty.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete faculty member from PostgreSQL database.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Faculty Member</h3>
            <p className="text-xs text-slate-500">PostgreSQL DELETE operation</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200 font-medium">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to permanently delete faculty member{' '}
          <span className="font-bold text-slate-900">{faculty.full_name}</span> (Code:{' '}
          <span className="font-mono font-semibold text-blue-600">{faculty.faculty_code}</span>)?
        </p>

        <div className="mt-3 rounded-lg bg-amber-50 p-2.5 border border-amber-200 text-[11px] text-amber-800">
          <span className="font-semibold">Notice:</span> This will execute a native PostgreSQL{' '}
          <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded">DELETE FROM faculty WHERE id = $1</code>{' '}
          statement. Any future timetable references will be unassigned.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting from DB...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Confirm Permanent Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus, Save, AlertCircle, Loader2 } from 'lucide-react';
import { Faculty, FacultyFormData } from '../../types/faculty.ts';
import { useDepartments } from '../../hooks/useFaculty.ts';

const facultyFormSchema = z.object({
  faculty_code: z
    .string()
    .trim()
    .min(2, 'Faculty Code must be at least 2 characters')
    .max(50, 'Faculty Code cannot exceed 50 characters')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Code can only contain letters, numbers, hyphens, and underscores'),
  full_name: z
    .string()
    .trim()
    .min(2, 'Full Name must be at least 2 characters')
    .max(150, 'Full Name cannot exceed 150 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(150, 'Email cannot exceed 150 characters'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone cannot exceed 30 characters')
    .optional()
    .nullable(),
  department_id: z
    .string()
    .min(1, 'Please select an academic department'),
  designation: z
    .string()
    .trim()
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation cannot exceed 100 characters'),
  specialization: z
    .string()
    .trim()
    .max(150, 'Specialization cannot exceed 150 characters')
    .optional()
    .nullable(),
  max_weekly_hours: z
    .number()
    .int('Hours must be an integer')
    .min(1, 'Minimum weekly teaching hours is 1')
    .max(40, 'Maximum weekly teaching hours cannot exceed 40'),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
});

type FormValues = z.infer<typeof facultyFormSchema>;

interface FacultyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacultyFormData) => Promise<void>;
  initialData?: Faculty | null;
  title: string;
}

const DESIGNATION_PRESETS = [
  'Professor & HOD',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Adjunct Professor',
  'Visiting Faculty'
];

export const FacultyFormModal: React.FC<FacultyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      faculty_code: '',
      full_name: '',
      email: '',
      phone: '',
      department_id: '',
      designation: 'Assistant Professor',
      specialization: '',
      max_weekly_hours: 18,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        faculty_code: initialData.faculty_code,
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone || '',
        department_id: initialData.department_id,
        designation: initialData.designation,
        specialization: initialData.specialization || '',
        max_weekly_hours: initialData.max_weekly_hours,
        status: initialData.status,
      });
    } else {
      reset({
        faculty_code: '',
        full_name: '',
        email: '',
        phone: '',
        department_id: departments && departments.length > 0 ? departments[0].id : '',
        designation: 'Assistant Professor',
        specialization: '',
        max_weekly_hours: 18,
        status: 'ACTIVE',
      });
    }
    setServerError(null);
  }, [initialData, reset, departments, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        phone: values.phone?.trim() ? values.phone.trim() : null,
        specialization: values.specialization?.trim() ? values.specialization.trim() : null,
      });
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to persist faculty member to PostgreSQL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              {initialData ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                PostgreSQL transactional write with parameterized validation
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

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">PostgreSQL Error:</span> {serverError}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Faculty Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Code <span className="text-red-500">*</span>
              </label>
              <input
                {...register('faculty_code')}
                placeholder="e.g. FAC-CSE-005"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.faculty_code ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.faculty_code && (
                <p className="mt-1 text-[11px] text-red-600">{errors.faculty_code.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('full_name')}
                placeholder="e.g. Dr. Alan Turing"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.full_name ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.full_name && (
                <p className="mt-1 text-[11px] text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="faculty@university.edu"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                {...register('department_id')}
                disabled={deptsLoading}
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.department_id ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              >
                <option value="">-- Select Department --</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="mt-1 text-[11px] text-red-600">{errors.department_id.message}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                {...register('designation')}
                list="designation-options"
                placeholder="e.g. Associate Professor"
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.designation ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              <datalist id="designation-options">
                {DESIGNATION_PRESETS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              {errors.designation && (
                <p className="mt-1 text-[11px] text-red-600">{errors.designation.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialization / Domain
              </label>
              <input
                {...register('specialization')}
                placeholder="e.g. Distributed Computing, Algorithms"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.specialization && (
                <p className="mt-1 text-[11px] text-red-600">{errors.specialization.message}</p>
              )}
            </div>

            {/* Max Weekly Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Weekly Hours (1 - 40) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="40"
                {...register('max_weekly_hours', { valueAsNumber: true })}
                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
                  errors.max_weekly_hours ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.max_weekly_hours && (
                <p className="mt-1 text-[11px] text-red-600">{errors.max_weekly_hours.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50 text-xs font-medium">
                  <input
                    type="radio"
                    value="ACTIVE"
                    {...register('status')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active
                  </span>
                </label>

                <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50 text-xs font-medium">
                  <input
                    type="radio"
                    value="ON_LEAVE"
                    {...register('status')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> On Leave
                  </span>
                </label>

                <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50 text-xs font-medium">
                  <input
                    type="radio"
                    value="INACTIVE"
                    {...register('status')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-400"></span> Inactive
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Persisting to PostgreSQL...
                </>
              ) : initialData ? (
                'Update Faculty Record'
              ) : (
                'Save to PostgreSQL'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

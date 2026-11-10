import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Building,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useFacultyList,
  useFacultyStats,
  useDepartments,
  useCreateFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
} from '../../hooks/useFaculty.ts';
import { Faculty, FacultyFilterParams, FacultyFormData } from '../../types/faculty.ts';
import { FacultyFormModal } from './FacultyFormModal.tsx';
import { FacultyDetailModal } from './FacultyDetailModal.tsx';
import { DeleteFacultyDialog } from './DeleteFacultyDialog.tsx';

export const FacultyPage: React.FC = () => {
  // Query parameters state
  const [params, setParams] = useState<FacultyFilterParams>({
    search: '',
    department_id: 'all',
    status: 'all',
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [viewingFaculty, setViewingFaculty] = useState<Faculty | null>(null);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // TanStack Query hooks
  const { data: facultyData, isLoading, isError, error, refetch, isFetching } = useFacultyList(params);
  const { data: stats } = useFacultyStats();
  const { data: departments } = useDepartments();

  const createMutation = useCreateFaculty();
  const updateMutation = useUpdateFaculty();
  const deleteMutation = useDeleteFaculty();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prev) => ({ ...prev, department_id: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleSort = (field: string) => {
    setParams((prev) => {
      const isSameField = prev.sortBy === field;
      const newOrder = isSameField && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      return { ...prev, sortBy: field, sortOrder: newOrder, page: 1 };
    });
  };

  const handleCreateSubmit = async (formData: FacultyFormData) => {
    await createMutation.mutateAsync(formData);
    showToast('success', `Faculty member '${formData.full_name}' was successfully created in PostgreSQL.`);
  };

  const handleUpdateSubmit = async (formData: FacultyFormData) => {
    if (!editingFaculty) return;
    await updateMutation.mutateAsync({ id: editingFaculty.id, data: formData });
    showToast('success', `Faculty member '${formData.full_name}' was successfully updated in PostgreSQL.`);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    showToast('success', 'Faculty member was permanently deleted from PostgreSQL.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> On Leave
          </span>
        );
      case 'INACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl p-4 shadow-xl border animate-in slide-in-from-top-4 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <div className="text-xs font-semibold">{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Management</h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
              PostgreSQL CRUD
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage academic instructors, department assignments, workload limits, and active status in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* PostgreSQL Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Faculty</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats?.total ?? (facultyData ? facultyData.pagination.total : '...')}
          </div>
          <span className="text-[11px] font-medium text-slate-400">In PostgreSQL Database</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Active</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats?.active ?? '...'}
          </div>
          <span className="text-[11px] font-medium text-emerald-600">Available for Scheduling</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">On Leave</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <PauseCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats?.onLeave ?? '...'}
          </div>
          <span className="text-[11px] font-medium text-amber-600">Temporarily Blocked</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Departments</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {departments ? departments.length : '...'}
          </div>
          <span className="text-[11px] font-medium text-slate-400">Academic Units</span>
        </div>
      </div>

      {/* Table Filters & Search Controls */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, faculty code, email, specialization..."
            value={params.search || ''}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Dept:</span>
            <select
              value={params.department_id || 'all'}
              onChange={handleDepartmentChange}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={params.status || 'all'}
              onChange={handleStatusChange}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {(params.search || params.department_id !== 'all' || params.status !== 'all') && (
            <button
              onClick={() =>
                setParams({
                  search: '',
                  department_id: 'all',
                  status: 'all',
                  page: 1,
                  limit: 10,
                  sortBy: 'created_at',
                  sortOrder: 'DESC',
                })
              }
              className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Faculty Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 w-full bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-sm font-bold text-slate-900">Failed to Query PostgreSQL</h3>
            <p className="mt-1 text-xs text-red-600 max-w-md mx-auto">
              {(error as any)?.message || 'Could not retrieve faculty records from the database.'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              Retry Connection
            </button>
          </div>
        ) : facultyData && facultyData.data.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Faculty Records Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {params.search || params.department_id !== 'all' || params.status !== 'all'
                ? 'No faculty members match your filter criteria. Try adjusting your search keywords.'
                : 'Your PostgreSQL database has no faculty records yet. Click below to add the first faculty member.'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Faculty Member
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th
                      onClick={() => handleSort('faculty_code')}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      <div className="flex items-center gap-1">
                        Code <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('full_name')}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      <div className="flex items-center gap-1">
                        Faculty Name <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('department_name')}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      <div className="flex items-center gap-1">
                        Department <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4">Designation & Specialization</th>
                    <th
                      onClick={() => handleSort('max_weekly_hours')}
                      className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 select-none"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Max Load <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 select-none"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Status <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {facultyData?.data.map((faculty) => (
                    <tr
                      key={faculty.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">
                        {faculty.faculty_code}
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {faculty.full_name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" /> {faculty.email}
                          </span>
                          {faculty.phone && (
                            <span className="hidden lg:flex items-center gap-1">
                              • <Phone className="h-3 w-3 text-slate-400" /> {faculty.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{faculty.department_name}</div>
                        <div className="text-[11px] text-slate-500">
                          Dept Code: <span className="font-mono font-medium">{faculty.department_code}</span>
                          {faculty.building && <span> • {faculty.building}</span>}
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{faculty.designation}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {faculty.specialization || <span className="italic text-slate-400">General</span>}
                        </div>
                      </td>

                      {/* Max Weekly Hours */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-bold font-mono text-slate-800">
                          {faculty.max_weekly_hours} hrs
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(faculty.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingFaculty(faculty)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="View Faculty Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingFaculty(faculty)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="Edit Faculty Record"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingFaculty(faculty)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete Faculty Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {facultyData && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50/60 px-4 py-3 gap-3">
                <div className="text-xs text-slate-600">
                  Showing{' '}
                  <span className="font-bold text-slate-900">
                    {Math.min(
                      (facultyData.pagination.page - 1) * facultyData.pagination.limit + 1,
                      facultyData.pagination.total
                    )}
                  </span>{' '}
                  to{' '}
                  <span className="font-bold text-slate-900">
                    {Math.min(
                      facultyData.pagination.page * facultyData.pagination.limit,
                      facultyData.pagination.total
                    )}
                  </span>{' '}
                  of <span className="font-bold text-slate-900">{facultyData.pagination.total}</span> faculty records
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span>Rows:</span>
                    <select
                      value={params.limit || 10}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          limit: Number(e.target.value),
                          page: 1,
                        }))
                      }
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
                      disabled={!facultyData.pagination.hasPrevPage}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-2 text-xs font-semibold text-slate-700">
                      Page {facultyData.pagination.page} of {facultyData.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                      disabled={!facultyData.pagination.hasNextPage}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <FacultyFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Add New Faculty Member"
      />

      <FacultyFormModal
        isOpen={Boolean(editingFaculty)}
        onClose={() => setEditingFaculty(null)}
        onSubmit={handleUpdateSubmit}
        initialData={editingFaculty}
        title={`Edit Faculty: ${editingFaculty?.full_name || ''}`}
      />

      <FacultyDetailModal
        faculty={viewingFaculty}
        isOpen={Boolean(viewingFaculty)}
        onClose={() => setViewingFaculty(null)}
        onEdit={(fac) => {
          setViewingFaculty(null);
          setEditingFaculty(fac);
        }}
      />

      <DeleteFacultyDialog
        faculty={deletingFaculty}
        isOpen={Boolean(deletingFaculty)}
        onClose={() => setDeletingFaculty(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

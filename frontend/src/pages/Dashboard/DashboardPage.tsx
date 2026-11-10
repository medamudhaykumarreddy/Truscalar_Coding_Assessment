import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Database,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useFacultyStats, useFacultyList } from '../../hooks/useFaculty.ts';

export const DashboardPage: React.FC = () => {
  const { data: stats } = useFacultyStats();
  const { data: recentFaculty } = useFacultyList({ page: 1, limit: 5, sortBy: 'created_at', sortOrder: 'DESC' });

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Milestone 1 Active • PostgreSQL Live
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Timetable & Scheduling System
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enterprise academic administration platform with native PostgreSQL database persistence,
            connection pooling, parameterized SQL queries, and complete Faculty Management CRUD.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              Open Faculty CRUD <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-emerald-400" /> Verify /api/health
            </a>
          </div>
        </div>

        {/* Decorative Grid SVG in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>

      {/* Real PostgreSQL Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty In Database
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats?.total ?? '...'}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Real PostgreSQL count
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Instructors
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats?.active ?? '...'}
          </div>
          <div className="mt-1 text-xs text-slate-400 font-medium">
            Available for lecture slots
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On Leave / Inactive
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats ? stats.onLeave + stats.inactive : '...'}
          </div>
          <div className="mt-1 text-xs text-slate-400 font-medium">
            Excluded from scheduling
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Database Engine
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold tracking-tight text-slate-900">
            PostgreSQL
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <Server className="h-3.5 w-3.5" /> Pool & Migrations Active
          </div>
        </div>
      </div>

      {/* Grid: Recent Faculty from Database & Architecture Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Faculty Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Faculty in PostgreSQL</h2>
              <p className="text-xs text-slate-500">Live records retrieved via GET /api/faculty</p>
            </div>
            <Link
              to="/faculty"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All ({stats?.total ?? 0})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentFaculty?.data.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-semibold text-blue-700">
                      {faculty.faculty_code}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {faculty.full_name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{faculty.department_code}</td>
                    <td className="py-2.5 px-3 text-slate-600">{faculty.designation}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          faculty.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {faculty.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestone 1 Architecture Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Milestone 1 Architecture</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Architecture Layers:</span>
              <p className="text-[11px] leading-relaxed">
                Routes → Controllers → Services → Repositories → PostgreSQL.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Database Principles:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Zero ORM: 100% native PostgreSQL SQL</li>
                <li>Parameterized queries for SQL injection safety</li>
                <li>PostgreSQL UUIDs & timestamps</li>
                <li>Foreign key constraint integrity</li>
              </ul>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Network Tab Auditing:</span>
              <p className="text-[11px]">
                Open Chrome DevTools → Network → Fetch/XHR to observe genuine HTTP calls:
                <code className="block mt-1 bg-slate-200/60 p-1 rounded font-mono text-[10px]">
                  GET /api/faculty?page=1&limit=10
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

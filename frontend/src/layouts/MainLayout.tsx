import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DoorOpen,
  GraduationCap,
  CalendarClock,
  CalendarDays,
  Sparkles,
  AlertTriangle,
  FileBarChart2,
  History,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Database,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Faculty', path: '/faculty', icon: Users, badge: 'Active CRUD' },
  { name: 'Subjects', path: '/subjects', icon: BookOpen },
  { name: 'Classrooms', path: '/classrooms', icon: DoorOpen },
  { name: 'Student Batches', path: '/batches', icon: GraduationCap },
  { name: 'Faculty Availability', path: '/availability', icon: CalendarClock },
  { name: 'Timetable', path: '/timetable', icon: CalendarDays },
  { name: 'Auto Generation', path: '/auto-generate', icon: Sparkles },
  { name: 'Conflicts', path: '/conflicts', icon: AlertTriangle },
  { name: 'Reports', path: '/reports', icon: FileBarChart2 },
  { name: 'Audit Logs', path: '/audit-logs', icon: History },
  { name: 'Academic Settings', path: '/settings', icon: Sliders },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find((item) =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  ) || NAV_ITEMS[1];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Enterprise Slate/Navy Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-200 transition-all duration-300 ease-in-out lg:static ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-900/30">
              <CalendarDays className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-white uppercase leading-none">
                  SmartSchedule
                </span>
                <span className="block text-[11px] font-medium text-slate-400 mt-1 truncate">
                  Academic Timetable v1.0
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {!collapsed ? 'Academic Master Data' : '•••'}
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Database Engine Status Footer */}
        <div className="border-t border-slate-800 p-3">
          <div
            className={`flex items-center gap-2.5 rounded-lg bg-slate-800/80 p-2.5 border border-slate-700/60 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                    <Database className="h-3 w-3 text-emerald-400" /> PostgreSQL
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  Native Pool & Migrations Active
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-500">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> University Academic ERP
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">{currentNavItem.name}</span>
            </nav>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            {/* Database indicator badge */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>PostgreSQL Database: <span className="font-semibold text-slate-900">smart_timetable</span></span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title="System Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      System Notifications
                    </span>
                    <span className="text-[11px] text-blue-600 font-medium">Mark all read</span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50/70 p-2.5 border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-950">PostgreSQL Schema Ready</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Departments and Faculty tables migrated with UUIDs and indexing.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-lg bg-blue-50/70 p-2.5 border border-blue-100">
                      <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-950">Faculty CRUD Milestone</p>
                        <p className="text-[11px] text-blue-700 mt-0.5">
                          Full REST API endpoints connected with real database persistence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-xs">
                  AD
                </div>
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">Admin User</div>
                  <div className="text-[10px] font-medium text-slate-400">Academic Dean</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">Dr. Administrator</p>
                    <p className="text-[11px] text-slate-500">admin@university.edu</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-blue-100/80 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                      <ShieldCheck className="h-3 w-3" /> ROLE: ADMIN
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left rounded-md px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left rounded-md px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    PostgreSQL Connection Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

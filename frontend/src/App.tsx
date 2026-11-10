import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout.tsx';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage.tsx';
import { FacultyPage } from './pages/Faculty/FacultyPage.tsx';
import { SubjectsPage } from './pages/Subjects/SubjectsPage.tsx';
import { ClassroomsPage } from './pages/Classrooms/ClassroomsPage.tsx';
import { BatchesPage } from './pages/Batches/BatchesPage.tsx';
import { AvailabilityPage } from './pages/Availability/AvailabilityPage.tsx';
import { TimetablePage } from './pages/Timetable/TimetablePage.tsx';
import { AutoGeneratePage } from './pages/AutoGenerate/AutoGeneratePage.tsx';
import { ConflictsPage } from './pages/Conflicts/ConflictsPage.tsx';
import { ReportsPage } from './pages/Reports/ReportsPage.tsx';
import { AuditLogsPage } from './pages/AuditLogs/AuditLogsPage.tsx';
import { SettingsPage } from './pages/Settings/SettingsPage.tsx';

// Create a single stable TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/classrooms" element={<ClassroomsPage />} />
            <Route path="/batches" element={<BatchesPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/auto-generate" element={<AutoGeneratePage />} />
            <Route path="/conflicts" element={<ConflictsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

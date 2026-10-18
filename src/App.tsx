import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AcademyProvider } from './context/AcademyContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { StudentsPage } from './pages/StudentsPage';
import { CoachesPage } from './pages/CoachesPage';
import { CourtsPage } from './pages/CourtsPage';
import { GroupsPage } from './pages/GroupsPage';
import { AttendancePage } from './pages/AttendancePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { BookingsPage, SettingsPage } from './pages/SecondaryPages';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#0F172A] font-sans antialiased relative selection:bg-[#FF5B26] selection:text-white">
      {/* 🎾 FLONEA USLUBIDAGI YUQORI HEADER */}
      <TopNavbar />

      {/* ASOSIY SAHIFA KONTENTI */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/academy" element={<Navigate to="/payments?tab=academy" replace />} />
          <Route path="/rankings" element={<Navigate to="/payments?tab=rankings" replace />} />
          <Route path="/reports" element={<Navigate to="/payments?tab=reports" replace />} />
          <Route path="/notifications" element={<Navigate to="/payments?tab=notifications" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* TOAST BILDIRISHNOMALARI VA AUTH MODAL */}
      <ToastContainer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AcademyProvider>
  );
}

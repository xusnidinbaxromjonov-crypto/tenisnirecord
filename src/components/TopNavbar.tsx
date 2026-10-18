import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  User,
  CreditCard,
  CalendarDays,
  Users,
  GraduationCap,
  Trophy,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const TopNavbar: React.FC = () => {
  const { currentUser, setIsAuthModalOpen, notificationCount } = useAcademy();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const navLinks = [
    { path: '/', label: 'Bosh sahifa' },
    { path: '/courts', label: 'Mashg‘ulotlar' },
    { path: '/coaches', label: 'Ustozlar' },
    { path: '/students', label: 'O‘quvchilar' },
    { path: '/groups', label: 'Guruhlar' },
    { path: '/calendar', label: 'Kalendar' },
    { path: '/payments', label: 'To‘lovlar' },
    { path: '/tournaments', label: 'Turnirlar' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F6F8FA]/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Chap qism: Logotip (FLONEA. uslubida) */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-2xl sm:text-[28px] font-black tracking-tight text-[#0C1E34] hover:opacity-90 transition-opacity select-none"
          >
            <span className="font-sport tracking-wider text-3xl">TENISREKORD</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B26] -mb-1 inline-block" />
          </Link>
        </div>

        {/* Markaziy qism: Desktop Navigatsiya Linklari */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-xs 2xl:text-[13px] font-extrabold uppercase tracking-wider transition-all relative py-1 ${
                  isActive
                    ? 'text-[#0C1E34] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF5B26]'
                    : 'text-gray-500 hover:text-[#0C1E34]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* O'ng qism: Qo'ng'iroqcha, Profil va "CONTACT / KABINET" Pill Buttoni */}
        <div className="flex items-center gap-3">
          {/* Bildirishnomalar */}
          <Link
            to="/payments?tab=notifications"
            className="relative p-2 text-gray-700 hover:text-[#0C1E34] hover:bg-white rounded-full border border-gray-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell size={17} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5B26] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </Link>

          {/* FLONEA. uslubidagi Pill tugma (Qora/To'q ko'k kapsula + tennis koptogi) */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2.5 bg-[#0C1E34] hover:bg-[#122b49] text-white pl-4 pr-1.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <span>Kabinet</span>
            <span className="w-7 h-7 rounded-full bg-[#FF5B26] flex items-center justify-center text-sm shadow-inner text-white">
              🎾
            </span>
          </button>

          {/* Foydalanuvchi avatari */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#FF5B26]/30 transition-all cursor-pointer"
            >
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 text-xs text-gray-700 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-extrabold text-gray-900 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#FF5B26] font-bold">{currentUser.role}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-left font-bold text-gray-700 cursor-pointer"
                >
                  <User size={14} className="text-[#FF5B26]" /> Profilni boshqarish
                </button>
                <Link
                  to="/payments"
                  onClick={() => setProfileDropdown(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-left font-bold text-gray-700"
                >
                  <CreditCard size={14} className="text-emerald-600" /> To‘lovlar & Moliya
                </Link>
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-left font-bold text-rose-600 border-t border-gray-100 mt-1 cursor-pointer"
                >
                  <LogOut size={14} /> Chiqish / Qayta kirish
                </button>
              </div>
            )}
          </div>

          {/* Mobil Menyu Gamburgeri */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-gray-700 hover:text-[#0C1E34] hover:bg-white rounded-xl border border-gray-200 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobil Ochiluvchi Menyu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-gray-200 pb-2 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#0C1E34] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-between bg-[#0C1E34] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
            >
              <span>Kabinet / Profil</span>
              <span>🎾</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

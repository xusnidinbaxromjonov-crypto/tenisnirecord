import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  GraduationCap,
  FolderKanban,
  CalendarDays,
  CalendarCheck2,
  CheckSquare,
  CreditCard,
  Trophy,
  Award,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const Sidebar: React.FC = () => {
  const { currentUser, setIsAuthModalOpen, notificationCount } = useAcademy();
  const location = useLocation();

  // Asosiy menyu ro'yxati
  const mainMenuItems = [
    { path: '/', label: 'Bosh sahifa', icon: Home },
    { path: '/courts', label: 'Mashg‘ulotlar', icon: CalendarDays },
    { path: '/coaches', label: 'Ustozlar', icon: Users },
    { path: '/students', label: 'O‘quvchilar', icon: GraduationCap },
    { path: '/groups', label: 'Guruhlar va dasturlar', icon: FolderKanban },
    { path: '/calendar', label: 'Kalendar', icon: CalendarDays },
    { path: '/bookings', label: 'Bronlar', icon: CalendarCheck2 },
    { path: '/attendance', label: 'Davomat', icon: CheckSquare },
    { path: '/tournaments', label: 'Turnirlar', icon: Trophy },
  ];

  // To'lovlar ichidagi ichki bo'limlar (Akademiya, Bildirishnomalar, Reytinglar, Hisobotlar to'lovlarga biriktirilgan)
  const paymentSubItems = [
    { path: '/payments?tab=payments', tabKey: 'payments', label: 'To‘lovlar & Kassa', icon: CreditCard },
    { path: '/payments?tab=reports', tabKey: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { path: '/payments?tab=rankings', tabKey: 'rankings', label: 'Reytinglar', icon: Award },
    {
      path: '/payments?tab=notifications',
      tabKey: 'notifications',
      label: 'Bildirishnomalar',
      icon: Bell,
      badge: notificationCount,
    },
    { path: '/payments?tab=academy', tabKey: 'academy', label: 'Akademiya', icon: Building2 },
  ];

  const isPaymentsActive = location.pathname.startsWith('/payments');
  const currentTab = new URLSearchParams(location.search).get('tab') || 'payments';

  // To'lovlar menyusining ochiq/yopiq holati
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(true);

  return (
    <aside className="w-[260px] min-w-[260px] bg-[#07251E] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-[#0D382E] select-none z-30 shadow-2xl">
      {/* Yuqori qism: Logo */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#A3E635] flex items-center justify-center text-[#07251E] font-black text-xl shadow-lg ring-2 ring-[#84CC16]/30 flex-shrink-0">
            ⚡
          </div>
          <div>
            <h1 className="text-[17px] font-black tracking-wide text-white leading-tight">
              Tenis<span className="text-[#A3E635]">rekord</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold">
              Boshqaruv Markazi
            </p>
          </div>
        </div>
      </div>

      {/* Navigatsiya menyusi */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E7153] text-white font-bold shadow-md shadow-emerald-950/40'
                    : 'text-emerald-100/70 hover:bg-[#0E3A2F] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}

        {/* TO'LOVLAR BO'LIMI (ICHIDA AKADEMIYA, BILDIRISHNOMA, REYTING VA HISOBOTLAR) */}
        <div className="pt-1.5 pb-1">
          <div
            onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
              isPaymentsActive
                ? 'bg-[#15533D] text-white font-bold'
                : 'text-emerald-100/80 hover:bg-[#0E3A2F] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-[#A3E635] flex-shrink-0" />
              <span>To‘lovlar Markazi</span>
            </div>
            <div className="flex items-center gap-1.5">
              {notificationCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              {isPaymentsOpen ? (
                <ChevronDown size={15} className="text-emerald-400" />
              ) : (
                <ChevronRight size={15} className="text-emerald-400" />
              )}
            </div>
          </div>

          {/* To'lovlar ostidagi ichki bo'limlar */}
          {isPaymentsOpen && (
            <div className="ml-3 pl-3 border-l-2 border-[#175C44] mt-1 space-y-1">
              {paymentSubItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isPaymentsActive && currentTab === sub.tabKey;

                return (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isSubActive
                        ? 'bg-[#A3E635] text-[#07251E] font-extrabold shadow-sm'
                        : 'text-emerald-200/70 hover:bg-[#0E3A2F] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SubIcon size={15} className="flex-shrink-0" />
                      <span>{sub.label}</span>
                    </div>
                    {sub.badge && sub.badge > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center">
                        {sub.badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Sozlamalar */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              isActive
                ? 'bg-[#1E7153] text-white font-bold shadow-md shadow-emerald-950/40'
                : 'text-emerald-100/70 hover:bg-[#0E3A2F] hover:text-white'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="flex-shrink-0" />
            <span>Sozlamalar</span>
          </div>
        </NavLink>
      </nav>

      {/* Pastki qism: Profil bloki (Motivatsion gaplar olib tashlangan) */}
      <div className="px-3 pb-3 pt-2 border-t border-[#0F3E32]">
        <div
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center justify-between px-2 cursor-pointer hover:bg-[#0E3D31]/40 p-1.5 rounded-xl transition-colors"
          title="Profil va Registratsiya"
        >
          <div className="flex items-center gap-2.5">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#A3E635]"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{currentUser.role}</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-emerald-500/60" />
        </div>

        {/* Ro'yxatdan o'tish / Chiqish */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-[11px] text-emerald-200/60 hover:text-[#A3E635] hover:bg-[#0E3A2F] rounded-lg transition-colors font-semibold cursor-pointer"
        >
          <LogOut size={14} />
          <span>Ro‘yxatdan o‘tish / Kirish</span>
        </button>
      </div>
    </aside>
  );
};

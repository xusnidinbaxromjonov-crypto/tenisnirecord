import React, { useState, useMemo } from 'react';
import {
  Plus,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  Check,
  RefreshCw,
  Printer,
  Flame,
  Maximize2,
  Minimize2,
  Columns,
  Square,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { SportSubject, Coach, Student, PaymentRecord } from '../types';
import { SportWindowContent } from '../components/SportWindowContent';

export const DashboardPage: React.FC = () => {
  const {
    sports,
    coaches,
    students,
    payments,
    addSport,
    addCoach,
    addStudent,
    addPayment,
    updateCoachSalaryRate,
    resetToSampleSportsData,
  } = useAcademy();

  // =========================================================================
  // 1. 🪟 MASHG'ULOTLAR / SPORT FANLARI OYNA (MULTI-WINDOW) TIZIMI
  //    "bitta mashg'ulotni ezsa bitta oyna ochilsin va 2-chisini ezsa yana ochilsin"
  // =========================================================================
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindowSlug, setActiveWindowSlug] = useState<string>('');
  const [windowViewMode, setWindowViewMode] = useState<'single' | 'split'>('single');
  const [isWindowMinimized, setIsWindowMinimized] = useState<boolean>(false);
  const [isWindowFullscreen, setIsWindowFullscreen] = useState<boolean>(false);

  // Mashg'ulot oynasini ochish
  const handleOpenSportWindow = (sportSlug: string) => {
    setOpenWindows((prev) => {
      if (!prev.includes(sportSlug)) {
        return [...prev, sportSlug];
      }
      return prev;
    });
    setActiveWindowSlug(sportSlug);
    setIsWindowMinimized(false);
  };

  // Alohida oynani yopish
  const handleCloseSportWindow = (sportSlug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenWindows((prev) => {
      const next = prev.filter((s) => s !== sportSlug);
      if (activeWindowSlug === sportSlug && next.length > 0) {
        setActiveWindowSlug(next[0]);
      }
      return next;
    });
  };

  // Barcha oynalarni yopish
  const handleCloseAllWindows = () => {
    setOpenWindows([]);
    setActiveWindowSlug('');
  };

  // Hozir ochiq turgan faol sport fani
  const activeWindowSport = useMemo(() => {
    return sports.find((s) => s.slug === activeWindowSlug) || sports.find((s) => s.slug === openWindows[0]) || sports[0];
  }, [sports, activeWindowSlug, openWindows]);

  // Split-screen uchun 2-chi sport fani
  const splitSecondSport = useMemo(() => {
    if (openWindows.length < 2) return null;
    const secondSlug = openWindows.find((s) => s !== activeWindowSlug) || openWindows[1];
    return sports.find((s) => s.slug === secondSlug) || null;
  }, [sports, openWindows, activeWindowSlug]);

  // Hali ochilmagan qolgan mashg'ulotlar (dropdown uchun)
  const unopenedSports = useMemo(() => {
    return sports.filter((s) => !openWindows.includes(s.slug));
  }, [sports, openWindows]);

  // =========================================================================
  // 2. MODALLAR HOLATI (TO'LOV, KVITANSIYA, YANGI O'QUVCHI, YANGI USTOZ, SPORT)
  // =========================================================================
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);
  const [targetCoach, setTargetCoach] = useState<Coach | null>(null);
  const [targetSport, setTargetSport] = useState<SportSubject | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(500000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Cash');
  const [paymentDescription, setPaymentDescription] = useState('Oylik mashg‘ulot badali');

  // Chek / Kvitansiya
  const [receiptData, setReceiptData] = useState<{
    studentName: string;
    coachName: string;
    sportName: string;
    amount: number;
    method: string;
    date: string;
    invoice: string;
  } | null>(null);

  // Yangi o'quvchi modali
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false);
  const [modalSportForStudent, setModalSportForStudent] = useState<SportSubject | null>(null);
  const [modalCoachForStudent, setModalCoachForStudent] = useState<Coach | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+998 90 ');
  const [newStudentParent, setNewStudentParent] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('+998 90 ');
  const [newStudentGroup, setNewStudentGroup] = useState('');

  // Yangi murabbiy modali
  const [newCoachModalOpen, setNewCoachModalOpen] = useState(false);
  const [modalSportForCoach, setModalSportForCoach] = useState<SportSubject | null>(null);
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachPhone, setNewCoachPhone] = useState('+998 90 ');
  const [newCoachSpecialization, setNewCoachSpecialization] = useState('');
  const [newCoachRate, setNewCoachRate] = useState<number>(40);

  // Yangi sport fani modali
  const [newSportModalOpen, setNewSportModalOpen] = useState(false);
  const [newSportName, setNewSportName] = useState('');
  const [newSportIcon, setNewSportIcon] = useState('🥋');
  const [newSportBadge, setNewSportBadge] = useState('Yakkakurash');
  const [newSportFee, setNewSportFee] = useState<number>(500000);
  const [newSportDesc, setNewSportDesc] = useState('');

  // Har bir sport bo'yicha jami o'quvchilar va murabbiylar statistikasini hisoblash
  const sportsStats = useMemo(() => {
    const statsMap: Record<
      string,
      { studentsCount: number; coachesCount: number; totalRevenue: number }
    > = {};

    sports.forEach((sp) => {
      const spCoaches = coaches.filter(
        (c) =>
          c.sport?.toLowerCase() === sp.name.toLowerCase() ||
          c.specialization?.toLowerCase().includes(sp.name.toLowerCase())
      );
      const spCoachIds = spCoaches.map((c) => c.id);

      const spStudents = students.filter(
        (s) =>
          s.sport?.toLowerCase() === sp.name.toLowerCase() ||
          spCoachIds.includes(s.coachId)
      );
      const spStudentIds = spStudents.map((s) => s.id);

      const spRevenue = payments
        .filter(
          (p) =>
            p.status === 'Paid' &&
            (p.sport?.toLowerCase() === sp.name.toLowerCase() ||
              spStudentIds.includes(p.studentId) ||
              spCoachIds.includes(p.coachId || ''))
        )
        .reduce((sum, p) => sum + p.amount, 0);

      statsMap[sp.slug] = {
        studentsCount: spStudents.length,
        coachesCount: spCoaches.length,
        totalRevenue: spRevenue,
      };
    });

    return statsMap;
  }, [sports, coaches, students, payments]);

  // Umumiy akademiya ko'rsatkichlari
  const totalStudents = students.length;
  const totalCoaches = coaches.length;
  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  // =========================================================================
  // 3. HANDLERLAR
  // =========================================================================
  const handleOpenPaymentModal = (st: Student, coach: Coach | null, sportObj: SportSubject) => {
    setTargetStudent(st);
    setTargetCoach(coach);
    setTargetSport(sportObj);
    setPaymentAmount(st.lastPaymentAmount || sportObj.monthlyFee || 500000);
    setPaymentMethod('Cash');
    setPaymentDescription(`${sportObj.name} oylik dars to‘lovi`);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !targetSport) return;

    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addPayment({
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      studentPhoto: targetStudent.photo,
      coachId: targetCoach?.id,
      coachName: targetCoach?.fullName,
      sport: targetSport.name,
      amount: paymentAmount,
      date: today,
      dueDate: today,
      status: 'Paid',
      paymentMethod,
      itemDescription: paymentDescription,
    });

    setReceiptData({
      studentName: targetStudent.fullName,
      coachName: targetCoach?.fullName || 'Murabbiy',
      sportName: targetSport.name,
      amount: paymentAmount,
      method:
        paymentMethod === 'Cash'
          ? 'Naqd pul'
          : paymentMethod === 'Credit Card'
          ? 'Bank kartasi'
          : 'Payme / Click',
      date: today,
      invoice: invoiceNum,
    });

    setPaymentModalOpen(false);
  };

  const handleOpenNewStudent = (sportObj: SportSubject, coach: Coach | null) => {
    setModalSportForStudent(sportObj);
    setModalCoachForStudent(coach);
    setNewStudentGroup(`${sportObj.name} 1-Guruh`);
    setNewStudentModalOpen(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSportForStudent) return;

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    addStudent({
      fullName: newStudentName,
      photo: randomAvatar,
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@tenisrekord.uz`,
      phone: newStudentPhone,
      dob: '2008-01-01',
      age: 18,
      parentName: newStudentParent || 'Ota-onasi',
      parentPhone: newStudentParentPhone || newStudentPhone,
      skillLevel: 'Intermediate',
      groupId: `grp-${modalSportForStudent.slug}-1`,
      groupName: newStudentGroup || `${modalSportForStudent.name} 1-Guruh`,
      coachId: modalCoachForStudent?.id || '',
      coachName: modalCoachForStudent?.fullName || '',
      sport: modalSportForStudent.name,
      registrationDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      subscriptionStatus: 'Pending',
      balance: 0,
      notes: `${modalSportForStudent.name} bo‘limiga yangi qabul qilindi`,
      status: 'active',
      lastPaymentStatus: 'Pending',
    });

    setNewStudentModalOpen(false);
    setNewStudentName('');
    setNewStudentPhone('+998 90 ');
    setNewStudentParent('');
    setNewStudentParentPhone('+998 90 ');
    setNewStudentGroup('');
  };

  const handleOpenNewCoach = (sportObj: SportSubject) => {
    setModalSportForCoach(sportObj);
    setNewCoachSpecialization(`Katta murabbiy, ${sportObj.name} sport ustasi`);
    setNewCoachModalOpen(true);
  };

  const handleCreateCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSportForCoach) return;

    addCoach({
      fullName: newCoachName,
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      email: `${newCoachName.toLowerCase().replace(/\s+/g, '.')}@tenisrekord.uz`,
      phone: newCoachPhone,
      specialization: newCoachSpecialization || `${modalSportForCoach.name} murabbiyi`,
      sport: modalSportForCoach.name,
      experienceYears: 5,
      certifications: [`${modalSportForCoach.name} Sport ustasi`],
      assignedGroups: [],
      weeklyHours: 20,
      activeStudentsCount: 0,
      winRate: 85,
      salaryMonthly: 5000000,
      salaryRate: newCoachRate,
      salaryType: 'percentage',
      rating: 5.0,
      status: 'active',
    });

    setNewCoachModalOpen(false);
    setNewCoachName('');
    setNewCoachPhone('+998 90 ');
    setNewCoachSpecialization('');
  };

  const handleCreateSport = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newSportName.toLowerCase().trim().replace(/\s+/g, '-');

    addSport({
      name: newSportName,
      slug,
      icon: newSportIcon || '🥋',
      badge: newSportBadge || 'Sport',
      color: '#3B82F6',
      bgGradient: 'from-blue-600/15 via-indigo-500/10 to-transparent',
      monthlyFee: newSportFee,
      description: newSportDesc || `${newSportName} bo‘limi va mashg‘ulotlari`,
    });

    setNewSportModalOpen(false);
    setNewSportName('');
    setNewSportDesc('');
    // Yangi sportni darhol oyna sifatida ochish
    handleOpenSportWindow(slug);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-24">
      {/* ========================================================================= */}
      {/* 1. YUQORI HEADER & AKADEMIYA STATISTIKALARI                                */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#0C1E34] text-white flex items-center justify-center text-sm font-black shadow-md">
              ⚡
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5B26]">
              Sport Fanlari & Mashg‘ulotlar Markazi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0C1E34] tracking-tight">
            Akademiya Fanlari & Mashg‘ulotlar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Har bir mashg‘ulotni bosganda alohida oyna ochiladi. Bir nechta mashg‘ulot oynasini bir vaqtda ochib, yonma-yon solishtirishingiz mumkin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setNewSportModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <Plus size={16} />
            <span>Yangi Fan Qo‘shish</span>
          </button>

          <button
            onClick={resetToSampleSportsData}
            title="Namunaviy ma’lumotlarni tiklash"
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Namunaviy ma’lumotlar</span>
          </button>
        </div>
      </div>

      {/* 4 TA YORQIN STATISTIK KARTALAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5B26] flex items-center justify-center text-xl font-black">
            🥋
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Mavjud Fanlar
            </p>
            <h3 className="text-xl font-black text-[#0C1E34] mt-0.5">{sports.length} ta fan</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">
            👥
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Jami O‘quvchilar
            </p>
            <h3 className="text-xl font-black text-[#0C1E34] mt-0.5">{totalStudents} o‘quvchi</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
            🏆
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Faol Murabbiylar
            </p>
            <h3 className="text-xl font-black text-[#0C1E34] mt-0.5">{totalCoaches} ustoz</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black">
            💰
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Jami Tushum
            </p>
            <h3 className="text-xl font-black text-[#0C1E34] mt-0.5">
              {(totalRevenue / 1000).toLocaleString()} ming
            </h3>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MASHG'ULOTLAR KARTALARI (BENTO GRID)                                    */}
      {/*    Har birini bosganda alohida oyna ochiladi!                             */}
      {/* ========================================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-2">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-[#FF5B26]" />
            <h2 className="text-lg font-black uppercase tracking-wider text-[#0C1E34]">
              Mavjud Sport Fanlari & Mashg‘ulotlar ({sports.length})
            </h2>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles size={13} className="text-emerald-600" />
            Mashg‘ulotni bosing — alohida oyna ochiladi!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {sports.map((sport) => {
            const isWindowOpen = openWindows.includes(sport.slug);
            const stats = sportsStats[sport.slug] || {
              studentsCount: 0,
              coachesCount: 0,
              totalRevenue: 0,
            };

            return (
              <div
                key={sport.id}
                onClick={() => handleOpenSportWindow(sport.slug)}
                className={`relative rounded-[28px] p-6 transition-all duration-300 cursor-pointer select-none group flex flex-col justify-between overflow-hidden border ${
                  isWindowOpen
                    ? 'bg-[#0C1E34] text-white border-[#0C1E34] shadow-2xl ring-4 ring-[#FF5B26] scale-[1.02]'
                    : 'bg-white hover:bg-gray-50/90 text-[#0C1E34] border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Orqa fon nur effekti */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity ${
                    isWindowOpen ? 'opacity-30 bg-[#FF5B26]' : 'opacity-10 bg-gray-400'
                  }`}
                />

                {/* Yuqori qism: Ikonka va Nishon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-transform group-hover:scale-110 ${
                        isWindowOpen
                          ? 'bg-white/10 ring-2 ring-white/20'
                          : 'bg-gray-100 ring-2 ring-gray-200/50'
                      }`}
                    >
                      {sport.icon}
                    </div>

                    {isWindowOpen ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs animate-pulse">
                        <Check size={11} /> Oyna Ochiq
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {sport.badge}
                      </span>
                    )}
                  </div>

                  {/* Sport Nomi */}
                  <h3
                    className={`font-sport text-3xl tracking-wide uppercase leading-tight ${
                      isWindowOpen ? 'text-white' : 'text-[#0C1E34]'
                    }`}
                  >
                    {sport.name}
                  </h3>

                  <p
                    className={`text-[11px] font-medium line-clamp-1 mt-1 ${
                      isWindowOpen ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {sport.description}
                  </p>
                </div>

                {/* Pastki qism: Statistika & "Oynani Ochish" tugmasi */}
                <div
                  className={`pt-4 mt-4 border-t flex flex-col gap-3 ${
                    isWindowOpen ? 'border-white/10' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                        O‘quvchilar / Ustozlar
                      </p>
                      <p
                        className={`text-xs font-black mt-0.5 ${
                          isWindowOpen ? 'text-white' : 'text-[#0C1E34]'
                        }`}
                      >
                        {stats.studentsCount} o‘quvchi • {stats.coachesCount} ustoz
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#FF5B26]">
                        Tushum
                      </p>
                      <p
                        className={`text-xs font-black mt-0.5 ${
                          isWindowOpen ? 'text-white' : 'text-[#0C1E34]'
                        }`}
                      >
                        {(stats.totalRevenue / 1000).toLocaleString()} ming
                      </p>
                    </div>
                  </div>

                  {/* Tugma */}
                  <div
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                      isWindowOpen
                        ? 'bg-[#FF5B26] text-white shadow-md'
                        : 'bg-gray-100 hover:bg-[#0C1E34] text-gray-700 hover:text-white'
                    }`}
                  >
                    <span>{isWindowOpen ? 'Oynani Ko‘rish' : '⚡ Oynani Ochish'}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 🪟 ASOSIY MASHG'ULOT MODAL OYNASI (MULTI-WINDOW + SPLIT SCREEN)         */}
      {/*    Foydalanuvchi bitta mashg'ulotni bossa oyna ochiladi,                  */}
      {/*    2-chisini bossa 2-oyna ham ochiladi (yonma-yon yoki tablarda)!        */}
      {/* ========================================================================= */}
      {openWindows.length > 0 && !isWindowMinimized && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div
            className={`bg-[#F8FAFC] rounded-[32px] sm:rounded-[40px] shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
              isWindowFullscreen
                ? 'w-full h-full rounded-none'
                : 'w-full max-w-[1580px] h-[92vh] max-h-[920px]'
            }`}
          >
            {/* OYNA TEPASI: TABLAR VA BOSHQARUV TUGMALARI */}
            <div className="bg-[#0C1E34] text-white p-3 sm:p-4 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 select-none">
              {/* CHAP: OCHILGAN MASHG'ULOTLARNING TABLARI (1-oyna, 2-oyna...) */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#FF5B26] mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B26] animate-ping inline-block" />
                  <span>Oynalar:</span>
                </div>

                {openWindows.map((slug) => {
                  const sp = sports.find((s) => s.slug === slug);
                  if (!sp) return null;
                  const isActive = activeWindowSlug === slug;

                  return (
                    <div
                      key={slug}
                      onClick={() => {
                        setActiveWindowSlug(slug);
                        if (windowViewMode === 'split' && openWindows.length === 2) {
                          // split rejimda ham ko'rish mumkin
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                        isActive
                          ? 'bg-[#FF5B26] text-white shadow-md ring-2 ring-white/30 scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      <span>{sp.icon}</span>
                      <span>{sp.name}</span>
                      <button
                        title="Oynani yopish"
                        onClick={(e) => handleCloseSportWindow(slug, e)}
                        className="w-4 h-4 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center text-[10px] transition-colors ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* + QOLGAN SPORT FANLARINI HAM OYNA QILIB OCHISH TUGMASI */}
                {unopenedSports.length > 0 && (
                  <div className="relative group">
                    <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-200 flex items-center gap-1 transition-colors cursor-pointer">
                      <Plus size={13} />
                      <span className="hidden sm:inline">+ Boshqa mashg‘ulot ochish</span>
                    </button>
                    <div className="absolute left-0 top-full mt-1.5 hidden group-hover:block bg-[#0C1E34] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 min-w-[200px]">
                      <p className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1">
                        Yana bitta oyna ochish:
                      </p>
                      {unopenedSports.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleOpenSportWindow(s.slug)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-[#FF5B26] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span>{s.icon}</span>
                          <span>{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* O'NG: SPLIT VIEW (2 TA OYNANI YONMA-YON KO'RISH) VA OYNA TUGMALARI */}
              <div className="flex items-center gap-2">
                {/* 2 TA OYNA OCHILGANDA YONMA-YON (SPLIT SCREEN) IMKONIYATI */}
                {openWindows.length >= 2 && (
                  <div className="bg-white/10 rounded-xl p-1 flex items-center gap-1">
                    <button
                      onClick={() => setWindowViewMode('single')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        windowViewMode === 'single'
                          ? 'bg-white text-[#0C1E34] shadow-xs'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      title="Bitta oyna ko‘rinishi"
                    >
                      <Square size={13} />
                      <span className="hidden md:inline">Yakka oyna</span>
                    </button>

                    <button
                      onClick={() => setWindowViewMode('split')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        windowViewMode === 'split'
                          ? 'bg-[#FF5B26] text-white shadow-xs'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      title="2 ta oynani yonma-yon ko‘rish"
                    >
                      <Columns size={13} />
                      <span className="hidden md:inline">2 ta oyna yonma-yon</span>
                    </button>
                  </div>
                )}

                {/* Oynani kichraytirish (Minimize) */}
                <button
                  onClick={() => setIsWindowMinimized(true)}
                  title="Pastga tushirish (Minimize)"
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minimize2 size={15} />
                </button>

                {/* Oynani kattalashtirish (Fullscreen) */}
                <button
                  onClick={() => setIsWindowFullscreen(!isWindowFullscreen)}
                  title={isWindowFullscreen ? 'Normal oyna' : 'To‘liq ekran'}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Maximize2 size={15} />
                </button>

                {/* Oynani yopish */}
                <button
                  onClick={handleCloseAllWindows}
                  title="Oynani yopish (Close)"
                  className="w-8 h-8 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* OYNA ICHKI KONTENTI */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {windowViewMode === 'split' && openWindows.length >= 2 && splitSecondSport ? (
                /* 🔥 2 TA MASHG'ULOT OYNASI YONMA-YON (SPLIT VIEW) */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                  {/* 1-OYNA */}
                  <div className="bg-white rounded-[32px] p-6 border-2 border-[#0C1E34]/10 shadow-lg">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5B26] bg-[#FF5B26]/10 px-2.5 py-1 rounded-md">
                        1-Oyna: {activeWindowSport?.name}
                      </span>
                      <button
                        onClick={() => handleCloseSportWindow(activeWindowSport.slug)}
                        className="text-xs text-gray-400 hover:text-rose-600 font-bold"
                      >
                        Yopish ✕
                      </button>
                    </div>
                    {activeWindowSport && (
                      <SportWindowContent
                        sport={activeWindowSport}
                        coaches={coaches}
                        students={students}
                        payments={payments}
                        onOpenPayment={handleOpenPaymentModal}
                        onOpenNewCoach={handleOpenNewCoach}
                        onOpenNewStudent={handleOpenNewStudent}
                        onUpdateSalaryRate={updateCoachSalaryRate}
                        isCompact={true}
                      />
                    )}
                  </div>

                  {/* 2-OYNA */}
                  <div className="bg-white rounded-[32px] p-6 border-2 border-[#FF5B26]/20 shadow-lg">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0C1E34] bg-gray-100 px-2.5 py-1 rounded-md">
                        2-Oyna: {splitSecondSport.name}
                      </span>
                      <button
                        onClick={() => handleCloseSportWindow(splitSecondSport.slug)}
                        className="text-xs text-gray-400 hover:text-rose-600 font-bold"
                      >
                        Yopish ✕
                      </button>
                    </div>
                    <SportWindowContent
                      sport={splitSecondSport}
                      coaches={coaches}
                      students={students}
                      payments={payments}
                      onOpenPayment={handleOpenPaymentModal}
                      onOpenNewCoach={handleOpenNewCoach}
                      onOpenNewStudent={handleOpenNewStudent}
                      onUpdateSalaryRate={updateCoachSalaryRate}
                      isCompact={true}
                    />
                  </div>
                </div>
              ) : (
                /* YAKKA OYNA (SINGLE WINDOW) KO'RINISHI */
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-sm">
                  {activeWindowSport && (
                    <SportWindowContent
                      sport={activeWindowSport}
                      coaches={coaches}
                      students={students}
                      payments={payments}
                      onOpenPayment={handleOpenPaymentModal}
                      onOpenNewCoach={handleOpenNewCoach}
                      onOpenNewStudent={handleOpenNewStudent}
                      onUpdateSalaryRate={updateCoachSalaryRate}
                      isCompact={false}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PASTKI FLOATING TASKBAR / DOCK (OYNALAR MINIMIZE BO'LGANDA YOKI OCHIQDA) */}
      {/* ========================================================================= */}
      {openWindows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0C1E34]/95 backdrop-blur-md text-white px-5 py-3 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-[95vw] overflow-x-auto">
          <div className="flex items-center gap-2 pr-3 border-r border-white/20 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-200">
              Ochiq Mashg‘ulotlar ({openWindows.length}):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {openWindows.map((slug) => {
              const sp = sports.find((s) => s.slug === slug);
              if (!sp) return null;
              const isActive = activeWindowSlug === slug && !isWindowMinimized;

              return (
                <button
                  key={slug}
                  onClick={() => {
                    setActiveWindowSlug(slug);
                    setIsWindowMinimized(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF5B26] text-white shadow-md ring-2 ring-white/30 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  <span>{sp.icon}</span>
                  <span>{sp.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/20 flex-shrink-0">
            {isWindowMinimized ? (
              <button
                onClick={() => setIsWindowMinimized(false)}
                className="bg-[#FF5B26] hover:bg-[#e04f20] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Oynani Ko‘rsatish ↗
              </button>
            ) : (
              <button
                onClick={handleCloseAllWindows}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
              >
                Hammasini yopish ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALLAR: TO'LOV, KVITANSIYA, YANGI O'QUVCHI, YANGI USTOZ, SPORT        */}
      {/* ========================================================================= */}

      {/* A. TEZKOR TO'LOV QABUL QILISH MODALI */}
      {paymentModalOpen && targetStudent && targetSport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5B26]/10 text-[#FF5B26] flex items-center justify-center text-xl font-bold">
                💳
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0C1E34]">To‘lov Qabul Qilish</h3>
                <p className="text-xs text-gray-500">
                  {targetSport.name} bo‘limi • Ustoz: {targetCoach?.fullName || 'Murabbiy'}
                </p>
              </div>
            </div>

            {/* O'quvchi Tafsiloti */}
            <div className="bg-gray-50 rounded-2xl p-3.5 mb-5 border border-gray-200/80 flex items-center gap-3">
              <img
                src={targetStudent.photo}
                alt={targetStudent.fullName}
                className="w-11 h-11 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-gray-500">O‘quvchi:</p>
                <p className="text-sm font-extrabold text-[#0C1E34]">
                  {targetStudent.fullName}
                </p>
                <p className="text-[11px] text-gray-500">{targetStudent.groupName}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  To‘lov Summasi (so‘m)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-base font-black text-[#0C1E34] outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
                <div className="flex items-center gap-2 mt-2">
                  {[400000, 500000, 600000].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setPaymentAmount(preset)}
                      className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  To‘lov Usuli
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Cash', label: 'Naqd pul', icon: '💵' },
                    { key: 'Credit Card', label: 'Karta', icon: '💳' },
                    { key: 'Stripe', label: 'Click/Payme', icon: '📱' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === m.key
                          ? 'bg-[#0C1E34] text-white border-[#0C1E34] font-black shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <div className="text-base mb-0.5">{m.icon}</div>
                      <span className="text-[11px] block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  To‘lov Maqsadi / Izoh
                </label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Ushbu to‘lovdan <b>{targetCoach?.salaryRate || 40}%</b> stavka bo‘yicha ustoz{' '}
                  <b>{targetCoach?.fullName}</b>ning oyligiga darhol qo‘shiladi!
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  To‘lovni Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. TO'LOV KVITANSIYASI MODALI */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setReceiptData(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-gray-200">
              <span className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center text-xl font-bold mb-2">
                ✓
              </span>
              <h3 className="text-base font-black text-[#0C1E34]">TO‘LOV KVITANSIYASI</h3>
              <p className="text-[11px] text-gray-500 font-semibold">{receiptData.invoice}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">O‘quvchi:</span>
                <span className="font-extrabold text-[#0C1E34]">{receiptData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Sport fani:</span>
                <span className="font-extrabold text-[#0C1E34]">{receiptData.sportName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Biriktirilgan ustoz:</span>
                <span className="font-extrabold text-[#0C1E34]">{receiptData.coachName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">To‘lov usuli:</span>
                <span className="font-extrabold text-[#0C1E34]">{receiptData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Sana:</span>
                <span className="font-extrabold text-[#0C1E34]">{receiptData.date}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-sm font-black text-gray-700">JAMI SUMMA:</span>
                <span className="text-lg font-black text-emerald-600">
                  {receiptData.amount.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer size={14} /> Chop etish
              </button>
              <button
                onClick={() => setReceiptData(null)}
                className="flex-1 py-2.5 bg-[#0C1E34] hover:bg-[#163154] text-white text-xs font-black uppercase rounded-xl transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. YANGI O'QUVCHI QO'SHISH MODALI */}
      {newStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setNewStudentModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-[#0C1E34] mb-1">
              Yangi O‘quvchi Qo‘shish
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Sport: <b>{modalSportForStudent?.name}</b> • Murabbiy:{' '}
              <b>{modalCoachForStudent?.fullName || 'Belgilanmagan'}</b>
            </p>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  O‘quvchining To‘liq Ismi *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Masalan: Jasur Mahmudov"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Telefon Raqami *
                </label>
                <input
                  type="tel"
                  required
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ota-onasi Ismi
                  </label>
                  <input
                    type="text"
                    value={newStudentParent}
                    onChange={(e) => setNewStudentParent(e.target.value)}
                    placeholder="Mahmud aka"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Guruh Nomi
                  </label>
                  <input
                    type="text"
                    value={newStudentGroup}
                    onChange={(e) => setNewStudentGroup(e.target.value)}
                    placeholder={`${modalSportForStudent?.name} 1-Guruh`}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewStudentModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white text-xs font-black uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. YANGI MURABBIY QO'SHISH MODALI */}
      {newCoachModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setNewCoachModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-[#0C1E34] mb-1">
              Yangi Murabbiy Biriktirish
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Sport fani: <b>{modalSportForCoach?.name}</b>
            </p>

            <form onSubmit={handleCreateCoach} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Murabbiy To‘liq Ismi *
                </label>
                <input
                  type="text"
                  required
                  value={newCoachName}
                  onChange={(e) => setNewCoachName(e.target.value)}
                  placeholder="Masalan: Rustam Qosimov"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Telefon Raqami *
                </label>
                <input
                  type="tel"
                  required
                  value={newCoachPhone}
                  onChange={(e) => setNewCoachPhone(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ixtisoslik va Unvoni
                </label>
                <input
                  type="text"
                  value={newCoachSpecialization}
                  onChange={(e) => setNewCoachSpecialization(e.target.value)}
                  placeholder={`Katta murabbiy, ${modalSportForCoach?.name} sport ustasi`}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Murabbiy Stavkasi (% foiz)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newCoachRate}
                  onChange={(e) => setNewCoachRate(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Ushbu stavka bo‘yicha o‘quvchilar to‘lovidan murabbiyning oyligi hisoblab boriladi.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewCoachModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0C1E34] hover:bg-[#163154] text-white text-xs font-black uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. YANGI SPORT FANI QO'SHISH MODALI */}
      {newSportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setNewSportModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-[#0C1E34] mb-1">
              Yangi Sport Fani Qo‘shish
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Dashboard kartalariga yangi sport turi qo‘shiladi va darhol oyna bo‘lib ochiladi
            </p>

            <form onSubmit={handleCreateSport} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Sport Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSportName}
                    onChange={(e) => setNewSportName(e.target.value)}
                    placeholder="Masalan: Shaxmat"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Emoji / Belgi
                  </label>
                  <input
                    type="text"
                    value={newSportIcon}
                    onChange={(e) => setNewSportIcon(e.target.value)}
                    placeholder="♟️"
                    className="w-full text-center bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nishon / Toifa
                  </label>
                  <input
                    type="text"
                    value={newSportBadge}
                    onChange={(e) => setNewSportBadge(e.target.value)}
                    placeholder="Aqliy sport"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Oylik Badal (so‘m)
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={newSportFee}
                    onChange={(e) => setNewSportFee(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Qisqacha Tavsif
                </label>
                <textarea
                  value={newSportDesc}
                  onChange={(e) => setNewSportDesc(e.target.value)}
                  placeholder="Sport maktabi va mashg‘ulotlari haqida qisqacha ma’lumot..."
                  rows={2}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5B26]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewSportModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white text-xs font-black uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Fanni Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

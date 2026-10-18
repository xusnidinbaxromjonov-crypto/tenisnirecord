import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Users,
  CreditCard,
  Plus,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Sparkles,
  Percent,
  Wallet,
  Clock,
  AlertCircle,
  Phone,
  X,
  Check,
  RefreshCw,
  Printer,
  ChevronRight,
  UserCheck,
  Flame,
  Dumbbell,
  Receipt,
  UserPlus,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { SportSubject, Coach, Student, PaymentRecord } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    sports,
    coaches,
    students,
    payments,
    groups,
    addSport,
    addCoach,
    addStudent,
    addPayment,
    updateCoachSalaryRate,
    resetToSampleSportsData,
    addToast,
  } = useAcademy();

  // 1. Tanlangan sport fani (Standart bo'yicha Boks yoki birinchi sport)
  const [selectedSportSlug, setSelectedSportSlug] = useState<string>(() => {
    return sports.find((s) => s.slug === 'boks')?.slug || sports[0]?.slug || 'boks';
  });

  // Hozir tanlangan sport obyekti
  const currentSport = useMemo(() => {
    return sports.find((s) => s.slug === selectedSportSlug) || sports[0];
  }, [sports, selectedSportSlug]);

  // Shu sportga tegishli murabbiylar
  const sportCoaches = useMemo(() => {
    if (!currentSport) return [];
    return coaches.filter(
      (c) =>
        c.sport?.toLowerCase() === currentSport.name.toLowerCase() ||
        c.specialization?.toLowerCase().includes(currentSport.name.toLowerCase())
    );
  }, [coaches, currentSport]);

  // 2. Tanlangan ustoz (Standart bo'yicha shu sportdagi 1-chi ustoz)
  const [selectedCoachId, setSelectedCoachId] = useState<string>('');

  // Agar tanlangan ustoz shu sportga tegishli bo'lmasa yoki bo'sh bo'lsa, 1-chi ustozni tanlash
  const activeCoach = useMemo(() => {
    if (sportCoaches.length === 0) return null;
    const found = sportCoaches.find((c) => c.id === selectedCoachId);
    return found || sportCoaches[0];
  }, [sportCoaches, selectedCoachId]);

  // Shu ustozga tegishli o'quvchilar
  const coachStudents = useMemo(() => {
    if (!activeCoach) return [];
    return students.filter(
      (s) =>
        s.coachId === activeCoach.id ||
        s.coachName?.toLowerCase() === activeCoach.fullName?.toLowerCase()
    );
  }, [students, activeCoach]);

  // Shu sport bo'yicha barcha o'quvchilar
  const allSportStudents = useMemo(() => {
    if (!currentSport) return [];
    return students.filter(
      (s) =>
        s.sport?.toLowerCase() === currentSport.name.toLowerCase() ||
        sportCoaches.some((c) => c.id === s.coachId)
    );
  }, [students, currentSport, sportCoaches]);

  // Shu ustoz shogirdlaridan jami to'langan to'lovlar
  const coachPayments = useMemo(() => {
    if (!activeCoach) return [];
    const studentIds = coachStudents.map((s) => s.id);
    return payments.filter(
      (p) =>
        p.status === 'Paid' &&
        (p.coachId === activeCoach.id || studentIds.includes(p.studentId))
    );
  }, [payments, activeCoach, coachStudents]);

  // Jami yig'ilgan to'lov summasi
  const coachTotalCollected = useMemo(() => {
    return coachPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [coachPayments]);

  // Ustozning stavka foizi (masalan 40%)
  const coachStavka = activeCoach?.salaryRate || 40;

  // Ustozning stavkadan hisoblangan sof oylik maoshi: Total Collected * (Stavka / 100)
  const calculatedSalary = Math.round(coachTotalCollected * (coachStavka / 100));

  // Akademiya / Markaz daromad ulushi: Total Collected - Calculated Salary
  const centerRevenueShare = coachTotalCollected - calculatedSalary;

  // O'quvchilarni qidirish
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const filteredCoachStudents = useMemo(() => {
    if (!studentSearchQuery) return coachStudents;
    const q = studentSearchQuery.toLowerCase();
    return coachStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.groupName.toLowerCase().includes(q)
    );
  }, [coachStudents, studentSearchQuery]);

  // --- MODALLAR HOLATI ---
  // A. Tezkor To'lov Qilish Modali
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(500000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Cash');
  const [paymentDescription, setPaymentDescription] = useState('Oylik mashg‘ulot badali');

  // B. Stavka o'zgartirish maydoni
  const [isEditingStavka, setIsEditingStavka] = useState(false);
  const [inputStavkaValue, setInputStavkaValue] = useState<number>(coachStavka);

  // C. Yangi O'quvchi Qo'shish Modali
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+998 90 ');
  const [newStudentParent, setNewStudentParent] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('+998 90 ');
  const [newStudentGroup, setNewStudentGroup] = useState('');

  // D. Yangi Murabbiy Qo'shish Modali
  const [newCoachModalOpen, setNewCoachModalOpen] = useState(false);
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachPhone, setNewCoachPhone] = useState('+998 90 ');
  const [newCoachSpecialization, setNewCoachSpecialization] = useState('');
  const [newCoachRate, setNewCoachRate] = useState<number>(40);

  // E. Yangi Sport Fani Qo'shish Modali
  const [newSportModalOpen, setNewSportModalOpen] = useState(false);
  const [newSportName, setNewSportName] = useState('');
  const [newSportIcon, setNewSportIcon] = useState('🥋');
  const [newSportBadge, setNewSportBadge] = useState('Yakkakurash');
  const [newSportFee, setNewSportFee] = useState<number>(500000);
  const [newSportDesc, setNewSportDesc] = useState('');

  // F. Chek / Kvitansiya Modali
  const [receiptData, setReceiptData] = useState<{
    studentName: string;
    coachName: string;
    sportName: string;
    amount: number;
    method: string;
    date: string;
    invoice: string;
  } | null>(null);

  // --- AMALLAR HANDLERLARI ---
  // To'lov qilish modalini ochish
  const handleOpenPaymentModal = (st: Student) => {
    setTargetStudent(st);
    setPaymentAmount(st.lastPaymentAmount || currentSport?.monthlyFee || 500000);
    setPaymentMethod('Cash');
    setPaymentDescription(`${currentSport?.name || 'Sport'} oylik dars to‘lovi`);
    setPaymentModalOpen(true);
  };

  // Yangi to'lovni tasdiqlash
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent) return;

    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addPayment({
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      studentPhoto: targetStudent.photo,
      coachId: activeCoach?.id,
      coachName: activeCoach?.fullName,
      sport: currentSport?.name,
      amount: paymentAmount,
      date: today,
      dueDate: today,
      status: 'Paid',
      paymentMethod,
      itemDescription: paymentDescription,
    });

    // Kvitansiyani ko'rsatish
    setReceiptData({
      studentName: targetStudent.fullName,
      coachName: activeCoach?.fullName || 'Murabbiy',
      sportName: currentSport?.name || 'Sport',
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

  // Stavkani saqlash
  const handleSaveStavka = (newRate: number) => {
    if (!activeCoach) return;
    updateCoachSalaryRate(activeCoach.id, newRate);
    setIsEditingStavka(false);
  };

  // Yangi o'quvchini saqlash
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoach || !currentSport) return;

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
      groupId: `grp-${currentSport.slug}-1`,
      groupName: newStudentGroup || `${currentSport.name} 1-Guruh`,
      coachId: activeCoach.id,
      coachName: activeCoach.fullName,
      sport: currentSport.name,
      registrationDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      subscriptionStatus: 'Pending',
      balance: 0,
      notes: `${currentSport.name} bo‘limiga yangi qabul qilindi`,
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

  // Yangi murabbiy qo'shish
  const handleCreateCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSport) return;

    addCoach({
      fullName: newCoachName,
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      email: `${newCoachName.toLowerCase().replace(/\s+/g, '.')}@tenisrekord.uz`,
      phone: newCoachPhone,
      specialization: newCoachSpecialization || `${currentSport.name} murabbiyi`,
      sport: currentSport.name,
      experienceYears: 5,
      certifications: [`${currentSport.name} Sport ustasi`],
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

  // Yangi sport fani qo'shish
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
    setSelectedSportSlug(slug);
    setNewSportName('');
    setNewSportDesc('');
  };

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

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* ========================================================================= */}
      {/* 1. YUQORI HEADER VA UMUMIY INDIKATORLAR                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#0C1E34] text-white flex items-center justify-center text-sm font-black shadow-md">
              ⚡
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5B26]">
              Sport Fanlari & Bo‘limlar Markazi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0C1E34] tracking-tight">
            Akademiya Fanlari & Murabbiylar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Sport fanini tanlang: o‘quvchilar ro‘yxati, oxirgi to‘lovlar, to‘lov qilish va murabbiy stavkasidan oylikni hisoblash.
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

          {/* Agar ma'lumotlar kam bo'lsa yoki qayta yuklash kerak bo'lsa */}
          <button
            onClick={resetToSampleSportsData}
            title="Namunaviy fanlar, murabbiylar va to‘lovlarni tiklash"
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Namunaviy ma’lumotlar</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DOSKADAGI KVADRATLAR: SPORT FANLARI BENTO GRID (BOKS, KURASH, TENNIS...) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#FF5B26]" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#0C1E34]">
              Mavjud Sport Fanlari ({sports.length})
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            Biror fanni bosing — pastda uning ustozlari va o‘quvchilari ochiladi 👇
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
          {sports.map((sport) => {
            const isSelected = selectedSportSlug === sport.slug;
            const stats = sportsStats[sport.slug] || {
              studentsCount: 0,
              coachesCount: 0,
              totalRevenue: 0,
            };

            return (
              <div
                key={sport.id}
                onClick={() => {
                  setSelectedSportSlug(sport.slug);
                  // Sport o'zgarganda birinchi murabbiyni tanlash
                  const matchingCoach = coaches.find(
                    (c) =>
                      c.sport?.toLowerCase() === sport.name.toLowerCase() ||
                      c.specialization?.toLowerCase().includes(sport.name.toLowerCase())
                  );
                  if (matchingCoach) {
                    setSelectedCoachId(matchingCoach.id);
                  }
                }}
                className={`relative rounded-[28px] p-5 sm:p-6 transition-all duration-300 cursor-pointer select-none group flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-[#0C1E34] text-white shadow-2xl ring-4 ring-[#FF5B26] scale-[1.02]'
                    : 'bg-white hover:bg-gray-50/80 text-[#0C1E34] border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Orqa fondagi yorqin gradient */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-30 bg-[#FF5B26]' : 'opacity-10 bg-gray-400'
                  }`}
                />

                {/* Yuqori qator: Ikonka va Nishon */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-white/10 ring-2 ring-white/20'
                          : 'bg-gray-100 ring-2 ring-gray-200/50'
                      }`}
                    >
                      {sport.icon}
                    </div>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 bg-[#FF5B26] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                        <Check size={11} /> Faol Fan
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {sport.badge}
                      </span>
                    )}
                  </div>

                  {/* Sport Nomi */}
                  <h3
                    className={`font-sport text-3xl sm:text-4xl tracking-wide uppercase leading-tight ${
                      isSelected ? 'text-white' : 'text-[#0C1E34]'
                    }`}
                  >
                    {sport.name}
                  </h3>

                  <p
                    className={`text-[11px] font-medium line-clamp-1 mt-1 ${
                      isSelected ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {sport.description}
                  </p>
                </div>

                {/* Pastki qism: Statistika (O'quvchilar & Murabbiylar & Tushum) */}
                <div
                  className={`pt-4 mt-4 border-t flex items-center justify-between ${
                    isSelected ? 'border-white/10' : 'border-gray-100'
                  }`}
                >
                  <div>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        isSelected ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    >
                      O‘quvchilar / Ustozlar
                    </p>
                    <p
                      className={`text-xs font-black mt-0.5 ${
                        isSelected ? 'text-white' : 'text-[#0C1E34]'
                      }`}
                    >
                      {stats.studentsCount} o‘quvchi • {stats.coachesCount} ustoz
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        isSelected ? 'text-[#FF5B26]' : 'text-emerald-600'
                      }`}
                    >
                      Tushum
                    </p>
                    <p
                      className={`text-xs font-black mt-0.5 ${
                        isSelected ? 'text-white' : 'text-[#0C1E34]'
                      }`}
                    >
                      {(stats.totalRevenue / 1000).toLocaleString()} ming
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CHALBOARD SKETCH PASTKI QISMI: TANLANGAN SPORT BOSHQARUV PANELI        */}
      {/*    (Ustozlar ro'yxati chapda + Ustoz oylik kalkulyatori + O'quvchilar)    */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 border border-gray-200/80 shadow-xl relative overflow-hidden">
        {/* Yuqori Sarlavha: Tanlangan Fan Banneri */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#0C1E34] text-white flex items-center justify-center text-4xl shadow-lg ring-4 ring-[#FF5B26]/30">
              {currentSport?.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5B26] bg-[#FF5B26]/10 px-2.5 py-0.5 rounded-md">
                  {currentSport?.badge}
                </span>
                <span className="text-xs text-gray-400 font-semibold">• Oylik badal: {currentSport?.monthlyFee.toLocaleString()} so‘m</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0C1E34] uppercase tracking-tight font-sport mt-0.5">
                {currentSport?.name} BO‘LIMI BOSHQARUVI
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setNewCoachModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0C1E34] hover:bg-[#163154] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ Ustoz Biriktirish</span>
            </button>
            <button
              onClick={() => {
                if (!activeCoach) {
                  addToast('error', 'Murabbiy topilmadi', 'Avval ushbu sportga kamida bitta murabbiy qo‘shing');
                  return;
                }
                setNewStudentModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Yangi O‘quvchi</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* DOSKA STRUKTURASI: CHAPDA USTOZLAR (1chi ustoz, 2chi ustoz)             */}
        {/* O'NGDA: USTOZ OYLIGI (STAVKASI) VA O'QUVCHILARNING TO'LOVLARI           */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* ===================================================================== */}
          {/* CHAP USTUN (4/12): USTOZLAR RO'YXATI                                  */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Users size={17} className="text-[#0C1E34]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0C1E34]">
                  Ustozlar Tarkibi ({sportCoaches.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 font-semibold">
                Tanlash uchun bosing 👇
              </span>
            </div>

            {sportCoaches.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                <p className="text-3xl mb-2">🥋</p>
                <p className="text-xs font-extrabold text-gray-700">
                  {currentSport?.name} uchun hali ustoz biriktirilmagan
                </p>
                <button
                  onClick={() => setNewCoachModalOpen(true)}
                  className="mt-3 text-xs text-[#FF5B26] font-black uppercase hover:underline"
                >
                  + Birinchi murabbiyni qo‘shish
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sportCoaches.map((coach, index) => {
                  const isCoachSelected = activeCoach?.id === coach.id;
                  const coachStudentCount = students.filter(
                    (s) => s.coachId === coach.id || s.coachName === coach.fullName
                  ).length;

                  return (
                    <div
                      key={coach.id}
                      onClick={() => setSelectedCoachId(coach.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden flex items-center justify-between ${
                        isCoachSelected
                          ? 'bg-[#0C1E34] text-white border-[#0C1E34] shadow-xl ring-2 ring-[#FF5B26]'
                          : 'bg-white hover:bg-gray-50 text-[#0C1E34] border-gray-200/90 shadow-2xs hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img
                            src={coach.photo}
                            alt={coach.fullName}
                            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/30 shadow-sm"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                              isCoachSelected ? 'bg-[#FF5B26]' : 'bg-gray-700'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black tracking-tight leading-snug">
                              {coach.fullName}
                            </h4>
                          </div>
                          <p
                            className={`text-[11px] font-medium leading-tight mt-0.5 line-clamp-1 ${
                              isCoachSelected ? 'text-gray-300' : 'text-gray-500'
                            }`}
                          >
                            {coach.specialization}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isCoachSelected
                                  ? 'bg-white/10 text-[#00C2FF]'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              👥 {coachStudentCount} o‘quvchi
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isCoachSelected
                                  ? 'bg-[#FF5B26] text-white'
                                  : 'bg-orange-50 text-[#FF5B26]'
                              }`}
                            >
                              📊 {coach.salaryRate || 40}% stavka
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        size={18}
                        className={`transition-transform ${
                          isCoachSelected
                            ? 'text-[#FF5B26] translate-x-1'
                            : 'text-gray-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* O'NG USTUN (8/12): USTOZ MA'LUMOTLARI, STAVKASI VA O'QUVCHILAR RO'YXATI */}
          {/* ===================================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {activeCoach ? (
              <>
                {/* 1. USTOZ MAOSH & STAVKA BLOKI (Doskadagi "вставкасини йозса ойлигини чикариб беради") */}
                <div className="bg-gradient-to-br from-[#0C1E34] to-[#142C4B] rounded-[32px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF5B26]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                  {/* Yuqori Profil & Stavka Boshqaruvi */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <img
                        src={activeCoach.photo}
                        alt={activeCoach.fullName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FF5B26] shadow-lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF5B26] text-white px-2 py-0.5 rounded-md">
                            Faol Murabbiy
                          </span>
                          <span className="text-xs text-gray-300 flex items-center gap-1 font-semibold">
                            <Phone size={12} className="text-emerald-400" />
                            {activeCoach.phone}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                          {activeCoach.fullName}
                        </h3>
                        <p className="text-xs text-gray-300 font-medium">
                          {activeCoach.specialization} • Tajriba: {activeCoach.experienceYears} yil
                        </p>
                      </div>
                    </div>

                    {/* 🔥 STAVKA SOZLASH / FOIZ KIRITISH MAYDONI ("Вставкасини йозса") */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex flex-col gap-2 min-w-[240px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 flex items-center gap-1">
                          <Percent size={12} className="text-[#FF5B26]" />
                          Ustoz Stavkasi:
                        </span>
                        <span className="text-sm font-black text-[#00C2FF]">
                          {coachStavka}%
                        </span>
                      </div>

                      {/* Stavka kiritish inputi & tezkor tugmalar */}
                      <div className="flex items-center gap-1.5">
                        {[30, 40, 50, 60].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handleSaveStavka(rate)}
                            className={`flex-1 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                              coachStavka === rate
                                ? 'bg-[#FF5B26] text-white shadow-md'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {rate}%
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={inputStavkaValue}
                          onChange={(e) => setInputStavkaValue(Number(e.target.value))}
                          placeholder="Boshqa foiz"
                          className="w-24 bg-white/20 text-white placeholder-gray-400 text-xs font-bold px-2 py-1 rounded-lg outline-none focus:ring-2 focus:ring-[#FF5B26]"
                        />
                        <button
                          onClick={() => handleSaveStavka(inputStavkaValue)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-colors cursor-pointer"
                        >
                          Saqlash
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pastki Qism: HISOBLANGAN OYLIK MAOSH KARTALARI */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                    {/* 1. Jami tushgan to'lov */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        O‘quvchilar To‘lovlari
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-white mt-1">
                        {coachTotalCollected.toLocaleString()} so‘m
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {coachStudents.length} ta o‘quvchi hisobidan
                      </p>
                    </div>

                    {/* 2. 🔥 USTOZNING HISOBLANGAN OYLIGI (Asosiy talab) */}
                    <div className="bg-emerald-950/60 rounded-2xl p-4 border-2 border-emerald-400/80 shadow-lg relative overflow-hidden group">
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Ustoz Sof Oyligi ({coachStavka}%)
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">
                        {calculatedSalary.toLocaleString()} so‘m
                      </p>
                      <p className="text-[10px] text-emerald-200/80 font-semibold mt-0.5">
                        Stavkadan hisoblangan maosh
                      </p>
                    </div>

                    {/* 3. Akademiya ulushi */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Akademiya Daromadi ({100 - coachStavka}%)
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-[#00C2FF] mt-1">
                        {centerRevenueShare.toLocaleString()} so‘m
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        Markaz sof daromad ulushi
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. O'QUVCHILAR RO'YXATI VA TO'LOV QILISH TUGMASI (Doskadagi kabi) */}
                {/* "отлари битта томонга жилиб кичкина кичкина болиб йонида оша окувчини охирги килинган толовлари билан толов килиш кнопкаси болади" */}
                <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
                  {/* Qidiruv va Sarlavha */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-extrabold text-[#0C1E34] uppercase tracking-wide">
                        {activeCoach.fullName}ning O‘quvchilari ({coachStudents.length})
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        Har bir o‘quvchining oxirgi to‘lovi va tezkor to‘lov qabul qilish tugmasi:
                      </p>
                    </div>

                    {/* Qidiruv inputi */}
                    <div className="relative min-w-[220px]">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="O‘quvchini qidirish..."
                        className="w-full bg-gray-50 border border-gray-200 pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5B26]"
                      />
                    </div>
                  </div>

                  {/* O'quvchilar ro'yxati (ixcham qatorlar / kichkina kartochkalar) */}
                  {filteredCoachStudents.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-2xl mb-1">👥</p>
                      <p className="text-xs font-bold text-gray-600">
                        Ushbu murabbiyga biriktirilgan o‘quvchilar hozircha mavjud emas.
                      </p>
                      <button
                        onClick={() => setNewStudentModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 bg-[#FF5B26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                      >
                        <Plus size={14} /> Birinchi o‘quvchini qo‘shish
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredCoachStudents.map((student) => {
                        // Oxirgi to'lov ma'lumoti
                        const lastPayment = payments.find(
                          (p) => p.studentId === student.id && p.status === 'Paid'
                        );
                        const isPaid =
                          student.lastPaymentStatus === 'Paid' || lastPayment !== undefined;
                        const paymentDate =
                          student.lastPaymentDate || lastPayment?.date || 'To‘lanmagan';
                        const paymentSum =
                          student.lastPaymentAmount || lastPayment?.amount || currentSport?.monthlyFee || 500000;
                        const paymentMethodLabel =
                          student.lastPaymentMethod ||
                          (lastPayment?.paymentMethod === 'Cash'
                            ? 'Naqd pul'
                            : lastPayment?.paymentMethod === 'Credit Card'
                            ? 'Karta'
                            : 'Payme');

                        return (
                          <div
                            key={student.id}
                            className="bg-gray-50/70 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 hover:border-gray-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                          >
                            {/* O'quvchi Tafsiloti */}
                            <div className="flex items-center gap-3">
                              <img
                                src={student.photo}
                                alt={student.fullName}
                                className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200 shadow-2xs"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs sm:text-sm font-extrabold text-[#0C1E34] leading-tight">
                                    {student.fullName}
                                  </h5>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
                                    {student.age} yosh
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mt-0.5">
                                  <span>{student.groupName}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Phone size={10} className="text-gray-400" />
                                    {student.phone}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Oxirgi To'lov Ma'lumotlari & "To'lov Qilish" Tugmasi */}
                            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200/70">
                              {/* Oxirgi to'lov bloki */}
                              <div className="text-left md:text-right">
                                <div className="flex items-center md:justify-end gap-1.5">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                      isPaid
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                  >
                                    {isPaid ? (
                                      <>
                                        <CheckCircle2 size={11} className="text-emerald-600" />
                                        To‘langan
                                      </>
                                    ) : (
                                      <>
                                        <Clock size={11} className="text-rose-600" />
                                        Kutilmoqda
                                      </>
                                    )}
                                  </span>
                                  <span className="text-xs font-black text-[#0C1E34]">
                                    {paymentSum.toLocaleString()} so‘m
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                  Sana: {paymentDate} • {paymentMethodLabel}
                                </p>
                              </div>

                              {/* 🔥 TO'LOV QILISH TUGMASI (Doskadagi kabi) */}
                              <button
                                onClick={() => handleOpenPaymentModal(student)}
                                className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer whitespace-nowrap"
                              >
                                <CreditCard size={14} />
                                <span>To‘lov qilish</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                <p className="text-4xl mb-3">🥊</p>
                <h4 className="text-base font-black text-[#0C1E34]">
                  Chap tomondagi ustozlardan birini tanlang
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Ustozga bosishingiz bilan uning o‘quvchilari va hisoblangan oylik maoshi ochiladi.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MODALLAR: TO'LOV QILISH, YANGI O'QUVCHI, YANGI USTOZ, KVITANSIYA       */}
      {/* ========================================================================= */}

      {/* A. TEZKOR TO'LOV QABUL QILISH MODALI */}
      {paymentModalOpen && targetStudent && (
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
                  {currentSport?.name} bo‘limi • Ustoz: {activeCoach?.fullName}
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
                <div className="relative">
                  <input
                    type="number"
                    step={10000}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-base font-black text-[#0C1E34] outline-none focus:ring-2 focus:ring-[#FF5B26]"
                  />
                </div>
                {/* Tezkor Summa Tugmalari */}
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

              {/* Ustoz oyligiga ta'sir haqida eslatma */}
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Ushbu to‘lovdan <b>{coachStavka}%</b> stavka bo‘yicha ustoz{' '}
                  <b>{activeCoach?.fullName}</b>ning oyligiga darhol qo‘shiladi!
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

      {/* B. TO'LOV KVITANSIYASI / CHEK MODALI */}
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
                onClick={() => {
                  window.print();
                }}
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
              Sport: <b>{currentSport?.name}</b> • Murabbiy: <b>{activeCoach?.fullName}</b>
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
                    placeholder={`${currentSport?.name} 1-Guruh`}
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
              Sport fani: <b>{currentSport?.name}</b>
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
                  placeholder={`Katta murabbiy, ${currentSport?.name} sport ustasi`}
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
              Dashboard kartalariga yangi sport turi (kvadrat) qo‘shiladi
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

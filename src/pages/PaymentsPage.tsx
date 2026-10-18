import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  FileText,
  Download,
  X,
  CreditCard,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BarChart3,
  Bell,
  Building2,
  MapPin,
  Calendar,
  Printer,
  Search,
  CheckCheck,
  Clock,
  AlertTriangle,
  Receipt,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { PaymentRecord, Student } from '../types';

type PaymentTab = 'payments' | 'reports' | 'rankings' | 'notifications' | 'academy';

export const PaymentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as PaymentTab) || 'payments';

  const setTab = (tab: PaymentTab) => {
    setSearchParams({ tab });
  };

  const {
    sports,
    coaches,
    payments,
    students,
    rankings,
    notificationCount,
    clearNotifications,
    addPayment,
    updatePaymentStatus,
    addToast,
  } = useAcademy();

  // --- TAB 1: TO'LOVLAR STATE & HANDLERS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState(500000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Cash');
  const [itemDescription, setItemDescription] = useState('Oylik mashg‘ulot to‘lovi');

  // To'lov qilmagan (Qarzdor) o'quvchilar ro'yxati
  const unpaidStudents = useMemo(() => {
    return students.filter((s) => {
      // Sport filtri
      if (selectedSport !== 'all' && s.sport?.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }
      // Qidiruv
      if (
        searchTerm &&
        !s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.phone.includes(searchTerm)
      ) {
        return false;
      }

      const hasUnpaidInvoice = payments.some(
        (p) => p.studentId === s.id && (p.status === 'Pending' || p.status === 'Overdue')
      );

      return (
        s.lastPaymentStatus === 'Pending' ||
        s.lastPaymentStatus === 'Overdue' ||
        s.subscriptionStatus === 'Pending' ||
        s.subscriptionStatus === 'Expired' ||
        s.balance < 0 ||
        hasUnpaidInvoice
      );
    });
  }, [students, payments, selectedSport, searchTerm]);

  // Jami qarz summasi
  const totalDebtSum = useMemo(() => {
    return unpaidStudents.reduce((sum: number, s: Student) => {
      const spObj = sports.find((sp) => sp.name.toLowerCase() === s.sport?.toLowerCase());
      return sum + (s.lastPaymentAmount || spObj?.monthlyFee || 500000);
    }, 0);
  }, [unpaidStudents, sports]);

  const getSportIcon = (sportName?: string) => {
    switch (sportName?.toLowerCase()) {
      case 'boks':
        return '🥊';
      case 'kurash':
        return '🥋';
      case 'tennis':
        return '🎾';
      case 'suzish':
        return '🏊‍♂️';
      case 'futbol':
        return '⚽';
      case 'taekvondo':
        return '🥋';
      case 'dzyudo':
        return '🥋';
      case 'gimnastika':
        return '🤸‍♀️';
      default:
        return '🏅';
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((pay) => {
    // Sport filtri
    if (selectedSport !== 'all') {
      const paySport = pay.sport || students.find((s) => s.id === pay.studentId)?.sport;
      if (paySport?.toLowerCase() !== selectedSport.toLowerCase()) return false;
    }

    const matchesFilter = statusFilter === 'All' || pay.status === statusFilter;
    const matchesSearch =
      pay.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.sport && pay.sport.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    const coachObj = coaches.find((c) => c.id === st?.coachId);

    addPayment({
      studentId,
      studentName: st?.fullName || 'O‘quvchi',
      studentPhoto: st?.photo,
      coachId: st?.coachId,
      coachName: st?.coachName || coachObj?.fullName,
      sport: st?.sport,
      amount,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'Paid',
      paymentMethod,
      itemDescription,
    });
    addToast('success', 'To‘lov saqlandi', `${amount.toLocaleString()} so‘m muvaffaqiyatli qabul qilindi.`);
    setIsModalOpen(false);
  };

  // Qarzdor o'quvchi uchun tezkor to'lov oynasini ochish
  const handleQuickPayForStudent = (st: Student) => {
    setStudentId(st.id);
    const spObj = sports.find((sp) => sp.name.toLowerCase() === st.sport?.toLowerCase());
    setAmount(st.lastPaymentAmount || spObj?.monthlyFee || 500000);
    setItemDescription(`${st.sport || 'Sport'} oylik dars to‘lovi`);
    setIsModalOpen(true);
  };

  // Eslatma / SMS yuborish
  const handleSendReminder = (st: Student) => {
    addToast(
      'success',
      'Eslatma yuborildi',
      `${st.fullName}ning ota-onasi (${st.parentName || 'Ota-onasi'}: ${st.parentPhone || st.phone})ga to‘lov eslatmasi jo‘natildi.`
    );
  };

  const getStatusUz = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'Paid':
        return 'To‘langan';
      case 'Pending':
        return 'Kutilmoqda';
      case 'Overdue':
        return 'Muddati o‘tgan';
      case 'Partially Paid':
        return 'Qisman to‘langan';
      default:
        return status;
    }
  };

  const getMethodUz = (method: PaymentRecord['paymentMethod']) => {
    switch (method) {
      case 'Credit Card':
        return 'Bank kartasi (Uzcard / Humo)';
      case 'Bank Transfer':
        return 'Bank o‘tkazmasi';
      case 'Cash':
        return 'Naqd pul';
      case 'Stripe':
        return 'Onlayn to‘lov (Payme / Click)';
      default:
        return method;
    }
  };

  // --- TAB 2: HISOBOTLAR MOLIYAVIY MA'LUMOTLARI ---
  const monthlyFinanceData = [
    { oy: 'May', kirim: 3200000, chiqim: 1800000 },
    { oy: 'Iyun', kirim: 4100000, chiqim: 2100000 },
    { oy: 'Iyul', kirim: 4800000, chiqim: 2400000 },
    { oy: 'Avg', kirim: 5300000, chiqim: 2600000 },
    { oy: 'Sen', kirim: 6200000, chiqim: 3100000 },
    { oy: 'Okt', kirim: totalCollected || 7400000, chiqim: 3400000 },
  ];

  const attendanceData = [
    { guruh: 'Boshlang‘ich U12', foiz: 94 },
    { guruh: 'Professional U18', foiz: 98 },
    { guruh: 'Kattalar Havaskor', foiz: 88 },
    { guruh: 'Individual darslar', foiz: 100 },
  ];

  // --- TAB 3: REYTINGLAR FILTERI ---
  const [rankingCategory, setRankingCategory] = useState<string>('All');
  const filteredRankings = rankings.filter((r) =>
    rankingCategory === 'All' ? true : r.category.includes(rankingCategory)
  );

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <PageHeader
        title="To‘lovlar, Moliya va Boshqaruv Markazi"
        subtitle="To‘lovlar kassa amallari, tahliliy hisobotlar, rasmiy o‘yinchilar reytingi, bildirishnomalar hamda akademiya ma’lumotlari."
        badge={`${totalCollected.toLocaleString()} so‘m jami tushum`}
        actions={
          currentTab === 'payments' ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white pl-5 pr-2 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span>Yangi To‘lov Kiritish</span>
              <span className="w-7 h-7 rounded-full bg-white text-[#FF5B26] flex items-center justify-center font-bold text-sm shadow-sm">
                +
              </span>
            </button>
          ) : currentTab === 'reports' ? (
            <button
              onClick={() => {
                addToast('success', 'Eksport qilindi', 'Barcha moliyaviy hisobotlar PDF formatida yuklandi.');
              }}
              className="inline-flex items-center gap-2 bg-[#0C1E34] hover:bg-[#1a385f] text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Download size={15} /> Barcha Hisobotlarni Yuklash
            </button>
          ) : currentTab === 'notifications' && notificationCount > 0 ? (
            <button
              onClick={clearNotifications}
              className="inline-flex items-center gap-2 bg-[#0C1E34] hover:bg-[#1a385f] text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <CheckCheck size={15} /> Barchasini O‘qilgan Deb Belgilash
            </button>
          ) : null
        }
      />

      {/* 🧭 FLONEA USLUBIDAGI PILL TABS NAVIGATSIYASI */}
      <div className="bg-white p-2 rounded-full border border-gray-200/80 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setTab('payments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
            currentTab === 'payments'
              ? 'bg-[#0C1E34] text-white shadow-md'
              : 'text-gray-500 hover:text-[#0C1E34] hover:bg-gray-100'
          }`}
        >
          <CreditCard size={15} className={currentTab === 'payments' ? 'text-[#FF5B26]' : ''} />
          <span>To‘lovlar & Kassa</span>
        </button>

        <button
          onClick={() => setTab('reports')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
            currentTab === 'reports'
              ? 'bg-[#0C1E34] text-white shadow-md'
              : 'text-gray-500 hover:text-[#0C1E34] hover:bg-gray-100'
          }`}
        >
          <BarChart3 size={15} className={currentTab === 'reports' ? 'text-[#00C2FF]' : ''} />
          <span>Hisobotlar</span>
        </button>

        <button
          onClick={() => setTab('rankings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
            currentTab === 'rankings'
              ? 'bg-[#0C1E34] text-white shadow-md'
              : 'text-gray-500 hover:text-[#0C1E34] hover:bg-gray-100'
          }`}
        >
          <Award size={15} className={currentTab === 'rankings' ? 'text-[#FFE799]' : ''} />
          <span>Reytinglar</span>
        </button>

        <button
          onClick={() => setTab('notifications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 relative cursor-pointer ${
            currentTab === 'notifications'
              ? 'bg-[#0C1E34] text-white shadow-md'
              : 'text-gray-500 hover:text-[#0C1E34] hover:bg-gray-100'
          }`}
        >
          <Bell size={15} className={currentTab === 'notifications' ? 'text-[#FF5B26]' : ''} />
          <span>Bildirishnomalar</span>
          {notificationCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FF5B26] text-white text-[9px] font-black flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('academy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
            currentTab === 'academy'
              ? 'bg-[#0C1E34] text-white shadow-md'
              : 'text-gray-500 hover:text-[#0C1E34] hover:bg-gray-100'
          }`}
        >
          <Building2 size={15} className={currentTab === 'academy' ? 'text-[#00C2FF]' : ''} />
          <span>Akademiya</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. TO'LOVLAR BO'LIMI                                     */}
      {/* ======================================================== */}
      {currentTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Moliyaviy KPI kartalari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Jami Qabul Qilingan Mablag‘
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900">
                  {totalCollected.toLocaleString()} <span className="text-xs font-normal">so‘m</span>
                </span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  G‘aznaga tushdi
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Karta, naqd va to‘lov tizimlari orqali</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kutilayotgan / Qarzdorlik
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#F07835]">
                  {totalPending.toLocaleString()} <span className="text-xs font-normal">so‘m</span>
                </span>
                <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                  Eslatma yuborish
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">O‘quvchilar hisobidagi to‘lanmagan qarz</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Faol Hisob-Fakturalar
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900">{payments.length} ta</span>
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  100% Shaffof
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Barcha generatsiya qilingan kvitansiyalar</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Qarzdor O‘quvchilar
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-600">
                  {students.filter((s) => s.balance < 0).length} nafar
                </span>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                  Nazoratda
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Balansi manfiy bo‘lgan talabalar</p>
            </div>
          </div>

          {/* 🏅 FANLAR BO'YICHA FILTER PANELI */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider px-2 whitespace-nowrap">
              Fanlar:
            </span>
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedSport === 'all'
                  ? 'bg-[#0C1E34] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>🏆 Barcha Fanlar</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-current font-bold">
                {payments.length}
              </span>
            </button>
            {sports.map((sp) => {
              const spPaymentsCount = payments.filter(
                (p) =>
                  p.sport?.toLowerCase() === sp.name.toLowerCase() ||
                  students.find((s) => s.id === p.studentId)?.sport?.toLowerCase() === sp.name.toLowerCase()
              ).length;
              const spUnpaidCount = unpaidStudents.filter(
                (s) => s.sport?.toLowerCase() === sp.name.toLowerCase()
              ).length;
              const isSelected = selectedSport.toLowerCase() === sp.name.toLowerCase();

              return (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSport(sp.name)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF5B26] text-white shadow-md scale-102'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                  }`}
                >
                  <span className="text-sm">{sp.icon || getSportIcon(sp.name)}</span>
                  <span>{sp.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {spPaymentsCount}
                  </span>
                  {spUnpaidCount > 0 && (
                    <span
                      title="Qarzdor o‘quvchilar soni"
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-white text-[#FF5B26]' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {spUnpaidCount} qarz
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ⚠️ TO'LOV QILMAGAN O'QUVCHILAR & QARZDORLIK NAZORATI */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 m-0 flex items-center gap-2">
                    <span>To‘lov Qilmagan O‘quvchilar (Qarzdorlar Ro‘yxati)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                      {unpaidStudents.length} nafar
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-600 m-0">
                    Oylik mashg‘ulot to‘lov muddati o‘tgan yoki kutilayotgan o‘quvchilar. Jami qarz:{' '}
                    <span className="font-black text-rose-600 text-xs">
                      {totalDebtSum.toLocaleString()} so‘m
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    unpaidStudents.forEach((st) => handleSendReminder(st));
                    addToast(
                      'success',
                      'Barcha o‘quvchilarga yuborildi',
                      `${unpaidStudents.length} nafar o‘quvchi ota-onasiga to‘lov eslatmasi SMS tarzida jo‘natildi.`
                    );
                  }}
                  disabled={unpaidStudents.length === 0}
                  className="px-3.5 py-2 bg-[#0C1E34] hover:bg-[#1a385f] disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Bell size={14} className="text-[#FF5B26]" />
                  <span>Barchasiga SMS Eslatma</span>
                </button>
              </div>
            </div>

            {unpaidStudents.length > 0 ? (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {unpaidStudents.map((st) => {
                  const spObj = sports.find((sp) => sp.name.toLowerCase() === st.sport?.toLowerCase());
                  const coachObj = coaches.find((c) => c.id === st.coachId);
                  const fee = st.lastPaymentAmount || spObj?.monthlyFee || 500000;
                  const isOverdue = st.lastPaymentStatus === 'Overdue' || st.balance < 0;

                  return (
                    <div
                      key={st.id}
                      className="bg-white rounded-xl p-3.5 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={
                              st.photo ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
                            }
                            alt={st.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate m-0">
                              {st.fullName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#0C1E34] text-white">
                                {getSportIcon(st.sport)} {st.sport || 'Sport'}
                              </span>
                              <span className="text-[10px] text-gray-400 truncate">
                                {st.groupName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isOverdue ? 'Muddati o‘tgan' : 'Kutilmoqda'}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-lg space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Murabbiy:</span>
                          <span className="font-bold text-gray-700 truncate max-w-[140px]">
                            {st.coachName || coachObj?.fullName || 'Belgilanmagan'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Oylik to‘lov:</span>
                          <span className="font-black text-rose-600">
                            {fee.toLocaleString()} so‘m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Oxirgi to‘lov sanasi:</span>
                          <span className="font-medium text-gray-600">
                            {st.lastPaymentDate || 'Hali to‘lanmagan'}
                          </span>
                        </div>
                        {st.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Telefon:</span>
                            <span className="font-mono text-gray-700">{st.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleSendReminder(st)}
                          className="py-1.5 px-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-bold text-[11px] text-gray-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Bell size={12} /> SMS Eslatma
                        </button>
                        <button
                          onClick={() => handleQuickPayForStudent(st)}
                          className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-black text-[11px] text-white flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                        >
                          <CreditCard size={12} /> To‘lov Olish
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-emerald-50/40">
                <CheckCircle className="mx-auto text-emerald-600 mb-2" size={32} />
                <h4 className="font-bold text-gray-900 text-sm">
                  To‘lov qilmagan o‘quvchilar topilmadi!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Barcha o‘quvchilar tanlangan sport fani bo‘yicha to‘lovlarni to‘liq amalga oshirgan.
                </p>
              </div>
            )}
          </div>

          {/* Qidiruv va Filterlar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500">Holat:</span>
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#0C1E34] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {st === 'All'
                      ? 'Barchasi'
                      : st === 'Paid'
                      ? 'To‘langan'
                      : st === 'Pending'
                      ? 'Kutilmoqda'
                      : 'Muddati o‘tgan'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="O‘quvchi, sport, invoys yoki ta’rif bo‘yicha izlash..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] outline-none"
              />
            </div>
          </div>

          {/* Hisob-fakturalar jadvali */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 m-0">Oylik To‘lov Amallari va Invoyslar</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Barcha fanlar va murabbiylar kesimidagi kvitansiyalar
                </p>
              </div>
              <button
                onClick={() =>
                  addToast('info', 'Eksport', 'To‘lovlar reyestri Excel jadval ko‘rinishida yuklandi.')
                }
                className="flex items-center gap-1.5 text-xs font-bold text-[#0C1E34] hover:underline cursor-pointer"
              >
                <Download size={14} /> CSV / Excel yuklab olish
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4">Invoys Raqami</th>
                    <th className="py-3.5 px-4">O‘quvchi</th>
                    <th className="py-3.5 px-4">Sport Fani</th>
                    <th className="py-3.5 px-4">Murabbiy</th>
                    <th className="py-3.5 px-4">Ta’rifi</th>
                    <th className="py-3.5 px-4">To‘lov Usuli</th>
                    <th className="py-3.5 px-4">Sana</th>
                    <th className="py-3.5 px-4">Miqdori</th>
                    <th className="py-3.5 px-4">Holati</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((pay) => {
                      const studentObj = students.find((s) => s.id === pay.studentId);
                      const displaySport = pay.sport || studentObj?.sport || 'Sport';
                      const displayCoach = pay.coachName || studentObj?.coachName || 'Murabbiy';

                      return (
                        <tr key={pay.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900 flex items-center gap-1.5">
                            <FileText size={14} className="text-[#27966B]" />
                            {pay.invoiceNumber}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-800">
                            <div className="flex items-center gap-2">
                              {pay.studentPhoto ? (
                                <img
                                  src={pay.studentPhoto}
                                  alt={pay.studentName}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-600">
                                  {pay.studentName.charAt(0)}
                                </div>
                              )}
                              <span>{pay.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#0C1E34] text-white">
                              {getSportIcon(displaySport)} {displaySport}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 font-medium">{displayCoach}</td>
                          <td className="py-3.5 px-4 text-gray-600">{pay.itemDescription}</td>
                          <td className="py-3.5 px-4 text-gray-500">{getMethodUz(pay.paymentMethod)}</td>
                          <td className="py-3.5 px-4 text-gray-500 font-medium">{pay.date}</td>
                          <td className="py-3.5 px-4 font-black text-gray-900">
                            {pay.amount.toLocaleString()} so‘m
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                const nextStatus = pay.status === 'Paid' ? 'Pending' : 'Paid';
                                updatePaymentStatus(pay.id, nextStatus);
                                addToast(
                                  'info',
                                  'Holat o‘zgardi',
                                  `${pay.invoiceNumber} holati "${getStatusUz(nextStatus)}" ga o‘zgartirildi.`
                                );
                              }}
                              title="Holatni almashtirish uchun bosing"
                              className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-all hover:scale-105 ${
                                pay.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : pay.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {getStatusUz(pay.status)}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedReceipt(pay)}
                              className="p-1.5 text-gray-500 hover:text-[#27966B] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                              title="Kvitansiyani ko‘rish"
                            >
                              <Receipt size={14} />
                              <span>Kvitansiya</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-gray-400 font-medium">
                        Qidiruv bo‘yicha to‘lovlar topilmadi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HISOBOTLAR BO'LIMI                                    */}
      {/* ======================================================== */}
      {currentTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Yuqori hisobot kartalari */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Oylik Moliyaviy Balans
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#123D32]">
                    +{totalCollected.toLocaleString()} <span className="text-xs font-normal">so‘m</span>
                  </span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Sof Foyda
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  O‘quvchilar to‘lovlari, kort ijarasi va turnir badallaridan kelib tushgan jami mablag‘.
                </p>
              </div>
              <button
                onClick={() => addToast('success', 'PDF Yuklandi', 'Oylik moliyaviy hisobot muvaffaqiyatli saqlandi.')}
                className="mt-4 px-4 py-2.5 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> PDF Yuklab olish
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  O‘quvchilar Davomat Ko‘rsatkichi
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-gray-900">95.4%</span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    A’lo Daraja
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Guruhlar va individual darslar bo‘yicha o‘quvchilarning mashg‘ulotlarga qatnashish intizomi.
                </p>
              </div>
              <button
                onClick={() => addToast('success', 'CSV Yuklandi', 'Davomat jurnali to‘liq yuklandi.')}
                className="mt-4 px-4 py-2.5 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> CSV Yuklab olish
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kortlar Bandlik Xaritasi
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-gray-900">82.0%</span>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    Yuqori Yuklama
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Kortlarning soatlar bo‘yicha bandligi, o‘tkazilgan darslar va murabbiylar soatlari hisoboti.
                </p>
              </div>
              <button
                onClick={() => addToast('success', 'PDF Yuklandi', 'Kortlar hisoboti tayyorlandi.')}
                className="mt-4 px-4 py-2.5 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> PDF Yuklab olish
              </button>
            </div>
          </div>

          {/* Dinamik Grafik: Kirim va Chiqim tahlili */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Oylik Tushumlar va Chiqimlar Dinamikasi</h3>
                  <p className="text-xs text-gray-400">So‘nggi 6 oylik moliyaviy aylanma</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  2024-yil
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="oy" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip
                      formatter={(val: any) => [`${Number(val).toLocaleString()} so‘m`, '']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="kirim" name="Kirim" fill="#27966B" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="chiqim" name="Xarajat" fill="#F07835" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Guruhlar Bo‘yicha Davomat Statistikasi</h3>
                  <p className="text-xs text-gray-400">Har bir guruhning mashg‘ulotlardagi faolligi</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Darslar
                </span>
              </div>
              <div className="space-y-4 pt-2">
                {attendanceData.map((item) => (
                  <div key={item.guruh}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-700">{item.guruh}</span>
                      <span className="text-emerald-700">{item.foiz}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#27966B] h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.foiz}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. REYTINGLAR BO'LIMI                                    */}
      {/* ======================================================== */}
      {currentTab === 'rankings' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Shohsupa: Kuchli 3 talik */}
          {rankings.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rankings.slice(0, 3).map((player, index) => (
                <div
                  key={player.playerId}
                  className={`rounded-2xl border p-6 shadow-sm relative overflow-hidden flex flex-col justify-between ${
                    index === 0
                      ? 'bg-gradient-to-b from-amber-500/10 via-white to-white border-amber-300'
                      : index === 1
                      ? 'bg-gradient-to-b from-gray-400/10 via-white to-white border-gray-300'
                      : 'bg-gradient-to-b from-amber-700/10 via-white to-white border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.photo}
                        alt={player.playerName}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900">{player.playerName}</h3>
                        <span className="text-xs text-gray-500">{player.category}</span>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-md ${
                        index === 0
                          ? 'bg-amber-500'
                          : index === 1
                          ? 'bg-slate-400'
                          : 'bg-amber-700'
                      }`}
                    >
                      #{player.rank}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400 block font-semibold">Reyting Ballari</span>
                      <span className="text-lg font-black text-emerald-800">{player.points} ball</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block font-semibold">G‘alaba / Mag‘lubiyat</span>
                      <span className="text-sm font-bold text-gray-800">
                        {player.wins}G‘ — {player.losses}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Kategoriya filtri va to'liq jadval */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 m-0">Rasmiy Elo Reyting Jadvali</h3>
              <div className="flex items-center gap-1.5">
                {(['All', 'U18', 'Kattalar'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRankingCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      rankingCategory === cat
                        ? 'bg-[#123D32] text-white'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {cat === 'All' ? 'Barchasi' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4 w-16">O‘rin</th>
                    <th className="py-3.5 px-4">O‘yinchi</th>
                    <th className="py-3.5 px-4">Kategoriya</th>
                    <th className="py-3.5 px-4">O‘yinlar</th>
                    <th className="py-3.5 px-4">G‘alabalar</th>
                    <th className="py-3.5 px-4">Mag‘lubiyat</th>
                    <th className="py-3.5 px-4">Sovrinlar</th>
                    <th className="py-3.5 px-4 text-right">Ball</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRankings.map((p) => {
                    const diff = p.previousRank - p.rank;

                    return (
                      <tr key={p.playerId} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-black text-gray-900">
                            <span>#{p.rank}</span>
                            {diff > 0 ? (
                              <TrendingUp size={13} className="text-emerald-600" />
                            ) : diff < 0 ? (
                              <TrendingDown size={13} className="text-rose-600" />
                            ) : (
                              <Minus size={13} className="text-gray-300" />
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.photo}
                              alt={p.playerName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-bold text-gray-900">{p.playerName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-medium">{p.category}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">{p.matchesPlayed}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{p.wins}</td>
                        <td className="py-3.5 px-4 text-gray-500">{p.losses}</td>
                        <td className="py-3.5 px-4 font-bold text-amber-600">
                          {p.titlesWon > 0 ? `🏆 ${p.titlesWon}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-[#123D32] text-sm">
                          {p.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. BILDIRISHNOMALAR BO'LIMI                              */}
      {/* ======================================================== */}
      {currentTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-[#27966B]" />
                Tizim va To‘lov Eslatmalari
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {notificationCount} ta yangi bildirishnoma
              </span>
            </div>

            <div className="space-y-3">
              {/* Bildirishnomalar kartalari */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123D32]">Tizim to‘liq ishga tushirildi</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Barcha to‘lovlar, hisobotlar, o‘yinchilar reytingi va akademiya ma’lumotlari muvaffaqiyatli sinxronlashtirildi.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">Hozir</span>
              </div>

              {students.some((s) => s.balance < 0) && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Muddati o‘tgan to‘lovlar mavjud</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {students.filter((s) => s.balance < 0).length} nafar o‘quvchi hisobida qarzdorlik qayd etilgan. Ularga SMS yoki to‘lov eslatmasi yuborish tavsiya etiladi.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">Bugun</span>
                </div>
              )}

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Yangi to‘lov kvitansiyalari tayyor</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Barcha amalga oshirilgan to‘lovlar hisob-fakturalari (invoices) avtomatik generatsiya qilingan.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">Kecha</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => {
                  clearNotifications();
                  addToast('info', 'Tozalandi', 'Barcha bildirishnomalar o‘qilgan deb belgilandi.');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Bildirishnomalarni tozalash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. AKADEMIYA BO'LIMI                                     */}
      {/* ======================================================== */}
      {currentTab === 'academy' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#07251E] text-[#A3E635] flex items-center justify-center font-black text-xl shadow-md">
                  ⚡
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 m-0">Tenisrekord Boshqaruv Markazi</h2>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Professional tennis ta’limi va moliyaviy muvofiqlashtirish tizimi
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed pt-2">
                Tenisrekord markazi o‘quvchilar, murabbiylar va ma’muriyat o‘rtasidagi ta’lim sifatini, to‘lovlar shaffofligini va mashg‘ulotlar intizomini ta’minlovchi zamonaviy markazdir. Tizimda har bir yosh toifasi uchun ITF xalqaro standartlari asosida dasturlar amalga oshiriladi.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Tashkil topgan</span>
                  <span className="text-base font-extrabold text-gray-900 block mt-0.5">2024-yil</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Standart</span>
                  <span className="text-base font-extrabold text-gray-900 block mt-0.5">ITF Xalqaro</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400">O‘quvchilar</span>
                  <span className="text-base font-extrabold text-[#27966B] block mt-0.5">{students.length} nafar</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Holat</span>
                  <span className="text-base font-extrabold text-[#27966B] block mt-0.5">Faol Tizim</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Akademiya Infratuzilmasi</h3>
                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-[#27966B] flex-shrink-0" />
                    Professional raketka tortish ustaxonasi (Babolat)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-[#27966B] flex-shrink-0" />
                    Video tahlil va zarbalar tezligini aniqlash laboratoriyasi
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-[#27966B] flex-shrink-0" />
                    Fizioterapiya, massaj va tiklanish zali
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-[#27966B] flex-shrink-0" />
                    Kutish zali, kofe va sport fitnes bari
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                <MapPin size={16} className="text-[#F07835] flex-shrink-0" />
                <span>Tenisrekord Sport Majmuasi, Markaziy Filial</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* YANGI TO'LOV KIRITISH MODAL OYNASI                       */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <CreditCard size={20} className="text-[#27966B]" />
                Yangi To‘lov Kiritish
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">O‘quvchini Tanlang *</label>
                <select
                  value={studentId}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    setStudentId(chosenId);
                    const chosen = students.find((s) => s.id === chosenId);
                    if (chosen) {
                      const spObj = sports.find(
                        (sp) => sp.name.toLowerCase() === chosen.sport?.toLowerCase()
                      );
                      setAmount(chosen.lastPaymentAmount || spObj?.monthlyFee || 500000);
                      setItemDescription(`${chosen.sport || 'Sport'} bo‘yicha oylik mashg‘ulot to‘lovi`);
                    }
                  }}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] outline-none font-medium"
                >
                  <option value="">O‘quvchini tanlang...</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {getSportIcon(st.sport)} {st.fullName} — {st.sport || 'Sport'} ({st.groupName})
                      {st.balance < 0 ? ' [⚠️ Qarzdor]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">To‘lov Miqdori (so‘m) *</label>
                  <div className="flex gap-1">
                    {[400000, 500000, 600000, 700000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                          amount === preset
                            ? 'bg-[#0C1E34] text-white font-bold'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {preset / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] outline-none font-black text-sm text-[#0C1E34]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">To‘lov Ta’rifi</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Masalan: Boks oylik mashg‘ulot to‘lovi"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">To‘lov Usuli</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] outline-none font-medium"
                >
                  <option value="Cash">💵 Naqd pul</option>
                  <option value="Credit Card">💳 Bank kartasi (Uzcard / Humo)</option>
                  <option value="Stripe">📱 Onlayn to‘lov (Payme / Click)</option>
                  <option value="Bank Transfer">🏦 Bank o‘tkazmasi</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF5B26] hover:bg-[#e04f20] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  To‘lovni Qayd Etish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* KVITANSIYA KO'RISH MODAL OYNASI                          */}
      {/* ======================================================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                To‘lov Kvitansiyasi
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 text-center pb-4 border-b border-dashed border-gray-200">
              <div className="w-10 h-10 rounded-full bg-[#A3E635] text-[#07251E] flex items-center justify-center font-black mx-auto mb-2">
                ⚡
              </div>
              <h4 className="font-black text-gray-900 text-sm">Tenisrekord Majmuasi</h4>
              <p className="text-[11px] text-gray-400">Invoys: {selectedReceipt.invoiceNumber}</p>
              <div className="text-2xl font-black text-gray-900 mt-2">
                {selectedReceipt.amount.toLocaleString()} so‘m
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {getStatusUz(selectedReceipt.status)}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">O‘quvchi:</span>
                <span className="font-bold text-gray-800">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">To‘lov sanasi:</span>
                <span className="font-medium text-gray-700">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">To‘lov usuli:</span>
                <span className="font-medium text-gray-700">{getMethodUz(selectedReceipt.paymentMethod)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Ta’rifi:</span>
                <span className="font-medium text-gray-700">{selectedReceipt.itemDescription}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 bg-[#123D32] hover:bg-[#1A5345] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer size={15} /> Chop etish / Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

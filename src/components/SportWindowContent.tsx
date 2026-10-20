import React, { useState, useMemo } from 'react';
import {
  Users,
  Percent,
  Phone,
  Search,
  CreditCard,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  UserPlus,
} from 'lucide-react';
import { SportSubject, Coach, Student, PaymentRecord } from '../types';

interface SportWindowContentProps {
  sport: SportSubject;
  coaches: Coach[];
  students: Student[];
  payments: PaymentRecord[];
  onOpenPayment: (student: Student, coach: Coach | null, sport: SportSubject) => void;
  onOpenNewCoach: (sport: SportSubject) => void;
  onOpenNewStudent: (sport: SportSubject, coach: Coach | null) => void;
  onUpdateSalaryRate: (coachId: string, newRate: number) => void;
  isCompact?: boolean;
}

export const SportWindowContent: React.FC<SportWindowContentProps> = ({
  sport,
  coaches,
  students,
  payments,
  onOpenPayment,
  onOpenNewCoach,
  onOpenNewStudent,
  onUpdateSalaryRate,
  isCompact = false,
}) => {
  // Ushbu sportga tegishli murabbiylar
  const sportCoaches = useMemo(() => {
    return coaches.filter(
      (c) =>
        c.sport?.toLowerCase() === sport.name.toLowerCase() ||
        c.specialization?.toLowerCase().includes(sport.name.toLowerCase())
    );
  }, [coaches, sport]);

  // Tanlangan murabbiy
  const [selectedCoachId, setSelectedCoachId] = useState<string>(() => {
    return sportCoaches[0]?.id || '';
  });

  const activeCoach = useMemo(() => {
    if (sportCoaches.length === 0) return null;
    const found = sportCoaches.find((c) => c.id === selectedCoachId);
    return found || sportCoaches[0];
  }, [sportCoaches, selectedCoachId]);

  // Shu murabbiy o'quvchilari
  const coachStudents = useMemo(() => {
    if (!activeCoach) return [];
    return students.filter(
      (s) =>
        s.coachId === activeCoach.id ||
        s.coachName?.toLowerCase() === activeCoach.fullName?.toLowerCase()
    );
  }, [students, activeCoach]);

  // Shu murabbiy shogirdlaridan jami to'langan to'lovlar
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

  // Ustoz stavkasi
  const coachStavka = activeCoach?.salaryRate || 40;
  const [inputStavkaValue, setInputStavkaValue] = useState<number>(coachStavka);

  // Hisoblangan maosh va markaz ulushi
  const calculatedSalary = Math.round(coachTotalCollected * (coachStavka / 100));
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

  const handleSaveStavka = (rate: number) => {
    if (!activeCoach) return;
    onUpdateSalaryRate(activeCoach.id, rate);
  };

  return (
    <div className="space-y-6">
      {/* 1. SPORT SARI VA AMALLAR HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#0C1E34] text-white flex items-center justify-center text-3xl shadow-md ring-3 ring-[#FF5B26]/30 flex-shrink-0">
            {sport.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5B26] bg-[#FF5B26]/10 px-2.5 py-0.5 rounded-md">
                {sport.badge}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                • Oylik badal: {sport.monthlyFee.toLocaleString()} so‘m
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0C1E34] uppercase tracking-tight font-sport mt-0.5">
              {sport.name} BO‘LIMI & MASHG‘ULOTLARI
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenNewCoach(sport)}
            className="inline-flex items-center gap-1.5 bg-[#0C1E34] hover:bg-[#163154] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <UserPlus size={14} />
            <span>+ Ustoz Biriktirish</span>
          </button>
          <button
            onClick={() => onOpenNewStudent(sport, activeCoach)}
            className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Yangi O‘quvchi</span>
          </button>
        </div>
      </div>

      {/* 2. ASOSIY STRUKTURA: USTOZLAR RO'YXATI + USTOZ MAOSHI & O'QUVCHILAR */}
      <div
        className={`grid gap-6 items-start ${
          isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
        }`}
      >
        {/* CHAP / BIRINCHI USTUN: USTOZLAR */}
        <div className={isCompact ? 'space-y-3' : 'lg:col-span-4 space-y-3'}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#0C1E34]" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0C1E34]">
                Ustozlar Tarkibi ({sportCoaches.length})
              </h4>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">Tanlang 👇</span>
          </div>

          {sportCoaches.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-1">{sport.icon}</p>
              <p className="text-xs font-bold text-gray-700">
                {sport.name} uchun hali ustoz biriktirilmagan
              </p>
              <button
                onClick={() => onOpenNewCoach(sport)}
                className="mt-2 text-xs text-[#FF5B26] font-black uppercase hover:underline"
              >
                + Birinchi murabbiyni qo‘shish
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sportCoaches.map((coach, idx) => {
                const isSelected = activeCoach?.id === coach.id;
                const coachStudentCount = students.filter(
                  (s) => s.coachId === coach.id || s.coachName === coach.fullName
                ).length;

                return (
                  <div
                    key={coach.id}
                    onClick={() => setSelectedCoachId(coach.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0C1E34] text-white border-[#0C1E34] shadow-md ring-2 ring-[#FF5B26]'
                        : 'bg-white hover:bg-gray-50 text-[#0C1E34] border-gray-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={coach.photo}
                          alt={coach.fullName}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white ${
                            isSelected ? 'bg-[#FF5B26]' : 'bg-gray-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h5 className="text-xs font-black tracking-tight truncate leading-tight">
                          {coach.fullName}
                        </h5>
                        <p
                          className={`text-[10px] font-medium truncate mt-0.5 ${
                            isSelected ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {coach.specialization}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-white/10 text-[#00C2FF]'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            👥 {coachStudentCount} o‘quvchi
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
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
                      size={16}
                      className={isSelected ? 'text-[#FF5B26]' : 'text-gray-300'}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* O'NG USTUN: USTOZ OYLIK KALKULYATORI VA O'QUVCHILAR RO'YXATI */}
        <div className={isCompact ? 'space-y-5' : 'lg:col-span-8 space-y-5'}>
          {activeCoach ? (
            <>
              {/* USTOZ MAOSH & STAVKA BLOKI */}
              <div className="bg-gradient-to-br from-[#0C1E34] to-[#142C4B] rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5B26]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={activeCoach.photo}
                      alt={activeCoach.fullName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#FF5B26] shadow-md flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF5B26] text-white px-2 py-0.5 rounded">
                          Faol Murabbiy
                        </span>
                        <span className="text-xs text-gray-300 flex items-center gap-1 font-semibold">
                          <Phone size={11} className="text-emerald-400" />
                          {activeCoach.phone}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-white mt-0.5">
                        {activeCoach.fullName}
                      </h4>
                      <p className="text-[11px] text-gray-300 font-medium">
                        {activeCoach.specialization} • Tajriba: {activeCoach.experienceYears} yil
                      </p>
                    </div>
                  </div>

                  {/* STAVKA FOIZI SOZLASH */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex flex-col gap-1.5 min-w-[210px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 flex items-center gap-1">
                        <Percent size={11} className="text-[#FF5B26]" />
                        Ustoz Stavkasi:
                      </span>
                      <span className="text-xs font-black text-[#00C2FF]">
                        {coachStavka}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[30, 40, 50, 60].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSaveStavka(rate)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                            coachStavka === rate
                              ? 'bg-[#FF5B26] text-white shadow-xs'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={inputStavkaValue}
                        onChange={(e) => setInputStavkaValue(Number(e.target.value))}
                        placeholder="Foiz"
                        className="w-16 bg-white/20 text-white placeholder-gray-400 text-xs font-bold px-2 py-0.5 rounded outline-none focus:ring-1 focus:ring-[#FF5B26]"
                      />
                      <button
                        onClick={() => handleSaveStavka(inputStavkaValue)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[9px] font-black uppercase transition-colors cursor-pointer"
                      >
                        Saqlash
                      </button>
                    </div>
                  </div>
                </div>

                {/* HISOBLANGAN OYLIK MAOSH BLOKI */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      O‘quvchilar To‘lovlari
                    </span>
                    <p className="text-base sm:text-lg font-black text-white mt-0.5">
                      {coachTotalCollected.toLocaleString()} so‘m
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">
                      {coachStudents.length} ta o‘quvchi hisobidan
                    </p>
                  </div>

                  <div className="bg-emerald-950/60 rounded-xl p-3 border-2 border-emerald-400/80 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300">
                        Ustoz Sof Oyligi ({coachStavka}%)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-black">✓</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-emerald-300 mt-0.5">
                      {calculatedSalary.toLocaleString()} so‘m
                    </p>
                    <p className="text-[9px] text-emerald-200/80 font-semibold">
                      Stavkadan hisoblangan maosh
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      Akademiya Daromadi ({100 - coachStavka}%)
                    </span>
                    <p className="text-base sm:text-lg font-black text-[#00C2FF] mt-0.5">
                      {centerRevenueShare.toLocaleString()} so‘m
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">
                      Markaz sof daromad ulushi
                    </p>
                  </div>
                </div>
              </div>

              {/* O'QUVCHILAR RO'YXATI VA TO'LOV QILISH TUGMASI */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h5 className="text-sm font-extrabold text-[#0C1E34] uppercase tracking-wide">
                      {activeCoach.fullName}ning O‘quvchilari ({coachStudents.length})
                    </h5>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Har bir o‘quvchining oxirgi to‘lovi va tezkor to‘lov qabul qilish:
                    </p>
                  </div>

                  <div className="relative min-w-[200px]">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="O‘quvchini qidirish..."
                      className="w-full bg-gray-50 border border-gray-200 pl-8 pr-3 py-1.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5B26]"
                    />
                  </div>
                </div>

                {filteredCoachStudents.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xl mb-1">👥</p>
                    <p className="text-xs font-bold text-gray-600">
                      Ushbu murabbiyga biriktirilgan o‘quvchilar hozircha mavjud emas.
                    </p>
                    <button
                      onClick={() => onOpenNewStudent(sport, activeCoach)}
                      className="mt-2.5 inline-flex items-center gap-1 bg-[#FF5B26] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Plus size={13} /> Birinchi o‘quvchini qo‘shish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCoachStudents.map((student) => {
                      const lastPayment = payments.find(
                        (p) => p.studentId === student.id && p.status === 'Paid'
                      );
                      const isPaid =
                        student.lastPaymentStatus === 'Paid' || lastPayment !== undefined;
                      const paymentDate =
                        student.lastPaymentDate || lastPayment?.date || 'To‘lanmagan';
                      const paymentSum =
                        student.lastPaymentAmount ||
                        lastPayment?.amount ||
                        sport.monthlyFee ||
                        500000;
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
                          className="bg-gray-50/70 hover:bg-white p-3 rounded-2xl border border-gray-200/90 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={student.photo}
                              alt={student.fullName}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 flex-shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h6 className="text-xs sm:text-sm font-extrabold text-[#0C1E34] leading-tight">
                                  {student.fullName}
                                </h6>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                                  {student.age} yosh
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium mt-0.5">
                                <span>{student.groupName}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <Phone size={9} className="text-gray-400" />
                                  {student.phone}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200/60">
                            <div className="text-left md:text-right">
                              <div className="flex items-center md:justify-end gap-1">
                                <span
                                  className={`inline-flex items-center gap-0.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    isPaid
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {isPaid ? (
                                    <>
                                      <CheckCircle2 size={10} className="text-emerald-600" />
                                      To‘langan
                                    </>
                                  ) : (
                                    <>
                                      <Clock size={10} className="text-rose-600" />
                                      Kutilmoqda
                                    </>
                                  )}
                                </span>
                                <span className="text-xs font-black text-[#0C1E34]">
                                  {paymentSum.toLocaleString()} so‘m
                                </span>
                              </div>
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                {paymentDate} • {paymentMethodLabel}
                              </p>
                            </div>

                            <button
                              onClick={() => onOpenPayment(student, activeCoach, sport)}
                              className="inline-flex items-center gap-1 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-xs hover:scale-105 cursor-pointer whitespace-nowrap"
                            >
                              <CreditCard size={13} />
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
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
              <p className="text-3xl mb-2">{sport.icon}</p>
              <h5 className="text-sm font-black text-[#0C1E34]">
                Ustozlardan birini tanlang yoki yangi ustoz qo‘shing
              </h5>
              <button
                onClick={() => onOpenNewCoach(sport)}
                className="mt-3 inline-flex items-center gap-1.5 bg-[#FF5B26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <UserPlus size={14} /> + Ustoz Biriktirish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

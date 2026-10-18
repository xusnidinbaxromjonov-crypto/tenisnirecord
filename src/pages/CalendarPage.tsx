import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Users,
  MapPin,
  AlertCircle,
  X,
  Check,
  Trash2,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { LessonEvent, LessonType } from '../types';

export const CalendarPage: React.FC = () => {
  const {
    lessons,
    courts,
    coaches,
    groups,
    addLesson,
    cancelLesson,
  } = useAcademy();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');

  // Filtrlar
  const [selectedCoach, setSelectedCoach] = useState<string>('all');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modallar
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Yangi mashg'ulot formasi
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<LessonType>('Regular Training');
  const [formCourtId, setFormCourtId] = useState(courts[0]?.id || '');
  const [formCoachId, setFormCoachId] = useState(coaches[0]?.id || '');
  const [formGroupId, setFormGroupId] = useState(groups[0]?.id || '');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('10:00');
  const [formEndTime, setFormEndTime] = useState('11:30');
  const [formMaxParticipants, setFormMaxParticipants] = useState(8);
  const [formNotes, setFormNotes] = useState('');

  // Filtrlangan darslar
  const filteredLessons = useMemo(() => {
    return lessons.filter((les) => {
      if (selectedCoach !== 'all' && les.coachId !== selectedCoach) return false;
      if (selectedCourt !== 'all' && les.courtId !== selectedCourt) return false;
      if (selectedType !== 'all' && les.type !== selectedType) return false;
      if (
        searchTerm &&
        !les.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !les.coachName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !les.courtName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [lessons, selectedCoach, selectedCourt, selectedType, searchTerm]);

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const firstDay = curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr);
      d.setDate(firstDay + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const formatDateISO = (d: Date) => d.toISOString().split('T')[0];

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const courtObj = courts.find((c) => c.id === formCourtId);
    const coachObj = coaches.find((c) => c.id === formCoachId);
    const groupObj = groups.find((g) => g.id === formGroupId);

    if (formStartTime >= formEndTime) {
      setConflictError('Dars boshlanish vaqti tugash vaqtidan oldin bo‘lishi kerak.');
      return;
    }

    const res = addLesson({
      title: formTitle,
      type: formType,
      courtId: formCourtId,
      courtName: courtObj?.name || 'Kort',
      coachId: formCoachId,
      coachName: coachObj?.fullName || 'Ustoz',
      groupId: formType === 'Private Lesson' ? undefined : formGroupId,
      groupName: formType === 'Private Lesson' ? undefined : groupObj?.name,
      studentNames: formType === 'Private Lesson' ? ['Yakka tartibdagi o‘quvchi'] : [],
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      participantsCount: formType === 'Private Lesson' ? 1 : 4,
      maxParticipants: formMaxParticipants,
      status: 'Scheduled',
      notes: formNotes,
    });

    if (!res.success) {
      setConflictError(res.error || 'Vaqt to‘qnashuvi aniqlandi');
    } else {
      setIsCreateModalOpen(false);
      setFormTitle('');
      setFormNotes('');
    }
  };

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  const getDayNameUz = (d: Date) => {
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    return days[d.getDay()];
  };

  const getMonthNameUz = (d: Date) => {
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getLessonTypeUz = (t: LessonType) => {
    switch (t) {
      case 'Regular Training':
        return 'Muntazam mashg‘ulot';
      case 'Group Lesson':
        return 'Guruh darsi';
      case 'Private Lesson':
        return 'Yakka tartibdagi dars';
      case 'Tournament / Camp':
        return 'Musobaqa / Yig‘in';
      default:
        return t;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interaktiv Mashg‘ulotlar va Kortlar Taqvimi"
        subtitle="Kortlar bandligi, murabbiylar dars jadvallari va bir vaqtga ikki marta band qilishni oldini oluvchi aqlli taqvim."
        badge={`${filteredLessons.length} ta dars rejalashtirilgan`}
        actions={
          <button
            onClick={() => {
              setConflictError(null);
              setIsCreateModalOpen(true);
            }}
            className="bg-[#F07835] hover:bg-[#d96628] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={18} /> Dars Rejalashtirish
          </button>
        }
      />

      {/* Boshqaruv paneli: Ko'rinish, Navigatsiya, Filtrlar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tugmalar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs font-bold text-[#123D32] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            Bugun
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={handlePrev}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-all"
              title="Oldingi"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-all"
              title="Keyingi"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-sm font-extrabold text-gray-800 ml-1">
            {getMonthNameUz(currentDate)}
          </span>
        </div>

        {/* Ko'rinish rejimi */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start lg:self-auto">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'month'
                ? 'bg-white text-[#123D32] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Oy
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'week'
                ? 'bg-white text-[#123D32] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hafta
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'day'
                ? 'bg-white text-[#123D32] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kun
          </button>
        </div>

        {/* Filtrlar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ustoz filtri */}
          <select
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha Ustozlar</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>

          {/* Kort filtri */}
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha Kortlar</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Dars turi */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha Dars Turlari</option>
            <option value="Regular Training">Muntazam mashg‘ulot</option>
            <option value="Group Lesson">Guruh darsi</option>
            <option value="Private Lesson">Yakka tartibdagi dars</option>
            <option value="Tournament / Camp">Musobaqa / Yig‘in</option>
          </select>
        </div>
      </div>

      {/* Ranglar Belgilanishi (Legenda) */}
      <div className="flex items-center gap-4 text-xs font-medium text-gray-600 flex-wrap px-1">
        <span className="font-bold text-gray-700">Dars turlari:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#27966B]" /> Muntazam mashg‘ulot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2563EB]" /> Guruh darsi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F07835]" /> Yakka tartibdagi dars
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" /> Musobaqalar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]" /> Bekor qilingan
        </span>
      </div>

      {/* Asosiy Taqvim */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HAFTALIK KO'RINISH */}
        {viewMode === 'week' && (
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50/80">
                <div className="p-3 text-center text-xs font-bold text-gray-400 border-r border-gray-200">
                  Vaqt
                </div>
                {weekDays.map((d, idx) => {
                  const isToday = formatDateISO(d) === formatDateISO(new Date());
                  return (
                    <div
                      key={idx}
                      className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                        isToday ? 'bg-emerald-50/60' : ''
                      }`}
                    >
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        {getDayNameUz(d)}
                      </p>
                      <p
                        className={`text-sm font-extrabold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                          isToday ? 'bg-[#123D32] text-white' : 'text-gray-900'
                        }`}
                      >
                        {d.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Vaqt kataklari */}
              <div className="divide-y divide-gray-100">
                {timeSlots.map((slot) => (
                  <div key={slot} className="grid grid-cols-8 min-h-[72px]">
                    <div className="p-2 text-center text-xs font-bold text-gray-400 border-r border-gray-200 bg-gray-50/40 flex items-start justify-center">
                      {slot}
                    </div>

                    {weekDays.map((dayDate, dayIdx) => {
                      const dayISO = formatDateISO(dayDate);
                      const cellEvents = filteredLessons.filter((l) => {
                        return l.date === dayISO && l.startTime.startsWith(slot.slice(0, 2));
                      });

                      return (
                        <div
                          key={dayIdx}
                          className="p-1 border-r border-gray-100 last:border-r-0 hover:bg-gray-50/30 transition-colors relative"
                        >
                          {cellEvents.map((ev) => (
                            <button
                              key={ev.id}
                              onClick={() => setSelectedEvent(ev)}
                              style={{
                                borderLeftColor: ev.color || '#27966B',
                              }}
                              className="w-full text-left p-1.5 mb-1 rounded-md bg-white border border-gray-200 border-l-4 shadow-xs hover:shadow-md transition-all group overflow-hidden"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-bold text-gray-900 truncate">
                                  {ev.title}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-gray-400" />
                                <span>{ev.startTime} - {ev.endTime}</span>
                              </div>
                              <div className="text-[10px] text-emerald-800 font-medium truncate mt-0.5">
                                {ev.courtName}
                              </div>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OYLIK KO'RINISH */}
        {viewMode === 'month' && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map((day) => (
                <div key={day} className="text-center font-bold text-xs text-gray-400 uppercase py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => {
                const dayNum = (index % 31) + 1;
                const paddedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const testDateStr = `2026-10-${paddedDay}`;
                const dayEvents = filteredLessons.filter((l) => l.date === testDateStr);

                return (
                  <div
                    key={index}
                    className="min-h-[100px] p-2 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-700">{dayNum}</span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-16">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left text-[10px] px-1.5 py-0.5 rounded font-medium text-white truncate block"
                          style={{ backgroundColor: ev.color || '#27966B' }}
                        >
                          {ev.startTime} {ev.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KUNLIK KO'RINISH */}
        {viewMode === 'day' && (
          <div className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {currentDate.toLocaleDateString('uz-UZ', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} dars jadvali
            </h3>
            <div className="divide-y divide-gray-100">
              {filteredLessons
                .filter((l) => l.date === formatDateISO(currentDate))
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 px-4 rounded-xl transition-colors cursor-pointer"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-12 rounded-full"
                        style={{ backgroundColor: ev.color || '#27966B' }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{ev.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-gray-700">
                            {ev.startTime} - {ev.endTime}
                          </span>
                          <span>•</span>
                          <span>{ev.courtName}</span>
                          <span>•</span>
                          <span>Ustoz: {ev.coachName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-[#123D32] font-semibold">
                        {ev.type}
                      </span>
                    </div>
                  </div>
                ))}
              {filteredLessons.filter((l) => l.date === formatDateISO(currentDate)).length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Ushbu sanada darslar mavjud emas. Yuqoridagi "Dars Rejalashtirish" tugmasi orqali dars qo‘shishingiz mumkin.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DARS TAFSILOTLARI MODALI */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md text-white mb-2 inline-block"
                  style={{ backgroundColor: selectedEvent.color || '#27966B' }}
                >
                  {getLessonTypeUz(selectedEvent.type)}
                </span>
                <h3 className="text-lg font-black text-gray-900">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock size={16} className="text-[#27966B]" />
                <span className="font-medium">Vaqti:</span>
                <span>{selectedEvent.date} ({selectedEvent.startTime} — {selectedEvent.endTime})</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={16} className="text-[#27966B]" />
                <span className="font-medium">Kort:</span>
                <span>{selectedEvent.courtName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <User size={16} className="text-[#27966B]" />
                <span className="font-medium">Ustoz (Murabbiy):</span>
                <span className="font-bold text-[#123D32]">{selectedEvent.coachName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users size={16} className="text-[#27966B]" />
                <span className="font-medium">Qatnashchilar:</span>
                <span>{selectedEvent.participantsCount} / {selectedEvent.maxParticipants} nafar</span>
              </div>
              {selectedEvent.notes && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                  <span className="font-bold block text-gray-800 mb-0.5">Mashg‘ulot maqsadi:</span>
                  {selectedEvent.notes}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  cancelLesson(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={15} /> Darsni bekor qilish
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DARS REJALASHTIRISH MODALI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">Mashg‘ulot Rejalashtirish</h3>
                <p className="text-xs text-gray-500">Kort va ustoz vaqt to‘qnashuvini avtomatik tekshirish</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {conflictError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Vaqt to‘qnashuvi:</strong>
                  {conflictError}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateLesson} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dars Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: To'p uzatish va taktik o'yin"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Dars Turi</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as LessonType)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="Regular Training">Muntazam mashg‘ulot (Yashil)</option>
                    <option value="Group Lesson">Guruh darsi (Ko'k)</option>
                    <option value="Private Lesson">Yakka tartibdagi dars (Olovrang)</option>
                    <option value="Tournament / Camp">Musobaqa / Yig‘in (Binafsha)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tennis Korti</label>
                  <select
                    value={formCourtId}
                    onChange={(e) => setFormCourtId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.surface})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ustoz (Murabbiy)</label>
                  <select
                    value={formCoachId}
                    onChange={(e) => setFormCoachId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    {coaches.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Guruh</label>
                  <select
                    value={formGroupId}
                    onChange={(e) => setFormGroupId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sana</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Boshlanish vaqti</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tugash vaqti</label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mashg‘ulot rejasi va vazifalari
                </label>
                <textarea
                  rows={2}
                  placeholder="Masalan: Cross-court zarbalari, chidamlilik mashqlari..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#123D32] hover:bg-[#1A5345] rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check size={16} /> Jadvalga Kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

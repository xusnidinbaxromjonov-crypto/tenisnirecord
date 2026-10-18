import React, { useState, useMemo } from 'react';
import {
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  X,
  Trash2,
  Users,
  MapPin,
  Flame,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { LessonType } from '../types';

export const CourtsPage: React.FC = () => {
  const { sports, courts, coaches, lessons, addLesson, cancelLesson } = useAcademy();

  // Sport Fani bo'yicha filter (Barcha fanlar yoki tanlangan sport)
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [modalSport, setModalSport] = useState<string>(sports[0]?.name || 'Boks');
  const [title, setTitle] = useState('');
  const [courtId, setCourtId] = useState('');
  const [coachId, setCoachId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [type, setType] = useState<LessonType>('Group Lesson');
  const [notes, setNotes] = useState('');

  // Modaldagi sport o'zgarganda unga mos kortlar va murabbiylarni topish
  const availableModalCourts = useMemo(() => {
    return courts.filter(
      (c) => !c.sport || c.sport.toLowerCase() === modalSport.toLowerCase()
    );
  }, [courts, modalSport]);

  const availableModalCoaches = useMemo(() => {
    return coaches.filter(
      (c) =>
        c.status === 'active' &&
        (!c.sport ||
          c.sport.toLowerCase() === modalSport.toLowerCase() ||
          c.specialization?.toLowerCase().includes(modalSport.toLowerCase()))
    );
  }, [coaches, modalSport]);

  // Darslarni filtr qilish
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      // 1. Sport fani bo'yicha
      if (selectedSport !== 'all') {
        const matchesSport =
          l.sport?.toLowerCase() === selectedSport.toLowerCase() ||
          courts.find((c) => c.id === l.courtId)?.sport?.toLowerCase() ===
            selectedSport.toLowerCase() ||
          coaches.find((c) => c.id === l.coachId)?.sport?.toLowerCase() ===
            selectedSport.toLowerCase();
        if (!matchesSport) return false;
      }
      // 2. Maydon / Zal bo'yicha
      if (selectedCourt !== 'all' && l.courtId !== selectedCourt) return false;
      // 3. Sana bo'yicha
      if (selectedDate && l.date !== selectedDate) return false;

      return true;
    });
  }, [lessons, selectedSport, selectedCourt, selectedDate, courts, coaches]);

  // Maydonlar / Zallarni filtr qilish
  const filteredCourts = useMemo(() => {
    if (selectedSport === 'all') return courts;
    return courts.filter(
      (c) => c.sport?.toLowerCase() === selectedSport.toLowerCase()
    );
  }, [courts, selectedSport]);

  const handleOpenModal = () => {
    setFormError(null);
    const initialSportName = selectedSport !== 'all' ? selectedSport : sports[0]?.name || 'Boks';
    setModalSport(initialSportName);
    const firstCourt = courts.find(
      (c) => c.sport?.toLowerCase() === initialSportName.toLowerCase()
    );
    const firstCoach = coaches.find(
      (c) =>
        c.sport?.toLowerCase() === initialSportName.toLowerCase() ||
        c.specialization?.toLowerCase().includes(initialSportName.toLowerCase())
    );
    setCourtId(firstCourt?.id || courts[0]?.id || '');
    setCoachId(firstCoach?.id || coaches[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const courtObj = courts.find((c) => c.id === courtId);
    const coachObj = coaches.find((c) => c.id === coachId);

    const result = addLesson({
      title,
      sport: modalSport,
      courtId,
      courtName: courtObj?.name || 'Zal / Maydon',
      coachId,
      coachName: coachObj?.fullName || 'Ustoz',
      date,
      startTime,
      endTime,
      type,
      studentIds: [],
      studentNames: [],
      participantsCount: 1,
      maxParticipants: 12,
      status: 'Scheduled',
      notes,
    });

    if (result.success) {
      setIsModalOpen(false);
      setTitle('');
      setNotes('');
    } else {
      setFormError(result.error || 'Vaqt to‘qnashuvi yuz berdi!');
    }
  };

  const getTypeUz = (t: LessonType) => {
    switch (t) {
      case 'Group Lesson':
        return 'Guruh darsi';
      case 'Private Lesson':
        return 'Yakka tartibdagi dars';
      case 'Regular Training':
        return 'Muntazam mashg‘ulot';
      case 'Tournament / Camp':
        return 'Turnir / Kamp';
      default:
        return t;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sahifa sarlavhasi */}
      <PageHeader
        title="Barcha Fanlar Mashg‘ulotlari Jadvali va Zallar Bandligi"
        subtitle="Boks, Kurash, Tennis, Suzish, Futbol, Taekvondo va boshqa sport fanlari bo‘yicha mashg‘ulotlar, ringlar, tatami va kortlar taqvimi."
        badge={`${lessons.filter((l) => l.status !== 'Cancelled').length} ta faol mashg‘ulot`}
        actions={
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#e04f20] text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <Plus size={16} />
            <span>Yangi Mashg‘ulot Qo‘shish</span>
          </button>
        }
      />

      {/* ========================================================================= */}
      {/* 1. SPORT FANLARI FILTERLARI (TABS)                                        */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0C1E34]">
            <Flame size={16} className="text-[#FF5B26]" />
            <span>Sport Fani Bo‘yicha Filtrlash:</span>
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            {selectedSport === 'all'
              ? 'Barcha sport fanlari ko‘rsatilmoqda'
              : `${selectedSport} fani tanlandi`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
              selectedSport === 'all'
                ? 'bg-[#0C1E34] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>⚡ Barcha Fanlar</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-white/20">
              {lessons.length}
            </span>
          </button>

          {sports.map((sp) => {
            const isSpSelected = selectedSport.toLowerCase() === sp.name.toLowerCase();
            const spLessonsCount = lessons.filter(
              (l) =>
                l.sport?.toLowerCase() === sp.name.toLowerCase() ||
                courts.find((c) => c.id === l.courtId)?.sport?.toLowerCase() ===
                  sp.name.toLowerCase()
            ).length;

            return (
              <button
                key={sp.id}
                onClick={() => setSelectedSport(sp.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  isSpSelected
                    ? 'bg-[#FF5B26] text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{sp.icon}</span>
                <span>{sp.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isSpSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {spLessonsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SANA VA KORT/MAYDON FILTERI                                            */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Calendar size={15} className="text-[#FF5B26]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-transparent focus:outline-none font-bold text-gray-800"
            />
          </div>

          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
          >
            <option value="all">Barcha zallar & maydonlar ({filteredCourts.length})</option>
            {filteredCourts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.sport ? `[${court.sport}] ` : ''}
                {court.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400 font-semibold">
          {selectedDate
            ? `Tanlangan sanada ${filteredLessons.length} ta dars mavjud`
            : `Jami ${filteredLessons.length} ta rejalashtirilgan mashg‘ulot`}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MASHG'ULOTLAR JADVALI KARTALARI                                        */}
      {/* ========================================================================= */}
      {filteredLessons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredLessons.map((les) => {
            const courtObj = courts.find((c) => c.id === les.courtId);
            const sportName = les.sport || courtObj?.sport || 'Sport';
            const sportObj = sports.find((s) => s.name.toLowerCase() === sportName.toLowerCase());

            return (
              <div
                key={les.id}
                className={`bg-white rounded-3xl border shadow-sm p-5 hover:shadow-lg transition-all flex flex-col justify-between ${
                  les.status === 'Cancelled'
                    ? 'border-red-200 bg-red-50/20 opacity-70'
                    : 'border-gray-200/90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{sportObj?.icon || '⚡'}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0C1E34] text-white">
                        {sportName}
                      </span>
                      <span
                        className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: les.color || '#27966B' }}
                      >
                        {getTypeUz(les.type)}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gray-500 line-clamp-1">
                      {les.courtName}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 mt-3 leading-snug">
                    {les.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-50 p-2 rounded-xl">
                      <Clock size={14} className="text-[#FF5B26]" />
                      <span>
                        {les.startTime} - {les.endTime} ({les.date})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 px-1">
                      <span className="font-bold text-[#0C1E34]">Ustoz:</span>
                      <span className="font-extrabold text-gray-800">{les.coachName}</span>
                    </div>
                    {les.groupName && (
                      <div className="flex items-center gap-2 text-gray-600 px-1">
                        <span className="font-bold text-[#0C1E34]">Guruh:</span>
                        <span>{les.groupName}</span>
                      </div>
                    )}
                    {les.notes && (
                      <div className="p-2 bg-gray-50 rounded-xl text-gray-500 text-[11px] mt-2">
                        {les.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span
                    className={`font-black text-[11px] uppercase tracking-wider ${
                      les.status === 'Cancelled' ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {les.status === 'Cancelled' ? 'Bekor qilingan' : 'Rejalashtirilgan'}
                  </span>

                  {les.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelLesson(les.id)}
                      className="text-rose-600 hover:text-rose-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Bekor qilish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAYDONLAR VA ZALLAR KO'RINISHLARI (Sport zallari galereyasi)           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-black uppercase text-[#0C1E34]">
            <MapPin size={18} className="text-[#FF5B26]" />
            <span>
              Akademiya Zallari, Ringlari va Kortlari ({filteredCourts.length})
            </span>
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            {selectedSport === 'all' ? 'Barcha zallar' : `${selectedSport} zallari`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCourts.map((court) => {
            const sportObj = sports.find(
              (s) => s.name.toLowerCase() === court.sport?.toLowerCase()
            );

            return (
              <div
                key={court.id}
                className="bg-gray-50/70 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#0C1E34]/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      {sportObj?.icon} {court.sport || 'Sport'}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-[#0C1E34] leading-tight">
                    {court.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">
                    Qoplama: {court.surface} • {court.type}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-black">
                    {court.hourlyRate.toLocaleString()} so‘m / soat
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Mavjud
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. YANGI MASHG'ULOT QO'SHISH MODAL OYNASI                                  */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-xl bg-[#0C1E34] text-white flex items-center justify-center text-sm font-black shadow-md">
                📅
              </span>
              <h3 className="text-lg font-black text-[#0C1E34]">
                Yangi Mashg‘ulot Rejalashtirish
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Sport fanini tanlang, maydon/zal va murabbiyni biriktiring.
            </p>

            {formError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold block">Vaqt to‘qnashuvi aniqlandi:</strong>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              {/* Sport Fanini Tanlash */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Sport Fani *</label>
                <div className="grid grid-cols-4 gap-2">
                  {sports.map((sp) => (
                    <button
                      type="button"
                      key={sp.id}
                      onClick={() => {
                        setModalSport(sp.name);
                        const matchCourt = courts.find(
                          (c) => c.sport?.toLowerCase() === sp.name.toLowerCase()
                        );
                        const matchCoach = coaches.find(
                          (c) =>
                            c.sport?.toLowerCase() === sp.name.toLowerCase() ||
                            c.specialization?.toLowerCase().includes(sp.name.toLowerCase())
                        );
                        if (matchCourt) setCourtId(matchCourt.id);
                        if (matchCoach) setCoachId(matchCoach.id);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        modalSport === sp.name
                          ? 'bg-[#0C1E34] text-white border-[#0C1E34] font-black shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-semibold'
                      }`}
                    >
                      <div className="text-base">{sp.icon}</div>
                      <span className="text-[10px] block mt-0.5 truncate">{sp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mashg‘ulot Nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Masalan: ${modalSport} pro sparring darsi`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] focus:outline-none font-semibold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Maydon / Zal * ({modalSport})
                  </label>
                  <select
                    value={courtId}
                    onChange={(e) => setCourtId(e.target.value)}
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                  >
                    <option value="">Maydonni tanlang</option>
                    {availableModalCourts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Murabbiy (Ustoz) * ({modalSport})
                  </label>
                  <select
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                  >
                    <option value="">Ustozni tanlang</option>
                    {availableModalCoaches.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sana *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Boshlanish *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tugash *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mashg‘ulot Turi</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                >
                  <option value="Group Lesson">Guruh darsi</option>
                  <option value="Private Lesson">Yakka tartibdagi dars</option>
                  <option value="Regular Training">Muntazam mashg‘ulot</option>
                  <option value="Tournament / Camp">Turnir / Kamp</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Qo‘shimcha Izoh</label>
                <textarea
                  rows={2}
                  placeholder="Dars dasturi yoki kerakli sport anjomlari..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5B26] font-semibold text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF5B26] hover:bg-[#e04f20] text-white rounded-xl font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Jadvalga Kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  X,
  Trophy,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';

export const TournamentsPage: React.FC = () => {
  const { tournaments, addTournament } = useAcademy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('O‘smirlar ochiq chempionati (U18)');
  const [surface, setSurface] = useState('Tuproq kort (Red Clay)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
  const [entryFee, setEntryFee] = useState(150000);
  const [prizePool, setPrizePool] = useState(5000000);
  const [maxParticipants, setMaxParticipants] = useState(32);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    addTournament({
      title,
      category,
      surface,
      startDate,
      endDate,
      registrationDeadline: startDate,
      entryFee,
      prizePool,
      status: 'Upcoming',
      participantsCount: 0,
      maxParticipants,
    });
    setIsModalOpen(false);
    setTitle('');
  };

  const getStatusUz = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'Kutilmoqda';
      case 'In Progress':
        return 'Davom etmoqda';
      case 'Finished':
        return 'Yakunlangan';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Akademiya Musobaqalari va Turnirlar"
        subtitle="Rasmiy musobaqalarni tashkil qilish, o‘yinlar to‘ri (Draw bracket), natijalar va mukofot jamg‘armalari."
        badge={`${tournaments.length} ta musobaqa`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F07835] hover:bg-[#d96628] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={18} /> Yangi Musobaqa Yaratish
          </button>
        }
      />

      <div className="space-y-6">
        {tournaments.length > 0 ? (
          tournaments.map((tr) => (
            <div
              key={tr.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F07835]">
                      {getStatusUz(tr.status)}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{tr.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{tr.title}</h3>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    Maydon qoplamasi: {tr.surface} • Qatnashish badali: {tr.entryFee.toLocaleString()} so‘m
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Mukofot Jamg‘armasi
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      {tr.prizePool.toLocaleString()} so‘m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Ro‘yxatdan o‘tganlar
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {tr.participantsCount} / {tr.maxParticipants} nafar
                    </span>
                  </div>
                </div>
              </div>

              {/* O'yinlar jadvali */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Jonli O‘yinlar va Natijalar To‘ri (Draw)
                </h4>
                {tr.matches.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
                    Qatnashchilarni ro‘yxatga olish davom etmoqda. O‘yinlar to‘ri musobaqa boshlanishidan 48 soat oldin e’lon qilinadi.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tr.matches.map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-2">
                          <span>{m.round}</span>
                          <span>{m.court}</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div
                            className={`flex items-center justify-between ${
                              m.winner === m.player1 ? 'font-black text-[#123D32]' : 'text-gray-700'
                            }`}
                          >
                            <span>{m.player1}</span>
                            {m.winner === m.player1 && <CheckCircle2 size={13} className="text-[#27966B]" />}
                          </div>
                          <div
                            className={`flex items-center justify-between ${
                              m.winner === m.player2 ? 'font-black text-[#123D32]' : 'text-gray-700'
                            }`}
                          >
                            <span>{m.player2}</span>
                            {m.winner === m.player2 && <CheckCircle2 size={13} className="text-[#27966B]" />}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] font-mono font-bold text-[#F07835]">
                          <span>Hisob:</span>
                          <span>{m.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 text-gray-400 font-medium">
            Hozircha musobaqalar mavjud emas. Yangi musobaqa yaratish uchun yuqoridagi "Yangi Musobaqa Yaratish" tugmasini bosing.
          </div>
        )}
      </div>

      {/* YANGI MUSOBAQA YARATISH MODAL OYNASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Yangi Turnir / Musobaqa Yaratish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Musobaqa Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Kuzgi Gran-Pri Chempionati"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kategoriya</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kort Qoplamasi</label>
                  <select
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="Tuproq kort (Red Clay)">Tuproq kort (Red Clay)</option>
                    <option value="Qattiq kort (Hard Court)">Qattiq kort (Hard Court)</option>
                    <option value="Maysa kort (Grass)">Maysa kort (Grass)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Boshlanish Sanasi *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tugash Sanasi *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badal (so‘m)</label>
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mukofot jamg‘armasi</label>
                  <input
                    type="number"
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Maks. ishtirokchilar</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#27966B] hover:bg-[#1E7153] text-white rounded-xl font-bold shadow-md"
                >
                  Turnirni E’lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

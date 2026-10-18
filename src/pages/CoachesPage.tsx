import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  Phone,
  Mail,
  Award,
  ArrowRightLeft,
  UserX,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Coach } from '../types';

export const CoachesPage: React.FC = () => {
  const { coaches, addCoach, deleteCoach, replaceCoach } = useAcademy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ustoz ketganda almashtirish modali
  const [replaceModalCoach, setReplaceModalCoach] = useState<Coach | null>(null);
  const [newCoachSelectedId, setNewCoachSelectedId] = useState('');

  // Yangi murabbiy formasi
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [certifications, setCertifications] = useState('ITF Level 2 Coach');
  const [specialization, setSpecialization] = useState('O‘smirlar va elita tayyorgarligi');
  const [experienceYears, setExperienceYears] = useState(5);
  const [salaryMonthly, setSalaryMonthly] = useState(6000000);

  const handleCreateCoach = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultCoachPhoto =
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

    addCoach({
      fullName,
      photo: photo || defaultCoachPhoto,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@tenisrekord.uz`,
      phone,
      specialization,
      experienceYears,
      certifications: [certifications],
      assignedGroups: [],
      weeklyHours: 30,
      activeStudentsCount: 0,
      winRate: 85,
      salaryMonthly,
      rating: 5.0,
      status: 'active',
    });

    setIsModalOpen(false);
    setFullName('');
    setPhoto('');
    setEmail('');
  };

  const handleExecuteReplace = () => {
    if (!replaceModalCoach || !newCoachSelectedId) return;
    replaceCoach(replaceModalCoach.id, newCoachSelectedId);
    setReplaceModalCoach(null);
    setNewCoachSelectedId('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Akademiya Murabbiylar Tarkibi"
        subtitle="Sertifikatlangan professional ustozlar jamoasi, dars jadvallari, o‘quvchilar biriktiruvi va almashtirish tizimi."
        badge={`${coaches.filter((c) => c.status === 'active').length} nafar faol murabbiy`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F07835] hover:bg-[#d96628] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={18} /> Yangi Ustoz Qo‘shish
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.length > 0 ? (
          coaches.map((coach) => (
            <div
              key={coach.id}
              className={`bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between ${
                coach.status === 'resigned'
                  ? 'border-red-200 bg-red-50/20 opacity-80'
                  : 'border-gray-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={coach.photo}
                      alt={coach.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#27966B]/20"
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900">{coach.fullName}</h3>
                      <p className="text-xs text-[#27966B] font-bold mt-0.5">{coach.specialization}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-extrabold">
                        <span>★ {coach.rating}</span>
                        <span className="text-gray-400 font-normal">({coach.experienceYears} yil tajriba)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ustoz ketgan bo'lsa xabar */}
                {coach.status === 'resigned' && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                    <span className="font-bold flex items-center gap-1 text-rose-700">
                      <UserX size={13} /> Faoliyati to‘xtatilgan (Ketgan)
                    </span>
                    <p className="mt-0.5 text-[11px] text-rose-800">
                      O‘quvchilari va darslari: <strong>{coach.replacedByCoachName}</strong>ga o‘tkazildi.
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award size={14} className="text-[#27966B]" />
                    <span className="font-medium">{coach.certifications.join(', ') || 'Sertifikatlangan murabbiy'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={14} className="text-gray-400" />
                    <span>{coach.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} className="text-gray-400" />
                    <span>{coach.phone}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      O‘quvchilar
                    </span>
                    <span className="text-base font-black text-gray-900">
                      {coach.activeStudentsCount} nafar
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Oylik Maosh
                    </span>
                    <span className="text-sm font-black text-emerald-800">
                      {coach.salaryMonthly.toLocaleString()} so‘m
                    </span>
                  </div>
                </div>
              </div>

              {/* Pastki amallar paneli */}
              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                {coach.status === 'active' ? (
                  <button
                    onClick={() => {
                      setReplaceModalCoach(coach);
                      const otherCoach = coaches.find((c) => c.id !== coach.id && c.status === 'active');
                      setNewCoachSelectedId(otherCoach?.id || '');
                    }}
                    className="text-xs font-bold text-[#F07835] hover:text-[#d96628] flex items-center gap-1.5 transition-colors"
                    title="Ustoz ketganda uning barcha dars va o'quvchilarini boshqa ustozga biriktirish"
                  >
                    <ArrowRightLeft size={13} /> Ketdi (O‘rniga biriktirish)
                  </button>
                ) : (
                  <span className="text-xs font-bold text-gray-400">Arxivlangan</span>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Haqiqatan ham ${coach.fullName}ni tizimdan o‘chirmoqchimisiz?`)) {
                      deleteCoach(coach.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="O‘chirish"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 text-gray-400 font-medium">
            Hozircha ustozlar kiritilmagan. Yangi ustoz qo‘shish uchun yuqoridagi "Yangi Ustoz Qo‘shish" tugmasini bosing.
          </div>
        )}
      </div>

      {/* YANGI MURABBIY QO'SHISH MODAL OYNASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Yangi Murabbiy Qo‘shish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCoach} className="mt-4 space-y-3.5 text-xs">
              {/* Rasm yuklash (Rasm qo'yish) */}
              <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100">
                <ImageUploader
                  value={photo}
                  onChange={setPhoto}
                  label="Murabbiy fotosurati (Rasm qo‘yish)"
                  placeholderText="Ustoz fotosuratini tanlang"
                  size="md"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ustozning To‘liq Ismi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rustamov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mutaxassisligi</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sertifikati</label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Telefon Raqami</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Elektron Pochta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tajribasi (yil)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Oylik Maoshi (so‘m)</label>
                  <input
                    type="number"
                    value={salaryMonthly}
                    onChange={(e) => setSalaryMonthly(Number(e.target.value))}
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USTOZ KETGANDA O'RNIGA BIRIKTIRISH MODALI */}
      {replaceModalCoach && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">
                Ustoz Ketishi va O‘quvchilarni O‘tkazish
              </h3>
              <button
                onClick={() => setReplaceModalCoach(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <p className="text-gray-600 leading-relaxed">
                <strong>{replaceModalCoach.fullName}</strong> ishdan ketayotgani yoki boshqa sababli mashg‘ulot o‘ta olmasligi sababli, uning barcha o‘quvchilari, guruhlari va rejalashtirilgan mashg‘ulotlarini yangi ustozga biriktiring.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Yangi Mas’ul Ustozni Tanlang *
                </label>
                <select
                  value={newCoachSelectedId}
                  onChange={(e) => setNewCoachSelectedId(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                >
                  <option value="">Ustozni tanlang...</option>
                  {coaches
                    .filter((c) => c.id !== replaceModalCoach.id && c.status === 'active')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.specialization})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplaceModalCoach(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  disabled={!newCoachSelectedId}
                  onClick={handleExecuteReplace}
                  className="px-5 py-2 bg-[#F07835] hover:bg-[#d96628] disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all"
                >
                  O‘tkazishni Tasdiqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  CheckCircle,
  X,
  GraduationCap,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { ImageUploader } from '../components/ImageUploader';
import { Student } from '../types';

export const StudentsPage: React.FC = () => {
  const { students, coaches, groups, addStudent, deleteStudent, pauseStudent, resumeStudent } =
    useAcademy();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // O'qishni to'xtatish (ketib qolish) modali
  const [pauseModalStudent, setPauseModalStudent] = useState<Student | null>(null);
  const [lastTopicInput, setLastTopicInput] = useState('');

  // Yangi o'quvchi qo'shish formasi
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('2012-01-01');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [skillLevel, setSkillLevel] = useState<Student['skillLevel']>('Beginner');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [coachId, setCoachId] = useState(coaches[0]?.id || '');
  const [notes, setNotes] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (levelFilter !== 'all' && s.skillLevel !== levelFilter) return false;
      if (statusFilter !== 'all' && s.subscriptionStatus !== statusFilter) return false;
      if (
        search &&
        !s.fullName.toLowerCase().includes(search.toLowerCase()) &&
        !s.email.toLowerCase().includes(search.toLowerCase()) &&
        !s.parentName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [students, search, levelFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupObj = groups.find((g) => g.id === groupId);
    const coachObj = coaches.find((c) => c.id === coachId);

    const calculatedAge = 2026 - (parseInt(dob.split('-')[0]) || 2012);

    const defaultStudentAvatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    addStudent({
      fullName,
      photo: photo || defaultStudentAvatar,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@tenisrekord.uz`,
      phone: phone || '+998 90 123 45 67',
      dob,
      age: calculatedAge,
      parentName: parentName || 'Ota-onasi',
      parentPhone: parentPhone || phone || '+998 90 999 88 77',
      skillLevel,
      groupId,
      groupName: groupObj?.name || 'Biriktirilmagan',
      coachId,
      coachName: coachObj?.fullName || 'Biriktirilmagan',
      registrationDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      subscriptionStatus: 'Active',
      balance: 0,
      notes,
      status: 'active',
    });

    setIsModalOpen(false);
    setFullName('');
    setPhoto('');
    setEmail('');
    setPhone('');
    setParentName('');
    setParentPhone('');
    setNotes('');
  };

  const getSkillLevelUz = (level: Student['skillLevel']) => {
    switch (level) {
      case 'Beginner':
        return 'Boshlang‘ich';
      case 'Intermediate':
        return 'O‘rta';
      case 'Advanced':
        return 'Yuqori';
      case 'Pro Academy':
        return 'Professional';
      default:
        return level;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="O‘quvchilar Ro‘yxati va Boshqaruvi"
        subtitle="Akademiyada ro‘yxatdan o‘tgan barcha o‘quvchilar, mahorat darajalari, ota-onalar kontaktlari, to‘lovlar va davomat ko‘rsatkichlari."
        badge={`${students.length} nafar o‘quvchi`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F07835] hover:bg-[#d96628] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={18} /> Yangi o‘quvchi qo‘shish
          </button>
        }
      />

      {/* Qidiruv va Filtrlar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="O‘quvchi yoki ota-ona ismini qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#27966B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha darajalar</option>
            <option value="Beginner">Boshlang‘ich daraja</option>
            <option value="Intermediate">O‘rta daraja</option>
            <option value="Advanced">Yuqori daraja</option>
            <option value="Pro Academy">Professional daraja</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha holatlar</option>
            <option value="Active">Faol o‘quvchilar</option>
            <option value="Paused">O‘qishni to‘xtatganlar</option>
            <option value="Pending">Kutilmoqda</option>
            <option value="Expired">Muddati o‘tgan</option>
          </select>
        </div>
      </div>

      {/* O‘quvchilar Jadvali */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">O‘quvchi ma’lumotlari</th>
                <th className="py-3.5 px-4">Dastur va Ustoz</th>
                <th className="py-3.5 px-4">Darajasi</th>
                <th className="py-3.5 px-4">Dars Holati / Oxirgi joyi</th>
                <th className="py-3.5 px-4">Davomat</th>
                <th className="py-3.5 px-4">Balans</th>
                <th className="py-3.5 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      st.status === 'paused' ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.fullName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#27966B]/20 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{st.fullName}</span>
                          <span className="text-[11px] text-gray-400 block">{st.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800 block">{st.groupName}</span>
                      <span className="text-[11px] text-[#27966B] font-medium block">
                        Ustoz: {st.coachName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          st.skillLevel === 'Pro Academy'
                            ? 'bg-purple-50 text-purple-700'
                            : st.skillLevel === 'Advanced'
                            ? 'bg-blue-50 text-blue-700'
                            : st.skillLevel === 'Intermediate'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {getSkillLevelUz(st.skillLevel)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {st.status === 'paused' ? (
                        <div className="bg-amber-100/70 border border-amber-200 text-amber-900 p-2 rounded-xl text-[11px]">
                          <span className="font-bold flex items-center gap-1 text-amber-800">
                            <PauseCircle size={12} /> O‘qish to‘xtatilgan ({st.leaveDate})
                          </span>
                          <p className="mt-0.5 text-[10px] text-amber-950 font-medium">
                            Qolgan joyi: <strong>{st.lastStudiedTopic || 'Muntazam darslar'}</strong>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Faol o‘qimoqda
                          </span>
                          {st.returnDate && (
                            <span className="block text-[10px] text-gray-400 mt-0.5">
                              Qaytgan: {st.returnDate}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#27966B] h-full"
                            style={{ width: `${st.attendanceRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-800">{st.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {st.balance < 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          {Math.abs(st.balance).toLocaleString()} so‘m qarz
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <CheckCircle size={11} /> To‘langan
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {st.status === 'paused' ? (
                          <button
                            onClick={() => resumeStudent(st.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                            title="Qolgan joyidan qayta davom ettirish"
                          >
                            <PlayCircle size={13} /> Davom ettirish
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setPauseModalStudent(st);
                              setLastTopicInput(st.lastStudiedTopic || 'Zarba texnikasi va to‘p uzatish');
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] flex items-center gap-1 border border-amber-200 transition-colors"
                            title="Ketib qolsa - joyini saqlab to'xtatish"
                          >
                            <PauseCircle size={13} /> Ketdi (To‘xtatish)
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Haqiqatan ham ${st.fullName}ni butunlay o‘chirmoqchimisiz?`)) {
                              deleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    Hozircha o‘quvchilar mavjud emas. Yangi o‘quvchi qo‘shish uchun yuqoridagi "Yangi o‘quvchi qo‘shish" tugmasini bosing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YANGI O'QUVCHI QO'SHISH MODAL OYNASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Yangi O‘quvchi Ro‘yxatdan O‘tkazish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Rasm yuklash (Rasm qo'yish) */}
              <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100">
                <ImageUploader
                  value={photo}
                  onChange={setPhoto}
                  label="O‘quvchi fotosurati (Rasm qo‘yish)"
                  placeholderText="O‘quvchi rasmini kompyuterdan tanlang"
                  size="md"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">O‘quvchining To‘liq Ism-Familiyasi *</label>
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
                  <label className="block font-bold text-gray-700 mb-1">Telefon Raqami *</label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Elektron Pochta (Email)</label>
                  <input
                    type="email"
                    placeholder="sardor@tenisrekord.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tug‘ilgan Sanasi</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mahorat Darajasi</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="Beginner">Boshlang‘ich daraja</option>
                    <option value="Intermediate">O‘rta daraja</option>
                    <option value="Advanced">Yuqori daraja</option>
                    <option value="Pro Academy">Professional (Pro)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ota-Onasining Ismi</label>
                  <input
                    type="text"
                    placeholder="Rustam Karimov"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ota-Onaning Telefoni</label>
                  <input
                    type="text"
                    placeholder="+998 90 999 88 77"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guruhni Tanlang</label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="">Guruh biriktirilmagan</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Biriktirilgan Ustoz</label>
                  <select
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="">Ustoz biriktirilmagan</option>
                    {coaches.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Qo‘shimcha Izoh / Eslatma</label>
                <textarea
                  rows={2}
                  placeholder="Masalan: Sog‘lig‘i bo‘yicha cheklovlar, maqsadlari..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                />
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
                  Ro‘yxatdan o‘tkazish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* O'QISHNI TO'XTATISH (KETIB QOLGANDA) MODAL OYNASI */}
      {pauseModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">
                O‘qishni To‘xtatish: {pauseModalStudent.fullName}
              </h3>
              <button
                onClick={() => setPauseModalStudent(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-gray-600 leading-relaxed">
                O‘quvchi mashg‘ulotlarni vaqtincha to‘xtatganda yoki ketganida uning qaysi darsda yoki qaysi mavzuda to‘xtaganini yozib qo‘ying. Qaytib kelganida tizim aynan shu yerdan davom ettirishni taklif qiladi.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Oxirgi o‘rganilgan mavzu / Qolgan dars joyi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Bekxend zarba texnikasi va oyoq harakatlari"
                  value={lastTopicInput}
                  onChange={(e) => setLastTopicInput(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPauseModalStudent(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pauseStudent(pauseModalStudent.id, lastTopicInput);
                    setPauseModalStudent(null);
                  }}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md"
                >
                  Saqlash va To‘xtatish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

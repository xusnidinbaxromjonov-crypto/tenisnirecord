import React, { useState } from 'react';
import {
  Plus,
  TrendingUp,
  X,
  Trash2,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { GroupProgram } from '../types';

export const GroupsPage: React.FC = () => {
  const { groups, coaches, addGroup, deleteGroup } = useAcademy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [level, setLevel] = useState<GroupProgram['level']>('Intermediate');
  const [ageCategory, setAgeCategory] = useState<GroupProgram['ageCategory']>('Juniors (10-14)');
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [coachId, setCoachId] = useState(coaches[0]?.id || '');
  const [timeSlot, setTimeSlot] = useState('16:00 - 17:30');
  const [monthlyPrice, setMonthlyPrice] = useState(450000);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const coachObj = coaches.find((c) => c.id === coachId);
    addGroup({
      name,
      level,
      ageCategory,
      maxCapacity,
      enrolledCount: 0,
      coachId,
      coachName: coachObj?.fullName || 'Biriktirilmagan',
      daysOfWeek: ['Dush', 'Chor', 'Jum'],
      timeSlot,
      monthlyPrice,
      progressPercentage: 0,
    });
    setIsModalOpen(false);
    setName('');
  };

  const getAgeCategoryUz = (cat: GroupProgram['ageCategory']) => {
    switch (cat) {
      case 'Kids (6-9)':
        return 'Bolalar (6-9 yosh)';
      case 'Juniors (10-14)':
        return 'O‘smirlar (10-14 yosh)';
      case 'Teens (15-18)':
        return 'Katta o‘smirlar (15-18 yosh)';
      case 'Adults (18+)':
        return 'Kattalar (18+ yosh)';
      default:
        return cat;
    }
  };

  const getLevelUz = (lvl: GroupProgram['level']) => {
    switch (lvl) {
      case 'Beginner':
        return 'Boshlang‘ich daraja';
      case 'Intermediate':
        return 'O‘rta daraja';
      case 'Advanced':
        return 'Yuqori daraja';
      case 'Elite Competition':
        return 'Professional terma jamoa';
      default:
        return lvl;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mashg‘ulot Guruhlari va Dasturlar"
        subtitle="Bolalar maktabi, o‘smirlar jamoalari va kattalar ligasi mashg‘ulot guruhlari boshqaruvi."
        badge={`${groups.length} ta faol guruh`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F07835] hover:bg-[#d96628] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus size={18} /> Yangi Guruh Ochish
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#123D32] border border-emerald-100">
                      {getAgeCategoryUz(group.ageCategory)}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">{group.name}</h3>
                    <p className="text-xs text-[#27966B] font-bold">{getLevelUz(group.level)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-900">
                      {group.monthlyPrice.toLocaleString()} <span className="text-xs font-normal">so‘m</span>
                    </span>
                    <span className="text-[11px] text-gray-400 block">/ oylik to‘lov</span>
                  </div>
                </div>

                {/* Sig'im va to'lish foizi */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Guruh sig‘imi:</span>
                    <span className="font-bold text-gray-800">
                      {group.enrolledCount} / {group.maxCapacity} nafar o‘quvchi
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#27966B] h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (group.enrolledCount / (group.maxCapacity || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Guruh tafsilotlari */}
                <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Biriktirilgan Ustoz</span>
                    <span className="font-bold text-[#123D32]">{group.coachName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Mashg‘ulot Vaqti</span>
                    <span className="font-bold text-gray-800">{group.timeSlot}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 mt-1 pt-2 border-t border-gray-200/50">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Hafta kunlari:</span>
                    <span className="font-bold text-gray-700">
                      {group.daysOfWeek.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp size={14} /> Dastur: {group.progressPercentage}% o‘zlashtirildi
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Haqiqatan ham "${group.name}" guruhini o‘chirmoqchimisiz?`)) {
                      deleteGroup(group.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Guruhni o‘chirish"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 text-gray-400 font-medium">
            Hozircha guruhlar ochilmagan. Yangi guruh ochish uchun yuqoridagi "Yangi Guruh Ochish" tugmasini bosing.
          </div>
        )}
      </div>

      {/* YANGI GURUH OCHISH MODAL OYNASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Yangi Guruh Tashkil Etish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Guruh Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: O‘smirlar Kelajak Yulduzlari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mahorat Darajasi</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="Beginner">Boshlang‘ich daraja</option>
                    <option value="Intermediate">O‘rta daraja</option>
                    <option value="Advanced">Yuqori daraja</option>
                    <option value="Elite Competition">Professional elita</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Yosh Toifasi</label>
                  <select
                    value={ageCategory}
                    onChange={(e) => setAgeCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  >
                    <option value="Kids (6-9)">Bolalar (6-9 yosh)</option>
                    <option value="Juniors (10-14)">O‘smirlar (10-14 yosh)</option>
                    <option value="Teens (15-18)">Katta o‘smirlar (15-18 yosh)</option>
                    <option value="Adults (18+)">Kattalar (18+ yosh)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guruh Sig‘imi (nafar)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Oylik To‘lov Miqdori (so‘m)</label>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Biriktiriladigan Ustoz</label>
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
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mashg‘ulot Soati</label>
                  <input
                    type="text"
                    placeholder="16:00 - 17:30"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
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
                  Guruhni Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

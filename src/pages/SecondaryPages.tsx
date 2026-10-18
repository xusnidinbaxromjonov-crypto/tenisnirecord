import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { CheckCircle, MapPin, Trash2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const AcademyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenisrekord Markazi Haqida"
        subtitle="Zamonaviy ta’lim, mashg‘ulotlar va sport jarayonlarini muvofiqlashtiruvchi boshqaruv tizimi."
        badge="Rasmiy Tizim"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 m-0">Markaz va Faoliyat Falsafasi</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tenisrekord markazi o‘quvchilar va murabbiylar o‘rtasidagi darslar, mashg‘ulotlar hamda ta’lim sifatini oshirishga yo‘naltirilgan zamonaviy boshqaruv markazidir. Har bir yosh toifasi uchun maxsus individual va guruh dasturlari ishlab chiqilgan.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-gray-400">Tashkil topgan</span>
              <span className="text-base font-extrabold text-gray-900 block mt-0.5">2024-yil</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-gray-400">Standart</span>
              <span className="text-base font-extrabold text-gray-900 block mt-0.5">ITF Xalqaro</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-gray-400">Holat</span>
              <span className="text-base font-extrabold text-[#27966B] block mt-0.5">Faol Tizim</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Akademiya Qulayliklari</h3>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#27966B]" />
                Professional raketka tortish xonasi (Babolat)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#27966B]" />
                Video tahlil va harakat aniqligi laboratoriyasi
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#27966B]" />
                Fizioterapiya va tiklanish havzasi
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#27966B]" />
                Kutish zali va fitnes bar
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#F07835]" />
            Tenisrekord Majmuasi, Markaziy Sport Majmuasi
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingsPage: React.FC = () => {
  const { lessons } = useAcademy();

  const getTypeUz = (t: string) => {
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

  const getStatusUz = (s: string) => {
    switch (s) {
      case 'Scheduled':
        return 'Rejalashtirilgan';
      case 'Completed':
        return 'Yakunlangan';
      case 'In Progress':
        return 'Jarayonda';
      case 'Cancelled':
        return 'Bekor qilingan';
      default:
        return s;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kort Band Qilishlari va Bronlar"
        subtitle="Akademiyada rejalashtirilgan barcha kort band qilishlari va mashg‘ulotlar ro‘yxati."
        badge={`${lessons.filter((l) => l.status !== 'Cancelled').length} ta tasdiqlangan dars`}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Kort</th>
                <th className="py-3.5 px-4">Mashg‘ulot Nomi</th>
                <th className="py-3.5 px-4">Ustoz</th>
                <th className="py-3.5 px-4">Sana va Vaqt</th>
                <th className="py-3.5 px-4">Dars Turi</th>
                <th className="py-3.5 px-4 text-right">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lessons.length > 0 ? (
                lessons.map((les) => (
                  <tr key={les.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{les.courtName}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{les.title}</td>
                    <td className="py-3.5 px-4 text-[#27966B] font-medium">{les.coachName}</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {les.date} ({les.startTime} - {les.endTime})
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: les.color || '#27966B' }}
                      >
                        {getTypeUz(les.type)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-700">
                      {getStatusUz(les.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    Hech qanday bron yoki mashg‘ulot mavjud emas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Akademiya Tahliliy Hisobotlari"
        subtitle="Direktorlar, bosh murabbiylar va buxgalteriya uchun moliyaviy va statistik hisobotlar."
        badge="Hisobotlar"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900">Oylik Moliyaviy Balans</h3>
          <p className="text-xs text-gray-500 mt-1">O‘quvchilar to‘lovlari, kort ijarasi va turnir tushumlari.</p>
          <button
            onClick={() => alert('Moliyaviy hisobot yuklab olindi (PDF)')}
            className="mt-4 px-4 py-2 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            PDF Yuklab olish
          </button>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900">O‘quvchilar Davomat Ko‘rsatkichi</h3>
          <p className="text-xs text-gray-500 mt-1">Guruhlar bo‘yicha o‘quvchilarning darslarga qatnashish foizlari.</p>
          <button
            onClick={() => alert('Davomat hisoboti yuklab olindi (CSV)')}
            className="mt-4 px-4 py-2 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            CSV Yuklab olish
          </button>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900">Kortlar Bandlik Xaritasi</h3>
          <p className="text-xs text-gray-500 mt-1">Kortlarning soatlar bo‘yicha yuklamasi va mashg‘ulotlar jurnali.</p>
          <button
            onClick={() => alert('Kortlar hisoboti yuklab olindi (PDF)')}
            className="mt-4 px-4 py-2 bg-emerald-50 text-[#123D32] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            PDF Yuklab olish
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const { notificationCount, clearNotifications } = useAcademy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bildirishnomalar va Tizim Xabarlari"
        subtitle="Akademiya bo‘yicha muhim eslatmalar, jadval o‘zgarishlari va to‘lov bildirishnomalari."
        badge={`${notificationCount} ta yangi xabar`}
        actions={
          <button
            onClick={clearNotifications}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            Barchasini O‘qilgan Deb Belgilash
          </button>
        }
      />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {notificationCount > 0 ? (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#123D32]">Tizim muvaffaqiyatli ishga tushirildi</h4>
                <p className="text-xs text-gray-600 mt-1">Barcha bo‘limlar to‘liq o‘zbek tilida faol holatda ishlamoqda.</p>
              </div>
              <span className="text-[10px] text-gray-400">Hozir</span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-xs font-medium">
            Hozircha yangi bildirishnomalar mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { clearAllData } = useAcademy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenisrekord Sozlamalari va Boshqaruv"
        subtitle="Tizim parametrlari, valyuta, xavfsizlik va ma’lumotlarni tozalash."
        badge="Tizim Sozlamalari"
      />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl space-y-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Markaz Ma’lumotlari</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-500 font-bold mb-1">Markaz Nomi</label>
              <input
                type="text"
                defaultValue="Tenisrekord Boshqaruv Markazi"
                className="w-full p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-bold mb-1">Asosiy Valyuta</label>
              <select className="w-full p-2.5 border border-gray-200 rounded-xl">
                <option>UZS (So‘m)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Xavfsizlik va Ma’lumotlar Saqlanishi</h3>
          <p className="text-xs text-gray-500 mt-1">
            Barcha kiritilgan ma’lumotlar brauzeringiz xotirasida (localStorage) ishonchli saqlanadi.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-800">
              Lokal xotira faol holatda
            </span>
          </div>
        </div>

        {/* Barcha ma'lumotlarni tozalash bo'limi */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
            <Trash2 size={15} /> Barcha Ma’lumotlarni Tozalash
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Agar tizimdagi barcha o‘quvchilar, mashg‘ulotlar, to‘lovlar va jadvallarni butunlay o‘chirib, noldan boshlamoqchi bo‘lsangiz, quyidagi tugmani bosing.
          </p>
          <div className="mt-3">
            <button
              onClick={() => {
                if (confirm("Haqiqatan ham barcha kiritilgan yozuvlar va ma'lumotlarni tozalab tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) {
                  clearAllData();
                }
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Hamma narsani tozalab tashlash
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => alert('Sozlamalar muvaffaqiyatli saqlandi!')}
            className="px-5 py-2.5 bg-[#123D32] hover:bg-[#1A5345] text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            O‘zgarishlarni Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

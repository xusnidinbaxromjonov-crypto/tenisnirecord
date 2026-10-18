import React from 'react';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';

export const RankingsPage: React.FC = () => {
  const { rankings } = useAcademy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="O‘yinchilar Rasmiy Reyting Jadvali"
        subtitle="Musobaqalar va turnirlardagi g‘alabalar, setlar farqi va Elo ballari asosida shakllanuvchi akademiya yetakchilari ro‘yxati."
        badge="Rasmiy Reyting Jadvali"
      />

      {rankings.length > 0 ? (
        <>
          {/* Shohsupa: Kuchli 3 talik */}
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

          {/* To'liq jadval */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                  {rankings.map((p) => {
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
        </>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 text-gray-400 font-medium">
          Hozircha o‘yinchilar reytingi shakllanmagan. Musobaqalar va darslar natijalariga ko‘ra reyting avtomatik hisoblanadi.
        </div>
      )}
    </div>
  );
};

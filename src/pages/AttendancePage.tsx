import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  HelpCircle,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PageHeader } from '../components/PageHeader';
import { AttendanceRecord } from '../types';

export const AttendancePage: React.FC = () => {
  const { students, groups, attendance, recordAttendance, currentUser } = useAcademy();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const handleMark = (
    studentId: string,
    studentName: string,
    status: AttendanceRecord['status']
  ) => {
    recordAttendance({
      lessonId: 'les-daily',
      studentId,
      studentName,
      date: selectedDate,
      status,
      markedByCoach: currentUser.name,
    });
  };

  const getStudentStatusForDate = (studentId: string) => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    return record?.status;
  };

  const filteredStudents = students.filter((s) => {
    if (selectedGroup !== 'all' && s.groupId !== selectedGroup) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="O‘quvchilar Davomat Jurnali"
        subtitle="Har kunlik darslar bo‘yicha o‘quvchilar ishtirokini belgilash: Keldi, Kechikdi, Kelmadi yoki Sababli."
        badge={`${attendance.length} ta qayd etilgan davomat`}
      />

      {/* Sana va Guruh tanlash */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Calendar size={15} className="text-[#27966B]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-transparent focus:outline-none font-bold text-gray-800"
            />
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#27966B]"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Mas’ul shaxs: <strong className="text-gray-900">{currentUser.name}</strong> ({currentUser.role})
        </div>
      </div>

      {/* Davomat Jadvali */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">O‘quvchi</th>
                <th className="py-3.5 px-4">Guruh</th>
                <th className="py-3.5 px-4">Umumiy Davomat %</th>
                <th className="py-3.5 px-4 text-center">Bugungi Davomat Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const currentStatus = getStudentStatusForDate(st.id);

                  return (
                    <tr key={st.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.photo}
                            alt={st.fullName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#27966B]/20"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{st.fullName}</span>
                            <span className="text-[11px] text-gray-400 block">{st.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">{st.groupName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {st.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Keldi */}
                          <button
                            onClick={() => handleMark(st.id, st.fullName, 'Present')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 size={13} /> Keldi
                          </button>

                          {/* Kechikdi */}
                          <button
                            onClick={() => handleMark(st.id, st.fullName, 'Late')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <Clock3 size={13} /> Kechikdi
                          </button>

                          {/* Kelmadi */}
                          <button
                            onClick={() => handleMark(st.id, st.fullName, 'Absent')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle size={13} /> Kelmadi
                          </button>

                          {/* Sababli */}
                          <button
                            onClick={() => handleMark(st.id, st.fullName, 'Excused')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                              currentStatus === 'Excused'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            <HelpCircle size={13} /> Sababli
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                    Hozircha o‘quvchilar mavjud emas. Davomatni belgilash uchun avval o‘quvchilarni ro‘yxatga oling.
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

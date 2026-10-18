import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Coach,
  Court,
  LessonEvent,
  GroupProgram,
  PaymentRecord,
  Tournament,
  PlayerRanking,
  AttendanceRecord,
  UserProfile,
  Role,
  SportSubject,
} from '../types';
import {
  currentUser as initialUser,
  initialSports,
  initialCoaches,
  initialCourts,
  initialGroups,
  initialStudents,
  initialLessons,
  initialPayments,
  initialTournaments,
  initialRankings,
  initialAttendance,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AcademyContextType {
  currentUser: UserProfile;
  setCurrentUserRole: (role: Role) => void;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  sports: SportSubject[];
  students: Student[];
  coaches: Coach[];
  courts: Court[];
  lessons: LessonEvent[];
  groups: GroupProgram[];
  payments: PaymentRecord[];
  tournaments: Tournament[];
  rankings: PlayerRanking[];
  attendance: AttendanceRecord[];

  // Bildirishnoma xabarlari (Toast)
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Fanlar / Sport turlari amallari
  addSport: (sport: Omit<SportSubject, 'id'>) => void;
  updateSport: (id: string, sport: Partial<SportSubject>) => void;
  deleteSport: (id: string) => void;

  // O'quvchilar amallari
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  pauseStudent: (studentId: string, lastTopic: string) => void;
  resumeStudent: (studentId: string) => void;

  // Ustozlar amallari
  addCoach: (coach: Omit<Coach, 'id'>) => void;
  updateCoach: (id: string, coach: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;
  replaceCoach: (oldCoachId: string, newCoachId: string) => void;
  updateCoachSalaryRate: (coachId: string, rate: number) => void;

  // Kortlar amallari
  addCourt: (court: Omit<Court, 'id'>) => void;
  updateCourt: (id: string, court: Partial<Court>) => void;
  deleteCourt: (id: string) => void;

  // Mashg'ulotlar amallari
  addLesson: (lesson: Omit<LessonEvent, 'id'>) => { success: boolean; error?: string };
  updateLesson: (id: string, lesson: Partial<LessonEvent>) => { success: boolean; error?: string };
  cancelLesson: (id: string) => void;

  // Guruhlar amallari
  addGroup: (group: Omit<GroupProgram, 'id'>) => void;
  updateGroup: (id: string, group: Partial<GroupProgram>) => void;
  deleteGroup: (id: string) => void;

  // To'lovlar amallari
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'invoiceNumber'>) => void;
  updatePaymentStatus: (id: string, status: PaymentRecord['status']) => void;

  // Davomat amallari
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;

  // Musobaqalar amallari
  addTournament: (tournament: Omit<Tournament, 'id' | 'matches'>) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;

  // Qidiruv va tizim bildirishnomalari
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notificationCount: number;
  clearNotifications: () => void;
  clearAllData: () => void;
  resetToSampleSportsData: () => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'tenisrekord_user_v6',
  SPORTS: 'tenisrekord_sports_v6',
  STUDENTS: 'tenisrekord_students_v6',
  COACHES: 'tenisrekord_coaches_v6',
  COURTS: 'tenisrekord_courts_v6',
  LESSONS: 'tenisrekord_lessons_v6',
  GROUPS: 'tenisrekord_groups_v6',
  PAYMENTS: 'tenisrekord_payments_v6',
  TOURNAMENTS: 'tenisrekord_tournaments_v6',
  RANKINGS: 'tenisrekord_rankings_v6',
  ATTENDANCE: 'tenisrekord_attendance_v6',
};

// Eski mock ma'lumotlarni tozalash (foydalanuvchi talabiga asosan)
if (typeof window !== 'undefined') {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('tenisrekord_') && !Object.values(STORAGE_KEYS).includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : initialUser;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [sports, setSports] = useState<SportSubject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPORTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialSports;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialStudents;
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COACHES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialCoaches;
  });

  const [courts, setCourts] = useState<Court[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialCourts;
  });

  const [lessons, setLessons] = useState<LessonEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LESSONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialLessons;
  });

  const [groups, setGroups] = useState<GroupProgram[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialGroups;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialPayments;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    return saved ? JSON.parse(saved) : initialTournaments;
  });

  const [rankings, setRankings] = useState<PlayerRanking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RANKINGS);
    return saved ? JSON.parse(saved) : initialRankings;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  // LocalStorage xotirasiga avtomatik saqlab borish
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(sports));
  }, [sports]);

  // LocalStorage xotirasiga avtomatik saqlab borish
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURTS, JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...profile };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  };

  const setCurrentUserRole = (role: Role) => {
    updateCurrentUser({ role });
    addToast('info', 'Foydalanuvchi roli', `Joriy boshqaruv roli: ${role}`);
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    addToast('info', 'Bildirishnomalar', "Barcha bildirishnomalar o‘qilgan deb belgilandi");
  };

  const clearAllData = () => {
    setStudents([]);
    setCoaches([]);
    setCourts([]);
    setLessons([]);
    setGroups([]);
    setPayments([]);
    setTournaments([]);
    setRankings([]);
    setAttendance([]);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    addToast('info', 'Tozalash', "Barcha yozuvlar va ma'lumotlar butunlay tozalandi!");
  };

  // O'quvchilar
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addToast('success', 'Muvaffaqiyatli', `${studentData.fullName} o‘quvchilar safiga qo‘shildi!`);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    addToast('success', 'Yangilandi', "O‘quvchi ma’lumotlari muvaffaqiyatli yangilandi");
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'O‘chirildi', 'O‘quvchi ro‘yxatdan o‘chirildi');
  };

  const pauseStudent = (studentId: string, lastTopic: string) => {
    const today = new Date().toISOString().split('T')[0];
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'paused',
              subscriptionStatus: 'Paused',
              lastStudiedTopic: lastTopic || 'Muntazam darslar bosqichida',
              leaveDate: today,
            }
          : s
      )
    );
    addToast('info', 'O‘qish to‘xtatildi', `O‘quvchining oxirgi dars joyi saqlandi. Qaytganida shu yerdan davom ettiradi!`);
  };

  const resumeStudent = (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'active',
              subscriptionStatus: 'Active',
              returnDate: today,
            }
          : s
      )
    );
    addToast('success', 'O‘qish davom ettirildi', `O‘quvchi darslarga qayta faollashtirildi!`);
  };

  // Ustozlar
  const addCoach = (coachData: Omit<Coach, 'id'>) => {
    const newCoach: Coach = {
      ...coachData,
      id: `coach-${Date.now()}`,
      status: 'active',
    };
    setCoaches((prev) => [newCoach, ...prev]);
    addToast('success', 'Muvaffaqiyatli', `Ustoz ${coachData.fullName} tizimga qo‘shildi!`);
  };

  const updateCoach = (id: string, updated: Partial<Coach>) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast('success', 'Yangilandi', "Ustoz ma’lumotlari yangilandi");
  };

  const deleteCoach = (id: string) => {
    setCoaches((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'O‘chirildi', 'Ustoz ro‘yxatdan chiqarildi');
  };

  const replaceCoach = (oldCoachId: string, newCoachId: string) => {
    const oldCoach = coaches.find((c) => c.id === oldCoachId);
    const newCoach = coaches.find((c) => c.id === newCoachId);

    if (!oldCoach || !newCoach) {
      addToast('error', 'Xatolik', 'Ustozlar topilmadi');
      return;
    }

    setCoaches((prev) =>
      prev.map((c) =>
        c.id === oldCoachId
          ? {
              ...c,
              status: 'resigned',
              replacedByCoachId: newCoach.id,
              replacedByCoachName: newCoach.fullName,
            }
          : c
      )
    );

    setStudents((prev) =>
      prev.map((s) =>
        s.coachId === oldCoachId
          ? {
              ...s,
              coachId: newCoach.id,
              coachName: newCoach.fullName,
            }
          : s
      )
    );

    setLessons((prev) =>
      prev.map((l) =>
        l.coachId === oldCoachId
          ? {
              ...l,
              coachId: newCoach.id,
              coachName: newCoach.fullName,
            }
          : l
      )
    );

    setGroups((prev) =>
      prev.map((g) =>
        g.coachId === oldCoachId
          ? {
              ...g,
              coachId: newCoach.id,
              coachName: newCoach.fullName,
            }
          : g
      )
    );

    addToast(
      'success',
      'Ustoz almashtirildi',
      `${oldCoach.fullName}ning barcha o‘quvchilari va darslari ustoz ${newCoach.fullName}ga biriktirildi!`
    );
  };

  // Kortlar
  const addCourt = (courtData: Omit<Court, 'id'>) => {
    const newCourt: Court = {
      ...courtData,
      id: `court-${Date.now()}`,
    };
    setCourts((prev) => [...prev, newCourt]);
    addToast('success', 'Muvaffaqiyatli', `${courtData.name} yangi kort sifatida qo‘shildi!`);
  };

  const updateCourt = (id: string, updated: Partial<Court>) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast('success', 'Kort holati', 'Kort ma’lumotlari yangilandi');
  };

  const deleteCourt = (id: string) => {
    setCourts((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'O‘chirildi', 'Kort ro‘yxatdan o‘chirildi');
  };

  // Mashg'ulotlar (To'qnashuvni tekshirish)
  const checkLessonConflict = (
    date: string,
    startTime: string,
    endTime: string,
    courtId: string,
    coachId: string,
    excludeId?: string
  ): { conflict: boolean; reason?: string } => {
    const activeLessons = lessons.filter(
      (l) => l.date === date && l.status !== 'Cancelled' && l.id !== excludeId
    );

    for (const l of activeLessons) {
      const hasOverlap = startTime < l.endTime && endTime > l.startTime;
      if (hasOverlap) {
        if (l.courtId === courtId && courtId) {
          return {
            conflict: true,
            reason: `Kort band: ${l.courtName} ayni shu vaqtda (${l.startTime} - ${l.endTime}) "${l.title}" uchun band qilingan.`,
          };
        }
        if (l.coachId === coachId && coachId) {
          return {
            conflict: true,
            reason: `Ustoz band: ${l.coachName} ayni shu vaqt oralig‘ida (${l.startTime} - ${l.endTime}) boshqa darsga biriktirilgan.`,
          };
        }
      }
    }

    return { conflict: false };
  };

  const addLesson = (lessonData: Omit<LessonEvent, 'id'>) => {
    const conflictCheck = checkLessonConflict(
      lessonData.date,
      lessonData.startTime,
      lessonData.endTime,
      lessonData.courtId,
      lessonData.coachId
    );

    if (conflictCheck.conflict) {
      addToast('error', 'Vaqt to‘qnashuvi', conflictCheck.reason || 'Kort yoki ustoz band');
      return { success: false, error: conflictCheck.reason };
    }

    let color = '#27966B';
    if (lessonData.type === 'Group Lesson') color = '#2563EB';
    if (lessonData.type === 'Private Lesson') color = '#F07835';
    if (lessonData.type === 'Tournament / Camp') color = '#8B5CF6';

    const newLesson: LessonEvent = {
      ...lessonData,
      id: `les-${Date.now()}`,
      color,
    };

    setLessons((prev) => [...prev, newLesson]);
    addToast('success', 'Taqvimga kiritildi', `"${lessonData.title}" mashg‘uloti jadvalga qo‘shildi!`);
    return { success: true };
  };

  const updateLesson = (id: string, updated: Partial<LessonEvent>) => {
    const existing = lessons.find((l) => l.id === id);
    if (!existing) return { success: false, error: 'Dars topilmadi' };

    const merged = { ...existing, ...updated };
    if (
      updated.date ||
      updated.startTime ||
      updated.endTime ||
      updated.courtId ||
      updated.coachId
    ) {
      const conflictCheck = checkLessonConflict(
        merged.date,
        merged.startTime,
        merged.endTime,
        merged.courtId,
        merged.coachId,
        id
      );
      if (conflictCheck.conflict) {
        addToast('error', 'Vaqt to‘qnashuvi', conflictCheck.reason || 'Kort yoki ustoz band');
        return { success: false, error: conflictCheck.reason };
      }
    }

    setLessons((prev) =>
      prev.map((l) => (l.id === id ? merged : l))
    );
    addToast('success', 'Yangilandi', 'Dars ma’lumotlari yangilandi');
    return { success: true };
  };

  const cancelLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Cancelled', color: '#EF4444' } : l))
    );
    addToast('info', 'Bekor qilindi', 'Mashg‘ulot bekor qilindi deb belgilandi');
  };

  // Guruhlar
  const addGroup = (groupData: Omit<GroupProgram, 'id'>) => {
    const newGroup: GroupProgram = {
      ...groupData,
      id: `grp-${Date.now()}`,
    };
    setGroups((prev) => [...prev, newGroup]);
    addToast('success', 'Muvaffaqiyatli', `"${groupData.name}" yangi guruhi tashkil etildi!`);
  };

  const updateGroup = (id: string, updated: Partial<GroupProgram>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
    addToast('success', 'Yangilandi', 'Guruh ma’lumotlari yangilandi');
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    addToast('info', 'O‘chirildi', 'Guruh o‘chirildi');
  };

  // Ustoz stavkasi (foiz)
  const updateCoachSalaryRate = (coachId: string, rate: number) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === coachId ? { ...c, salaryRate: rate } : c))
    );
    addToast('success', 'Stavka belgilandi', `Ustoz stavkasi ${rate}% ga muvaffaqiyatli o‘rnatildi!`);
  };

  // Sport fanlari amallari
  const addSport = (sportData: Omit<SportSubject, 'id'>) => {
    const newSport: SportSubject = {
      ...sportData,
      id: `sport-${Date.now()}`,
    };
    setSports((prev) => [...prev, newSport]);
    addToast('success', 'Yangi fan kiritildi', `"${sportData.name}" sport fani ro‘yxatga qo‘shildi!`);
  };

  const updateSport = (id: string, updated: Partial<SportSubject>) => {
    setSports((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, ...updated } : sp))
    );
    addToast('success', 'Fan yangilandi', 'Sport ma’lumotlari saqlandi');
  };

  const deleteSport = (id: string) => {
    setSports((prev) => prev.filter((sp) => sp.id !== id));
    addToast('info', 'Fan o‘chirildi', 'Sport fani tizimdan olib tashlandi');
  };

  // Namuna sport fanlari va ma'lumotlarini qayta tiklash
  const resetToSampleSportsData = () => {
    setSports(initialSports);
    setCoaches(initialCoaches);
    setStudents(initialStudents);
    setPayments(initialPayments);
    setGroups(initialGroups);
    setCourts(initialCourts);
    setLessons(initialLessons);
    addToast('success', 'Fanlar yuklandi', 'Barcha namunaviy sport fanlari va ma’lumotlar tiklandi');
  };

  // To'lovlar
  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'invoiceNumber'>) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceNumber,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // O'quvchining oxirgi to'lov ma'lumotlarini yangilash
    if (paymentData.studentId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === paymentData.studentId
            ? {
                ...s,
                lastPaymentDate: paymentData.date,
                lastPaymentAmount: paymentData.amount,
                lastPaymentMethod: paymentData.paymentMethod,
                lastPaymentStatus: 'Paid',
                balance: (s.balance || 0) + paymentData.amount,
                subscriptionStatus: 'Active',
              }
            : s
        )
      );
    }

    addToast(
      'success',
      'To‘lov qabul qilindi',
      `${paymentData.studentName} uchun ${paymentData.amount.toLocaleString()} so‘m to‘lov qayd etildi (${invoiceNumber})`
    );
  };

  const updatePaymentStatus = (id: string, status: PaymentRecord['status']) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    addToast('success', 'To‘lov holati', `Hisob-faktura holati yangilandi`);
  };

  // Davomat
  const recordAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-${Date.now()}`,
    };
    setAttendance((prev) => {
      const filtered = prev.filter(
        (a) => !(a.studentId === recordData.studentId && a.date === recordData.date)
      );
      return [newRecord, ...filtered];
    });
    addToast('success', 'Davomat belgilandi', `${recordData.studentName}: ${recordData.status === 'Present' ? 'Keldi' : recordData.status === 'Late' ? 'Kechikdi' : recordData.status === 'Absent' ? 'Kelmadi' : 'Sababli'}`);
  };

  // Musobaqalar
  const addTournament = (tournamentData: Omit<Tournament, 'id' | 'matches'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tr-${Date.now()}`,
      matches: [],
    };
    setTournaments((prev) => [newTournament, ...prev]);
    addToast('success', 'Musobaqa ochildi', `"${tournamentData.title}" musobaqasi e’lon qilindi!`);
  };

  const updateTournament = (id: string, updated: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    addToast('success', 'Yangilandi', 'Musobaqa ma’lumotlari yangilandi');
  };

  return (
    <AcademyContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        updateCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        sports,
        students,
        coaches,
        courts,
        lessons,
        groups,
        payments,
        tournaments,
        rankings,
        attendance,
        toasts,
        addToast,
        removeToast,
        addSport,
        updateSport,
        deleteSport,
        addStudent,
        updateStudent,
        deleteStudent,
        pauseStudent,
        resumeStudent,
        addCoach,
        updateCoach,
        deleteCoach,
        replaceCoach,
        updateCoachSalaryRate,
        addCourt,
        updateCourt,
        deleteCourt,
        addLesson,
        updateLesson,
        cancelLesson,
        addGroup,
        updateGroup,
        deleteGroup,
        addPayment,
        updatePaymentStatus,
        recordAttendance,
        addTournament,
        updateTournament,
        searchQuery,
        setSearchQuery,
        notificationCount,
        clearNotifications,
        clearAllData,
        resetToSampleSportsData,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};

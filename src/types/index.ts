export type Role = 'Super Admin' | 'Administrator' | 'Coach' | 'Cashier' | 'Parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface SportSubject {
  id: string;
  name: string; // 'Boks' | 'Kurash' | 'Tennis' | 'Suzish' | 'Futbol' | 'Taekvondo' | 'Dzyudo' | 'Gimnastika'
  slug: string;
  icon: string;
  badge: string;
  color: string;
  bgGradient: string;
  monthlyFee: number;
  description: string;
}

export interface Student {
  id: string;
  fullName: string;
  photo: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  parentName: string;
  parentPhone: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Academy';
  groupId: string;
  groupName: string;
  coachId: string;
  coachName: string;
  sport?: string; // Fan / Sport turi: 'Boks', 'Kurash', 'Tennis', etc.
  registrationDate: string;
  attendanceRate: number; // percentage
  subscriptionStatus: 'Active' | 'Pending' | 'Expired' | 'Paused';
  balance: number; // UZS
  notes?: string;
  status: 'active' | 'archived' | 'paused' | 'left';
  lastStudiedTopic?: string; // Ketgan joyi / dars bosqichi
  leaveDate?: string; // Ketgan sanasi
  returnDate?: string; // Qaytib kelgan sanasi
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  lastPaymentMethod?: string;
  lastPaymentStatus?: 'Paid' | 'Pending' | 'Overdue';
}

export interface Coach {
  id: string;
  fullName: string;
  photo: string;
  email: string;
  phone: string;
  specialization: string;
  sport?: string; // Fan / Sport turi: 'Boks', 'Kurash', 'Tennis', etc.
  experienceYears: number;
  certifications: string[];
  assignedGroups: string[];
  weeklyHours: number;
  activeStudentsCount: number;
  winRate: number; // percentage
  salaryMonthly: number;
  salaryRate?: number; // Stavka foizi (masalan 40%) yoki stavka summasi
  salaryType?: 'percentage' | 'fixed_per_student';
  rating: number;
  status: 'active' | 'resigned' | 'on_leave'; // Faol, ishdan ketgan, ta'tilda
  replacedByCoachId?: string;
  replacedByCoachName?: string;
}

export interface Court {
  id: string;
  name: string;
  sport?: string; // Fan / Sport turi: 'Boks', 'Kurash', 'Tennis', 'Suzish', 'Futbol', etc.
  number: number;
  type: 'Indoor' | 'Outdoor' | 'Covered Clay';
  surface: 'Clay (Red)' | 'Hard Court (DecoTurf)' | 'Grass' | 'Plexipave';
  lighting: boolean;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Reserved';
  hourlyRate: number;
  image: string;
}

export type LessonType = 'Regular Training' | 'Group Lesson' | 'Private Lesson' | 'Tournament / Camp';
export type LessonStatus = 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled';

export interface LessonEvent {
  id: string;
  title: string;
  sport?: string; // Fan / Sport turi: 'Boks', 'Kurash', 'Tennis', 'Suzish', etc.
  type: LessonType;
  courtId: string;
  courtName: string;
  coachId: string;
  coachName: string;
  groupId?: string;
  groupName?: string;
  studentIds?: string[];
  studentNames?: string[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  participantsCount: number;
  maxParticipants: number;
  status: LessonStatus;
  notes?: string;
  color?: string;
}

export interface GroupProgram {
  id: string;
  name: string;
  sport?: string; // Fan / Sport turi: 'Boks', 'Kurash', 'Tennis', etc.
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Competition';
  ageCategory: 'Kids (6-9)' | 'Juniors (10-14)' | 'Teens (15-18)' | 'Adults (18+)';
  maxCapacity: number;
  enrolledCount: number;
  coachId: string;
  coachName: string;
  daysOfWeek: string[]; // ['Mon', 'Wed', 'Fri']
  timeSlot: string; // '16:00 - 17:30'
  monthlyPrice: number;
  progressPercentage: number;
}

export interface AttendanceRecord {
  id: string;
  lessonId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  markedByCoach: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  coachId?: string;
  coachName?: string;
  sport?: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Stripe';
  itemDescription: string;
  discountPercentage?: number;
}

export interface TournamentMatch {
  id: string;
  round: string;
  player1: string;
  player2: string;
  score: string;
  winner?: string;
  court: string;
  scheduledTime: string;
  completed: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  category: string;
  surface: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  entryFee: number;
  prizePool: number;
  status: 'Upcoming' | 'In Progress' | 'Finished';
  participantsCount: number;
  maxParticipants: number;
  matches: TournamentMatch[];
}

export interface PlayerRanking {
  rank: number;
  previousRank: number;
  playerId: string;
  playerName: string;
  photo: string;
  category: string;
  points: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  titlesWon: number;
}

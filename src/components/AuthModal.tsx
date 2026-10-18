import React, { useState } from 'react';
import { X, UserPlus, LogIn, Shield, Phone, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Role } from '../types';
import { ImageUploader } from './ImageUploader';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, updateCurrentUser, addToast } =
    useAcademy();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Ro'yxatdan o'tish forma maydonlari
  const [name, setName] = useState(currentUser.name || '');
  const [role, setRole] = useState<Role>(currentUser.role || 'Super Admin');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [email, setEmail] = useState(currentUser.email || 'admin@tenisrekord.uz');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [password, setPassword] = useState('');

  // Login forma maydonlari
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Xatolik', 'Iltimos, ism va familiyangizni kiriting');
      return;
    }

    // Default avatar agar tanlanmagan bo'lsa
    const finalAvatar =
      avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    updateCurrentUser({
      name,
      role,
      email,
      avatar: finalAvatar,
    });

    addToast('success', 'Xush kelibsiz!', `${name}, ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!`);
    setIsAuthModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      addToast('error', 'Xatolik', 'Elektron pochta yoki telefoningizni kiriting');
      return;
    }

    // Login simulyatsiyasi
    updateCurrentUser({
      name: name || 'Foydalanuvchi',
      email: loginEmail,
    });

    addToast('success', 'Tizimga kirildi', 'Xush kelibsiz, hisobingizga muvaffaqiyatli kirdingiz.');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Yuqori qism: Sarlavha va yopish */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#092D24] text-[#A3E635] flex items-center justify-center font-bold text-lg shadow-sm">
              🎾
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                Tenis<span className="text-[#27966B]">rekord</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {activeTab === 'register' ? 'Yangi hisob ro‘yxatdan o‘tkazish' : 'Tizimga kirish'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tablar: Ro'yxatdan o'tish & Kirish */}
        <div className="flex bg-gray-100 p-1 rounded-2xl my-5">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <UserPlus size={15} />
            Ro‘yxatdan o‘tish
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LogIn size={15} />
            Kirish
          </button>
        </div>

        {activeTab === 'register' ? (
          /* ================== RO'YXATDAN O'TISH FORMASI ================== */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Rasm qo'yish (Image Upload) */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <ImageUploader
                value={avatar}
                onChange={setAvatar}
                label="Profil uchun rasm yuklash (Rasm qo‘yish)"
                placeholderText="Shaxsiy fotosuratingizni tanlang"
                size="md"
              />
            </div>

            {/* Ism va Familiya */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                To‘liq Ism-Familiya *
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Sardor Aliyev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] focus:outline-none font-medium"
              />
            </div>

            {/* Rol tanlash */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Tizimdagi Lavozim / Rol *
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium appearance-none bg-white pr-9"
                >
                  <option value="Super Admin">Bosh Administrator (Super Admin)</option>
                  <option value="Administrator">Administrator / Menejer</option>
                  <option value="Coach">Katta Murabbiy</option>
                  <option value="Cashier">Buxgalter / Kassir</option>
                  <option value="Parent">Ota-ona / Foydalanuvchi</option>
                </select>
                <Shield size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Telefon & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Telefon Raqam</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium"
                  />
                  <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Elektron Pochta</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@tenisrekord.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium"
                  />
                  <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Parol */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Parol o‘ylab toping</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium"
                />
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Tugma */}
            <button
              type="submit"
              className="w-full bg-[#27966B] hover:bg-[#1f7c57] text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-5 text-sm"
            >
              <CheckCircle2 size={18} />
              Ro‘yxatdan o‘tish va Saqlash
            </button>
          </form>
        ) : (
          /* ================== TIZIMGA KIRISH (LOGIN) FORMASI ================== */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Elektron pochta yoki Telefon raqam *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@tenisrekord.uz yoki +998 90 ..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium"
                />
                <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Parol *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27966B] font-medium"
                />
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#092D24] hover:bg-[#07241d] text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-5 text-sm"
            >
              <LogIn size={18} />
              Tizimga kirish
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAcademy();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
            <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-white/60 hover:text-white p-0.5 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

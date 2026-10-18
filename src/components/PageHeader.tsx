import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
}) => {
  return (
    <div className="bg-[#0C1E34] text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-[#162E4D] mb-8 relative overflow-hidden">
      {/* Orqa fon abstrakt sport nuri */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#00C2FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute right-20 -bottom-20 w-48 h-48 rounded-full bg-[#FF5B26]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-sport text-3xl sm:text-4xl text-white m-0 tracking-wide">
              {title}
            </h1>
            {badge && (
              <span className="bg-[#FF5B26] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-2 text-gray-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
};

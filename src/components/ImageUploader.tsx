import React, { useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg';
  placeholderText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Rasm yuklash',
  shape = 'circle',
  size = 'md',
  placeholderText = 'Rasm tanlang yoki shu yerga tashlang',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Rasm hajmi tekshiruvi (masalan, 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Rasm hajmi juda katta (maksimal 5MB bo‘lishi lozim)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
  }[size];

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div className="space-y-1.5">
      {label && <label className="block font-bold text-gray-700 text-xs">{label}</label>}
      <div className="flex items-center gap-4">
        {/* Yashirin file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Rasm ko'rinishi / Yuklash tugmasi */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative ${sizeClasses} ${roundedClass} border-2 border-dashed border-[#27966B]/40 hover:border-[#27966B] bg-[#0E3D31]/5 hover:bg-[#0E3D31]/10 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-xs`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Yuklangan rasm"
                className={`w-full h-full object-cover ${roundedClass}`}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold">
                <Camera size={18} className="mb-0.5" />
                <span>O‘zgartirish</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2 text-[#27966B]">
              <Upload size={size === 'sm' ? 16 : 22} className="group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-bold leading-tight">Rasm qo‘yish</span>
            </div>
          )}
        </div>

        {/* Boshqaruv tugmalari va tavsif */}
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#27966B]/10 hover:bg-[#27966B]/20 text-[#27966B] font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <Camera size={14} />
              {value ? 'Boshqa rasm tanlash' : 'Kompyuterdan tanlash'}
            </button>
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="Rasmni o‘chirish"
              >
                <Trash2 size={13} />
                O‘chirish
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {placeholderText} (PNG, JPG, WEBP, maks. 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CouBouDropdownProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  buttonClassName?: string;
  showPlaceholder?: boolean;
}

export const CouBouDropdown: React.FC<CouBouDropdownProps> = ({
  id = 'cou-bou-dropdown',
  value,
  onChange,
  className = '',
  buttonClassName = '',
  showPlaceholder = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = showPlaceholder ? ['Select Type', 'BOU', 'COU'] : ['BOU', 'COU'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`} id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-3.5 py-1.5 text-sm bg-white border border-slate-300 rounded text-slate-700 hover:border-slate-400 focus:outline-none transition-colors min-w-[100px] ${buttonClassName}`}
      >
        <span className="font-normal">{value || 'Select Type'}</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full min-w-[130px] bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-sm">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt === 'Select Type' ? 'Select Type' : opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-[13.5px] transition-colors ${
                  isSelected
                    ? 'bg-slate-100 font-medium text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#FF6B11]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

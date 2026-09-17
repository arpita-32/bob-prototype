import React from 'react';
import { X, Check } from 'lucide-react';

interface UserCreatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserCreatedSuccessModal: React.FC<UserCreatedSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="user-created-success-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150"
    >
      <div
        id="user-created-success-modal-card"
        className="bg-white rounded-lg shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            User Created Successfully
          </h2>
          <button
            type="button"
            id="close-success-modal-button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* User network avatar icon formation matching the screenshot */}
          <div className="relative w-28 h-24 mb-5 flex items-center justify-center">
            {/* Top avatar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-slate-300 mt-1" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF6B11] rounded-full flex items-center justify-center text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Bottom-left avatar */}
            <div className="absolute bottom-1 left-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-slate-300 mt-1" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF6B11] rounded-full flex items-center justify-center text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Bottom-right avatar */}
            <div className="absolute bottom-1 right-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-slate-300 mt-1" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF6B11] rounded-full flex items-center justify-center text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          {/* Descriptive text */}
          <p className="text-xs text-slate-600 leading-relaxed max-w-[340px] mb-6">
            The user has been created successfully. The user will receive their
            credentials on the respective mobile number and email ID
          </p>

          {/* OK Action button */}
          <button
            type="button"
            id="user-created-success-ok-button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e35a05] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

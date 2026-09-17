import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

interface RejectUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName?: string;
}

export const RejectUserModal: React.FC<RejectUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please enter the reason for rejection');
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setErrorMsg(null);
  };

  return (
    <div
      id="reject-user-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150"
    >
      <div
        id="reject-user-modal-card"
        className="bg-white rounded-lg shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Reject User</h2>
          <button
            type="button"
            id="close-reject-modal-button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Centered Document Illustration with Red ❌ Stamp */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-20 bg-slate-50 border border-slate-200 rounded-md shadow-sm flex flex-col p-2 space-y-1.5">
                <div className="w-8 h-1.5 bg-slate-200 rounded" />
                <div className="w-11 h-1.5 bg-slate-200 rounded" />
                <div className="w-9 h-1.5 bg-slate-200 rounded" />
                <div className="w-10 h-1.5 bg-slate-200 rounded" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
                <X className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded mb-4">
              {errorMsg}
            </div>
          )}

          {/* Reason of Rejection Field */}
          <div className="space-y-1.5 mb-6">
            <label className="block text-xs font-medium text-slate-700">
              Reason of Rejection<span className="text-[#FF6B11]">*</span>
            </label>
            <input
              type="text"
              id="input-rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter Reason of Rejection"
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            id="send-for-resubmission-button"
            className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e35a05] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
          >
            Send for Re-Submission
          </button>
        </form>
      </div>
    </div>
  );
};

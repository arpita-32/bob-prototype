import React from 'react';
import {
  Mail,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Lock,
  User,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { BillerCredentials } from '../types';

interface EmailSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: BillerCredentials | null;
  onOpenBillerPortal: (billerId: string, username: string) => void;
}

export const EmailSimulationModal: React.FC<EmailSimulationModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onOpenBillerPortal,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!isOpen || !credentials) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Email Client Window Header (Mac / Outlook style) */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-[#FF6B11]" />
              <span className="font-semibold text-white">Bank of Baroda Mail Simulation</span>
              <span className="text-[10px] bg-orange-500/20 text-[#FF8238] border border-orange-500/30 px-1.5 py-0.2 rounded font-mono">
                Automated Dispatch
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Meta Info */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Subject:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Complete Your Biller KYC - Bank of Baroda BBPS Onboarding</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">From:</span>
            <span className="text-slate-700 font-mono text-[11.5px]">
              biller-onboarding@bankofbaroda.co.in &lt;BBPS Operations Desk&gt;
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">To:</span>
            <span className="text-slate-800 font-medium font-mono text-[11.5px]">
              {credentials.billerName} &lt;{credentials.email}&gt;
            </span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 space-y-5 text-slate-700 text-xs sm:text-[13px] leading-relaxed max-h-[70vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-snug">Bank of Baroda Biller Portal</h4>
                <p className="text-[11px] text-orange-100">National Payments Corporation of India (BBPS)</p>
              </div>
            </div>
            <div className="hidden sm:block text-right text-[11px] text-orange-100 font-mono">
              BBPS Ver 2.0 BOU
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-900 text-sm">
              Dear {credentials.billerName} Team,
            </p>
            <p className="mt-2 text-slate-600">
              Your Biller onboarding request has been initiated successfully by Bank of Baroda BBPS Operations.
              Please complete your KYC and biller configuration using the secure Biller Portal to activate your billing services.
            </p>
          </div>

          {/* Credentials Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-[#FF6B11]" />
              <span>Your Biller Portal Credentials :</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Biller ID */}
              <div className="bg-white border border-slate-200 rounded-md p-2.5">
                <span className="text-[10.5px] font-semibold text-slate-400 block uppercase">
                  Biller ID
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {credentials.billerId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(credentials.billerId, 'billerId')}
                    className="text-slate-400 hover:text-[#FF6B11] p-1 rounded cursor-pointer"
                    title="Copy Biller ID"
                  >
                    {copiedField === 'billerId' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className="bg-white border border-slate-200 rounded-md p-2.5">
                <span className="text-[10.5px] font-semibold text-slate-400 block uppercase">
                  Username
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {credentials.username}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(credentials.username, 'username')}
                    className="text-slate-400 hover:text-[#FF6B11] p-1 rounded cursor-pointer"
                    title="Copy Username"
                  >
                    {copiedField === 'username' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Temporary Password */}
              <div className="bg-white border border-slate-200 rounded-md p-2.5">
                <span className="text-[10.5px] font-semibold text-slate-400 block uppercase">
                  Temporary Password
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-[#FF6B11] text-xs">
                    {credentials.tempPassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(credentials.tempPassword, 'password')}
                    className="text-slate-400 hover:text-[#FF6B11] p-1 rounded cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedField === 'password' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Note: You will be asked to complete Organization Details, API Configuration / Offline Parameters, POC Contacts, and KYC Documents.
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              id="btn-open-biller-portal-from-email"
              onClick={() => {
                onClose();
                onOpenBillerPortal(credentials.billerId, credentials.username);
              }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-[#FF6B11] hover:bg-[#e05a07] active:bg-[#c94f05] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Open Biller Portal & Complete KYC</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Clicking this button will switch you directly to the Biller Portal.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            <p>Regards,</p>
            <p className="font-semibold text-slate-700">Bank of Baroda BBPS Onboarding Unit</p>
            <p>Digital Banking & Fintech Operations Department</p>
          </div>
        </div>
      </div>
    </div>
  );
};

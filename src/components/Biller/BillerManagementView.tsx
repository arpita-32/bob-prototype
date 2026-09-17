import React, { useState } from 'react';
import { NavItem } from '../../types';
import { BillerVerificationView } from './BillerVerificationView';
import { BillerListView } from './BillerListView';

interface BillerManagementViewProps {
  initialTab?: 'Verification' | 'Directory';
  onNavigate?: (nav: NavItem) => void;
}

export const BillerManagementView: React.FC<BillerManagementViewProps> = ({
  initialTab = 'Verification',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'Verification' | 'Directory'>(initialTab);

  return (
    <div>
      {/* Top Tab Switcher */}
      <div className="bg-white border-b border-slate-200 px-6 pt-3 flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('Verification')}
          className={`pb-3 font-medium text-xs sm:text-sm border-b-2 transition-colors relative ${
            activeTab === 'Verification'
              ? 'text-[#FF6B11] border-[#FF6B11]'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <span>Biller Verification & Onboarding</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Directory')}
          className={`pb-3 font-medium text-xs sm:text-sm border-b-2 transition-colors relative ${
            activeTab === 'Directory'
              ? 'text-[#FF6B11] border-[#FF6B11]'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <span>Biller Directory & Management</span>
        </button>
      </div>

      {/* Render selected view */}
      {activeTab === 'Verification' ? (
        <BillerVerificationView onNavigate={onNavigate} />
      ) : (
        <BillerListView onNavigate={onNavigate} />
      )}
    </div>
  );
};

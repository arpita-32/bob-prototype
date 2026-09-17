import React, { useState } from 'react';
import { ManagedUser } from '../../types';
import { RejectUserModal } from './RejectUserModal';

interface VerifyUserDetailViewProps {
  user: ManagedUser;
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
  onBack: () => void;
}

export const VerifyUserDetailView: React.FC<VerifyUserDetailViewProps> = ({
  user,
  onApprove,
  onReject,
  onBack,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Derive first name and last name
  const firstName = user.firstName || user.fullName.split(' ')[0] || 'Survesh';
  const lastName =
    user.lastName ||
    (user.fullName.split(' ').length > 1 ? user.fullName.split(' ').slice(1).join(' ') : 'Singla');
  const displayName = user.fullName || `${firstName} ${lastName}`;

  const handleConfirmReject = (reason: string) => {
    onReject(user.id, reason);
    setRejectModalOpen(false);
  };

  return (
    <div id="verify-user-detail-screen" className="p-6 max-w-full font-sans select-none">
      {/* Top Breadcrumb & Page Title */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          <span
            onClick={onBack}
            className="hover:text-[#FF6B11] cursor-pointer transition-colors"
          >
            User Management
          </span>{' '}
          /{' '}
          <span
            onClick={onBack}
            className="hover:text-[#FF6B11] cursor-pointer transition-colors"
          >
            Verify User
          </span>{' '}
          / <span className="text-slate-900">{displayName}</span>
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="border-b border-slate-200 px-6 pt-4">
          <div className="flex items-center gap-8">
            <button
              type="button"
              id="tab-basic-details"
              className="pb-3 text-xs font-semibold text-[#FF6B11] border-b-2 border-[#FF6B11] tracking-wide"
            >
              Basic Details
            </button>
          </div>
        </div>

        {/* User Details Grid (3 columns layout as in Screenshot 4) */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
            {/* Row 1 */}
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                First Name
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {firstName}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Last Name
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {lastName}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Employee ID
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.employeeId || 'BOB_123'}
              </span>
            </div>

            {/* Row 2 */}
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Username
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.username || 'John_Doe'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Email
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.email || 'Survesh.S@Gmail.Com'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Mobile Number
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.mobile || '9915670468'}
              </span>
            </div>

            {/* Row 3 */}
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                User Role
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.role || 'BOB_AGENT'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Created Date
              </span>
              <span className="block text-sm font-medium text-slate-800">
                {user.createdDate || '12.08.2024'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="border-t border-slate-100 px-8 py-5 flex items-center justify-end gap-6 bg-white">
          <button
            type="button"
            id="approve-user-button"
            onClick={() => onApprove(user.id)}
            className="px-10 py-2 bg-[#FF6B11] hover:bg-[#e35a05] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
          >
            Approve
          </button>
          <button
            type="button"
            id="reject-user-button"
            onClick={() => setRejectModalOpen(true)}
            className="text-xs font-semibold text-[#FF6B11] hover:text-[#d94f04] hover:underline cursor-pointer transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Reject User Popup Modal */}
      <RejectUserModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        userName={displayName}
      />
    </div>
  );
};

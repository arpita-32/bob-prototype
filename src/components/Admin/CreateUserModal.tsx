import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ManagedUser } from '../../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: ManagedUser) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [userRole, setUserRole] = useState('Admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setUserName('');
    setFirstName('');
    setLastName('');
    setEmployeeId('');
    setMobileNumber('');
    setEmailId('');
    setUserRole('Admin');
    setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userName.trim()) {
      setErrorMsg('Please enter User Name');
      return;
    }
    if (!firstName.trim()) {
      setErrorMsg('Please enter First Name');
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg('Please enter Last Name');
      return;
    }
    if (!employeeId.trim()) {
      setErrorMsg('Please enter Employee ID');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMsg('Please enter Mobile Number');
      return;
    }
    if (!emailId.trim()) {
      setErrorMsg('Please enter Email ID');
      return;
    }
    if (!userRole || userRole === 'Select User Role') {
      setErrorMsg('Please select a User Role');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');

    const newUser: ManagedUser = {
      id: `USR-${Date.now()}`,
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: userName.trim(),
      employeeId: employeeId.trim(),
      mobile: mobileNumber.startsWith('+') ? mobileNumber.trim() : `+91 ${mobileNumber.trim()}`,
      email: emailId.trim(),
      role: userRole,
      status: 'Pending',
      verificationStatus: 'Pending',
      createdDate: currentDate,
      createdBy: 'BOB_ADMIN',
    };

    onSubmit(newUser);
  };

  return (
    <div
      id="create-user-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150"
    >
      <div
        id="create-user-modal-card"
        className="bg-white rounded-lg shadow-2xl w-full max-w-[620px] overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Create User</h2>
          <button
            type="button"
            id="close-create-user-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {errorMsg}
            </div>
          )}

          {/* Form Fields: 2 Columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* User Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                User Name<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="text"
                id="input-user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter User Name"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                First Name<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="text"
                id="input-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Last Name<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="text"
                id="input-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Employee ID<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="text"
                id="input-employee-id"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Mobile Number<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="tel"
                id="input-mobile-number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Email ID<span className="text-[#FF6B11]">*</span>
              </label>
              <input
                type="email"
                id="input-email-id"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter Email ID"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
            </div>

            {/* User Role */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                User Role<span className="text-[#FF6B11]">*</span>
              </label>
              <select
                id="select-user-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] text-slate-700 bg-white cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Maker">Maker</option>
                <option value="Checker">Checker</option>
                <option value="BOB_AGENT">BOB_AGENT</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              id="submit-create-user-button"
              className="px-8 py-2 bg-[#FF6B11] hover:bg-[#e35a05] text-white text-xs font-medium rounded transition-colors cursor-pointer shadow-xs"
            >
              Create
            </button>
            <button
              type="button"
              id="reset-create-user-button"
              onClick={handleReset}
              className="px-8 py-2 border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

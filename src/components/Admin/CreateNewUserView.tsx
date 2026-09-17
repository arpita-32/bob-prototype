import React, { useState } from 'react';
import {
  UserPlus,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  Send,
  Eye,
  Info,
} from 'lucide-react';
import { ManagedUser, NavItem } from '../../types';

interface CreateNewUserViewProps {
  onAddUser: (user: ManagedUser) => void;
  onNavigateTab: (tab: 'create' | 'verify') => void;
  pendingCount: number;
  recentUsers: ManagedUser[];
}

export const CreateNewUserView: React.FC<CreateNewUserViewProps> = ({
  onAddUser,
  onNavigateTab,
  pendingCount,
  recentUsers,
}) => {
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'Maker' | 'Checker' | 'Admin'>('Maker');
  const [userId, setUserId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Digital Banking Operations');
  const [zone, setZone] = useState('Corporate Centre Mumbai');
  const [branchCode, setBranchCode] = useState('HO-MUMBAI-01');
  const [remarks, setRemarks] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'Internet Banking (Post-login)',
    'Mobile Banking (Bob World)',
    'UPI (BHIM Baroda Pay)',
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const availableChannels = [
    'Internet Banking (Post-login)',
    'Mobile Banking (Bob World)',
    'UPI (BHIM Baroda Pay)',
    'Internet Banking (Pre-login)',
    'Jio Feature Phone',
    'UPI123Pay',
    'Biller Onboarding Module',
    'Agent / AI Management',
    'Report & Reconciliation',
  ];

  const handleChannelToggle = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleAutoGenerateUserId = () => {
    const fNameClean = firstName.trim().replace(/[^a-zA-Z]/g, '').toUpperCase() || 'USER';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generated = `BOB_${fNameClean}_${role.toUpperCase()}_${randomDigits}`;
    setUserId(generated);
    if (!employeeId) {
      setEmployeeId(`BOB-EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setMobile('');
    setRole('Maker');
    setUserId('');
    setEmployeeId('');
    setDepartment('Digital Banking Operations');
    setZone('Corporate Centre Mumbai');
    setBranchCode('HO-MUMBAI-01');
    setRemarks('');
    setSelectedChannels([
      'Internet Banking (Post-login)',
      'Mobile Banking (Bob World)',
      'UPI (BHIM Baroda Pay)',
    ]);
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setFormError('Please enter user First Name and Last Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid official Email Address.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setFormError('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!userId.trim()) {
      setFormError('Please enter or generate a User ID / Login ID.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newUser: ManagedUser = {
      id: `USR-${Date.now()}`,
      fullName,
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      role,
      username: userId.trim().toUpperCase(),
      employeeId: employeeId.trim() || `BOB-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending Verification' as any,
      verificationStatus: 'Pending',
      createdDate: currentDate,
      createdTime: currentTime,
      createdBy: 'Biswanath Admin',
      department,
      zone,
      branchCode,
      channelAccess: selectedChannels,
      remarks: remarks.trim() || `New ${role} user registration initiated for BBPS Operations.`,
    };

    onAddUser(newUser);
    setSuccessToast(`User "${fullName}" (${userId}) submitted successfully for Checker verification!`);
    handleResetForm();

    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  return (
    <div id="create-new-user-view" className="p-6 max-w-[1400px] mx-auto space-y-6 select-none font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-900 text-white text-xs px-4 py-3.5 rounded-lg shadow-xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-semibold text-[13px]">Submission Successful</div>
            <div className="text-emerald-100 text-[11.5px] mt-0.5">{successToast}</div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('verify')}
            className="ml-3 px-2.5 py-1 bg-white text-emerald-900 text-[11px] font-bold rounded hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Verify Now &rarr;
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs text-slate-500 font-normal flex items-center gap-1.5">
            <span>Admin</span>
            <span className="text-slate-400">/</span>
            <span>User Management</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#FF6B11] font-semibold">Create New User</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Create New User
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Initiate and register new Bank of Baroda Maker, Checker, or Admin users with role-based access control.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            type="button"
            id="tab-btn-create-user"
            onClick={() => onNavigateTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-[#FF6B11] text-white shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>

          <button
            type="button"
            id="tab-btn-verify-user"
            onClick={() => onNavigateTab('verify')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verify User</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (2/3), Right Side Info & Recent (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50/50 via-white to-transparent border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#FF6B11] flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">User Onboarding Form</h2>
                  <p className="text-[11px] text-slate-500">
                    Fields marked with <span className="text-red-500 font-bold">*</span> are mandatory
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                Step 1: Maker Creation &rarr; Step 2: Checker Verification
              </span>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 1. Basic User Identity */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B11]" />
                  <span>1. User Identity & Personal Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Verma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="ramesh.verma@bankofbaroda.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Login ID & Employee ID */}
              <div className="space-y-3.5 pt-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Shield className="w-3.5 h-3.5 text-[#FF6B11]" />
                  <span>2. Authentication & Role Assignment</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        User ID / Login ID <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateUserId}
                        className="text-[11px] font-semibold text-[#FF6B11] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. BOB_RAMESH_MAKER"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.toUpperCase())}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 font-mono uppercase placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Employee ID / Staff No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BOB-EMP-9821"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 font-mono uppercase placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]"
                    />
                  </div>
                </div>

                {/* Role Radio Cards */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select User Role <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`p-3.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                        role === 'Maker'
                          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">Maker Role</span>
                        <input
                          type="radio"
                          name="userRole"
                          checked={role === 'Maker'}
                          onChange={() => setRole('Maker')}
                          className="accent-blue-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Can create & initiate Biller onboarding and register Agent entities.
                      </p>
                    </label>

                    <label
                      className={`p-3.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                        role === 'Checker'
                          ? 'border-[#FF6B11] bg-orange-50/50 ring-1 ring-[#FF6B11]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FF6B11]">Checker Role</span>
                        <input
                          type="radio"
                          name="userRole"
                          checked={role === 'Checker'}
                          onChange={() => setRole('Checker')}
                          className="accent-[#FF6B11]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Can review, verify, approve, or reject Biller KYC submissions.
                      </p>
                    </label>

                    <label
                      className={`p-3.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                        role === 'Admin'
                          ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700">Admin Role</span>
                        <input
                          type="radio"
                          name="userRole"
                          checked={role === 'Admin'}
                          onChange={() => setRole('Admin')}
                          className="accent-purple-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Full administrative management for user onboarding and system control.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Department, Zone, Branch */}
              <div className="space-y-3.5 pt-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B11]" />
                  <span>3. Organizational Placement</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                    >
                      <option value="Digital Banking Operations">Digital Banking Operations</option>
                      <option value="BBPS Central Operations">BBPS Central Operations</option>
                      <option value="Audit, Risk & Compliance">Audit, Risk & Compliance</option>
                      <option value="IT & Information Security">IT & Information Security</option>
                      <option value="Retail Assets & Payments">Retail Assets & Payments</option>
                      <option value="Branch Banking & Operations">Branch Banking & Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Zone / Region
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                    >
                      <option value="Corporate Centre Mumbai">Corporate Centre Mumbai</option>
                      <option value="Baroda Zone">Baroda Zone</option>
                      <option value="Delhi Zone">Delhi Zone</option>
                      <option value="Bengaluru Zone">Bengaluru Zone</option>
                      <option value="Kolkata Zone">Kolkata Zone</option>
                      <option value="Lucknow Zone">Lucknow Zone</option>
                      <option value="Ahmedabad Zone">Ahmedabad Zone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Branch / Office Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HO-MUMBAI-01"
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Channel Access & Permissions */}
              <div className="space-y-3.5 pt-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Shield className="w-3.5 h-3.5 text-[#FF6B11]" />
                  <span>4. Channel & Feature Permissions</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableChannels.map((channel) => {
                    const isSelected = selectedChannels.includes(channel);
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => handleChannelToggle(channel)}
                        className={`text-left p-2.5 rounded-md border text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B11] bg-orange-50/40 text-slate-800 font-medium'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#FF6B11] bg-[#FF6B11] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate text-[11.5px]">{channel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Remarks */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Maker Justification / Onboarding Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide justification or notes for Checker verification..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Form</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    id="btn-submit-user-verification"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] active:bg-[#c94f05] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Checker Verification</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Workflow Guidelines & Recent Submissions */}
        <div className="space-y-6">
          {/* Dual-Control Maker-Checker Guide Box */}
          <div className="bg-slate-900 text-white rounded-lg p-5 shadow-xs border border-slate-800">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#FF6B11] flex items-center justify-center text-white shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Dual Control Protocol
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with Bank of Baroda & NPCI BBPS security compliance, all user creations follow a strict{' '}
              <strong className="text-orange-400">Maker-Checker</strong> authorization rule:
            </p>
            <ul className="mt-3 space-y-2 text-[11.5px] text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Maker</strong> creates user request in this page.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  User enters <strong className="text-amber-400">Pending Verification</strong> queue.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Checker</strong> reviews and approves in <strong>Verify User</strong> page.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Pending Checker Queue:</span>
              <button
                type="button"
                onClick={() => onNavigateTab('verify')}
                className="text-xs font-bold text-[#FF6B11] hover:text-orange-400 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View {pendingCount} Pending</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Recent Submissions List */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Submissions</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('verify')}
                className="text-[11px] font-semibold text-[#FF6B11] hover:underline cursor-pointer"
              >
                Go to Verification &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-md bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-[12px] truncate">
                      {user.fullName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      {user.username} &bull; {user.role}
                    </div>
                    <div className="text-[10.5px] text-slate-400 mt-1">
                      Created: {user.createdDate}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold border ${
                        user.verificationStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : user.verificationStatus === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {user.verificationStatus === 'Pending'
                        ? 'Pending'
                        : user.verificationStatus || user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

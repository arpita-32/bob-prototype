import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { AgentEntity, NavItem } from '../../types';

interface CreateAgentViewProps {
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  onAgentCreated?: (agent: AgentEntity) => void;
}

export const CreateAgentView: React.FC<CreateAgentViewProps> = ({
  onNavigate,
  onAgentCreated,
}) => {
  // 1. AI Basic Details State
  const [aiId, setAiId] = useState('');
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState('Private Limited');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState('');

  // 2. Admin / Primary Contact Details State
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // 3. Wallet Ceiling State
  const [walletCeilingEnabled, setWalletCeilingEnabled] = useState<boolean>(true);
  const [walletType, setWalletType] = useState<string>('Fixed Wallet');
  const [dailyLimit, setDailyLimit] = useState<string>('10,00,000');
  const [transactionLimit, setTransactionLimit] = useState<string>('1,00,000');

  // Validation errors
  const [errors, setErrors] = useState<{
    aiId?: string;
    entityName?: string;
    pan?: string;
    pinCode?: string;
    adminEmail?: string;
    walletType?: string;
    dailyLimit?: string;
    transactionLimit?: string;
  }>({});

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: {
      aiId?: string;
      entityName?: string;
      pan?: string;
      pinCode?: string;
      adminEmail?: string;
      walletType?: string;
      dailyLimit?: string;
      transactionLimit?: string;
    } = {};

    // AI ID Validation
    if (!aiId.trim()) {
      newErrors.aiId = 'AI ID is required';
    } else if (aiId.trim().length < 3) {
      newErrors.aiId = 'AI ID must be at least 3 characters long';
    }

    // Entity Name Validation
    if (!entityName.trim()) {
      newErrors.entityName = 'Entity / AI Name is required';
    }

    // PAN Validation (Optional format check if entered)
    if (pan.trim() && pan.trim().length !== 10) {
      newErrors.pan = 'PAN must be 10 characters long';
    }

    // PIN Code Validation (Optional format check if entered)
    if (pinCode.trim() && pinCode.trim().length !== 6) {
      newErrors.pinCode = 'PIN Code must be 6 digits';
    }

    // Admin Email Validation (Optional format check if entered)
    if (adminEmail.trim() && !adminEmail.includes('@')) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }

    // Wallet Ceiling Validation (when enabled)
    if (walletCeilingEnabled) {
      if (!walletType) {
        newErrors.walletType = 'Please select a Wallet Type';
      }

      const dailyNum = parseInt(dailyLimit.replace(/[^0-9]/g, ''), 10);
      if (!dailyLimit.trim()) {
        newErrors.dailyLimit = 'Daily Limit is required when wallet ceiling is enabled';
      } else if (isNaN(dailyNum) || dailyNum <= 0) {
        newErrors.dailyLimit = 'Daily Limit must be a valid positive amount';
      }

      const txnNum = parseInt(transactionLimit.replace(/[^0-9]/g, ''), 10);
      if (!transactionLimit.trim()) {
        newErrors.transactionLimit = 'Transaction Limit is required when wallet ceiling is enabled';
      } else if (isNaN(txnNum) || txnNum <= 0) {
        newErrors.transactionLimit = 'Transaction Limit must be a valid positive amount';
      } else if (!isNaN(dailyNum) && txnNum > dailyNum) {
        newErrors.transactionLimit = 'Transaction Limit cannot exceed Daily Limit';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAi = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedAiId = aiId.trim();
    const finalName = entityName.trim() || `${trimmedAiId.toUpperCase()} Entity`;
    const finalPan = pan.trim().toUpperCase() || `AABC${Math.floor(1000 + Math.random() * 9000)}F`;

    const newAiEntity: AgentEntity = {
      id: Date.now().toString(),
      aiId: trimmedAiId,
      entityNpciId: trimmedAiId.toUpperCase(),
      name: finalName,
      pan: finalPan,
      type: 'AI',
      npciId: trimmedAiId.toUpperCase(),
      entityType: entityType,
      gstin: gstin.trim().toUpperCase() || undefined,
      pinCode: pinCode.trim() || undefined,
      registeredAddress: registeredAddress.trim() || undefined,
      adminFirstName: adminFirstName.trim() || undefined,
      adminLastName: adminLastName.trim() || undefined,
      adminPhone: adminPhone.trim() || undefined,
      adminEmail: adminEmail.trim() || undefined,
      walletBalance: walletCeilingEnabled ? '₹0' : '—',
      walletBalanceNum: 0,
      dailyLimit: walletCeilingEnabled ? dailyLimit.trim() : '—',
      dailyLimitNum: walletCeilingEnabled
        ? parseInt(dailyLimit.replace(/[^0-9]/g, ''), 10) || 0
        : 0,
      transactionLimit: walletCeilingEnabled ? transactionLimit.trim() : '—',
      status: 'Active',
      walletCeilingEnabled: walletCeilingEnabled,
      walletStatus: walletCeilingEnabled ? 'Active' : 'No Wallet Limit',
      walletType: walletCeilingEnabled ? walletType : undefined,
      onboardedAgents: [
        {
          id: `ag-${Date.now()}-1`,
          agentId: `AG00${Math.floor(1 + Math.random() * 9)}`,
          agentName: `${finalName} Primary Outlet`,
          agentStatus: 'Active',
          walletStatus: 'No Wallet Limit',
          walletLimitConfigured: false,
        },
      ],
    };

    if (onAgentCreated) {
      onAgentCreated(newAiEntity);
    }

    setToastMessage(`AI Entity "${trimmedAiId.toUpperCase()}" created successfully!`);

    setTimeout(() => {
      onNavigate('AI List', newAiEntity);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1050px] mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-xl border border-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center text-xs text-slate-500 font-normal">
        <span>Admin</span>
        <span className="mx-2 text-slate-400">/</span>
        <span>Agent Institution</span>
        <span className="mx-2 text-slate-400">/</span>
        <button
          type="button"
          onClick={() => onNavigate('AI List')}
          className="hover:text-[#FF6B11] hover:underline cursor-pointer"
        >
          AI
        </button>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">Create AI</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create AI</h1>
        <p className="text-xs text-slate-500 mt-1">
          Define the AI identification details, entity information, primary contact, and AI-level wallet ceiling policy.
        </p>
      </div>

      {/* Main Creation Form Card */}
      <form onSubmit={handleCreateAi} className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs space-y-8">
        
        {/* SECTION 1: AI BASIC DETAILS */}
        <div>
          <div className="border-b border-slate-100 pb-3 mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B11]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                AI Basic Details
              </h2>
              <p className="text-xs text-slate-500">
                Specify the AI ID, institution name, and tax registration credentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. AI ID */}
            <div className="space-y-1.5">
              <label htmlFor="ai-id-input" className="block text-xs font-semibold text-slate-700">
                AI ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="ai-id-input"
                type="text"
                value={aiId}
                onChange={(e) => {
                  setAiId(e.target.value);
                  if (errors.aiId) setErrors((prev) => ({ ...prev, aiId: undefined }));
                }}
                placeholder="e.g. AI_SK01 or NPCI_AI_1005"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.aiId
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                }`}
              />
              {errors.aiId ? (
                <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.aiId}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Unique AI identifier recognized within the BBPS ecosystem.
                </p>
              )}
            </div>

            {/* 2. Entity / AI Name */}
            <div className="space-y-1.5">
              <label htmlFor="entity-name-input" className="block text-xs font-semibold text-slate-700">
                AI / Entity Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="entity-name-input"
                type="text"
                value={entityName}
                onChange={(e) => {
                  setEntityName(e.target.value);
                  if (errors.entityName) setErrors((prev) => ({ ...prev, entityName: undefined }));
                }}
                placeholder="e.g. SuperKirana Network Pvt Ltd"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.entityName
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                }`}
              />
              {errors.entityName && (
                <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.entityName}
                </p>
              )}
            </div>

            {/* 3. Entity Type */}
            <div className="space-y-1.5">
              <label htmlFor="entity-type-select" className="block text-xs font-semibold text-slate-700">
                Entity Type
              </label>
              <div className="relative">
                <select
                  id="entity-type-select"
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-10"
                >
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Trust / Society">Trust / Society</option>
                  <option value="Government Body">Government Body</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. PAN Number */}
            <div className="space-y-1.5">
              <label htmlFor="pan-input" className="block text-xs font-semibold text-slate-700">
                PAN
              </label>
              <input
                id="pan-input"
                type="text"
                value={pan}
                maxLength={10}
                onChange={(e) => {
                  setPan(e.target.value.toUpperCase());
                  if (errors.pan) setErrors((prev) => ({ ...prev, pan: undefined }));
                }}
                placeholder="e.g. AAKCS0912L"
                className={`w-full uppercase px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.pan
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                }`}
              />
              {errors.pan && (
                <p className="text-[11px] text-rose-500">{errors.pan}</p>
              )}
            </div>

            {/* 5. GSTIN */}
            <div className="space-y-1.5">
              <label htmlFor="gstin-input" className="block text-xs font-semibold text-slate-700">
                GSTIN
              </label>
              <input
                id="gstin-input"
                type="text"
                value={gstin}
                maxLength={15}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 27AAKCS0912L1Z5"
                className="w-full uppercase px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
              />
            </div>

            {/* 6. PIN Code */}
            <div className="space-y-1.5">
              <label htmlFor="pincode-input" className="block text-xs font-semibold text-slate-700">
                PIN Code
              </label>
              <input
                id="pincode-input"
                type="text"
                value={pinCode}
                maxLength={6}
                onChange={(e) => {
                  setPinCode(e.target.value.replace(/[^0-9]/g, ''));
                  if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: undefined }));
                }}
                placeholder="e.g. 400051"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.pinCode
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                }`}
              />
              {errors.pinCode && (
                <p className="text-[11px] text-rose-500">{errors.pinCode}</p>
              )}
            </div>

            {/* 7. Registered Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="address-input" className="block text-xs font-semibold text-slate-700">
                Registered Address
              </label>
              <input
                id="address-input"
                type="text"
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                placeholder="e.g. B-402, Trade Center, BKC, Bandra East, Mumbai - 400051"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRIMARY ADMIN CONTACT DETAILS */}
        <div>
          <div className="border-b border-slate-100 pb-3 mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                Primary Contact Details
              </h2>
              <p className="text-xs text-slate-500">
                Authorized representative or administrator managing this Agent Institution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-1.5">
              <label htmlFor="admin-fname-input" className="block text-xs font-semibold text-slate-700">
                First Name
              </label>
              <input
                id="admin-fname-input"
                type="text"
                value={adminFirstName}
                onChange={(e) => setAdminFirstName(e.target.value)}
                placeholder="e.g. Prakash"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label htmlFor="admin-lname-input" className="block text-xs font-semibold text-slate-700">
                Last Name
              </label>
              <input
                id="admin-lname-input"
                type="text"
                value={adminLastName}
                onChange={(e) => setAdminLastName(e.target.value)}
                placeholder="e.g. Kulkarni"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
              />
            </div>

            {/* Mobile / Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="admin-phone-input" className="block text-xs font-semibold text-slate-700">
                Mobile Number
              </label>
              <input
                id="admin-phone-input"
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="e.g. +91 98201 44552"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email-input" className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="admin-email-input"
                type="email"
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  if (errors.adminEmail) setErrors((prev) => ({ ...prev, adminEmail: undefined }));
                }}
                placeholder="e.g. prakash@superkirana.in"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.adminEmail
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                }`}
              />
              {errors.adminEmail && (
                <p className="text-[11px] text-rose-500">{errors.adminEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: WALLET CEILING CONFIGURATION */}
        <div>
          <div className="border-b border-slate-100 pb-3 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                    Wallet Ceiling
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure maximum limits that apply at the AI Institution ceiling level.
                  </p>
                </div>
              </div>

              {/* Dynamic Toggle: Enabled / Disabled */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  id="toggle-wallet-ceiling-enabled"
                  onClick={() => {
                    setWalletCeilingEnabled(true);
                    setErrors((prev) => ({ ...prev, dailyLimit: undefined, transactionLimit: undefined }));
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    walletCeilingEnabled
                      ? 'bg-white text-[#FF6B11] shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      walletCeilingEnabled ? 'bg-[#FF6B11]' : 'border border-slate-400'
                    }`}
                  />
                  Enabled
                </button>
                <button
                  type="button"
                  id="toggle-wallet-ceiling-disabled"
                  onClick={() => {
                    setWalletCeilingEnabled(false);
                    setErrors((prev) => ({
                      ...prev,
                      walletType: undefined,
                      dailyLimit: undefined,
                      transactionLimit: undefined,
                    }));
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    !walletCeilingEnabled
                      ? 'bg-white text-slate-800 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !walletCeilingEnabled ? 'bg-slate-700' : 'border border-slate-400'
                    }`}
                  />
                  Disabled
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Content: ONLY shown when Wallet Ceiling is ENABLED */}
          {walletCeilingEnabled ? (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-5 space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Wallet Type */}
                <div className="space-y-1.5">
                  <label htmlFor="ai-wallet-type" className="block text-xs font-semibold text-slate-700">
                    Wallet Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="ai-wallet-type"
                      value={walletType}
                      onChange={(e) => {
                        setWalletType(e.target.value);
                        if (errors.walletType) setErrors((prev) => ({ ...prev, walletType: undefined }));
                      }}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-10"
                    >
                      <option value="Fixed Wallet">Fixed Wallet</option>
                      <option value="Variable Wallet">Variable Wallet</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.walletType && (
                    <p className="text-[11px] text-rose-500">{errors.walletType}</p>
                  )}
                </div>

                {/* 2. Daily Limit */}
                <div className="space-y-1.5">
                  <label htmlFor="ai-daily-limit" className="block text-xs font-semibold text-slate-700">
                    Daily Limit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      id="ai-daily-limit"
                      type="text"
                      value={dailyLimit}
                      onChange={(e) => {
                        setDailyLimit(e.target.value);
                        if (errors.dailyLimit) setErrors((prev) => ({ ...prev, dailyLimit: undefined }));
                      }}
                      placeholder="e.g. 10,00,000"
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.dailyLimit
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                      }`}
                    />
                  </div>
                  {errors.dailyLimit && (
                    <p className="text-[11px] text-rose-500">{errors.dailyLimit}</p>
                  )}
                </div>

                {/* 3. Transaction Limit */}
                <div className="space-y-1.5">
                  <label htmlFor="ai-txn-limit" className="block text-xs font-semibold text-slate-700">
                    Transaction Limit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      id="ai-txn-limit"
                      type="text"
                      value={transactionLimit}
                      onChange={(e) => {
                        setTransactionLimit(e.target.value);
                        if (errors.transactionLimit) setErrors((prev) => ({ ...prev, transactionLimit: undefined }));
                      }}
                      placeholder="e.g. 1,00,000"
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.transactionLimit
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                      }`}
                    />
                  </div>
                  {errors.transactionLimit && (
                    <p className="text-[11px] text-rose-500">{errors.transactionLimit}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Wallet Ceiling is disabled for this AI entity. No wallet limits will be applied at the AI ceiling level.
            </div>
          )}
        </div>

        {/* SECTION 4: FORM ACTIONS */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            id="cancel-create-ai-btn"
            onClick={() => onNavigate('AI List')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="submit-create-ai-btn"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Create AI
          </button>
        </div>
      </form>
    </div>
  );
};

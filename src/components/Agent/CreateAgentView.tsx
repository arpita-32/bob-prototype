import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, ChevronDown, Upload, FileText, Download } from 'lucide-react';
import { AgentEntity, NavItem } from '../../types';

interface CreateAgentViewProps {
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  onAgentCreated?: (agent: AgentEntity) => void;
}

export const CreateAgentView: React.FC<CreateAgentViewProps> = ({
  onNavigate,
  onAgentCreated,
}) => {
  const [creationMode, setCreationMode] = useState<'individual' | 'bulk'>('individual');
  const [entityCategory, setEntityCategory] = useState<'institution' | 'agent'>('agent');

  // Agent Form State (matching the exact screenshot)
  const [parentAi, setParentAi] = useState('SuperKirana Network (SK01)');
  const [agentName, setAgentName] = useState('SuperKirana Dadar West');
  const [channelType, setChannelType] = useState('AGT — Physical outlet');
  const [contactMobile, setContactMobile] = useState('');
  const [agentEmailId, setAgentEmailId] = useState('');
  const [agentPinCode, setAgentPinCode] = useState('400028');
  const [agentGeoCode, setAgentGeoCode] = useState('19.0178, 72.8478');
  const [agentPerTxnCap, setAgentPerTxnCap] = useState('25,000');
  const [agentDailyValueLimit, setAgentDailyValueLimit] = useState('2,00,000');
  const [agentDailyCountLimit, setAgentDailyCountLimit] = useState('400');

  // Agent Institution Form State
  const [aiName, setAiName] = useState('QuickPay Retail Services Pvt Ltd');
  const [npciId, setNpciId] = useState('');
  const [entityType, setEntityType] = useState('Private Limited');
  const [pan, setPan] = useState('AABCQ4321F');
  const [gstin, setGstin] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('Rahul');
  const [lastName, setLastName] = useState('Mehta');
  const [mobileNumber, setMobileNumber] = useState('+91 98200 11223');
  const [emailId, setEmailId] = useState('rahul@quickpay.in');
  const [walletType, setWalletType] = useState<'AI Pooled Wallet' | 'AI Dedicated Wallet'>('AI Pooled Wallet');
  const [perTxnCap, setPerTxnCap] = useState('1,00,000');
  const [dailyValueLimit, setDailyValueLimit] = useState('25,00,000');
  const [lowBalanceAlert, setLowBalanceAlert] = useState('1,00,000');
  const [inviteValidity, setInviteValidity] = useState('72 hours');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAgent: AgentEntity = {
      id: Date.now().toString(),
      name: agentName || 'New Agent Outlet',
      pan: 'AAKCS0912L',
      type: 'Agent',
      parentEntity: parentAi.split(' (')[0],
      npciId: 'SK01A' + Math.floor(100 + Math.random() * 900),
      walletBalance: '— (pooled)',
      walletBalanceNum: 0,
      dailyLimit: `₹${agentDailyValueLimit}`,
      dailyLimitNum: parseInt(agentDailyValueLimit.replace(/,/g, ''), 10) || 200000,
      status: 'Submitted',
      entityType: 'Outlet / Agent',
      pinCode: agentPinCode,
      registeredAddress: `${agentName}, Mumbai - ${agentPinCode}`,
      adminFirstName: agentName.split(' ')[0] || 'Agent',
      adminLastName: 'Owner',
      adminPhone: contactMobile || '+91 98200 00000',
      adminEmail: agentEmailId || 'agent@outlet.com',
      walletType: 'AI Pooled Wallet',
      perTxnCap: agentPerTxnCap,
      lowBalanceAlert: '25,000',
      inviteValidity: '72 hours',
      onHold: '₹0',
      usedToday: '₹0',
      dailyCountLimit: agentDailyCountLimit,
    };

    if (onAgentCreated) {
      onAgentCreated(newAgent);
    }

    setToastMessage('Agent submitted directly for bank checker approval!');
    setTimeout(() => {
      onNavigate('Agent / AI List');
    }, 1300);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAi: AgentEntity = {
      id: Date.now().toString(),
      name: aiName || 'New Agent Entity',
      pan: pan || 'AABCA0000X',
      type: 'AI',
      npciId: npciId || '—',
      walletBalance: '—',
      walletBalanceNum: 0,
      dailyLimit: dailyValueLimit ? `₹${dailyValueLimit}` : '—',
      dailyLimitNum: parseInt(dailyValueLimit.replace(/,/g, ''), 10) || 0,
      status: 'Invited',
      entityType,
      gstin,
      pinCode,
      registeredAddress: address,
      adminFirstName: firstName,
      adminLastName: lastName,
      adminPhone: mobileNumber,
      adminEmail: emailId,
      walletType,
      perTxnCap,
      lowBalanceAlert,
      inviteValidity,
      onHold: '₹0',
      usedToday: '₹0',
      dailyCountLimit: '1,000',
    };

    if (onAgentCreated) {
      onAgentCreated(newAi);
    }

    setToastMessage('Agent Institution created and activation invite dispatched!');
    setTimeout(() => {
      onNavigate('Agent / AI List');
    }, 1300);
  };

  return (
    <div className="p-6 space-y-4 max-w-[1250px] mx-auto select-none">
      {/* Breadcrumb */}
      <div className="text-[13px] text-slate-500 font-normal">
        <span>Agent</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-800 font-medium">Create Agent / AI</span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xs">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight mb-6">
          Create Agent / AI
        </h1>

        {/* Radio Selectors: Row 1 & Row 2 */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-8 text-[14px]">
            <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-800">
              <input
                type="radio"
                name="creationMode"
                checked={creationMode === 'individual'}
                onChange={() => setCreationMode('individual')}
                className="w-4 h-4 text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
              />
              <span>Individual Creation</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 hover:text-slate-900">
              <input
                type="radio"
                name="creationMode"
                checked={creationMode === 'bulk'}
                onChange={() => setCreationMode('bulk')}
                className="w-4 h-4 text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
              />
              <span>Bulk Upload</span>
            </label>
          </div>

          <div className="flex items-center gap-8 text-[14px]">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="entityCategory"
                checked={entityCategory === 'institution'}
                onChange={() => setEntityCategory('institution')}
                className="w-4 h-4 text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
              />
              <span>Agent Institution</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-800">
              <input
                type="radio"
                name="entityCategory"
                checked={entityCategory === 'agent'}
                onChange={() => setEntityCategory('agent')}
                className="w-4 h-4 text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
              />
              <span>Agent</span>
            </label>
          </div>
        </div>

        {/* BULK UPLOAD MODE */}
        {creationMode === 'bulk' ? (
          <div className="space-y-6 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Bulk {entityCategory === 'agent' ? 'Agent' : 'Agent Institution'} Onboarding
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a CSV or Excel file with mandatory NPCI attributes to create multiple entities in one batch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const csvContent = entityCategory === 'agent'
                      ? 'Parent AI,Agent Name,Channel Type,Contact Mobile,Email ID,PIN Code,Geo Code,Per Txn Cap,Daily Value Limit,Daily Count Limit\nSK01,SuperKirana Andheri,AGT,9820011111,andheri@sk.in,400058,"19.1136, 72.8697",25000,200000,400'
                      : 'AI Name,Entity Type,PAN,GSTIN,PIN Code,Registered Address,Admin First Name,Admin Last Name,Admin Phone,Admin Email\nQuickPay Retail,Private Limited,AABCQ4321F,27AABCQ4321F1Z2,400013,Mumbai,Rahul,Mehta,9820011223,rahul@quickpay.in';
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `bulk_${entityCategory}_template.csv`;
                    a.click();
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#FF6B11] bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV Template
                </button>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setBulkFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`mt-5 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[#FF6B11] bg-orange-50/40'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100/60 flex items-center justify-center text-[#FF6B11] mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {bulkFile ? bulkFile.name : 'Click to browse or drag and drop your bulk file here'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports .CSV, .XLSX (Max file size: 10MB, up to 1,000 records per batch)
                  </p>
                  <input
                    type="file"
                    id="bulk-file-input"
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBulkFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('bulk-file-input')?.click()}
                    className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Select File from Device
                  </button>
                </div>
              </div>

              {bulkFile && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">{bulkFile.name} (ready for validation)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBulkFile(null)}
                    className="text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={!bulkFile}
                onClick={() => {
                  setToastMessage('Bulk file uploaded successfully! 12 valid records queued for processing.');
                  setTimeout(() => onNavigate('Agent / AI List'), 1300);
                }}
                className={`px-6 py-2.5 font-medium text-sm rounded shadow-xs transition-colors ${
                  bulkFile
                    ? 'bg-[#FF6B11] hover:bg-[#e05a07] text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Upload & Process Batch
              </button>
              <button
                type="button"
                onClick={() => onNavigate('Agent / AI List')}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : entityCategory === 'agent' ? (
          /* ===================================================================== */
          /* AGENT CREATION FRAME (MATCHES USER SCREENSHOT EXACTLY) */
          /* ===================================================================== */
          <form onSubmit={handleAgentSubmit} className="space-y-8">
            {/* Section 1: Agent Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  Agent Details :
                </h2>
                <p className="text-[12px] mt-0.5">
                  <span className="text-red-500 font-medium">* Mark fields are mandatory</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-500">Agent ID derives from the parent AI's NPCI ID on approval</span>
                </p>
              </div>

              {/* Row 1: Parent AI, Agent Name, Channel Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Parent AI<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={parentAi}
                      onChange={(e) => setParentAi(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] appearance-none pr-9"
                    >
                      <option>SuperKirana Network (SK01)</option>
                      <option>QuickPay Retail Services Pvt Ltd (QP01)</option>
                      <option>BharatPe Outlet Services (BP03)</option>
                      <option>PayMax Distribution Ltd (PM04)</option>
                      <option>Gramin Suvidha Kendra Network (GS05)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Agent Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="SuperKirana Dadar West"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Channel Type<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={channelType}
                      onChange={(e) => setChannelType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] appearance-none pr-9"
                    >
                      <option>AGT — Physical outlet</option>
                      <option>INT — Internet Banking</option>
                      <option>MOB — Mobile Banking / App</option>
                      <option>POS — Point of Sale Device</option>
                      <option>BC — Business Correspondent</option>
                      <option>ATM — Automated Teller Machine</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Contact Mobile, Email ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Contact Mobile<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Email ID
                  </label>
                  <input
                    type="email"
                    value={agentEmailId}
                    onChange={(e) => setAgentEmailId(e.target.value)}
                    placeholder="Enter Email ID"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>

              {/* Row 3: PIN Code, Geo Code (lat, long) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    PIN Code<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentPinCode}
                    onChange={(e) => setAgentPinCode(e.target.value)}
                    placeholder="400028"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Geo Code (lat, long)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentGeoCode}
                    onChange={(e) => setAgentGeoCode(e.target.value)}
                    placeholder="19.0178, 72.8478"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Agent Wallet Limits */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  Agent Wallet Limits :
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Consumes from the parent AI's pooled wallet; validated against the AI ceiling
                </p>
              </div>

              {/* Row 1: Per Transaction Cap, Daily Value Limit, Daily Count Limit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Per Transaction Cap (₹)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentPerTxnCap}
                    onChange={(e) => setAgentPerTxnCap(e.target.value)}
                    placeholder="25,000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Daily Value Limit (₹)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentDailyValueLimit}
                    onChange={(e) => setAgentDailyValueLimit(e.target.value)}
                    placeholder="2,00,000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Daily Count Limit<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentDailyCountLimit}
                    onChange={(e) => setAgentDailyCountLimit(e.target.value)}
                    placeholder="400"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>
            </div>

            {/* Warning Box (Yellow/Amber card from screenshot) */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3 text-[13px] text-[#92400E]">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal">
                Submits directly to the bank checker — no invite loop for agents under a live AI. The AI admin can also raise agent additions from their own portal.
              </p>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  id="submit-for-approval-btn"
                  className="px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-[13.5px] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Submit for Approval
                </button>
                <button
                  type="button"
                  id="save-agent-draft-btn"
                  onClick={() => {
                    setToastMessage('Agent draft saved successfully.');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-[13.5px] rounded-lg transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>

              <span className="text-[12px] text-slate-500">
                Maker: you · Checker: bank ops
              </span>
            </div>
          </form>
        ) : (
          /* ===================================================================== */
          /* AGENT INSTITUTION FORM */
          /* ===================================================================== */
          <form onSubmit={handleAiSubmit} className="space-y-8">
            {/* Section 1: AI Basic Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  AI Basic Details :
                </h2>
                <p className="text-[12px] text-red-500 font-medium mt-0.5">
                  * Mark fields are mandatory
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    AI Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder="QuickPay Retail Services Pvt Ltd"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Existing NPCI AI ID (for migration)
                  </label>
                  <input
                    type="text"
                    value={npciId}
                    onChange={(e) => setNpciId(e.target.value)}
                    placeholder="Enter NPCI AI ID"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Entity Type<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] appearance-none pr-9"
                    >
                      <option>Private Limited</option>
                      <option>Public Limited</option>
                      <option>Proprietorship</option>
                      <option>Partnership</option>
                      <option>Limited Liability Partnership (LLP)</option>
                      <option>Trust / Society / NGO</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    PAN<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AABCQ4321F"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="Enter GSTIN"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    PIN Code<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter PIN Code"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Registered Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Address"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: AI Admin Details */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  AI Admin Details :
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Activation link will be emailed to this user to complete KYC, documents and limit requests
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Rahul"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mehta"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Mobile Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="rahul@quickpay.in"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Wallet Ceiling (Bank-set) */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  Wallet Ceiling (Bank-set) :
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Maximum limits this AI may request; approved limits can never exceed these
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Wallet Type<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] appearance-none pr-9"
                    >
                      <option>AI Pooled Wallet</option>
                      <option>AI Dedicated Wallet</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Per Transaction Cap (₹)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={perTxnCap}
                    onChange={(e) => setPerTxnCap(e.target.value)}
                    placeholder="1,00,000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Daily Value Limit (₹)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dailyValueLimit}
                    onChange={(e) => setDailyValueLimit(e.target.value)}
                    placeholder="25,00,000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Low Balance Alert (₹)
                  </label>
                  <input
                    type="text"
                    value={lowBalanceAlert}
                    onChange={(e) => setLowBalanceAlert(e.target.value)}
                    placeholder="1,00,000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Invite Validity<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={inviteValidity}
                      onChange={(e) => setInviteValidity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-[13.5px] bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#FF6B11] appearance-none pr-9"
                    >
                      <option>72 hours</option>
                      <option>48 hours</option>
                      <option>24 hours</option>
                      <option>7 days</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-[#f0f4ff] border border-[#d6e2ff] rounded-xl p-4 flex items-start gap-3 text-[13px] text-[#2c4082]">
              <Mail className="w-4 h-4 text-[#3b5998] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                On create, the entity enters <strong className="font-semibold text-slate-800">Invited</strong> status and a one-time activation link is emailed. Duplicate check runs on PAN and Email.
              </p>
            </div>

            {/* Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  id="create-send-invite-btn"
                  className="px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-[13.5px] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Create & Send Invite
                </button>
                <button
                  type="button"
                  id="save-draft-btn"
                  onClick={() => {
                    setToastMessage('Institution draft saved successfully.');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-[13.5px] rounded-lg transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>

              <span className="text-[12px] text-slate-500">
                Maker: you · Checker: bank ops
              </span>
            </div>
          </form>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};


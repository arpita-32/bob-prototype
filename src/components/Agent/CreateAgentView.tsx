import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Building2,
  UserCheck,
  ShieldCheck,
  Store,
  UploadCloud,
  FileSpreadsheet,
  Download,
  FileCheck2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AgentEntity, NavItem, OnboardedAgent } from '../../types';
import { mockAgentEntities } from '../../data/mockData';

interface CreateAgentViewProps {
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  onAgentCreated?: (agent: AgentEntity) => void;
  agentsList?: AgentEntity[];
  onUpdateAgent?: (updatedAgent: AgentEntity) => void;
}

export const CreateAgentView: React.FC<CreateAgentViewProps> = ({
  onNavigate,
  onAgentCreated,
  agentsList = mockAgentEntities,
  onUpdateAgent,
}) => {
  // Navigation / Mode Selection matching User's Radio Buttons
  const [entityTarget, setEntityTarget] = useState<'institution' | 'agent'>('institution');
  const [creationMode, setCreationMode] = useState<'individual' | 'bulk'>('individual');

  // Filter available parent AI entities (Live/Active)
  const availableAIs = useMemo(() => {
    return agentsList.filter(
      (a) => (a.status === 'Active' || a.status === 'Live') && (a.type === 'AI' || !a.type)
    );
  }, [agentsList]);

  // ==========================================
  // 1. STATE FOR AGENT INSTITUTION CREATION
  // ==========================================
  const [aiId, setAiId] = useState('');
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState('Private Limited');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState('');

  // Primary Contact Details
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // AI Wallet Ceiling State
  const [walletCeilingEnabled, setWalletCeilingEnabled] = useState<boolean>(true);
  const [walletType, setWalletType] = useState<string>('Fixed Wallet');
  const [dailyLimit, setDailyLimit] = useState<string>('10,00,000');
  const [transactionLimit, setTransactionLimit] = useState<string>('1,00,000');

  // Validation errors for AI
  const [aiErrors, setAiErrors] = useState<{
    aiId?: string;
    entityName?: string;
    pan?: string;
    pinCode?: string;
    adminEmail?: string;
    walletType?: string;
    dailyLimit?: string;
    transactionLimit?: string;
  }>({});

  // ==========================================
  // 2. STATE FOR INDIVIDUAL AGENT CREATION
  // ==========================================
  const [selectedParentAiId, setSelectedParentAiId] = useState<string>(
    availableAIs[0]?.aiId || availableAIs[0]?.id || ''
  );
  const [agentIdInput, setAgentIdInput] = useState('');
  const [agentNameInput, setAgentNameInput] = useState('');
  const [agentCategory, setAgentCategory] = useState('Retail Outlet');
  const [agentMobile, setAgentMobile] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPan, setAgentPan] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [agentPinCode, setAgentPinCode] = useState('');

  // Validation errors for Agent
  const [agentErrors, setAgentErrors] = useState<{
    parentAi?: string;
    agentId?: string;
    agentName?: string;
    agentMobile?: string;
  }>({});

  // ==========================================
  // 3. STATE FOR BULK UPLOAD
  // ==========================================
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState<boolean>(false);
  const [bulkSuccessSummary, setBulkSuccessSummary] = useState<{
    total: number;
    success: number;
    errors: number;
  } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ------------------------------------------
  // AI Form Validation & Submission
  // ------------------------------------------
  const validateAiForm = () => {
    const errs: {
      aiId?: string;
      entityName?: string;
      pan?: string;
      pinCode?: string;
      adminEmail?: string;
      walletType?: string;
      dailyLimit?: string;
      transactionLimit?: string;
    } = {};

    if (!aiId.trim()) {
      errs.aiId = 'AI ID is required';
    } else if (aiId.trim().length < 3) {
      errs.aiId = 'AI ID must be at least 3 characters long';
    }

    if (!entityName.trim()) {
      errs.entityName = 'Entity / AI Name is required';
    }

    if (pan.trim() && pan.trim().length !== 10) {
      errs.pan = 'PAN must be 10 characters long';
    }

    if (pinCode.trim() && pinCode.trim().length !== 6) {
      errs.pinCode = 'PIN Code must be 6 digits';
    }

    if (adminEmail.trim() && !adminEmail.includes('@')) {
      errs.adminEmail = 'Please enter a valid email address';
    }

    if (walletCeilingEnabled) {
      if (!walletType) {
        errs.walletType = 'Please select a Wallet Type';
      }

      const dailyNum = parseInt(dailyLimit.replace(/[^0-9]/g, ''), 10);
      if (!dailyLimit.trim()) {
        errs.dailyLimit = 'Daily Limit is required when wallet ceiling is enabled';
      } else if (isNaN(dailyNum) || dailyNum <= 0) {
        errs.dailyLimit = 'Daily Limit must be a valid positive amount';
      }

      const txnNum = parseInt(transactionLimit.replace(/[^0-9]/g, ''), 10);
      if (!transactionLimit.trim()) {
        errs.transactionLimit = 'Transaction Limit is required when wallet ceiling is enabled';
      } else if (isNaN(txnNum) || txnNum <= 0) {
        errs.transactionLimit = 'Transaction Limit must be a valid positive amount';
      } else if (!isNaN(dailyNum) && txnNum > dailyNum) {
        errs.transactionLimit = 'Transaction Limit cannot exceed Daily Limit';
      }
    }

    setAiErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAiForm()) return;

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

    showToast(`Agent Institution "${finalName}" created successfully!`);
    setTimeout(() => {
      onNavigate('AI List');
    }, 1200);
  };

  // ------------------------------------------
  // Agent Form Validation & Submission
  // ------------------------------------------
  const validateAgentForm = () => {
    const errs: {
      parentAi?: string;
      agentId?: string;
      agentName?: string;
      agentMobile?: string;
    } = {};

    if (!selectedParentAiId) {
      errs.parentAi = 'Please select a parent Agent Institution';
    }

    if (!agentIdInput.trim()) {
      errs.agentId = 'Agent ID is required';
    }

    if (!agentNameInput.trim()) {
      errs.agentName = 'Agent / Outlet Name is required';
    }

    setAgentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAgentForm()) return;

    const parentAi = availableAIs.find(
      (a) =>
        a.aiId === selectedParentAiId ||
        a.id === selectedParentAiId ||
        a.entityNpciId === selectedParentAiId
    );

    const newOnboardedAgent: OnboardedAgent = {
      id: `ag-${Date.now()}`,
      agentId: agentIdInput.trim().toUpperCase(),
      agentName: agentNameInput.trim(),
      agentStatus: 'Active',
      walletStatus: 'No Wallet Limit',
      walletLimitConfigured: false,
    };

    if (parentAi && onUpdateAgent) {
      const updatedAi: AgentEntity = {
        ...parentAi,
        onboardedAgents: [newOnboardedAgent, ...(parentAi.onboardedAgents || [])],
      };
      onUpdateAgent(updatedAi);
    }

    showToast(
      `Agent "${agentNameInput.trim()}" (${agentIdInput.trim().toUpperCase()}) onboarded under ${
        parentAi ? parentAi.name : 'Institution'
      }!`
    );

    setTimeout(() => {
      onNavigate('AI List');
    }, 1200);
  };

  // ------------------------------------------
  // Bulk Upload Processing & Sample Download
  // ------------------------------------------
  const handleDownloadSample = () => {
    const csvContent =
      'PARENT_AI_ID,AGENT_ID,AGENT_NAME,CATEGORY,MOBILE,EMAIL,CITY,PIN_CODE,WALLET_TYPE,DAILY_LIMIT,TXN_LIMIT\n' +
      'AI_SK01,AG010,Andheri Station Kiosk,Retail Outlet,+91 9811122334,kiosk.andheri@outlet.in,Mumbai,400069,Fixed Wallet,50000,10000\n' +
      'AI_SK01,AG011,Bandra West Counter,Physical Counter,+91 9811122335,bandra.counter@outlet.in,Mumbai,400050,Variable Wallet,75000,15000\n' +
      'AI_QP02,AG105,Lower Parel Hub,Retail Outlet,+91 9811122336,hub.lowerparel@outlet.in,Mumbai,400013,Fixed Wallet,60000,12000\n';
    const fileName = 'sample_agents_template.csv';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${fileName}`);
  };

  const handleProcessBulkUpload = () => {
    if (!uploadedFile) {
      showToast('Please select or drop a CSV/Excel file first.');
      return;
    }

    setIsProcessingBulk(true);
    setTimeout(() => {
      setIsProcessingBulk(false);
      const simulatedCount = Math.floor(Math.random() * 8) + 12;
      setBulkSuccessSummary({
        total: simulatedCount,
        success: simulatedCount,
        errors: 0,
      });
      showToast(
        `Successfully uploaded and processed ${simulatedCount} Agents!`
      );
    }, 1500);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1250px] mx-auto select-none">
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
        <span className="text-slate-800 font-semibold">Create Agent / AI</span>
      </div>

      {/* Top Header & Previous Radio Buttons (Matching user's exact uploaded image) */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Agent / AI</h1>

        {/* Radio Button Options:
            Firstly: Agent Institution | Agent
            Secondly:
              - When Agent Institution is selected: Individual Creation is shown selected
              - When Agent is selected: displays two options: Individual Creation and Bulk Upload
        */}
        <div className="space-y-3 pt-1 pb-2">
          {/* Row 1: Firstly displays Agent Institution and Agent */}
          <div className="flex items-center gap-10 text-sm font-medium text-slate-800">
            <label
              htmlFor="radio-agent-institution"
              className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <input
                id="radio-agent-institution"
                type="radio"
                name="entityTarget"
                value="institution"
                checked={entityTarget === 'institution'}
                onChange={() => {
                  setEntityTarget('institution');
                  setCreationMode('individual');
                  setBulkSuccessSummary(null);
                }}
                className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11] cursor-pointer"
              />
              <span className={`group-hover:text-slate-900 transition-colors ${entityTarget === 'institution' ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                Agent Institution
              </span>
            </label>

            <label
              htmlFor="radio-agent"
              className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <input
                id="radio-agent"
                type="radio"
                name="entityTarget"
                value="agent"
                checked={entityTarget === 'agent'}
                onChange={() => {
                  setEntityTarget('agent');
                  setBulkSuccessSummary(null);
                }}
                className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11] cursor-pointer"
              />
              <span className={`group-hover:text-slate-900 transition-colors ${entityTarget === 'agent' ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                Agent
              </span>
            </label>
          </div>

          {/* Row 2: Mode Selection:
              - When selecting Agent Institution: Individual Creation is shown selected
              - When selecting Agent: displays two options: Individual Creation & Bulk Upload
          */}
          {entityTarget === 'institution' ? (
            <div className="flex items-center gap-10 text-sm font-medium text-slate-800 animate-in fade-in duration-150">
              <label
                htmlFor="radio-individual-creation"
                className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  id="radio-individual-creation"
                  type="radio"
                  name="creationMode"
                  value="individual"
                  checked={true}
                  onChange={() => {
                    setCreationMode('individual');
                  }}
                  className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11] cursor-pointer"
                />
                <span className="text-slate-900 font-semibold">
                  Individual Creation
                </span>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-10 text-sm font-medium text-slate-800 animate-in fade-in duration-150">
              <label
                htmlFor="radio-agent-individual"
                className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  id="radio-agent-individual"
                  type="radio"
                  name="agentCreationMode"
                  value="individual"
                  checked={creationMode === 'individual'}
                  onChange={() => {
                    setCreationMode('individual');
                    setBulkSuccessSummary(null);
                  }}
                  className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11] cursor-pointer"
                />
                <span className={`group-hover:text-slate-900 transition-colors ${creationMode === 'individual' ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                  Individual Creation
                </span>
              </label>

              <label
                htmlFor="radio-agent-bulk"
                className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  id="radio-agent-bulk"
                  type="radio"
                  name="agentCreationMode"
                  value="bulk"
                  checked={creationMode === 'bulk'}
                  onChange={() => {
                    setCreationMode('bulk');
                    setBulkSuccessSummary(null);
                  }}
                  className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11] cursor-pointer"
                />
                <span className={`group-hover:text-slate-900 transition-colors ${creationMode === 'bulk' ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                  Bulk Upload
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: BULK UPLOAD MODE (AGENT ONLY) */}
      {/* ========================================================================= */}
      {entityTarget === 'agent' && creationMode === 'bulk' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B11]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Bulk Upload - Agents
                </h2>
                <p className="text-xs text-slate-500">
                  Upload multiple agent outlets mapped to their parent Agent Institutions via CSV or Excel spreadsheet.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="download-bulk-sample-btn"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FF6B11] hover:text-[#e05a08] bg-orange-50 hover:bg-orange-100/70 border border-orange-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Sample Agents CSV
            </button>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#FF6B11] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-800">Bulk Agent Upload Guidelines:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li>Format: Standard CSV or XLSX with headers matching the sample template.</li>
                <li>
                  Required columns: <code>PARENT_AI_ID</code>, <code>AGENT_ID</code>,{' '}
                  <code>AGENT_NAME</code>, <code>CATEGORY</code>, <code>MOBILE</code>.
                </li>
                <li>
                  Parent AI IDs must match existing active AI entities in the system.
                </li>
                <li>
                  Note: Bulk upload is exclusively designated for Agent onboarding. Individual creation is used for Agent Institutions.
                </li>
              </ul>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setUploadedFile(e.dataTransfer.files[0]);
                setBulkSuccessSummary(null);
              }
            }}
            className="border-2 border-dashed border-slate-300 hover:border-[#FF6B11] bg-slate-50/60 hover:bg-orange-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            onClick={() => document.getElementById('bulk-file-input')?.click()}
          >
            <input
              id="bulk-file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFile(e.target.files[0]);
                  setBulkSuccessSummary(null);
                }
              }}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 group-hover:text-[#FF6B11] group-hover:border-[#FF6B11]/40 transition-colors mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            {uploadedFile ? (
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2 justify-center">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  {uploadedFile.name}
                </span>
                <p className="text-xs text-slate-500">
                  {(uploadedFile.size / 1024).toFixed(1)} KB — Ready for processing
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setBulkSuccessSummary(null);
                  }}
                  className="text-xs text-rose-500 hover:underline pt-1 cursor-pointer"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-700">
                  Drag and drop your file here, or{' '}
                  <span className="text-[#FF6B11] hover:underline">browse files</span>
                </span>
                <p className="text-xs text-slate-400">Supports CSV, XLSX, or XLS (Up to 10 MB)</p>
              </div>
            )}
          </div>

          {/* Success Summary if processed */}
          {bulkSuccessSummary && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    Upload & Processing Completed!
                  </span>
                  <span className="text-xs text-emerald-700">
                    {bulkSuccessSummary.success} records processed successfully. 0 validation errors.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('AI List')}
                className="px-4 py-1.5 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                View in AI List
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('AI List')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              id="upload-bulk-process-btn"
              disabled={!uploadedFile || isProcessingBulk}
              onClick={handleProcessBulkUpload}
              className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs ${
                uploadedFile && !isProcessingBulk
                  ? 'bg-[#FF6B11] hover:bg-[#e05a08] text-white hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isProcessingBulk ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing File...
                </>
              ) : (
                'Upload & Process File'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 2: INDIVIDUAL CREATION -> AGENT INSTITUTION */}
      {/* ========================================================================= */}
      {creationMode === 'individual' && entityTarget === 'institution' && (
        <form
          onSubmit={handleCreateAi}
          className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs space-y-8 animate-in fade-in duration-200"
        >
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
                    if (aiErrors.aiId) setAiErrors((prev) => ({ ...prev, aiId: undefined }));
                  }}
                  placeholder="e.g. AI_SK01 or NPCI_AI_1005"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    aiErrors.aiId
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {aiErrors.aiId ? (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {aiErrors.aiId}
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
                    if (aiErrors.entityName)
                      setAiErrors((prev) => ({ ...prev, entityName: undefined }));
                  }}
                  placeholder="e.g. SuperKirana Network Pvt Ltd"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    aiErrors.entityName
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {aiErrors.entityName && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {aiErrors.entityName}
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
                    if (aiErrors.pan) setAiErrors((prev) => ({ ...prev, pan: undefined }));
                  }}
                  placeholder="e.g. AAKCS0912L"
                  className={`w-full uppercase px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    aiErrors.pan
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {aiErrors.pan && <p className="text-[11px] text-rose-500">{aiErrors.pan}</p>}
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
                    if (aiErrors.pinCode) setAiErrors((prev) => ({ ...prev, pinCode: undefined }));
                  }}
                  placeholder="e.g. 400051"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    aiErrors.pinCode
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {aiErrors.pinCode && <p className="text-[11px] text-rose-500">{aiErrors.pinCode}</p>}
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
                    if (aiErrors.adminEmail)
                      setAiErrors((prev) => ({ ...prev, adminEmail: undefined }));
                  }}
                  placeholder="e.g. prakash@superkirana.in"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    aiErrors.adminEmail
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {aiErrors.adminEmail && (
                  <p className="text-[11px] text-rose-500">{aiErrors.adminEmail}</p>
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
                      setAiErrors((prev) => ({
                        ...prev,
                        dailyLimit: undefined,
                        transactionLimit: undefined,
                      }));
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
                      setAiErrors((prev) => ({
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
                          if (aiErrors.walletType)
                            setAiErrors((prev) => ({ ...prev, walletType: undefined }));
                        }}
                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-10"
                      >
                        <option value="Fixed Wallet">Fixed Wallet</option>
                        <option value="Variable Wallet">Variable Wallet</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {aiErrors.walletType && (
                      <p className="text-[11px] text-rose-500">{aiErrors.walletType}</p>
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
                          if (aiErrors.dailyLimit)
                            setAiErrors((prev) => ({ ...prev, dailyLimit: undefined }));
                        }}
                        placeholder="e.g. 10,00,000"
                        className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          aiErrors.dailyLimit
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                        }`}
                      />
                    </div>
                    {aiErrors.dailyLimit && (
                      <p className="text-[11px] text-rose-500">{aiErrors.dailyLimit}</p>
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
                          if (aiErrors.transactionLimit)
                            setAiErrors((prev) => ({ ...prev, transactionLimit: undefined }));
                        }}
                        placeholder="e.g. 1,00,000"
                        className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          aiErrors.transactionLimit
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                        }`}
                      />
                    </div>
                    {aiErrors.transactionLimit && (
                      <p className="text-[11px] text-rose-500">{aiErrors.transactionLimit}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Wallet Ceiling is disabled for this AI entity. No wallet limits will be applied at
                the AI ceiling level.
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
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
              Create Agent Institution
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* CASE 3: INDIVIDUAL CREATION -> AGENT */}
      {/* ========================================================================= */}
      {creationMode === 'individual' && entityTarget === 'agent' && (
        <form
          onSubmit={handleCreateAgent}
          className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs space-y-8 animate-in fade-in duration-200"
        >
          {/* SECTION 1: PARENT AGENT INSTITUTION MAPPING */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B11]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                  Parent Agent Institution
                </h2>
                <p className="text-xs text-slate-500">
                  Select the registered Agent Institution that this agent will operate under.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="parent-ai-select" className="block text-xs font-semibold text-slate-700">
                  Agent Institution (AI) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="parent-ai-select"
                    value={selectedParentAiId}
                    onChange={(e) => {
                      setSelectedParentAiId(e.target.value);
                      if (agentErrors.parentAi)
                        setAgentErrors((prev) => ({ ...prev, parentAi: undefined }));
                    }}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-10"
                  >
                    {availableAIs.map((ai) => (
                      <option key={ai.id} value={ai.aiId || ai.id}>
                        {ai.name} ({ai.aiId || ai.entityNpciId || ai.npciId}) — Daily Ceiling: ₹
                        {ai.dailyLimit || '10,00,000'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {agentErrors.parentAi && (
                  <p className="text-[11px] text-rose-500">{agentErrors.parentAi}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: AGENT OUTLET DETAILS */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                  Agent Details
                </h2>
                <p className="text-xs text-slate-500">
                  Agent outlet identification, location, and operational contact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Agent ID */}
              <div className="space-y-1.5">
                <label htmlFor="agent-id-input" className="block text-xs font-semibold text-slate-700">
                  Agent ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="agent-id-input"
                  type="text"
                  value={agentIdInput}
                  onChange={(e) => {
                    setAgentIdInput(e.target.value);
                    if (agentErrors.agentId)
                      setAgentErrors((prev) => ({ ...prev, agentId: undefined }));
                  }}
                  placeholder="e.g. AG005 or AG_ANDHERI_01"
                  className={`w-full uppercase px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    agentErrors.agentId
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {agentErrors.agentId && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {agentErrors.agentId}
                  </p>
                )}
              </div>

              {/* Agent Name / Outlet Name */}
              <div className="space-y-1.5">
                <label htmlFor="agent-name-input" className="block text-xs font-semibold text-slate-700">
                  Agent / Outlet Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="agent-name-input"
                  type="text"
                  value={agentNameInput}
                  onChange={(e) => {
                    setAgentNameInput(e.target.value);
                    if (agentErrors.agentName)
                      setAgentErrors((prev) => ({ ...prev, agentName: undefined }));
                  }}
                  placeholder="e.g. Andheri Station Retail Counter"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    agentErrors.agentName
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                  }`}
                />
                {agentErrors.agentName && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {agentErrors.agentName}
                  </p>
                )}
              </div>

              {/* Channel / Category */}
              <div className="space-y-1.5">
                <label htmlFor="agent-category-select" className="block text-xs font-semibold text-slate-700">
                  Agent Channel / Category
                </label>
                <div className="relative">
                  <select
                    id="agent-category-select"
                    value={agentCategory}
                    onChange={(e) => setAgentCategory(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-10"
                  >
                    <option value="Retail Outlet">Retail Outlet / Store</option>
                    <option value="Physical Counter">Physical Counter</option>
                    <option value="Mobile POS">Mobile POS / mPOS</option>
                    <option value="Self Service Kiosk">Self Service Kiosk</option>
                    <option value="Rural Banking Point">Rural Banking Point</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label htmlFor="agent-mobile-input" className="block text-xs font-semibold text-slate-700">
                  Mobile Number
                </label>
                <input
                  id="agent-mobile-input"
                  type="tel"
                  value={agentMobile}
                  onChange={(e) => setAgentMobile(e.target.value)}
                  placeholder="e.g. +91 98200 88990"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="agent-email-input" className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  id="agent-email-input"
                  type="email"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  placeholder="e.g. outlet.andheri@superkirana.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
                />
              </div>

              {/* PAN Number */}
              <div className="space-y-1.5">
                <label htmlFor="agent-pan-input" className="block text-xs font-semibold text-slate-700">
                  Agent PAN (Optional)
                </label>
                <input
                  id="agent-pan-input"
                  type="text"
                  maxLength={10}
                  value={agentPan}
                  onChange={(e) => setAgentPan(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDP1234F"
                  className="w-full uppercase px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label htmlFor="agent-pin-input" className="block text-xs font-semibold text-slate-700">
                  PIN Code
                </label>
                <input
                  id="agent-pin-input"
                  type="text"
                  maxLength={6}
                  value={agentPinCode}
                  onChange={(e) => setAgentPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 400069"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
                />
              </div>

              {/* Outlet Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="agent-address-input" className="block text-xs font-semibold text-slate-700">
                  Outlet Address
                </label>
                <input
                  id="agent-address-input"
                  type="text"
                  value={agentAddress}
                  onChange={(e) => setAgentAddress(e.target.value)}
                  placeholder="e.g. Shop 3, Railway Station West, Andheri, Mumbai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('AI List')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-agent-btn"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Create Agent
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

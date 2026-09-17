import React, { useState } from 'react';
import {
  Gauge,
  UploadCloud,
  FileText,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  FileUp,
  ExternalLink,
  ShieldAlert,
  Building2,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { BillerEntity, AuthUser } from '../../types';
import { BankLogo } from '../BankLogo';
import { UploadBillDataView } from './UploadBillDataView';

interface BillerPortalViewProps {
  biller: BillerEntity;
  currentUser?: AuthUser;
  onUpdateBiller: (updated: BillerEntity) => void;
  onExitPortal: () => void;
}

type BillerPortalTab =
  | 'Dashboard'
  | 'Upload Bill Data'
  | 'Biller Config'
  | 'Report Center';

export const BillerPortalView: React.FC<BillerPortalViewProps> = ({
  biller,
  currentUser: _currentUser,
  onUpdateBiller,
  onExitPortal,
}) => {
  const [activeTab, setActiveTab] = useState<BillerPortalTab>('Dashboard');

  // Config Step: 1 = Basic Details, 2 = Biller Configuration, 3 = POC Details, 4 = Submit KYC Doc
  const [configStep, setConfigStep] = useState<number>(1);
  const [configCompleteModalOpen, setConfigCompleteModalOpen] = useState(false);
  // Complete Configuration popup should show on entering the Biller Portal if not yet approved
  const [initialConfigModalOpen, setInitialConfigModalOpen] = useState<boolean>(
    biller.kycStatus !== 'Approved'
  );

  // Form states for Biller Config:
  // Step 1: Basic Details
  const [billerName, setBillerName] = useState(biller.billerName || 'Arham Veerayatan Polytechnic Institute');
  const [billerLegalName, setBillerLegalName] = useState(
    biller.billerLegalName || 'Shri Arham Veerayatan Education & Research Institute'
  );
  const [category, setCategory] = useState(biller.category || 'education fees');
  const [gstin, setGstin] = useState(biller.gstin !== 'NA' ? biller.gstin : '24AAAAA0000A1Z5');
  const [tanNumber, setTanNumber] = useState(biller.tanNo !== 'NA' ? biller.tanNo : 'AHMA01234D');
  const [uaAadhaar, setUaAadhaar] = useState(biller.uaAadhaar || '987654321098');
  const [rocUin, setRocUin] = useState(biller.rocUin || 'U80302GJ2010NPL062341');
  const [billerIdInput, setBillerIdInput] = useState(biller.billerId || 'ARHA00020NATYJ');
  const [country, setCountry] = useState(biller.registeredAddress?.country || 'India');
  const [state, setState] = useState(biller.registeredAddress?.state || 'Gujarat');
  const [district, setDistrict] = useState(biller.registeredAddress?.district || 'Kutch');
  const [pinCode, setPinCode] = useState(biller.registeredAddress?.pinCode || '370460');
  const [address, setAddress] = useState(
    biller.registeredAddress?.address || 'Veerayatan Campus, Jakhania, Mandvi, Kutch - 370460'
  );

  // Step 2: Configuration
  const [billerType, setBillerType] = useState<'Online' | 'Offline'>(
    biller.configuration?.billerType || 'Offline'
  );
  const [billFetchUrl, setBillFetchUrl] = useState(
    biller.configuration?.billFetchApiUrl !== 'NA'
      ? biller.configuration?.billFetchApiUrl || 'https://api.veerayatan.edu.in/bbps/v2/fetch-bill'
      : 'https://api.veerayatan.edu.in/bbps/v2/fetch-bill'
  );
  const [billPayUrl, setBillPayUrl] = useState(
    biller.configuration?.billPaymentApiUrl !== 'NA'
      ? biller.configuration?.billPaymentApiUrl || 'https://api.veerayatan.edu.in/bbps/v2/payment-notify'
      : 'https://api.veerayatan.edu.in/bbps/v2/payment-notify'
  );
  const [billStatusUrl, setBillStatusUrl] = useState(
    biller.configuration?.billStatusApiUrl !== 'NA'
      ? biller.configuration?.billStatusApiUrl || 'https://api.veerayatan.edu.in/bbps/v2/check-status'
      : 'https://api.veerayatan.edu.in/bbps/v2/check-status'
  );

  // Offline Parameters
  const [inputParams, setInputParams] = useState<Array<{ name: string; isMandatory: boolean }>>([
    { name: 'Student Registration / Roll Number', isMandatory: true },
    { name: 'Academic Term / Semester (e.g. SEM-4)', isMandatory: true },
    { name: 'Date of Birth (DDMMYYYY)', isMandatory: false },
  ]);

  const [outputParams, setOutputParams] = useState<Array<{ name: string; isMandatory: boolean }>>([
    { name: 'Student Full Name', isMandatory: true },
    { name: 'Course & Branch (e.g. Diploma in CE)', isMandatory: true },
    { name: 'Outstanding Tuition Fee Amount', isMandatory: true },
    { name: 'Due Date', isMandatory: false },
  ]);

  // Step 3: POC Details
  const [hodName, setHodName] = useState(biller.pocDetails?.hod?.name || 'Prof. Ketan V. Shah');
  const [hodEmail, setHodEmail] = useState(biller.pocDetails?.hod?.email || 'ketan.shah@veerayatan.edu.in');
  const [hodMobile, setHodMobile] = useState(biller.pocDetails?.hod?.mobileNumber || '9879102938');

  const [opsName, setOpsName] = useState(biller.pocDetails?.ops?.name || 'Nilesh Patel');
  const [opsEmail, setOpsEmail] = useState(biller.pocDetails?.ops?.email || 'accounts@veerayatan.edu.in');
  const [opsMobile, setOpsMobile] = useState(biller.pocDetails?.ops?.mobileNumber || '9825102931');

  const [techName, setTechName] = useState(biller.pocDetails?.tech?.name || 'Jignesh Thakkar');
  const [techEmail, setTechEmail] = useState(biller.pocDetails?.tech?.email || 'itdesk@veerayatan.edu.in');
  const [techMobile, setTechMobile] = useState(biller.pocDetails?.tech?.mobileNumber || '9924102930');

  // Step 4: Documents
  const [documents, setDocuments] = useState<Array<{ name: string; fileName: string; size: string }>>([
    {
      name: 'MDM Document (Master Data Sheet)',
      fileName: 'Veerayatan_Biller_Consent_Form.pdf',
      size: '1.8 MB',
    },
    {
      name: 'Biller Board Resolution & Consent Letter',
      fileName: 'Board_Resolution_BBPS_2026.pdf',
      size: '840 KB',
    },
    {
      name: 'PAN & GST Registration Certificate',
      fileName: 'PAN_GST_Certificate.pdf',
      size: '1.2 MB',
    },
    {
      name: 'Bank of Baroda Cancelled Cheque / Account Mandate',
      fileName: 'BOB_Bank_Account_Mandate.pdf',
      size: '650 KB',
    },
    {
      name: 'Authorized Signatory KYC & Aadhaar Card',
      fileName: 'Signatory_KYC_Proof.pdf',
      size: '2.1 MB',
    },
  ]);

  const [newDocName, setNewDocName] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddInputParam = () => {
    setInputParams([...inputParams, { name: '', isMandatory: true }]);
  };

  const handleAddOutputParam = () => {
    setOutputParams([...outputParams, { name: '', isMandatory: true }]);
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) return;
    setDocuments([
      ...documents,
      {
        name: newDocName.trim(),
        fileName: `${newDocName.trim().replace(/\s+/g, '_')}_2026.pdf`,
        size: '1.1 MB',
      },
    ]);
    setNewDocName('');
  };

  const handleCompleteSubmission = () => {
    const updatedBiller: BillerEntity = {
      ...biller,
      billerName,
      billerLegalName,
      category,
      gstin,
      tanNo: tanNumber,
      uaAadhaar,
      rocUin,
      billerId: billerIdInput,
      kycStatus: 'Under Review',
      status: 'Pending Verification',
      registeredAddress: {
        country,
        state,
        district,
        pinCode,
        address,
      },
      configuration: {
        billerType,
        billFetchApiUrl: billerType === 'Online' ? billFetchUrl : 'NA',
        billPaymentApiUrl: billerType === 'Online' ? billPayUrl : 'NA',
        billStatusApiUrl: billerType === 'Online' ? billStatusUrl : 'NA',
      },
      pocDetails: {
        hod: { name: hodName, email: hodEmail, mobileNumber: hodMobile },
        ops: { name: opsName, email: opsEmail, mobileNumber: opsMobile },
        tech: { name: techName, email: techEmail, mobileNumber: techMobile },
      },
      kycDocuments: {
        mdmDocumentName: documents[0]?.fileName || 'MDM_Document.pdf',
        mdmDocumentUrl: '#view-document',
      },
    };

    onUpdateBiller(updatedBiller);
    setConfigCompleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Public_Sans',sans-serif] text-slate-700 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-white text-slate-800 text-xs px-4 py-3 rounded-lg shadow-lg border border-slate-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium text-slate-800">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header (Matching Screenshot 1) */}
      <header className="relative w-full bg-white select-none z-30 shadow-2xs h-[62px] border-b border-slate-200">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="h-full w-[400px] absolute left-0 top-0"
            viewBox="0 0 400 62"
            preserveAspectRatio="none"
            fill="none"
          >
            <path d="M 0 0 H 290 C 290 24 310 54 360 59 H 0 Z" fill="#FF6B11" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF6B11]" />
        </div>

        <div className="relative w-full h-[59px] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center pl-1 z-10">
            <BankLogo />
          </div>

          <div className="flex items-center gap-4 pr-2 z-10">
            {/* Notification Bell */}
            <button
              type="button"
              className="p-1.5 text-slate-500 hover:text-[#FF6B11] hover:bg-orange-50 rounded-full transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B11]" />
            </button>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-slate-800 block">
                  {biller.billerName || 'Arham Admin'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {biller.billerId}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full border-2 border-[#FF6B11] overflow-hidden bg-white shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B11] border border-orange-200">
                Biller Admin
              </span>

              {/* Exit / Switch Role Button */}
              <button
                type="button"
                onClick={onExitPortal}
                className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-[#FF6B11] hover:bg-orange-50 rounded transition-colors cursor-pointer border border-slate-200"
                title="Switch back to Bank Operations"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-medium">Exit Portal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Biller Left Sidebar (Matching Screenshot 1) */}
        <aside className="w-60 bg-[#FAF9F6]/80 border-r border-slate-200 shrink-0 select-none py-3 text-sm flex flex-col justify-between">
          <nav className="space-y-1 px-3">
            {/* 1. Dashboard */}
            <button
              type="button"
              id="nav-biller-dashboard"
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'Dashboard'
                  ? 'bg-[#FCE2D2] text-[#D85A18] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#D85A18] hover:bg-orange-50/60'
              }`}
            >
              <Gauge className="w-4 h-4 shrink-0" />
              <span className="truncate">Dashboard</span>
            </button>

            {/* 2. Upload Bill Data */}
            <button
              type="button"
              id="nav-biller-upload-bill-data"
              onClick={() => setActiveTab('Upload Bill Data')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'Upload Bill Data'
                  ? 'bg-[#FCE2D2] text-[#D85A18] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#D85A18] hover:bg-orange-50/60'
              }`}
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span className="truncate">Upload Bill Data</span>
            </button>

            {/* 3. Biller Config */}
            <button
              type="button"
              id="nav-biller-config-tab"
              onClick={() => setActiveTab('Biller Config')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'Biller Config'
                  ? 'bg-[#FCE2D2] text-[#D85A18] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#D85A18] hover:bg-orange-50/60'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Biller Config</span>
            </button>

            {/* 4. Report Center */}
            <button
              type="button"
              id="nav-biller-report-center"
              onClick={() => setActiveTab('Report Center')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'Report Center'
                  ? 'bg-[#FCE2D2] text-[#D85A18] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#D85A18] hover:bg-orange-50/60'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">Report Center</span>
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-600">NPCI BBPS Ver 2.0</div>
            <div>Bank of Baroda BOU</div>
            <div className="text-[10px] text-slate-400 font-mono">{biller.billerId}</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Rejection Alert Banner (if Rejected by Checker) */}
          {biller.kycStatus === 'Rejected' && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-800 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-900">
                      KYC Verification Rejected by Checker
                    </h3>
                    <p className="text-xs text-red-700 mt-1">
                      Reason:{' '}
                      <span className="font-semibold">
                        {biller.rejectionReason || 'Incomplete KYC / Document Mismatch'}
                      </span>
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Please update the required details or documents in Biller Config and resubmit.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Biller Config');
                    setConfigStep(1);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Resubmit KYC Now
                </button>
              </div>
            </div>
          )}

          {/* Approved Live Banner */}
          {biller.kycStatus === 'Approved' && (
            <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 text-emerald-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-emerald-900">
                  Your Biller configuration is <strong>Approved & Live</strong> on Bharat BillPay Network.
                </span>
              </div>
              <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                Live Status: Active
              </span>
            </div>
          )}

          {/* VIEW 1: DASHBOARD (Screenshot 1) */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 max-w-[1400px]">
              {/* Dashboard Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
                    <span className="font-semibold text-slate-700">Today's Transaction :</span>
                    <span>24/08/2026</span>
                    <span className="text-slate-400">To</span>
                    <span>24/08/2026</span>
                  </div>

                  <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 shadow-2xs focus:outline-none">
                    <option>Last Hour</option>
                    <option>Today</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>
              </div>

              {/* Stats Cards (Screenshot 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stat 1: Amount */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Total Amount Of Transaction
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Today +1.5%
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-3 font-mono">
                    ₹ 1,23,000
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Total billing collections processed through BBPS
                  </div>
                </div>

                {/* Stat 2: Count */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Total Transaction Count
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Today +1.5%
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-3 font-mono">
                    4,770
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Total successful fee payment attempts
                  </div>
                </div>
              </div>

              {/* Charts Section (Screenshot 1) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Status Donut (1 Column) */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
                    Transaction Status
                  </h3>

                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <path
                          className="text-slate-100"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Success Slice 92% */}
                        <path
                          className="text-emerald-500"
                          strokeDasharray="92, 100"
                          strokeWidth="4"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-extrabold text-slate-900">92%</span>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                          Success
                        </span>
                      </div>
                    </div>

                    <div className="w-full mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Success (92%)
                        </span>
                        <span className="font-semibold text-slate-800">4,388</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Pending (5%)
                        </span>
                        <span className="font-semibold text-slate-800">238</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          Failed (3%)
                        </span>
                        <span className="font-semibold text-slate-800">144</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Volume Curve (2 Columns) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Weekly Transaction Curve
                    </h3>
                    <span className="text-xs text-slate-400">Peak: ₹2,93,000 (Fri, Sep 18)</span>
                  </div>

                  <div className="py-6 flex items-end justify-between gap-4 h-48 px-4">
                    {[
                      { day: 'Mon', val: 40, amt: '₹1.2L' },
                      { day: 'Tue', val: 55, amt: '₹1.8L' },
                      { day: 'Wed', val: 70, amt: '₹2.1L' },
                      { day: 'Thu', val: 60, amt: '₹1.9L' },
                      { day: 'Fri', val: 95, amt: '₹2.93L', peak: true },
                      { day: 'Sat', val: 45, amt: '₹1.4L' },
                      { day: 'Sun', val: 25, amt: '₹0.8L' },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <span
                          className={`text-[10px] font-mono font-semibold ${
                            item.peak ? 'text-[#FF6B11]' : 'text-slate-400'
                          }`}
                        >
                          {item.amt}
                        </span>
                        <div
                          style={{ height: `${item.val}%` }}
                          className={`w-full max-w-[36px] rounded-t transition-all ${
                            item.peak
                              ? 'bg-[#FF6B11] shadow-md shadow-orange-200'
                              : 'bg-orange-100 group-hover:bg-orange-200'
                          }`}
                        />
                        <span className="text-xs font-semibold text-slate-600">{item.day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-2">
                    Data synced real-time with NPCI Bharat BillPay Clearing Settlement
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: BILLER CONFIG (Screenshots 2 to 8) */}
          {activeTab === 'Biller Config' && (
            <div className="space-y-6 max-w-[1200px] mx-auto">
              {/* Stepper Header (Screenshots 2 & 8) */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  {/* Step 1 */}
                  <button
                    type="button"
                    onClick={() => setConfigStep(1)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
                      configStep >= 1 ? 'text-[#FF6B11]' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        configStep > 1
                          ? 'bg-emerald-500 text-white'
                          : configStep === 1
                          ? 'bg-[#FF6B11] text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {configStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </div>
                    <span>Basic Details</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-300" />

                  {/* Step 2 */}
                  <button
                    type="button"
                    onClick={() => setConfigStep(2)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
                      configStep >= 2 ? 'text-[#FF6B11]' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        configStep > 2
                          ? 'bg-emerald-500 text-white'
                          : configStep === 2
                          ? 'bg-[#FF6B11] text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {configStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </div>
                    <span>Biller Configuration</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-300" />

                  {/* Step 3 */}
                  <button
                    type="button"
                    onClick={() => setConfigStep(3)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
                      configStep >= 3 ? 'text-[#FF6B11]' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        configStep > 3
                          ? 'bg-emerald-500 text-white'
                          : configStep === 3
                          ? 'bg-[#FF6B11] text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {configStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
                    </div>
                    <span>POC Details</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-300" />

                  {/* Step 4 */}
                  <button
                    type="button"
                    onClick={() => setConfigStep(4)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
                      configStep === 4 ? 'text-[#FF6B11]' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        configStep === 4
                          ? 'bg-[#FF6B11] text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      4
                    </div>
                    <span>Submit KYC Doc</span>
                  </button>
                </div>
              </div>

              {/* STEP 1: Basic Details (Screenshot 2) */}
              {configStep === 1 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900">
                      Biller Configuration : Basic Details
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      * Mark fields are mandatory. Please provide exact organization and legal entity details.
                    </p>
                  </div>

                  {/* Logo Upload Row */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50 overflow-hidden">
                        <Building2 className="w-7 h-7 text-[#FF6B11]" />
                      </div>
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 cursor-pointer">
                          <FileUp className="w-3.5 h-3.5" />
                          <span>Browse...</span>
                          <input type="file" className="hidden" />
                        </label>
                        <span className="text-[11px] text-slate-400 block">
                          veerayatan_institute_logo.png (124 KB)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Biller Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={billerName}
                        onChange={(e) => setBillerName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Biller Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={billerLegalName}
                        onChange={(e) => setBillerLegalName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Biller Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:border-[#FF6B11]"
                      >
                        <option value="education fees">Education Fees</option>
                        <option value="electricity">Electricity</option>
                        <option value="water">Water</option>
                        <option value="gas">Gas</option>
                        <option value="telecom">Telecom</option>
                        <option value="housing society">Housing Society</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono uppercase focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        TAN Number
                      </label>
                      <input
                        type="text"
                        value={tanNumber}
                        onChange={(e) => setTanNumber(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono uppercase focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        UA Aadhaar
                      </label>
                      <input
                        type="text"
                        value={uaAadhaar}
                        onChange={(e) => setUaAadhaar(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        ROC UIN
                      </label>
                      <input
                        type="text"
                        value={rocUin}
                        onChange={(e) => setRocUin(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono uppercase focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        BBPS Biller ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={billerIdInput}
                        onChange={(e) => setBillerIdInput(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-mono uppercase font-bold bg-slate-50 focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>
                  </div>

                  {/* Registered Address Section (Screenshot 2) */}
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-bold text-slate-800 mb-3">
                      Registered Address :
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">
                          District <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-2 md:col-span-4">
                        <label className="block text-slate-600 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation CTA */}
                  <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setConfigStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Biller Configuration (Screenshots 3, 4, 5) */}
              {configStep === 2 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900">
                      Biller Configuration : Integration Mode
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select Online Mode if you host REST APIs for bill fetch/pay, or Offline Mode if you upload bill batches.
                    </p>
                  </div>

                  {/* Radio Choice (Screenshot 3) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Biller Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billerTypeRadio"
                          checked={billerType === 'Online'}
                          onChange={() => setBillerType('Online')}
                          className="accent-[#FF6B11] w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-slate-800">Online (API Endpoint Integration)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billerTypeRadio"
                          checked={billerType === 'Offline'}
                          onChange={() => setBillerType('Offline')}
                          className="accent-[#FF6B11] w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-slate-800">Offline (Batch Upload / Form Parameters)</span>
                      </label>
                    </div>
                  </div>

                  {/* Online Mode Form (Screenshot 4) */}
                  {billerType === 'Online' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4 animate-in fade-in">
                      <div className="border-b border-slate-200 pb-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Online Biller APIs
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          These APIs will be used to fetch the Input field details required to fetch the bill information and process the transaction at biller endpoint.
                        </p>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            Bill fetch API end point URL <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={billFetchUrl}
                            onChange={(e) => setBillFetchUrl(e.target.value)}
                            placeholder="https://api.domain.com/bbps/fetch-bill"
                            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono text-[11.5px] focus:outline-none focus:border-[#FF6B11]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            Bill payment API end point URL <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={billPayUrl}
                            onChange={(e) => setBillPayUrl(e.target.value)}
                            placeholder="https://api.domain.com/bbps/payment-notify"
                            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono text-[11.5px] focus:outline-none focus:border-[#FF6B11]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            Bill status API end point URL <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={billStatusUrl}
                            onChange={(e) => setBillStatusUrl(e.target.value)}
                            placeholder="https://api.domain.com/bbps/check-status"
                            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 font-mono text-[11.5px] focus:outline-none focus:border-[#FF6B11]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Offline Mode Parameters (Screenshot 5) */}
                  {billerType === 'Offline' && (
                    <div className="space-y-6 animate-in fade-in">
                      {/* Input Parameters */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div>
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                              Offline Input Parameters
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Fields required by customer to search and fetch bills
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddInputParam}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-[#FF6B11] text-xs font-semibold rounded border border-orange-200 cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add new</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {inputParams.map((param, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={param.name}
                                onChange={(e) => {
                                  const updated = [...inputParams];
                                  updated[idx].name = e.target.value;
                                  setInputParams(updated);
                                }}
                                placeholder="e.g. Student Roll Number"
                                className="flex-1 px-3 py-1.5 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                              />
                              <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={param.isMandatory}
                                  onChange={(e) => {
                                    const updated = [...inputParams];
                                    updated[idx].isMandatory = e.target.checked;
                                    setInputParams(updated);
                                  }}
                                  className="accent-[#FF6B11]"
                                />
                                <span>Is Mandatory</span>
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  setInputParams(inputParams.filter((_, i) => i !== idx))
                                }
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Output Parameters */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div>
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                              Offline Output Parameters
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Fields displayed to customer upon bill fetch
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddOutputParam}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-[#FF6B11] text-xs font-semibold rounded border border-orange-200 cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add new</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {outputParams.map((param, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={param.name}
                                onChange={(e) => {
                                  const updated = [...outputParams];
                                  updated[idx].name = e.target.value;
                                  setOutputParams(updated);
                                }}
                                placeholder="e.g. Total Fees Due"
                                className="flex-1 px-3 py-1.5 border border-slate-300 rounded bg-white text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                              />
                              <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={param.isMandatory}
                                  onChange={(e) => {
                                    const updated = [...outputParams];
                                    updated[idx].isMandatory = e.target.checked;
                                    setOutputParams(updated);
                                  }}
                                  className="accent-[#FF6B11]"
                                />
                                <span>Is Mandatory</span>
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  setOutputParams(outputParams.filter((_, i) => i !== idx))
                                }
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nav CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setConfigStep(1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfigStep(3)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: POC Details (Screenshot 6) */}
              {configStep === 3 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900">
                      Biller Configuration : Point of Contact (POC) Details
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Provide authorized contacts for Head of Department (HOD), Operations (OPS), and Technology (Tech).
                    </p>
                  </div>

                  {/* 1. HOD Details */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      HOD Details (Head of Organization)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1">
                          HOD POC Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={hodName}
                          onChange={(e) => setHodName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">
                          HOD POC Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={hodEmail}
                          onChange={(e) => setHodEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">
                          HOD POC Mobile <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={hodMobile}
                          onChange={(e) => setHodMobile(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. OPS Details */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      OPS Details (Billing & Finance Operations)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1">OPS POC Name</label>
                        <input
                          type="text"
                          value={opsName}
                          onChange={(e) => setOpsName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">OPS POC Email</label>
                        <input
                          type="email"
                          value={opsEmail}
                          onChange={(e) => setOpsEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">OPS POC Mobile</label>
                        <input
                          type="tel"
                          value={opsMobile}
                          onChange={(e) => setOpsMobile(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Tech Details */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Tech Details (IT & System Integration)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1">Tech POC Name</label>
                        <input
                          type="text"
                          value={techName}
                          onChange={(e) => setTechName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Tech POC Email</label>
                        <input
                          type="email"
                          value={techEmail}
                          onChange={(e) => setTechEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Tech POC Mobile</label>
                        <input
                          type="tel"
                          value={techMobile}
                          onChange={(e) => setTechMobile(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nav CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setConfigStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfigStep(4)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Submit KYC Doc (Screenshots 7 & 8) */}
              {configStep === 4 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900">
                      Biller Configuration : Submit KYC Documents
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kindly upload your biller MDM, consent letter, bank mandate and other regulatory KYC documents here.
                    </p>
                  </div>

                  {/* Document Rows (Screenshot 7) */}
                  <div className="space-y-3">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#FF6B11] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 text-xs block">
                              {doc.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-slate-700">{doc.fileName}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-300 cursor-pointer shadow-2xs">
                            <FileUp className="w-3.5 h-3.5 text-slate-500" />
                            <span>Replace</span>
                            <input type="file" className="hidden" />
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              showToast(`Previewing ${doc.fileName}`)
                            }
                            className="p-1.5 text-slate-500 hover:text-[#FF6B11] hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Document Row */}
                  <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter other document name (e.g. Audited Balance Sheet, Board Resolution)..."
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11]"
                    />
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer whitespace-nowrap"
                    >
                      + Add More Documents
                    </button>
                  </div>

                  {/* Nav CTA / Final Submission */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setConfigStep(3)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      id="btn-submit-biller-kyc"
                      onClick={handleCompleteSubmission}
                      className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] active:bg-[#c94f05] text-white text-xs font-bold rounded-md shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit KYC for Verification</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Bill Data View (matching User Screenshots 1 & 2) */}
          {activeTab === 'Upload Bill Data' && (
            <UploadBillDataView biller={biller} />
          )}

          {/* OTHER TABS: Placeholder for Report Center */}
          {activeTab !== 'Dashboard' && activeTab !== 'Biller Config' && activeTab !== 'Upload Bill Data' && (
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-2xs text-center space-y-4 max-w-2xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B11] flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-800">{activeTab}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                This module will become fully active once your Biller KYC is approved by the Bank of Baroda Checker.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('Biller Config')}
                className="px-5 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Go to Biller Config
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Initial Complete Configuration Prompt Modal (Matching Screenshot) */}
      {initialConfigModalOpen && (
        <div
          id="complete-configuration-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
        >
          <div
            id="complete-configuration-modal-card"
            className="bg-white rounded-xl shadow-2xl max-w-[480px] w-full p-8 text-center relative border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            {/* Close X Button */}
            <button
              type="button"
              id="close-config-modal-button"
              onClick={() => setInitialConfigModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Complete Configuration
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 leading-relaxed max-w-[340px] mx-auto mb-8 font-normal">
              Complete Your Biller Configuration To Verify Your Account.
            </p>

            {/* Buttons Row */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                id="modal-close-button"
                onClick={() => setInitialConfigModalOpen(false)}
                className="w-32 py-2.5 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                id="modal-start-now-button"
                onClick={() => {
                  setInitialConfigModalOpen(false);
                  setActiveTab('Biller Config');
                  setConfigStep(1);
                }}
                className="w-32 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Submission Complete Modal (Screenshot 8) */}
      {configCompleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Biller Configuration Complete!
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Your Config Creation Process Was Completed, We'll Review It And You Can Go Live.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Biller Name:</span>
                <span className="font-semibold text-slate-800">{billerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BBPS Biller ID:</span>
                <span className="font-mono text-slate-800">{billerIdInput}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Under Review
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfigCompleteModalOpen(false);
                  setActiveTab('Dashboard');
                }}
                className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Close & Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

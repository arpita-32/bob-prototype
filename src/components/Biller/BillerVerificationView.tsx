import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { BillerEntity, NavItem } from '../../types';
import { mockBillersList } from '../../data/mockData';

interface BillerVerificationViewProps {
  onNavigate?: (nav: NavItem) => void;
  billersList?: BillerEntity[];
  onUpdateBiller?: (updated: BillerEntity) => void;
}

type DetailTab = 'basic' | 'config' | 'poc' | 'kyc';

export const BillerVerificationView: React.FC<BillerVerificationViewProps> = ({
  onNavigate: _onNavigate,
  billersList,
  onUpdateBiller,
}) => {
  const [billers, setBillers] = useState<BillerEntity[]>(billersList || mockBillersList);

  useEffect(() => {
    if (billersList) {
      setBillers(billersList);
    }
  }, [billersList]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(mockBillersList[0]?.id || null);

  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('basic');
  const [selectedBiller, setSelectedBiller] = useState<BillerEntity | null>(null);

  // Reject dialog
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRejectSections, setSelectedRejectSections] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');

  // Approve dialog
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  // Document preview modal
  const [docPreviewOpen, setDocPreviewOpen] = useState(false);
  const [previewDocTitle, setPreviewDocTitle] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>('Biller verification data fetched successfully!');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Keep initial toast visible or allow dismissal
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredBillers = billers.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.billerName.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.mobileNumber && b.mobileNumber.toLowerCase().includes(q)) ||
      (b.emailId && b.emailId.toLowerCase().includes(q)) ||
      b.status.toLowerCase().includes(q) ||
      b.billerId.toLowerCase().includes(q) ||
      (b.createdTime && b.createdTime.toLowerCase().includes(q))
    );
  });

  const totalRows = filteredBillers.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const displayedBillers = filteredBillers.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    const headers = 'S.No,Biller Category,Biller Name,Mobile Number,Email ID,Created Time,Status\n';
    const rows = filteredBillers
      .map(
        (b, i) =>
          `"${i + 1}","${b.category}","${b.billerName}","${b.mobileNumber || b.supportPhone || '—'}","${b.emailId || b.supportEmail || '—'}","${b.createdTime || b.registrationDate || '—'}","${b.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Biller_Verification_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Biller verification CSV downloaded successfully!');
  };

  const handleOpenDetails = (biller: BillerEntity) => {
    setSelectedBiller(biller);
    setSelectedRowId(biller.id);
    setActiveTab('basic');
    setDetailsModalOpen(true);
  };

  const handleOpenRejectModal = () => {
    setSelectedRejectSections([]);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleOpenApproveModal = () => {
    setApproveModalOpen(true);
  };

  const toggleRejectSection = (section: string) => {
    setSelectedRejectSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const submitRejection = () => {
    if (!selectedBiller) return;
    const updated: BillerEntity = {
      ...selectedBiller,
      status: 'Rejected',
      kycStatus: 'Rejected',
      rejectedSections: selectedRejectSections,
      rejectionReason: rejectReason || 'Issues identified in submitted documentation.',
    };
    setBillers((prev) => prev.map((b) => (b.id === selectedBiller.id ? updated : b)));
    if (onUpdateBiller) {
      onUpdateBiller(updated);
    }
    setRejectModalOpen(false);
    setDetailsModalOpen(false);
    showToast('Biller sent for re-submission successfully!');
  };

  const submitApproval = () => {
    if (!selectedBiller) return;
    const updated: BillerEntity = {
      ...selectedBiller,
      status: 'Live',
      kycStatus: 'Approved',
      verifiedDate: '31-08-2026',
      verifiedBy: 'Checker Ops',
    };
    setBillers((prev) => prev.map((b) => (b.id === selectedBiller.id ? updated : b)));
    if (onUpdateBiller) {
      onUpdateBiller(updated);
    }
    setApproveModalOpen(false);
    setDetailsModalOpen(false);
    showToast('Biller approved successfully!');
  };

  const handleViewDocument = (title: string) => {
    setPreviewDocTitle(title);
    setDocPreviewOpen(true);
  };

  return (
    <div id="biller-verification-view" className="p-6 space-y-4 max-w-[1600px] mx-auto select-none font-sans">
      {/* Toast Notification Top Right (Matching Screenshot 1 & 8) */}
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

      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Biller</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Biller Verification</span>
      </div>

      {/* Page Heading */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">
        Biller Verification
      </h1>

      {/* Main Single Card Container */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {/* Top Control Bar: Search on left, Export as CSV on right */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search here...."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export as CSV</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-[#fafafa] border-b border-slate-200 text-xs font-semibold text-slate-700 select-none">
                <th className="py-3 px-3 w-14">S.No</th>
                <th className="py-3 px-3">Biller Category</th>
                <th className="py-3 px-3">Biller Name</th>
                <th className="py-3 px-3">Mobile Number</th>
                <th className="py-3 px-3">Email ID</th>
                <th className="py-3 px-3">Created Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">View Details</th>
                <th className="py-3 px-3 text-center">Verify Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {displayedBillers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-slate-500 text-sm font-normal">
                    No rows
                  </td>
                </tr>
              ) : (
                displayedBillers.map((item, index) => {
                  const sNo = startIndex + index + 1;
                  const isSelected = selectedRowId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRowId(item.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {sNo}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {item.billerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {item.mobileNumber || item.supportPhone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.emailId || item.supportEmail || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.createdTime || item.registrationDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-red-500 font-normal">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(item);
                          }}
                          className="text-[#FF6B11] hover:underline font-normal text-xs cursor-pointer inline-flex items-center"
                        >
                          Show Biller Details
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          disabled
                          className="text-slate-400 bg-slate-100/60 px-3 py-1 rounded text-xs cursor-not-allowed border border-slate-200"
                        >
                          Verify Biller Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination Bar matching Screenshot */}
        <div className="p-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 select-none">
          <div className="text-slate-500">
            {selectedRowId ? '1 row selected' : '0 rows selected'}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border-0 font-medium text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div>
              {totalRows === 0
                ? '0–0 of 0'
                : `${startIndex + 1}–${endIndex} of ${totalRows}`}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1 || totalRows === 0}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                  currentPage <= 1 || totalRows === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || totalRows === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                  currentPage >= totalPages || totalRows === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-Tab "Biller Details" Modal (Matching Screenshots 2, 3, 4, 5)             */}
      {/* ========================================================================= */}
      {detailsModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Biller Details</h2>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal Tabs Header (Orange underline active tab) */}
            <div className="px-6 border-b border-slate-200 flex items-center gap-8 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-3 relative transition-colors cursor-pointer ${
                  activeTab === 'basic' ? 'text-[#FF6B11]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Basic Details
                {activeTab === 'basic' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B11]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className={`py-3 relative transition-colors cursor-pointer ${
                  activeTab === 'config' ? 'text-[#FF6B11]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Biller Configuration
                {activeTab === 'config' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B11]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('poc')}
                className={`py-3 relative transition-colors cursor-pointer ${
                  activeTab === 'poc' ? 'text-[#FF6B11]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                POC Details
                {activeTab === 'poc' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B11]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kyc')}
                className={`py-3 relative transition-colors cursor-pointer ${
                  activeTab === 'kyc' ? 'text-[#FF6B11]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                KYC Documents
                {activeTab === 'kyc' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B11]" />
                )}
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-6">
              {/* TAB 1: BASIC DETAILS (Screenshot 2) */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* General Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Biller Logo</span>
                      <button
                        type="button"
                        onClick={() => handleViewDocument('Biller Logo')}
                        className="text-[#FF6B11] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Biller Name</span>
                      <span className="font-medium text-slate-900">{selectedBiller.billerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Biller Legal Name</span>
                      <span className="font-medium text-slate-900">{selectedBiller.billerLegalName || selectedBiller.billerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Biller Category</span>
                      <span className="font-medium text-slate-900">{selectedBiller.category}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">GSTIN</span>
                      <span className="font-medium text-slate-900">{selectedBiller.gstin || 'NA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">TAN No.</span>
                      <span className="font-medium text-slate-900">{selectedBiller.tanNo || 'NA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">UA Aadhaar</span>
                      <span className="font-medium text-slate-900">{selectedBiller.uaAadhaar || 'NA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">ROC UIN</span>
                      <span className="font-medium text-slate-900">{selectedBiller.rocUin || 'NA'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">BBPS Biller ID</span>
                      <span className="font-medium text-slate-900 font-mono">{selectedBiller.billerId}</span>
                    </div>
                  </div>

                  {/* Registered Address Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">Registered Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Country</span>
                        <span className="font-medium text-slate-900">{selectedBiller.registeredAddress?.country || 'India'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">State</span>
                        <span className="font-medium text-slate-900">{selectedBiller.registeredAddress?.state || selectedBiller.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">District</span>
                        <span className="font-medium text-slate-900">{selectedBiller.registeredAddress?.district || 'KACHCHH'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">PIN Code</span>
                        <span className="font-medium text-slate-900">{selectedBiller.registeredAddress?.pinCode || '370465'}</span>
                      </div>
                      <div className="sm:col-span-2 md:col-span-4">
                        <span className="text-slate-500 block text-[11px]">Address</span>
                        <span className="font-medium text-slate-900">{selectedBiller.registeredAddress?.address || 'Kutch district of Gujarat'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Communication Address Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">Communication Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Country</span>
                        <span className="font-medium text-slate-900">{selectedBiller.communicationAddress?.country || 'India'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">State</span>
                        <span className="font-medium text-slate-900">{selectedBiller.communicationAddress?.state || selectedBiller.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">District</span>
                        <span className="font-medium text-slate-900">{selectedBiller.communicationAddress?.district || 'KACHCHH'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">PIN Code</span>
                        <span className="font-medium text-slate-900">{selectedBiller.communicationAddress?.pinCode || '370465'}</span>
                      </div>
                      <div className="sm:col-span-2 md:col-span-4">
                        <span className="text-slate-500 block text-[11px]">Address</span>
                        <span className="font-medium text-slate-900">{selectedBiller.communicationAddress?.address || 'Kutch district of Gujarat'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Biller Admin Details */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">Biller Admin Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">First Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.billerAdmin?.firstName || selectedBiller.billerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Last Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.billerAdmin?.lastName || selectedBiller.billerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                        <span className="font-medium text-slate-900 font-mono">{selectedBiller.billerAdmin?.mobileNumber || selectedBiller.mobileNumber || '9345673456'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Email ID</span>
                        <span className="font-medium text-slate-900">{selectedBiller.billerAdmin?.emailId || selectedBiller.emailId || 'ARHA00020NATYJ@yop.com'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Biller Settlement Account Details */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">Biller Settlement Account Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Account Holder Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.settlementAccount?.accountHolderName || 'SBI'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Bank Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.settlementAccount?.bankName || 'SBI'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Account Number</span>
                        <span className="font-medium text-slate-900 font-mono">{selectedBiller.settlementAccount?.accountNumber || selectedBiller.bankAccountNo || '39420733781'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Bank IFSC</span>
                        <span className="font-medium text-slate-900 font-mono">{selectedBiller.settlementAccount?.bankIfsc || selectedBiller.ifscCode || 'SBIN0006341'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BILLER CONFIGURATION (Screenshot 3) */}
              {activeTab === 'config' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Biller Type</span>
                      <span className="font-medium text-slate-900">{selectedBiller.configuration?.billerType || 'Offline'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Bill Fetch API end point URL</span>
                      <span className="font-medium text-slate-900">{selectedBiller.configuration?.billFetchApiUrl || 'NA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Bill Payment API end point URL</span>
                      <span className="font-medium text-slate-900">{selectedBiller.configuration?.billPaymentApiUrl || 'NA'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Bill Status API end point URL</span>
                      <span className="font-medium text-slate-900">{selectedBiller.configuration?.billStatusApiUrl || 'NA'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POC DETAILS (Screenshot 4) */}
              {activeTab === 'poc' && (
                <div className="space-y-6">
                  {/* HOD POC Details */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 mb-3">HOD POC Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.hod?.name || selectedBiller.billerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Email</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.hod?.email || selectedBiller.emailId || 'ARHA00020NATYJ@yop.com'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                        <span className="font-medium text-slate-900 font-mono">{selectedBiller.pocDetails?.hod?.mobileNumber || '7234567234'}</span>
                      </div>
                    </div>
                  </div>

                  {/* OPS Details */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">OPS Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.ops?.name || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Email</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.ops?.email || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.ops?.mobileNumber || 'NA'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Details */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900 mb-3">Tech Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Name</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.tech?.name || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Email</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.tech?.email || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                        <span className="font-medium text-slate-900">{selectedBiller.pocDetails?.tech?.mobileNumber || 'NA'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: KYC DOCUMENTS (Screenshot 5) */}
              {activeTab === 'kyc' && (
                <div className="space-y-6 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <div>
                      <span className="text-slate-500 block text-[11px]">MDM Document</span>
                      <button
                        type="button"
                        onClick={() => handleViewDocument(selectedBiller.kycDocuments?.mdmDocumentName || 'MDM Document')}
                        className="text-[#FF6B11] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions Bar */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              {activeTab === 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                >
                  Next
                </button>
              )}

              {activeTab === 'config' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className="px-6 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 text-xs font-medium rounded transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('poc')}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </>
              )}

              {activeTab === 'poc' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('config')}
                    className="px-6 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 text-xs font-medium rounded transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kyc')}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </>
              )}

              {activeTab === 'kyc' && (
                <div className="flex items-center gap-3 w-full justify-end">
                  <button
                    type="button"
                    onClick={handleOpenApproveModal}
                    className="px-8 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenRejectModal}
                    className="px-8 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 text-xs font-medium rounded transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Reject Biller Dialog (Matching Screenshot 6)                              */}
      {/* ========================================================================= */}
      {rejectModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 text-center space-y-4">
            {/* Header with Title & Close */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Reject Biller</h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Graphic Illustration with Document & Red X Badge */}
            <div className="flex justify-center py-2">
              <div className="relative w-20 h-24 bg-white border-2 border-slate-300 rounded-md shadow-xs flex flex-col p-2">
                <div className="h-3 bg-[#FF6B11] rounded-xs w-full mb-1.5 opacity-90" />
                <div className="space-y-1">
                  <div className="h-1.5 bg-slate-200 rounded w-full" />
                  <div className="h-1.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-1.5 bg-slate-200 rounded w-5/6" />
                </div>
                {/* Red Circular X overlay */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Section with Issues (2 Columns of Checkboxes) */}
            <div className="text-left space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Section with Issues</span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRejectSections.includes('Basic Details')}
                    onChange={() => toggleRejectSection('Basic Details')}
                    className="w-4 h-4 text-[#FF6B11] rounded border-slate-300 focus:ring-[#FF6B11]"
                  />
                  <span>Basic Details</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRejectSections.includes('Biller Configuration')}
                    onChange={() => toggleRejectSection('Biller Configuration')}
                    className="w-4 h-4 text-[#FF6B11] rounded border-slate-300 focus:ring-[#FF6B11]"
                  />
                  <span>Biller Configuration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRejectSections.includes('POC Details')}
                    onChange={() => toggleRejectSection('POC Details')}
                    className="w-4 h-4 text-[#FF6B11] rounded border-slate-300 focus:ring-[#FF6B11]"
                  />
                  <span>POC Details</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRejectSections.includes('Submit KYC Document')}
                    onChange={() => toggleRejectSection('Submit KYC Document')}
                    className="w-4 h-4 text-[#FF6B11] rounded border-slate-300 focus:ring-[#FF6B11]"
                  />
                  <span>Submit KYC Document</span>
                </label>
              </div>
            </div>

            {/* Reason of Rejection Input */}
            <div className="text-left space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Reason of Rejection
              </label>
              <input
                type="text"
                placeholder="Enter Reason of Rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20"
              />
            </div>

            {/* Action Button: Send for Re-Submission */}
            <div className="pt-2">
              <button
                type="button"
                onClick={submitRejection}
                className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                Send for Re-Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Approve Biller Dialog (Matching Screenshot 7)                            */}
      {/* ========================================================================= */}
      {approveModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 text-center space-y-5">
            {/* Header with Title & Close */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Approve Biller</h3>
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Green Certified Checkmark Badge Graphic */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to approve{' '}
              <span className="font-semibold text-slate-900">{selectedBiller.billerName}</span>? Once approved, the biller status will be updated to verified.
            </p>

            {/* Action Button: Approve */}
            <div className="pt-2">
              <button
                type="button"
                onClick={submitApproval}
                className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Document View Preview Modal                                               */}
      {/* ========================================================================= */}
      {docPreviewOpen && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B11]" />
                <h3 className="text-sm font-bold text-slate-800">{previewDocTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDocPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B11]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">{previewDocTitle}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  NPCI BBPS Certified Verification Attachment (PDF)
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 font-mono text-[10px] rounded">
                  DIGITALLY SIGNED & VERIFIED
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDocPreviewOpen(false)}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-medium rounded hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Document downloaded successfully!');
                  setDocPreviewOpen(false);
                }}
                className="px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

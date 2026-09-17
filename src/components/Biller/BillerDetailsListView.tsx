import React, { useState } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Landmark,
  Layers,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { BillerEntity, NavItem } from '../../types';

interface BillerDetailsListViewProps {
  billersList: BillerEntity[];
  onNavigate?: (nav: NavItem) => void;
  onUpdateBiller?: (updatedBiller: BillerEntity) => void;
  hideUpdateDetails?: boolean;
}

export const BillerDetailsListView: React.FC<BillerDetailsListViewProps> = ({
  billersList,
  onNavigate: _onNavigate,
  onUpdateBiller,
  hideUpdateDetails = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [selectedBiller, setSelectedBiller] = useState<BillerEntity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'Basic' | 'Config' | 'POC' | 'KYC'>('Basic');
  const [previewMdmModalOpen, setPreviewMdmModalOpen] = useState(false);

  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBiller, setEditBiller] = useState<BillerEntity | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBillers = billersList.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.billerName.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.billerId.toLowerCase().includes(q) ||
      (b.mobileNumber && b.mobileNumber.toLowerCase().includes(q)) ||
      (b.emailId && b.emailId.toLowerCase().includes(q)) ||
      b.status.toLowerCase().includes(q) ||
      b.kycStatus.toLowerCase().includes(q)
    );
  });

  const totalRows = filteredBillers.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const displayedBillers = filteredBillers.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(displayedBillers.map((b) => b.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = 'S.No,Biller Name,Biller Category,Kyc Status,Mobile Number,Email ID,State\n';
    const rows = filteredBillers
      .map(
        (b, i) =>
          `"${i + 1}","${b.billerName}","${b.category}","${b.kycStatus}","${b.mobileNumber || b.supportPhone || '—'}","${b.emailId || b.supportEmail || '—'}","${b.state || '—'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Biller_Details_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported biller details to CSV');
  };

  const handleOpenDetail = (biller: BillerEntity) => {
    setSelectedBiller(biller);
    setActiveDetailTab('Basic');
    setDetailModalOpen(true);
  };

  const handleOpenEdit = (biller: BillerEntity) => {
    setEditBiller({ ...biller });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBiller) return;

    if (onUpdateBiller) {
      onUpdateBiller(editBiller);
    }
    showToast(`Biller ${editBiller.billerName} details updated successfully`);
    setEditModalOpen(false);
  };

  return (
    <div id="biller-details-list-view" className="p-6 space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Biller</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Biller Details</span>
      </div>

      {/* Page Heading */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Biller Details</h1>

      {/* Main Single Card Container */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {/* Top Control Bar */}
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

        {/* Table matching Image 4 */}
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-slate-200 text-xs font-semibold text-slate-700 select-none">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      displayedBillers.length > 0 &&
                      displayedBillers.every((b) => selectedRowIds.includes(b.id))
                    }
                    className="w-3.5 h-3.5 rounded text-[#FF6B11] focus:ring-[#FF6B11] border-slate-300 accent-[#FF6B11] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 w-16">S.No</th>
                <th className="py-3.5 px-4">Biller Name</th>
                <th className="py-3.5 px-4">Biller Category</th>
                <th className="py-3.5 px-4">Kyc Status</th>
                <th className="py-3.5 px-4 text-center">View Details</th>
                {!hideUpdateDetails && (
                  <th className="py-3.5 px-4 text-center">Update Details</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {displayedBillers.length === 0 ? (
                <tr>
                  <td colSpan={hideUpdateDetails ? 6 : 7} className="py-20 text-center text-slate-500 text-sm font-normal">
                    No rows found
                  </td>
                </tr>
              ) : (
                displayedBillers.map((item, index) => {
                  const isSelected = selectedRowIds.includes(item.id);
                  const isApproved = item.kycStatus === 'Approved';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="w-3.5 h-3.5 rounded text-[#FF6B11] focus:ring-[#FF6B11] border-slate-300 accent-[#FF6B11] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-normal text-slate-600">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[280px] truncate" title={item.billerName}>
                        {item.billerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            item.kycStatus === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.kycStatus === 'Created'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.kycStatus === 'Rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {item.kycStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="text-[#FF6B11] hover:text-[#e05a07] font-medium hover:underline text-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Show Biller Details</span>
                        </button>
                      </td>
                      {!hideUpdateDetails && (
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="text-[#FF6B11] hover:text-[#e05a07] font-medium hover:underline text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Update Biller Details</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer matching Image 4 */}
        <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
          <div>
            <span>{selectedRowIds.length} row(s) selected</span>
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
                className="border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#FF6B11]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div>
              <span>
                {totalRows === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalRows}`}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalRows === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalRows === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Biller Details 4-Tab Modal */}
      {detailModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#FF6B11] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedBiller.billerName}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {selectedBiller.billerId} | Category: {selectedBiller.category}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveDetailTab('Basic')}
                className={`py-3 border-b-2 transition-colors ${
                  activeDetailTab === 'Basic'
                    ? 'border-[#FF6B11] text-[#FF6B11]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Basic Details
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('Config')}
                className={`py-3 border-b-2 transition-colors ${
                  activeDetailTab === 'Config'
                    ? 'border-[#FF6B11] text-[#FF6B11]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Biller Configuration
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('POC')}
                className={`py-3 border-b-2 transition-colors ${
                  activeDetailTab === 'POC'
                    ? 'border-[#FF6B11] text-[#FF6B11]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                POC Details
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('KYC')}
                className={`py-3 border-b-2 transition-colors ${
                  activeDetailTab === 'KYC'
                    ? 'border-[#FF6B11] text-[#FF6B11]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                KYC Documents
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
              {activeDetailTab === 'Basic' && (
                <div className="space-y-6">
                  {/* General */}
                  <div>
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                      General Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Biller Legal Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.billerLegalName || selectedBiller.billerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">BBPS Biller ID</span>
                        <span className="font-medium font-mono text-slate-800">{selectedBiller.billerId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Biller Category</span>
                        <span className="font-medium text-slate-800 capitalize">{selectedBiller.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">State</span>
                        <span className="font-medium text-slate-800">{selectedBiller.state || 'GUJARAT'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">GSTIN</span>
                        <span className="font-medium font-mono text-slate-800">{selectedBiller.gstin || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">TAN Number</span>
                        <span className="font-medium font-mono text-slate-800">{selectedBiller.tanNo || 'NA'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Registered & Communication Address */}
                  <div>
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                      Address Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">Registered Address</span>
                        <p className="text-slate-600">
                          {selectedBiller.registeredAddress?.address || 'Kutch district of Gujarat, Mandvi Road'}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-1">
                          PIN: {selectedBiller.registeredAddress?.pinCode || '370465'}, State: {selectedBiller.registeredAddress?.state || 'GUJARAT'}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">Communication Address</span>
                        <p className="text-slate-600">
                          {selectedBiller.communicationAddress?.address || 'Kutch district of Gujarat, Mandvi Road'}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-1">
                          PIN: {selectedBiller.communicationAddress?.pinCode || '370465'}, State: {selectedBiller.communicationAddress?.state || 'GUJARAT'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Details */}
                  <div>
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                      Biller Admin Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Admin First Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.billerAdmin?.firstName || selectedBiller.contactPerson?.split(' ')[0] || 'Arham'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Admin Last Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.billerAdmin?.lastName || 'Veerayatan'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                        <span className="font-medium text-slate-800">{selectedBiller.billerAdmin?.mobileNumber || selectedBiller.mobileNumber || '9345673456'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Email ID</span>
                        <span className="font-medium text-slate-800">{selectedBiller.billerAdmin?.emailId || selectedBiller.emailId || 'ARHA00020NATYJ@yop.com'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement Account */}
                  <div>
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                      Settlement Account Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Account Holder Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.settlementAccount?.accountHolderName || selectedBiller.billerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Bank Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.settlementAccount?.bankName || 'SBI'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Account Number</span>
                        <span className="font-medium font-mono text-slate-800">{selectedBiller.settlementAccount?.accountNumber || selectedBiller.bankAccountNo || '39420733781'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Bank IFSC</span>
                        <span className="font-medium font-mono text-slate-800">{selectedBiller.settlementAccount?.bankIfsc || selectedBiller.ifscCode || 'SBIN0006341'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'Config' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Biller Type</span>
                      <span className="font-medium text-slate-800">{selectedBiller.configuration?.billerType || 'Offline'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Settlement Cycle</span>
                      <span className="font-medium text-slate-800">{selectedBiller.settlementCycle || 'T+1 Daily'}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bill Fetch API URL</span>
                      <div className="p-2 bg-slate-100 rounded font-mono text-[11px] text-slate-700 break-all">
                        {selectedBiller.configuration?.billFetchApiUrl || 'NA'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bill Payment API URL</span>
                      <div className="p-2 bg-slate-100 rounded font-mono text-[11px] text-slate-700 break-all">
                        {selectedBiller.configuration?.billPaymentApiUrl || 'NA'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bill Status API URL</span>
                      <div className="p-2 bg-slate-100 rounded font-mono text-[11px] text-slate-700 break-all">
                        {selectedBiller.configuration?.billStatusApiUrl || 'NA'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'POC' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-2">
                    <h5 className="font-semibold text-slate-900">Head of Department (HOD) POC</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.hod?.name || selectedBiller.contactPerson}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Email</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.hod?.email || selectedBiller.emailId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mobile</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.hod?.mobileNumber || selectedBiller.mobileNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-2">
                    <h5 className="font-semibold text-slate-900">Operations POC</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.ops?.name || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Email</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.ops?.email || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mobile</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.ops?.mobileNumber || 'NA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-2">
                    <h5 className="font-semibold text-slate-900">Technical POC</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Name</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.tech?.name || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Email</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.tech?.email || 'NA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mobile</span>
                        <span className="font-medium text-slate-800">{selectedBiller.pocDetails?.tech?.mobileNumber || 'NA'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'KYC' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-md p-4 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-orange-100 text-[#FF6B11] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800">
                          {selectedBiller.kycDocuments?.mdmDocumentName || 'MDM_Document_Verification.pdf'}
                        </h5>
                        <p className="text-[11px] text-slate-500">Master Data Management & Entity Proofs</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewMdmModalOpen(true)}
                      className="px-3 py-1.5 bg-[#FF6B11] text-white rounded text-xs font-semibold hover:bg-[#e05a07]"
                    >
                      View MDM Document
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Next & Back controls on every page */}
            <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md text-xs transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                {activeDetailTab === 'Config' && (
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('Basic')}
                    className="px-5 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 font-semibold rounded-md text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {activeDetailTab === 'POC' && (
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('Config')}
                    className="px-5 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 font-semibold rounded-md text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {activeDetailTab === 'KYC' && (
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('POC')}
                    className="px-5 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 font-semibold rounded-md text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {activeDetailTab === 'Basic' && (
                  <button
                    type="button"
                    id="btn-next-basic"
                    onClick={() => setActiveDetailTab('Config')}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-semibold rounded-md text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                )}

                {activeDetailTab === 'Config' && (
                  <button
                    type="button"
                    id="btn-next-config"
                    onClick={() => setActiveDetailTab('POC')}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-semibold rounded-md text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                )}

                {activeDetailTab === 'POC' && (
                  <button
                    type="button"
                    id="btn-next-poc"
                    onClick={() => setActiveDetailTab('KYC')}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-semibold rounded-md text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                )}

                {activeDetailTab === 'KYC' && (
                  <button
                    type="button"
                    id="btn-done-kyc"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-semibold rounded-md text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Biller Modal */}
      {editModalOpen && editBiller && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Biller Details: {editBiller.billerName}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Biller Name</label>
                  <input
                    type="text"
                    value={editBiller.billerName}
                    onChange={(e) => setEditBiller({ ...editBiller, billerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editBiller.category}
                    onChange={(e) => setEditBiller({ ...editBiller, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={editBiller.mobileNumber || ''}
                    onChange={(e) => setEditBiller({ ...editBiller, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email ID</label>
                  <input
                    type="email"
                    value={editBiller.emailId || ''}
                    onChange={(e) => setEditBiller({ ...editBiller, emailId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editBiller.settlementAccount?.bankName || 'SBI'}
                    onChange={(e) =>
                      setEditBiller({
                        ...editBiller,
                        settlementAccount: {
                          ...(editBiller.settlementAccount || {
                            accountHolderName: editBiller.billerName,
                            bankName: 'SBI',
                            accountNumber: editBiller.bankAccountNo || '',
                            bankIfsc: editBiller.ifscCode || '',
                          }),
                          bankName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={editBiller.settlementAccount?.accountNumber || editBiller.bankAccountNo || ''}
                    onChange={(e) =>
                      setEditBiller({
                        ...editBiller,
                        bankAccountNo: e.target.value,
                        settlementAccount: {
                          ...(editBiller.settlementAccount || {
                            accountHolderName: editBiller.billerName,
                            bankName: 'SBI',
                            accountNumber: e.target.value,
                            bankIfsc: editBiller.ifscCode || '',
                          }),
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#FF6B11]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white rounded text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MDM Document Preview Modal */}
      {previewMdmModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-800">
                MDM Document Preview: {selectedBiller.billerName}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewMdmModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-3 font-mono">
              <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>NPCI Master Data Management Certified</span>
              </div>
              <p className="text-slate-600 font-sans">
                Document: {selectedBiller.kycDocuments?.mdmDocumentName || 'MDM_Document_Verification.pdf'}
              </p>
              <p className="text-slate-600 font-sans">
                Entity ID: {selectedBiller.userId} | BBPS ID: {selectedBiller.billerId}
              </p>
              <p className="text-slate-600 font-sans">
                Verified Bank: Bank of Baroda BOU Settlement Gateway
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewMdmModalOpen(false)}
                className="px-4 py-2 bg-[#FF6B11] text-white text-xs font-semibold rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

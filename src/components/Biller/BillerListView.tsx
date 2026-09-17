import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Building2,
  X,
} from 'lucide-react';
import { BillerEntity, NavItem } from '../../types';

interface BillerListViewProps {
  billersList: BillerEntity[];
  onNavigate?: (nav: NavItem) => void;
  onUpdateBiller?: (updatedBiller: BillerEntity) => void;
  hideAction?: boolean;
}

export const BillerListView: React.FC<BillerListViewProps> = ({
  billersList,
  onNavigate: _onNavigate,
  onUpdateBiller,
  hideAction = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail Modal
  const [selectedBiller, setSelectedBiller] = useState<BillerEntity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBillers = billersList.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.billerName.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.userId?.toLowerCase().includes(q) ||
      b.createdBy?.toLowerCase().includes(q) ||
      b.updatedBy?.toLowerCase().includes(q) ||
      b.billerId.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.kycStatus.toLowerCase().includes(q) ||
      b.createdDate?.toLowerCase().includes(q)
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

  const handleToggleActivation = (biller: BillerEntity) => {
    const nextState = !biller.transactionEnabled;
    const updated: BillerEntity = {
      ...biller,
      transactionEnabled: nextState,
      status: nextState ? 'Live' : 'Deactivate',
      lastUpdatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      updatedBy: 'MAKER',
    };

    if (onUpdateBiller) {
      onUpdateBiller(updated);
    }
    setActiveActionMenuId(null);
    showToast(
      `Biller ${biller.billerName} has been ${nextState ? 'Activated' : 'Deactivated'} successfully.`
    );
  };

  const handleExportCSV = () => {
    const headers =
      'Sl No.,Created Date,Updated By,Transaction Enabled,KYC Status,Last Updated Date,Created By,Biller Name,User Type,User Name,User Id\n';
    const rows = filteredBillers
      .map(
        (b, i) =>
          `"${i + 1}","${b.createdDate || b.registrationDate || '31/08/2026'}","${
            b.updatedBy || 'ABHISHEKSINGLA'
          }","${b.transactionEnabled ? 'True' : 'False'}","${b.kycStatus}","${
            b.lastUpdatedDate || '31/08/2026'
          }","${b.createdBy || 'ABHISHEKSINGLA'}","${b.billerName}","${b.userType || 'BILLER'}","${
            b.userName || b.billerId
          }","${b.userId || '11231759345673456'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Biller_List_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Biller List to CSV');
  };

  return (
    <div id="biller-list-view" className="p-6 space-y-4 max-w-[1700px] mx-auto select-none">
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
        <span className="text-slate-700 font-medium">Biller List</span>
      </div>

      {/* Page Heading */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Biller List</h1>

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

        {/* 12-Column Table matching Image 2 & Image 3 */}
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-slate-200 text-xs font-semibold text-slate-700 select-none">
                <th className="py-3.5 px-3 w-10 text-center">
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
                <th className="py-3.5 px-3 whitespace-nowrap">Sl No.</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Created Date</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Updated By</th>
                <th className="py-3.5 px-3 whitespace-nowrap text-center">Transaction Enabled</th>
                <th className="py-3.5 px-3 whitespace-nowrap">KYC Status</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Last Updated Date</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Created By</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Biller Name</th>
                <th className="py-3.5 px-3 whitespace-nowrap">User Type</th>
                <th className="py-3.5 px-3 whitespace-nowrap">User Name</th>
                <th className="py-3.5 px-3 whitespace-nowrap">User Id</th>
                {!hideAction && (
                  <th className="py-3.5 px-3 text-center w-14 whitespace-nowrap">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {displayedBillers.length === 0 ? (
                <tr>
                  <td colSpan={hideAction ? 12 : 13} className="py-20 text-center text-slate-500 text-sm font-normal">
                    No rows found
                  </td>
                </tr>
              ) : (
                displayedBillers.map((item, index) => {
                  const isSelected = selectedRowIds.includes(item.id);
                  const isActionOpen = activeActionMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="w-3.5 h-3.5 rounded text-[#FF6B11] focus:ring-[#FF6B11] border-slate-300 accent-[#FF6B11] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-normal text-slate-600 whitespace-nowrap">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3.5 px-3 font-normal text-slate-600 whitespace-nowrap">
                        {item.createdDate || item.registrationDate || '31/08/2026'}
                      </td>
                      <td className="py-3.5 px-3 font-normal text-slate-700 whitespace-nowrap">
                        {item.updatedBy || 'ABHISHEKSINGLA'}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            item.transactionEnabled ? 'text-emerald-600' : 'text-slate-500'
                          }`}
                        >
                          {item.transactionEnabled ? 'True' : 'False'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
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
                      <td className="py-3.5 px-3 font-normal text-slate-600 whitespace-nowrap">
                        {item.lastUpdatedDate || '31/08/2026'}
                      </td>
                      <td className="py-3.5 px-3 font-normal text-slate-700 whitespace-nowrap">
                        {item.createdBy || 'ABHISHEKSINGLA'}
                      </td>
                      <td
                        className="py-3.5 px-3 font-medium text-slate-900 max-w-[200px] truncate"
                        title={item.billerName}
                      >
                        {item.billerName}
                      </td>
                      <td className="py-3.5 px-3 font-normal text-slate-600 whitespace-nowrap">
                        {item.userType || 'BILLER'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {item.userName || item.billerId}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {item.userId || '11231759345673456'}
                      </td>
                      {!hideAction && (
                        <td className="py-3.5 px-3 text-center relative whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenuId(isActionOpen ? null : item.id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Popover Action Menu matching Image 2 & 3 */}
                          {isActionOpen && (
                            <div
                              ref={actionMenuRef}
                              className="absolute right-3 top-10 z-40 bg-white border border-slate-200 rounded-md shadow-lg py-1 w-36 text-left animate-in fade-in zoom-in-95"
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleActivation(item)}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.transactionEnabled ? 'Deactivate' : 'Activate'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBiller(item);
                                  setDetailModalOpen(true);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Details</span>
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
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

      {/* Quick View Details Modal */}
      {detailModalOpen && selectedBiller && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#FF6B11]" />
                <h3 className="font-bold text-slate-800 text-sm">{selectedBiller.billerName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">BBPS Biller ID:</span>
                <span className="font-semibold text-slate-800">{selectedBiller.billerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 capitalize">{selectedBiller.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">KYC Status:</span>
                <span className="font-semibold text-emerald-700">{selectedBiller.kycStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Status:</span>
                <span className="font-semibold text-slate-800">
                  {selectedBiller.transactionEnabled ? 'Enabled (Live)' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created Date:</span>
                <span className="text-slate-700">{selectedBiller.createdDate || '31/08/2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created By:</span>
                <span className="text-slate-700">{selectedBiller.createdBy || 'ABHISHEKSINGLA'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

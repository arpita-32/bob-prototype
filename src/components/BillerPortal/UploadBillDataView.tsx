import React, { useState, useRef } from 'react';
import {
  History,
  Search,
  Calendar,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { BillerEntity } from '../../types';

export interface BillUploadRecord {
  id: string;
  sNo: number;
  uploadedAt: string;
  uploadedBy: string;
  fileName: string;
  status: 'Completed' | 'Failed';
  reason: string;
}

interface UploadBillDataViewProps {
  biller: BillerEntity;
}

export const UploadBillDataView: React.FC<UploadBillDataViewProps> = ({ biller }) => {
  const [currentView, setCurrentView] = useState<'upload' | 'history'>('upload');

  // History Toast Notification (matching Screenshot 2: "Reports fetched Successfully!")
  const [showHistoryToast, setShowHistoryToast] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search states for History Log (matching Screenshot 2)
  const [fromDate, setFromDate] = useState('06/06/2026');
  const [toDate, setToDate] = useState('03/09/2026');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // History log records initialized with exact data from Screenshot 2
  const [historyRecords, setHistoryRecords] = useState<BillUploadRecord[]>([
    {
      id: 'rec-1',
      sNo: 1,
      uploadedAt: 'Sep 1, 2026 2:36PM',
      uploadedBy: biller.billerId || 'LKTI00000NATT6',
      fileName: 'LKT BBPS Student Data.xlsx',
      status: 'Completed',
      reason: 'File uploaded successfully',
    },
    {
      id: 'rec-2',
      sNo: 2,
      uploadedAt: 'Sep 1, 2026 2:34PM',
      uploadedBy: biller.billerId || 'LKTI00000NATT6',
      fileName: 'LKT BBPS Student Data.xlsx',
      status: 'Failed',
      reason: 'File upload failed',
    },
  ]);

  const handleOpenHistory = () => {
    setCurrentView('history');
    setShowHistoryToast(true);
    setTimeout(() => {
      setShowHistoryToast(false);
    }, 4500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadSuccessMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadSuccessMsg(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      const now = new Date();
      const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

      const newRecord: BillUploadRecord = {
        id: `rec-${Date.now()}`,
        sNo: historyRecords.length + 1,
        uploadedAt: formattedDate,
        uploadedBy: biller.billerId || 'LKTI00000NATT6',
        fileName: selectedFile.name,
        status: 'Completed',
        reason: 'File uploaded successfully',
      };

      setHistoryRecords([newRecord, ...historyRecords]);
      setUploadSuccessMsg(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1200);
  };

  // Filtered records for History view
  const filteredRecords = historyRecords.filter((rec) => {
    if (statusFilter !== 'All' && rec.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.fileName.toLowerCase().includes(q) ||
        rec.uploadedBy.toLowerCase().includes(q) ||
        rec.reason.toLowerCase().includes(q) ||
        rec.uploadedAt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadExcel = () => {
    // Generate CSV data download
    const headers = ['S. No.', 'Uploaded At', 'Uploaded By', 'File Name', 'Status', 'Reason'];
    const rows = filteredRecords.map((r) => [
      r.sNo,
      `"${r.uploadedAt}"`,
      `"${r.uploadedBy}"`,
      `"${r.fileName}"`,
      r.status,
      `"${r.reason}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Upload_Bill_Data_Log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col font-sans select-none relative">
      {/* Toast Notification (Screenshot 2: "Reports fetched Successfully!") */}
      {showHistoryToast && (
        <div className="fixed top-20 right-6 z-50 bg-white text-slate-800 text-xs px-4 py-2.5 rounded shadow-lg border border-slate-200 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-700">Reports fetched Successfully!</span>
          <button
            type="button"
            onClick={() => setShowHistoryToast(false)}
            className="text-slate-400 hover:text-slate-600 ml-3 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* VIEW 1: UPLOAD BILL DATA (Exact replica of Screenshot 1) */}
      {currentView === 'upload' && (
        <div className="w-full space-y-4">
          {/* Breadcrumb */}
          <div className="text-[11px] text-slate-500 font-normal">
            <span>Upload Bill Data</span>
          </div>

          {/* Header Row: Title on Left, History Button on Right */}
          <div className="flex items-center justify-between">
            <h1 className="text-[15px] font-bold text-slate-800 tracking-tight">
              Upload Bill Data
            </h1>

            <button
              type="button"
              id="btn-upload-history"
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF6B11] hover:bg-[#E05A07] text-white text-xs font-medium rounded transition-colors shadow-xs cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Success Banner if newly uploaded */}
          {uploadSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadSuccessMsg(null)}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main White Canvas Box */}
          <div className="w-full bg-white border border-slate-200/80 rounded-md p-6 sm:p-12 min-h-[460px] flex flex-col items-center justify-center">
            {/* Box Header Label */}
            <div className="text-xs text-slate-600 font-medium mb-3">
              Upload Bill Data
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            {/* Dashed Rounded Upload Target with Excel Icon */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`w-[220px] h-[130px] sm:w-[240px] sm:h-[135px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-white hover:bg-orange-50/20 ${
                isDragOver
                  ? 'border-[#FF6B11] bg-orange-50/40'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              {/* Stylized Excel Finacle File Graphic matching Screenshot 1 */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* File sheet SVG with folded corner */}
                <svg
                  viewBox="0 0 64 64"
                  className="w-14 h-14 drop-shadow-xs"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Sheet body in soft peach/orange */}
                  <path
                    d="M 14 6 C 14 4 15.5 2.5 17.5 2.5 L 42 2.5 L 53.5 14 L 53.5 57.5 C 53.5 59.5 52 61 50 61 L 17.5 61 C 15.5 61 14 59.5 14 57.5 Z"
                    fill="#FFCCAA"
                  />
                  {/* Folded corner */}
                  <path
                    d="M 42 2.5 L 42 14 L 53.5 14 Z"
                    fill="#FFB085"
                  />
                  {/* Center Excel 'X' Symbol */}
                  <text
                    x="33.5"
                    y="43"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="28"
                  >
                    X
                  </text>
                </svg>
              </div>

              {/* Show selected file name if picked */}
              {selectedFile && (
                <div className="mt-1 text-[11px] font-semibold text-slate-700 truncate max-w-[190px] px-2 text-center">
                  {selectedFile.name}
                </div>
              )}
            </div>

            {/* Reset and Upload Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                id="btn-upload-reset"
                onClick={handleReset}
                className="text-xs font-semibold text-[#FF6B11] hover:underline px-2 py-1 cursor-pointer transition-colors"
              >
                Reset
              </button>

              <button
                type="button"
                id="btn-upload-submit"
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  selectedFile && !isUploading
                    ? 'bg-[#FF6B11] hover:bg-[#E05A07] text-white shadow-xs cursor-pointer'
                    : 'bg-[#CBD5E1] text-slate-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {/* Instruction footnote */}
            <p className="text-[11px] text-slate-500 mt-4 text-center">
              Please upload only Excel File (Finacle_File.xlsx)*
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: UPLOAD BILL DATA LOG / HISTORY (Exact replica of Screenshot 2) */}
      {currentView === 'history' && (
        <div className="w-full space-y-4 animate-in fade-in duration-150">
          {/* Breadcrumb with back navigation */}
          <div className="text-[11px] text-slate-500 font-normal flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentView('upload')}
              className="hover:text-[#FF6B11] transition-colors cursor-pointer"
            >
              Upload Bill Data
            </button>
            <span>/</span>
            <span className="text-slate-800 font-medium">History</span>
          </div>

          {/* Page Title */}
          <h1 className="text-[15px] font-bold text-slate-800 tracking-tight">
            Upload Bill Data log
          </h1>

          {/* Filter Bar Row */}
          <div className="flex flex-wrap items-end gap-3 pt-1">
            {/* From Date */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-600 font-medium">
                From Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-36 h-8 px-2.5 pr-8 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-600 font-medium">
                To Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-36 h-8 px-2.5 pr-8 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Select Bill Upload Status */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-600 font-medium">
                Select Bill Upload Status
              </label>
              <div className="relative flex items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Completed' | 'Failed')}
                  className="w-44 h-8 pl-2.5 pr-7 border border-slate-300 rounded text-xs text-slate-800 appearance-none bg-white focus:outline-none focus:border-[#FF6B11] cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={() => {
                setShowHistoryToast(true);
                setTimeout(() => setShowHistoryToast(false), 3000);
              }}
              className="h-8 px-5 bg-[#FF6B11] hover:bg-[#E05A07] text-white text-xs font-semibold rounded transition-colors shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Action Row: Search Here on left, Download Excel on right */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Here"
                className="w-full h-8 pl-7 pr-3 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
            </div>

            {/* Download Excel Button */}
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="h-8 px-3.5 bg-[#FF6B11] hover:bg-[#E05A07] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel</span>
            </button>
          </div>

          {/* Table */}
          <div className="w-full bg-white border border-slate-200 rounded overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#FAF9F8] border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">S. No.</th>
                    <th className="py-2.5 px-4">Uploaded At</th>
                    <th className="py-2.5 px-4">Uploaded By</th>
                    <th className="py-2.5 px-4">File Name</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Reason</th>
                    <th className="py-2.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec, index) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4 text-slate-600">{index + 1}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-normal">{rec.uploadedAt}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-mono text-[11px]">{rec.uploadedBy}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-normal">{rec.fileName}</td>
                        <td className="py-2.5 px-4">
                          {rec.status === 'Completed' ? (
                            <span className="inline-block px-2 py-0.5 text-[10.5px] font-medium rounded-xs bg-[#EDFDF2] text-[#16A34A] border border-emerald-200">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-[10.5px] font-medium rounded-xs bg-[#FEF2F2] text-[#EF4444] border border-red-200">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{rec.reason}</td>
                        <td className="py-2.5 px-4">
                          {rec.status === 'Completed' ? (
                            <button
                              type="button"
                              onClick={handleDownloadExcel}
                              className="text-[#FF6B11] hover:underline font-medium text-xs cursor-pointer"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs cursor-not-allowed">
                              Download
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No records match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls matching Screenshot 2 */}
            <div className="px-4 py-2.5 border-t border-slate-200 bg-white flex items-center justify-end gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="bg-transparent border-0 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="text-[11px] text-slate-700">
                1-{filteredRecords.length} of {filteredRecords.length}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="p-1 text-slate-300 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled
                  className="p-1 text-slate-300 cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

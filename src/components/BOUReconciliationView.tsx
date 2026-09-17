import React, { useState, useRef } from 'react';
import {
  Calendar,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  FileArchive,
  Download,
  Clock,
} from 'lucide-react';
import { ChannelOption } from '../types';

interface BOUReconciliationViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
}

interface ReconciliationHistoryItem {
  id: string;
  sNo: number;
  fromDate: string;
  toDate: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
}

const mockHistoryData: ReconciliationHistoryItem[] = [
  {
    id: 'recon-1',
    sNo: 1,
    fromDate: '26/08/2026',
    toDate: '27/08/2026',
    fileName: 'NPCI_BOU_RECON_20260827.zip',
    fileSize: '4.8 MB',
    uploadTime: '27-08-2026 16:45:10',
    totalRecords: 14250,
    matchedRecords: 14190,
    unmatchedRecords: 60,
    status: 'COMPLETED',
  },
  {
    id: 'recon-2',
    sNo: 2,
    fromDate: '25/08/2026',
    toDate: '25/08/2026',
    fileName: 'NPCI_BOU_RECON_20260825.zip',
    fileSize: '3.9 MB',
    uploadTime: '25-08-2026 17:12:00',
    totalRecords: 11800,
    matchedRecords: 11785,
    unmatchedRecords: 15,
    status: 'COMPLETED',
  },
  {
    id: 'recon-3',
    sNo: 3,
    fromDate: '20/08/2026',
    toDate: '24/08/2026',
    fileName: 'NPCI_BOU_BULK_WEEK34.zip',
    fileSize: '18.2 MB',
    uploadTime: '24-08-2026 19:30:22',
    totalRecords: 54100,
    matchedRecords: 53920,
    unmatchedRecords: 180,
    status: 'COMPLETED',
  },
];

export const BOUReconciliationView: React.FC<BOUReconciliationViewProps> = ({
  channel: _channel,
  onChannelChange: _onChannelChange,
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isDateSubmitted, setIsDateSubmitted] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [reconStatus, setReconStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromDate.trim() && toDate.trim()) {
      setIsDateSubmitted(true);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip') || file.type.includes('compressed')) {
        setUploadedFile(file);
        setReconStatus('idle');
      } else {
        alert('Please upload only Zip File (.zip)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip') || file.type.includes('compressed')) {
        setUploadedFile(file);
        setReconStatus('idle');
      } else {
        alert('Please upload only Zip File (.zip)');
      }
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setReconStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReconcile = () => {
    if (!uploadedFile) return;
    setReconStatus('processing');
    setTimeout(() => {
      setReconStatus('success');
    }, 1200);
  };

  const canSubmitDates = fromDate.trim().length > 0 && toDate.trim().length > 0;

  return (
    <div id="bou-reconciliation-view" className="p-6 space-y-4 max-w-[1600px] mx-auto select-none font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Reconciliation</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">BOU Reconciliation</span>
      </div>

      {/* Page Heading & History Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          BOU Reconciliation
        </h1>

        <button
          type="button"
          id="bou-recon-history-btn"
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-xs rounded-md shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* 1. Date Selection Section Card */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs space-y-4">
        <p className="text-xs text-slate-600 font-normal">
          After Selecting the date you can upload the NPCI Files.
        </p>

        <form onSubmit={handleDateSubmit} className="flex flex-wrap items-end gap-4">
          {/* From Date */}
          <div className="w-full sm:w-72">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              From Date <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full focus:outline-none placeholder:text-slate-400 text-xs text-slate-800"
              />
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* To Date */}
          <div className="w-full sm:w-72">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              To Date <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full focus:outline-none placeholder:text-slate-400 text-xs text-slate-800"
              />
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Submit Date Button */}
          <button
            type="submit"
            disabled={!canSubmitDates}
            className={`px-6 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              canSubmitDates
                ? 'bg-[#FF6B11] text-white hover:bg-[#e05a07] shadow-2xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </form>
      </div>

      {/* 2. Main Upload NPCI Files Card */}
      <div className="bg-white border border-slate-200 rounded-md p-8 shadow-2xs flex flex-col items-center justify-center text-center space-y-5">
        <h2 className="text-xs font-medium text-slate-700">
          Upload NPCI Files.
        </h2>

        {/* Dropzone Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-sm rounded-lg border border-dashed p-6 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-[#FF6B11] bg-orange-50/50'
              : 'border-slate-300 bg-white hover:bg-slate-50/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".zip,application/zip,application/x-zip-compressed"
            className="hidden"
          />

          {/* Realistic Peach ZIP File Icon Badge */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-16 h-20 bg-[#FFE5D3] rounded-md border border-[#FFD0B0] flex flex-col items-center justify-center relative shadow-xs">
              {/* Folded Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#FFC59E] rounded-bl" />
              <div className="w-full text-center mt-2">
                <span className="text-[13px] font-black tracking-wider text-[#FF6B11]">
                  ZIP
                </span>
              </div>
              <div className="w-6 h-0.5 bg-[#FF6B11]/30 rounded my-1" />
              <div className="w-4 h-0.5 bg-[#FF6B11]/30 rounded" />
            </div>
          </div>

          <p className="text-xs text-slate-500 font-normal">
            {uploadedFile ? (
              <span className="font-semibold text-slate-800 break-all">
                {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              'Click or drag & drop'
            )}
          </p>
        </div>

        {/* Action Buttons: Reset and Reconcile */}
        <div className="flex items-center gap-4 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-[#FF6B11] hover:underline cursor-pointer px-3 py-1.5"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleReconcile}
            disabled={!uploadedFile || reconStatus === 'processing'}
            className={`px-6 py-2 text-xs font-medium rounded-md transition-colors ${
              uploadedFile && reconStatus !== 'processing'
                ? 'bg-[#FF6B11] text-white hover:bg-[#e05a07] shadow-2xs cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {reconStatus === 'processing' ? 'Processing...' : 'Reconcile'}
          </button>
        </div>

        {/* Success Alert */}
        {reconStatus === 'success' && (
          <div className="w-full max-w-md bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-2.5 text-xs text-emerald-800 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              NPCI File <strong>{uploadedFile?.name}</strong> successfully submitted for reconciliation!
            </span>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500 font-normal">
          Please upload only Zip File
        </p>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF6B11]" />
                <h3 className="text-sm font-bold text-slate-900">
                  BOU Reconciliation History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-2.5 px-3 w-12">S.No</th>
                    <th className="py-2.5 px-3">Date Range</th>
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3">File Size</th>
                    <th className="py-2.5 px-3">Uploaded At</th>
                    <th className="py-2.5 px-3">Total Records</th>
                    <th className="py-2.5 px-3">Matched</th>
                    <th className="py-2.5 px-3">Discrepancies</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {mockHistoryData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-medium text-slate-600">{item.sNo}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium">
                        {item.fromDate} to {item.toDate}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {item.fileName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.fileSize}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.uploadTime}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.totalRecords.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 font-medium">
                        {item.matchedRecords.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-amber-600 font-medium">
                        {item.unmatchedRecords.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-md cursor-pointer transition-colors"
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

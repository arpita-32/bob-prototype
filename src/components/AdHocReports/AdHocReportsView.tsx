import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Download,
  FileDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { ChannelOption } from '../../types';

interface AdHocReportsViewProps {
  channel?: ChannelOption;
  onChannelChange?: (ch: ChannelOption) => void;
}

interface AdHocFileItem {
  id: string;
  sNo: number;
  fileName: string;
  createdDate: string;
  fileSize: string;
}

const mockAdHocFileList: AdHocFileItem[] = [
  {
    id: 'adhoc-1',
    sNo: 1,
    fileName: 'COU RECON OUTPUT_26TH AUG 2026.zip',
    createdDate: '27/08/2026, 12:23:12 PM',
    fileSize: '4.2 MB',
  },
  {
    id: 'adhoc-2',
    sNo: 2,
    fileName: 'BOU RECON OUTPUT_26TH AUG 2026.zip',
    createdDate: '27/08/2026, 11:03:28 AM',
    fileSize: '3.8 MB',
  },
  {
    id: 'adhoc-3',
    sNo: 3,
    fileName: 'COU RECON OUTPUT_25TH AUG 2026.zip',
    createdDate: '26/08/2026, 12:37:30 PM',
    fileSize: '5.1 MB',
  },
  {
    id: 'adhoc-4',
    sNo: 4,
    fileName: 'BOU RECON OUTPUT_25TH AUG 2026.zip',
    createdDate: '26/08/2026, 10:47:18 AM',
    fileSize: '4.6 MB',
  },
  {
    id: 'adhoc-5',
    sNo: 5,
    fileName: 'COU RECON OUTPUT_24TH AUG 2026.zip',
    createdDate: '25/08/2026, 12:26:50 PM',
    fileSize: '4.9 MB',
  },
  {
    id: 'adhoc-6',
    sNo: 6,
    fileName: 'BOU RECON OUTPUT_24TH AUG 2026.zip',
    createdDate: '25/08/2026, 10:32:15 AM',
    fileSize: '3.5 MB',
  },
  {
    id: 'adhoc-7',
    sNo: 7,
    fileName: 'COU RECON OUTPUT_23RD AUG 2026.zip',
    createdDate: '24/08/2026, 12:15:40 PM',
    fileSize: '5.4 MB',
  },
  {
    id: 'adhoc-8',
    sNo: 8,
    fileName: 'BOU RECON OUTPUT_23RD AUG 2026.zip',
    createdDate: '24/08/2026, 11:10:05 AM',
    fileSize: '4.1 MB',
  },
  {
    id: 'adhoc-9',
    sNo: 9,
    fileName: 'COU RECON OUTPUT_22ND AUG 2026.zip',
    createdDate: '23/08/2026, 01:05:22 PM',
    fileSize: '4.7 MB',
  },
  {
    id: 'adhoc-10',
    sNo: 10,
    fileName: 'BOU RECON OUTPUT_22ND AUG 2026.zip',
    createdDate: '23/08/2026, 10:50:18 AM',
    fileSize: '3.9 MB',
  },
];

export const AdHocReportsView: React.FC<AdHocReportsViewProps> = () => {
  // Navigation state: 'folder' (Image 1) or 'list' (Image 2)
  const [currentView, setCurrentView] = useState<'folder' | 'list'>('folder');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = (file: AdHocFileItem) => {
    const dummyContent = `File: ${file.fileName}\nGenerated: ${file.createdDate}\nStatus: Completed\nRecords Count: 12500\n`;
    const blob = new Blob([dummyContent], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${file.fileName}`);
  };

  const handleExportCSV = () => {
    const header = 'Sl no.,File Name,Created Date\n';
    const rows = mockAdHocFileList
      .map((f) => `${f.sNo},"${f.fileName}","${f.createdDate}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ad_Hoc_Reports_List_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Ad-hoc Reports metadata as CSV');
  };

  // Filtered files
  const filteredFiles = mockAdHocFileList.filter((f) =>
    f.fileName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const totalRecords = filteredFiles.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
  const displayedFiles = filteredFiles.slice(startIndex, endIndex);

  return (
    <div id="adhoc-reports-container" className="p-6 max-w-[1600px] mx-auto space-y-5 font-sans select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-md shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen 1: Initial Folder Card (Image 1) */}
      {currentView === 'folder' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Ad-hoc Reports
          </h1>

          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ad-hoc Reports
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Open the folder to view and download Ad-hoc MIS
              </p>
            </div>

            <button
              type="button"
              id="adhoc-open-folder-btn"
              onClick={() => {
                setCurrentView('list');
                setCurrentPage(1);
                setSearchQuery('');
              }}
              className="px-8 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer text-center shrink-0"
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Reports List Table View (Image 2) */}
      {currentView === 'list' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Ad-hoc Reports
          </h1>

          {/* Back Button */}
          <div>
            <button
              type="button"
              id="adhoc-back-btn"
              onClick={() => setCurrentView('folder')}
              className="flex items-center gap-1 px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Controls Bar: Search on Left, Export as CSV on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Export as CSV Button */}
            <button
              type="button"
              id="adhoc-export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 font-medium text-xs rounded-md transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <FileDown className="w-4 h-4" />
              <span>Export as CSV</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-normal text-slate-600 bg-white">
                    <th className="py-3 px-4 w-16">Sl no.</th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {displayedFiles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No reports matching your search.
                      </td>
                    </tr>
                  ) : (
                    displayedFiles.map((file, idx) => (
                      <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 text-slate-600">
                          {startIndex + idx + 1}
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 font-normal">
                          {file.fileName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-normal">
                          {file.createdDate}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDownload(file)}
                            className="inline-flex items-center justify-center p-1.5 text-slate-700 hover:text-[#FF6B11] hover:bg-orange-50 rounded transition-colors cursor-pointer"
                            title={`Download ${file.fileName}`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-6 text-xs text-slate-600 bg-white">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-[#FF6B11] font-normal">Rows per page:</span>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-transparent pr-5 pl-1 py-0.5 text-xs text-[#FF6B11] font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#FF6B11] absolute right-0 top-1 pointer-events-none" />
                </div>
              </div>

              {/* Range indicator */}
              <div className="text-[#FF6B11] font-normal">
                {totalRecords > 0 ? `${startIndex + 1}–${endIndex} of ${totalRecords}` : '0–0 of 0'}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={`p-1 rounded transition-colors ${
                    currentPage > 1
                      ? 'text-[#FF6B11] hover:bg-orange-50 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className={`p-1 rounded transition-colors ${
                    currentPage < totalPages
                      ? 'text-[#FF6B11] hover:bg-orange-50 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Next Page"
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

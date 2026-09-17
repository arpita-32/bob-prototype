import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { ChannelOption } from '../types';

interface BOUReportViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
}

export const BOU_REPORT_TYPES = [
  'BOU Transaction Summary',
  'Unique BOU Data',
  'Suspicious Transaction Report',
  'Biller Wise Agreed Commercials',
  'Bill Fetch Report',
  'BOU Transaction Report',
  'Commission Report',
];

export const PERIODIC_OPTIONS = [
  'Today',
  'Last Day',
  'Last 7 days',
  'Last Month',
  'Last 3 Months',
  'Last 6 Months',
];

interface BOUReportRecord {
  id: string;
  sNo: number;
  billerId: string;
  billerName: string;
  category: string;
  txnRefId: string;
  refId: string;
  customerId: string;
  amount: string;
  paymentMode: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  txnDate: string;
  fee: string;
}

const mockBOURecords: BOUReportRecord[] = [
  {
    id: 'bou-1',
    sNo: 1,
    billerId: 'BILL-001',
    billerName: 'Tata Power Delhi',
    category: 'Electricity',
    txnRefId: 'TXNBOU8819201',
    refId: 'REF-BOU-101',
    customerId: 'CUST-8819',
    amount: '₹ 2,450.00',
    paymentMode: 'UPI',
    status: 'SUCCESS',
    txnDate: '27-08-2026 10:15:32',
    fee: '₹ 12.25',
  },
  {
    id: 'bou-2',
    sNo: 2,
    billerId: 'BILL-002',
    billerName: 'Bangalore Electricity Supply (BESCOM)',
    category: 'Electricity',
    txnRefId: 'TXNBOU8819202',
    refId: 'REF-BOU-102',
    customerId: 'CUST-9920',
    amount: '₹ 1,820.00',
    paymentMode: 'Internet Banking',
    status: 'SUCCESS',
    txnDate: '27-08-2026 11:20:10',
    fee: '₹ 9.10',
  },
  {
    id: 'bou-3',
    sNo: 3,
    billerId: 'BILL-003',
    billerName: 'Mahanagar Gas Limited',
    category: 'Gas',
    txnRefId: 'TXNBOU8819203',
    refId: 'REF-BOU-103',
    customerId: 'CUST-3312',
    amount: '₹ 950.00',
    paymentMode: 'Mobile Banking',
    status: 'SUCCESS',
    txnDate: '27-08-2026 12:45:00',
    fee: '₹ 4.75',
  },
  {
    id: 'bou-4',
    sNo: 4,
    billerId: 'BILL-004',
    billerName: 'Airtel Postpaid',
    category: 'Mobile Postpaid',
    txnRefId: 'TXNBOU8819204',
    refId: 'REF-BOU-104',
    customerId: 'CUST-4419',
    amount: '₹ 1,199.00',
    paymentMode: 'Cards',
    status: 'SUCCESS',
    txnDate: '27-08-2026 13:10:45',
    fee: '₹ 6.00',
  },
  {
    id: 'bou-5',
    sNo: 5,
    billerId: 'BILL-005',
    billerName: 'Delhi Jal Board',
    category: 'Water',
    txnRefId: 'TXNBOU8819205',
    refId: 'REF-BOU-105',
    customerId: 'CUST-7721',
    amount: '₹ 450.00',
    paymentMode: 'UPI',
    status: 'PENDING',
    txnDate: '27-08-2026 14:05:12',
    fee: '₹ 2.25',
  },
];

export const BOUReportView: React.FC<BOUReportViewProps> = ({
  channel: _channel,
  onChannelChange: _onChannelChange,
}) => {
  const [activeTab, setActiveTab] = useState<'Periodic' | 'Custom' | 'Combination Search'>('Periodic');

  // Tab 1: Periodic Tab state
  const [periodicSelect, setPeriodicSelect] = useState<string>('');
  const [periodicReportType, setPeriodicReportType] = useState<string>('');
  const [periodicBillerUser, setPeriodicBillerUser] = useState<string>('');
  const [periodicSubmitted, setPeriodicSubmitted] = useState<boolean>(false);

  // Tab 2: Custom Tab state
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [customBillerUser, setCustomBillerUser] = useState<string>('');
  const [customReportType, setCustomReportType] = useState<string>('');
  const [customSubmitted, setCustomSubmitted] = useState<boolean>(false);

  // Tab 3: Combination Search Tab state
  const [combSearchType, setCombSearchType] = useState<'Ref ID' | 'Transaction Ref ID' | 'Customer ID'>('Ref ID');
  const [combStartDate, setCombStartDate] = useState<string>('');
  const [combEndDate, setCombEndDate] = useState<string>('');
  const [combRefId, setCombRefId] = useState<string>('');
  const [combTxnRefId, setCombTxnRefId] = useState<string>('');
  const [combCustomerId, setCombCustomerId] = useState<string>('');
  const [combBillerUser, setCombBillerUser] = useState<string>('');
  const [combSubmitted, setCombSubmitted] = useState<boolean>(false);

  // Search in table query & pagination
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter records based on current active tab search
  const isSearchActive =
    (activeTab === 'Periodic' && periodicSubmitted) ||
    (activeTab === 'Custom' && customSubmitted) ||
    (activeTab === 'Combination Search' && combSubmitted);

  const filteredRecords = !isSearchActive
    ? []
    : mockBOURecords.filter((r) => {
        if (!tableSearchQuery.trim()) return true;
        const q = tableSearchQuery.toLowerCase().trim();
        return (
          r.billerName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.txnRefId.toLowerCase().includes(q) ||
          r.refId.toLowerCase().includes(q) ||
          r.customerId.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.paymentMode.toLowerCase().includes(q)
        );
      });

  const totalRows = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const displayedRecords = filteredRecords.slice(startIndex, endIndex);

  const handlePeriodicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPeriodicSubmitted(true);
    setCurrentPage(1);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSubmitted(true);
    setCurrentPage(1);
  };

  const handleCombinationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCombSubmitted(true);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = 'S.No,Biller ID,Biller Name,Category,Txn Ref ID,Ref ID,Customer ID,Amount,Payment Mode,Status,Date,Fee\n';
    const rows = filteredRecords
      .map(
        (r, i) =>
          `"${i + 1}","${r.billerId}","${r.billerName}","${r.category}","${r.txnRefId}","${r.refId}","${r.customerId}","${r.amount}","${r.paymentMode}","${r.status}","${r.txnDate}","${r.fee}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BOU_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="bou-report-view" className="p-6 space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Report Center</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">BOU Report</span>
      </div>

      {/* Page Heading */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">
        BOU Report
      </h1>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('Periodic');
              setTableSearchQuery('');
            }}
            className={`pb-3 pt-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'Periodic'
                ? 'border-[#FF6B11] text-[#FF6B11]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Periodic
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('Custom');
              setTableSearchQuery('');
            }}
            className={`pb-3 pt-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'Custom'
                ? 'border-[#FF6B11] text-[#FF6B11]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('Combination Search');
              setTableSearchQuery('');
            }}
            className={`pb-3 pt-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'Combination Search'
                ? 'border-[#FF6B11] text-[#FF6B11]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Combination Search
          </button>
        </div>

        {/* Tab 1: Periodic Content */}
        {activeTab === 'Periodic' && (
          <div className="p-4 border-b border-slate-200">
            <form onSubmit={handlePeriodicSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Periodic<span className="text-red-500">*</span>
                </label>
                <select
                  value={periodicSelect}
                  onChange={(e) => setPeriodicSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:border-[#FF6B11] cursor-pointer"
                  required
                >
                  <option value="">Select Periodic</option>
                  {PERIODIC_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={periodicReportType}
                  onChange={(e) => setPeriodicReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:border-[#FF6B11] cursor-pointer"
                  required
                >
                  <option value="">Select Type</option>
                  {BOU_REPORT_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Billers
                </label>
                <input
                  type="text"
                  placeholder="Type Biller Username"
                  value={periodicBillerUser}
                  onChange={(e) => setPeriodicBillerUser(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer text-center"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Custom Content */}
        {activeTab === 'Custom' && (
          <div className="p-4 border-b border-slate-200">
            <form onSubmit={handleCustomSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full focus:outline-none text-xs text-slate-800"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full focus:outline-none text-xs text-slate-800"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Billers
                </label>
                <input
                  type="text"
                  placeholder="Type Biller Username"
                  value={customBillerUser}
                  onChange={(e) => setCustomBillerUser(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={customReportType}
                  onChange={(e) => setCustomReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:border-[#FF6B11] cursor-pointer"
                  required
                >
                  <option value="">Select Type</option>
                  {BOU_REPORT_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer text-center"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Combination Search Content */}
        {activeTab === 'Combination Search' && (
          <div className="p-4 border-b border-slate-200 space-y-4">
            {/* 3 Radio Buttons: Ref ID, Transaction Ref ID, Customer ID */}
            <div className="flex items-center gap-6 pb-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="bouCombSearchType"
                  value="Ref ID"
                  checked={combSearchType === 'Ref ID'}
                  onChange={() => setCombSearchType('Ref ID')}
                  className="text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
                />
                <span>Ref ID</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="bouCombSearchType"
                  value="Transaction Ref ID"
                  checked={combSearchType === 'Transaction Ref ID'}
                  onChange={() => setCombSearchType('Transaction Ref ID')}
                  className="text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
                />
                <span>Transaction Ref ID</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="bouCombSearchType"
                  value="Customer ID"
                  checked={combSearchType === 'Customer ID'}
                  onChange={() => setCombSearchType('Customer ID')}
                  className="text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
                />
                <span>Customer ID</span>
              </label>
            </div>

            <form onSubmit={handleCombinationSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={combStartDate}
                    onChange={(e) => setCombStartDate(e.target.value)}
                    className="w-full focus:outline-none text-xs text-slate-800"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={combEndDate}
                    onChange={(e) => setCombEndDate(e.target.value)}
                    className="w-full focus:outline-none text-xs text-slate-800"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* Conditional Identifier based on Radio Selection */}
              {combSearchType === 'Ref ID' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Ref ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Reference ID"
                    value={combRefId}
                    onChange={(e) => setCombRefId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                    required
                  />
                </div>
              )}

              {combSearchType === 'Transaction Ref ID' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Transaction Ref ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Transaction Ref ID"
                    value={combTxnRefId}
                    onChange={(e) => setCombTxnRefId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                    required
                  />
                </div>
              )}

              {combSearchType === 'Customer ID' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Customer ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Customer ID"
                    value={combCustomerId}
                    onChange={(e) => setCombCustomerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                    required
                  />
                </div>
              )}

              {/* Billers Username */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Billers
                </label>
                <input
                  type="text"
                  placeholder="Type Biller Username"
                  value={combBillerUser}
                  onChange={(e) => setCombBillerUser(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer text-center"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sub-Header Bar: Search Filter Inside Table & CSV Export */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Here"
              value={tableSearchQuery}
              onChange={(e) => {
                setTableSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
            />
          </div>

          {isSearchActive && filteredRecords.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as CSV</span>
            </button>
          )}
        </div>

        {/* Content Area: Empty State Illustration vs Results Table */}
        {!isSearchActive || displayedRecords.length === 0 ? (
          <div className="py-24 px-4 flex flex-col items-center justify-center text-center">
            {/* Soft Illustration for No Data Found */}
            <div className="relative w-48 h-36 mb-4 flex items-center justify-center">
              <div className="w-28 h-24 bg-orange-100/70 rounded-lg border-2 border-dashed border-orange-300 flex items-center justify-center shadow-inner rotate-[-3deg]">
                <div className="text-orange-400">
                  <FileSpreadsheet className="w-10 h-10 opacity-70" />
                </div>
              </div>
              <div className="absolute w-24 h-20 bg-white/90 rounded-md border border-orange-200 flex items-center justify-center shadow-md rotate-[4deg] top-6">
                <span className="text-2xl font-bold text-orange-400">✕</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium">No Data Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-200">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#fafafa] border-b border-slate-200 text-xs font-semibold text-slate-700 select-none">
                  <th className="py-3 px-4 w-14">S.No</th>
                  <th className="py-3 px-4">Biller Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Txn Ref ID</th>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {displayedRecords.map((item, index) => {
                  const sNo = startIndex + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-600">{sNo}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{item.billerName}</td>
                      <td className="py-3 px-4 text-slate-700">{item.category}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{item.txnRefId}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{item.refId}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{item.customerId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.amount}</td>
                      <td className="py-3 px-4 text-slate-600">{item.paymentMode}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            item.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{item.txnDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination Bar */}
        {isSearchActive && totalRows > 0 && (
          <div className="p-3.5 border-t border-slate-200 flex flex-wrap items-center justify-end gap-6 text-xs text-slate-600 select-none">
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

            <div>{`${startIndex + 1}–${endIndex} of ${totalRows}`}</div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                  currentPage <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                  currentPage >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

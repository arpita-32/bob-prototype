import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  Clock,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { autopaySummaryData, sampleCustomerFavBillers } from '../../data/mockData';
import { CustomerFavBillerRecord } from '../../types';

export const AutopayManagementView: React.FC = () => {
  // Download Report State
  const [fromDate, setFromDate] = useState('02-07-2026');
  const [toDate, setToDate] = useState('22-07-2026');
  const [downloadChannel, setDownloadChannel] = useState('All Channels');
  const [downloadReportType, setDownloadReportType] = useState('Autopay Failed Report');

  // Customer Lookup State (Pre-filled to match the screenshot)
  const [lookupChannel, setLookupChannel] = useState('Select Channel');
  const [customerId, setCustomerId] = useState('009177751');
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CustomerFavBillerRecord[]>(sampleCustomerFavBillers);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Mandate Details Drawer State
  const [selectedMandate, setSelectedMandate] = useState<CustomerFavBillerRecord | null>(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'details' | 'history'>('details');
  const [drawerFromDate, setDrawerFromDate] = useState('01-04-2026');
  const [drawerToDate, setDrawerToDate] = useState('22-07-2026');
  const [drawerHistoryApplied, setDrawerHistoryApplied] = useState(true);
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadReport = (e: React.FormEvent) => {
    e.preventDefault();
    const csvContent =
      `data:text/csv;charset=utf-8,Channel,Agent ID,Report Type,From Date,To Date\n` +
      `"${downloadChannel}","ALL","${downloadReportType}","${fromDate}","${toDate}"\n` +
      `"Mobile App (mbanking)","BB11BB12MBBPAL147134","${downloadReportType}","${fromDate}","${toDate}"\n` +
      `"Internet Banking (ebanking)","BB11BB13INBPAL145025","${downloadReportType}","${fromDate}","${toDate}"\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${downloadReportType.replace(/\s+/g, '_')}_${fromDate}_to_${toDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${downloadReportType} successfully generated and downloaded.`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) {
      showToast('Please enter a Customer ID or click Demo ID');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      let filtered = [...sampleCustomerFavBillers];
      if (lookupChannel && lookupChannel !== 'Select Channel' && lookupChannel !== 'All Channels') {
        filtered = filtered.filter(
          (b) => b.channel.toLowerCase().includes(lookupChannel.toLowerCase()) || lookupChannel.toLowerCase().includes(b.channel.toLowerCase())
        );
      }
      setSearchResults(filtered);
    }, 250);
  };

  const handleReset = () => {
    setCustomerId('');
    setLookupChannel('Select Channel');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleFillDemo = () => {
    setCustomerId('009177751');
    setLookupChannel('Select Channel');
    setHasSearched(true);
    setSearchResults(sampleCustomerFavBillers);
  };

  // Calculate totals for registration summary
  const totalFavBillers = autopaySummaryData.reduce(
    (acc, curr) => acc + curr.favCount,
    0
  );
  const totalAutopay = autopaySummaryData.reduce(
    (acc, curr) => acc + curr.autopayCount,
    0
  );

  return (
    <div className="p-6 space-y-6 max-w-[1300px] mx-auto select-none">
      {/* Top Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">
          Autopay Management
        </h1>
      </div>

      {/* 1. Registration Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#FF6B11] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            1
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Registration Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Channel-wise and Agent ID-wise count of Favourite Billers and Autopay registrations
            </p>
          </div>
        </div>

        {/* Summary Table with Vibrant Orange Header */}
        <div className="border border-slate-100 rounded-lg overflow-hidden mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FF6B11] text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">CHANNEL</th>
                <th className="py-3 px-4">AGENT ID</th>
                <th className="py-3 px-6 text-right">FAV. BILLERS REGISTERED</th>
                <th className="py-3 px-6 text-right">AUTOPAY REGISTERED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {autopaySummaryData.map((row) => (
                <tr key={row.slNo} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-normal">
                    {row.slNo}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    {row.channel}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {row.agentId}
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                    {row.favBillersRegistered}
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                    {row.autopayRegistered}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-slate-50/90 font-bold border-t border-slate-200 text-xs">
                <td colSpan={3} className="py-3.5 px-4 text-right tracking-wider uppercase text-slate-800">
                  TOTAL
                </td>
                <td className="py-3.5 px-6 text-right text-[#FF6B11] font-bold text-sm">
                  {totalFavBillers.toLocaleString()}
                </td>
                <td className="py-3.5 px-6 text-right text-[#2563EB] font-bold text-sm">
                  {totalAutopay.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Download Autopay Report Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-[#FF6B11] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            2
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Download Autopay Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select date range, channel and report type
            </p>
          </div>
        </div>

        <form onSubmit={handleDownloadReport} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* From Date */}
            <div>
              <label className="block font-semibold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
                FROM DATE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11] pr-9 text-xs"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block font-semibold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
                TO DATE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11] pr-9 text-xs"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Channel */}
            <div>
              <label className="block font-semibold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
                CHANNEL
              </label>
              <select
                value={downloadChannel}
                onChange={(e) => setDownloadChannel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11] text-xs cursor-pointer"
              >
                <option>All Channels</option>
                <option>Mobile App (mbanking)</option>
                <option>Internet Banking (ebanking)</option>
                <option>UPI</option>
                <option>Feature Phone</option>
              </select>
            </div>

            {/* Report Type */}
            <div>
              <label className="block font-semibold text-slate-600 uppercase tracking-wider text-[10px] mb-1.5">
                REPORT TYPE
              </label>
              <select
                value={downloadReportType}
                onChange={(e) => setDownloadReportType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11] text-xs cursor-pointer"
              >
                <option>Autopay Failed Report</option>
                <option>Autopay Registration Report</option>
                <option>Autopay Execution Report</option>
                <option>Mandate Status Report</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              id="download-autopay-report-btn"
              className="px-5 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Customer Favourite Biller Lookup Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-full bg-[#FF6B11] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            3
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Customer Favourite Biller Lookup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter Channel and Customer ID to view all favourite billers with autopay status. Click any row to view mandate details and transaction history.
            </p>
          </div>
        </div>

        {/* Lookup Controls */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 text-xs pt-1">
          {/* Channel Selector */}
          <div className="w-72">
            <label className="block font-semibold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
              CHANNEL
            </label>
            <div className="relative">
              <select
                value={lookupChannel}
                onChange={(e) => setLookupChannel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11] text-xs cursor-pointer appearance-none pr-8"
              >
                <option>Select Channel</option>
                <option>Mobile App</option>
                <option>Internet Banking</option>
                <option>UPI</option>
                <option>All Channels</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Customer ID with inline Demo ID button */}
          <div className="w-96">
            <label className="block font-semibold text-slate-500 uppercase tracking-wider text-[11px] mb-1.5">
              CUSTOMER ID
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="e.g. 009177751"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] text-xs font-mono pr-20"
              />
              <button
                type="button"
                onClick={handleFillDemo}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#FF6B11] bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded border border-orange-200 transition-colors"
              >
                Demo ID
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              id="customer-search-btn"
              disabled={isSearching}
              className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-medium rounded shadow-xs transition-colors cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

            <button
              type="button"
              id="customer-reset-btn"
              onClick={handleReset}
              className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results Area */}
        {!hasSearched ? (
          <div className="py-14 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center space-y-2.5 bg-slate-50/40">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">
              Enter Channel and Customer ID above, then click Search
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {/* Search Result Info Indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Search className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Results for Customer <strong className="font-bold text-slate-900">{customerId || '009177751'}</strong> — <strong className="font-bold text-slate-900">{searchResults.length}</strong> favourite billers found
              </span>
            </div>

            {/* Billers Table matching the screenshot */}
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FF6B11] text-white font-semibold text-xs">
                    <th className="py-3 px-3.5 w-12 text-center font-semibold">#</th>
                    <th className="py-3 px-4 font-semibold">Short Name</th>
                    <th className="py-3 px-4 font-semibold">Biller Name</th>
                    <th className="py-3 px-4 font-semibold">Biller ID</th>
                    <th className="py-3 px-4 font-semibold">Customer ID</th>
                    <th className="py-3 px-4 font-semibold">Biller Account ID</th>
                    <th className="py-3 px-4 font-semibold">Channel</th>
                    <th className="py-3 px-4 font-semibold">Autopay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {searchResults.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedMandate(row)}
                      className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-3.5 text-center text-slate-400 font-normal">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {row.shortName}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {row.billerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 uppercase tracking-tight">
                        {row.billerId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11.5px] text-slate-600">
                        {row.customerId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11.5px] text-slate-600">
                        {row.billerAccountId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {row.channel}
                      </td>
                      <td className="py-3.5 px-4">
                        {row.autopay ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {searchResults.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No favourite billers found for the selected customer ID and channel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-5 text-xs text-slate-500 pt-1">
              <span>Showing 1-{searchResults.length} of {searchResults.length}</span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 appearance-none pr-6 cursor-pointer focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded flex items-center justify-center text-slate-300 cursor-not-allowed bg-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded flex items-center justify-center text-slate-300 cursor-not-allowed bg-white"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandate & Transaction History Detail Slide-Over Drawer */}
      {selectedMandate && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedMandate(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col z-50">
              {/* Drawer Top Header (Orange) */}
              <div className="bg-[#FF6B11] text-white px-6 py-5 flex items-start justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {selectedMandate.billerName}
                  </h2>
                  <p className="text-xs text-white/90 font-normal mt-0.5">
                    Customer {selectedMandate.customerId} · {selectedMandate.channel} · {selectedMandate.shortName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMandate(null)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs Header */}
              <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-8 shrink-0">
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('details')}
                  className={`py-3.5 text-xs font-semibold relative transition-colors cursor-pointer ${
                    drawerActiveTab === 'details'
                      ? 'text-[#FF6B11] border-b-2 border-[#FF6B11]'
                      : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                  }`}
                >
                  Favorite Biller Details
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('history')}
                  className={`py-3.5 text-xs font-semibold relative transition-colors cursor-pointer ${
                    drawerActiveTab === 'history'
                      ? 'text-[#FF6B11] border-b-2 border-[#FF6B11]'
                      : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                  }`}
                >
                  Transaction History
                </button>
              </div>

              {/* Drawer Tab 1: Favorite Biller Details Content */}
              {drawerActiveTab === 'details' && (
                <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                  {/* Section: Biller Account */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      BILLER ACCOUNT
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          BILLER NAME
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">
                          {selectedMandate.billerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          BILLER ID
                        </span>
                        <span className="font-mono text-slate-800 text-xs block">
                          {selectedMandate.billerId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          CUSTOMER ID
                        </span>
                        <span className="font-mono text-slate-800 text-xs block">
                          {selectedMandate.customerId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          BILLER ACCOUNT ID
                        </span>
                        <span className="font-mono text-slate-800 text-xs block break-all">
                          {selectedMandate.billerAccountId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          AUTHENTICATOR 1
                        </span>
                        <span className="font-mono text-slate-800 text-xs block">
                          {selectedMandate.authenticator1 || selectedMandate.consumerNo || '100882194'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          NICKNAME
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">
                          {selectedMandate.nickname || selectedMandate.shortName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          CHANNEL
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">
                          {selectedMandate.channel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          SOURCE ID
                        </span>
                        <span className="font-mono text-slate-800 text-xs block">
                          {selectedMandate.sourceId || 'BOB03'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Autopay Mandate */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      AUTOPAY MANDATE
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          AUTOPAY
                        </span>
                        {selectedMandate.autopay ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 text-xs">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            Disabled
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          MANDATE ID
                        </span>
                        <span className="font-mono text-slate-800 text-xs block break-all">
                          {selectedMandate.mandateId || selectedMandate.mandateUmn || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          PAYMENT METHOD
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">
                          {selectedMandate.paymentMethod || 'Bank Account Debit'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          ACCOUNT DETAILS
                        </span>
                        <span className="font-mono text-slate-800 text-xs block">
                          {selectedMandate.accountDetails || selectedMandate.accountNo || 'XXXXXX4821'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          FREQUENCY
                        </span>
                        <span className="font-medium text-slate-900 text-xs block">
                          {selectedMandate.frequency || 'Monthly'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          AMOUNT LIMIT
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">
                          {selectedMandate.amountLimit || selectedMandate.maxLimit || '₹3,500'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          REGISTERED ON
                        </span>
                        <span className="font-medium text-slate-900 text-xs block">
                          {selectedMandate.registeredOn || selectedMandate.registrationDate || '15-05-2023'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          START DATE
                        </span>
                        <span className="font-medium text-slate-900 text-xs block">
                          {selectedMandate.startDate || selectedMandate.registrationDate || '15-05-2023'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                          END DATE
                        </span>
                        <span className="font-medium text-slate-900 text-xs block">
                          {selectedMandate.endDate || '15-05-2028'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer Tab 2: Transaction History Content */}
              {drawerActiveTab === 'history' && (
                <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                  {/* Date Filter Bar */}
                  <div className="flex flex-wrap items-end gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex-1 min-w-[120px]">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        FROM DATE
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={drawerFromDate}
                          onChange={(e) => setDrawerFromDate(e.target.value)}
                          className="w-full pl-2.5 pr-7 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-[#FF6B11]"
                        />
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-[120px]">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        TO DATE
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={drawerToDate}
                          onChange={(e) => setDrawerToDate(e.target.value)}
                          className="w-full pl-2.5 pr-7 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-[#FF6B11]"
                        />
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDrawerHistoryApplied(true)}
                        className="px-4 py-1.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-semibold text-xs rounded transition-colors cursor-pointer shadow-xs"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDrawerFromDate('01-04-2026');
                          setDrawerToDate('22-07-2026');
                          setDrawerHistoryApplied(false);
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Empty/Unapplied State */}
                  {!drawerHistoryApplied ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center my-6">
                      <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B11] flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        Select Date Range
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        Please select From date and To date and click "Apply" to view transaction history.
                      </p>
                    </div>
                  ) : (
                    /* Transactions Cards List */
                    <div className="space-y-3">
                      {(selectedMandate.transactions && selectedMandate.transactions.length > 0
                        ? selectedMandate.transactions
                        : [
                            {
                              id: 'ms-t1',
                              title: 'Autopay Debit Successful',
                              dateTime: '01-05-2026 07:58',
                              referenceNo: 'BB016104BAKAAAAFC816',
                              amount: '₹1,500',
                              status: 'SUCCESS' as const,
                            },
                            {
                              id: 'ms-t2',
                              title: 'Autopay Debit Successful',
                              dateTime: '01-04-2026 08:12',
                              referenceNo: 'BB016044BAKAAAAE5YN2',
                              amount: '₹1,403',
                              status: 'SUCCESS' as const,
                            },
                            {
                              id: 'ms-t3',
                              title: 'Autopay Debit Failed',
                              dateTime: '01-03-2026 07:45',
                              referenceNo: 'BB015349BAJAAAAEYUHB',
                              amount: '₹1,860',
                              status: 'FAILED' as const,
                              failureReason: 'Insufficient Account Balance',
                            },
                            {
                              id: 'ms-t4',
                              title: 'Autopay Debit Successful',
                              dateTime: '01-02-2026 06:30',
                              referenceNo: 'BB015288BAJAAAAETBQI',
                              amount: '₹1,630',
                              status: 'SUCCESS' as const,
                            },
                            {
                              id: 'ms-t5',
                              title: 'Autopay Debit Successful',
                              dateTime: '01-01-2026 06:50',
                              referenceNo: 'BB015225BAIAAAAEL T0K',
                              amount: '₹1,590',
                              status: 'SUCCESS' as const,
                            },
                            {
                              id: 'ms-t6',
                              title: 'Autopay Debit Successful',
                              dateTime: '01-12-2025 07:44',
                              referenceNo: 'BB014990BAIAAAABKX9P',
                              amount: '₹1,720',
                              status: 'SUCCESS' as const,
                            },
                            {
                              id: 'ms-t7',
                              title: 'Autopay Debit Failed',
                              dateTime: '01-11-2025 07:30',
                              referenceNo: 'BB014880BAIAAAACLY8Q',
                              amount: '₹1,800',
                              status: 'FAILED' as const,
                              failureReason: 'Bank Server Timeout',
                            },
                          ]
                      ).map((txn) => {
                        const isExpanded = expandedTxnId === txn.id;
                        const isSuccess = txn.status === 'SUCCESS';
                        return (
                          <div
                            key={txn.id}
                            className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                            onClick={() => setExpandedTxnId(isExpanded ? null : txn.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSuccess
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                                  }`}
                                >
                                  {isSuccess ? (
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900 text-xs">
                                    {txn.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                    {txn.dateTime} · {txn.referenceNo}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div
                                    className={`font-bold text-xs ${
                                      isSuccess ? 'text-emerald-600' : 'text-rose-600'
                                    }`}
                                  >
                                    {txn.amount}
                                  </div>
                                  <div
                                    className={`text-[10px] font-bold tracking-tight uppercase ${
                                      isSuccess ? 'text-emerald-600' : 'text-rose-600'
                                    }`}
                                  >
                                    {txn.status}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Collapsible details */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded">
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Debit Account</span>
                                  <span className="font-mono font-medium text-slate-800">{selectedMandate.accountDetails || selectedMandate.accountNo || 'XXXXXX4821'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mode</span>
                                  <span className="font-medium text-slate-800">BBPS Auto-Debit / NACH</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Biller Account ID</span>
                                  <span className="font-mono text-slate-700">{selectedMandate.billerAccountId}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Result</span>
                                  <span className={isSuccess ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                                    {isSuccess ? 'Debited Successfully' : (txn.failureReason || 'Debit Declined')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

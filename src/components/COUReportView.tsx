import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Search,
  FileSpreadsheet,
  FileDown,
  Printer,
  Info,
  Trash2,
  FolderDown,
  ChevronDown,
} from 'lucide-react';
import { ChannelOption, ReportItem, CombinationSearchRecord, CHANNELS_LIST } from '../types';
import { ChannelsDropdown } from './ChannelsDropdown';
import { sampleReports, sampleCombinationRecords } from '../data/mockData';

interface COUReportViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
}

export const COUReportView: React.FC<COUReportViewProps> = ({
  channel,
  onChannelChange,
}) => {
  const [couBouType] = useState('COU');
  const [activeTab, setActiveTab] = useState<'Periodic' | 'Custom' | 'Combination Search'>('Combination Search');
  const [periodicMode, setPeriodicMode] = useState<'Date' | 'Month'>('Date');
  const [reportType, setReportType] = useState('Select Report Type');
  const [startDate, setStartDate] = useState('08-07-2026');
  const [selectedMonth, setSelectedMonth] = useState('07-2026');
  const [endDate, setEndDate] = useState('08-07-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportsList, setReportsList] = useState<ReportItem[]>(sampleReports);
  const [channelSelection, setChannelSelection] = useState<string>(channel === 'All' ? 'Select Channels' : channel);

  // Tab form states
  const [periodicCustomerId, setPeriodicCustomerId] = useState('');
  const [customCustomerId, setCustomCustomerId] = useState('');

  // Combination Search Form state
  const [combSearchType, setCombSearchType] = useState<'Ref ID' | 'Transaction Ref ID' | 'Customer ID'>('Ref ID');
  const [combStartDate, setCombStartDate] = useState('26/08/2026');
  const [combEndDate, setCombEndDate] = useState('27/08/2026');
  const [combChannel, setCombChannel] = useState<string>('Select Type');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [refId, setRefId] = useState('');
  const [txnRefId, setTxnRefId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [combRecords, setCombRecords] = useState<CombinationSearchRecord[]>(sampleCombinationRecords);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const COMB_CHANNELS_LIST = [
    'Select Type',
    'Internet Banking (Post-login)',
    'Mobile Banking (Bob World)',
    'UPI (BHIM Baroda Pay)',
    'Internet Banking (Pre-login)',
    'Jio Feature Phone',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsChannelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePeriodicSearch = () => {
    if (channelSelection && channelSelection !== 'Select Channels' && channelSelection !== 'Select Type') {
      const newReport: ReportItem = {
        id: reportsList.length + 1,
        channelName: channelSelection === 'All' ? 'ALL' : channelSelection,
        reportType: reportType !== 'Select Report Type' && reportType !== 'Select Type' ? reportType : 'COU Transaction Summary Report',
        status: 'Finished',
        createdDate: '08-07-2026',
      };
      setReportsList([newReport, ...reportsList]);
    }
  };

  const handleCombinationSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let filtered = sampleCombinationRecords;

    if (combChannel && combChannel !== 'Select Type' && combChannel !== 'All') {
      filtered = filtered.filter((r) =>
        r.bankChannel.toLowerCase().includes(combChannel.toLowerCase()) ||
        combChannel.toLowerCase().includes(r.bankChannel.toLowerCase())
      );
    }
    if (combSearchType === 'Ref ID') {
      if (refId.trim()) {
        filtered = filtered.filter((r) =>
          r.referenceId.toLowerCase().includes(refId.toLowerCase().trim())
        );
      }
    } else if (combSearchType === 'Transaction Ref ID') {
      if (txnRefId.trim()) {
        filtered = filtered.filter((r) =>
          r.transactionRefId.toLowerCase().includes(txnRefId.toLowerCase().trim())
        );
      }
    } else if (combSearchType === 'Customer ID') {
      if (customerId.trim()) {
        filtered = filtered.filter((r) =>
          (r.customerId || '').toLowerCase().includes(customerId.toLowerCase().trim()) ||
          r.customerAccountId.toLowerCase().includes(customerId.toLowerCase().trim())
        );
      }
    }
    setCombRecords(filtered);
  };

  const handleExportExcel = () => {
    const headers = [
      'Sl No',
      'Bank Channel',
      'Customer Account Name',
      'Customer Account ID',
      'Customer ID',
      'Reference ID',
      'Msg ID Fetch',
      'Msg ID Pay',
      'Transaction Ref ID',
      'Bill Amount',
      'COU Customer Convenience Fee',
      'COU Convenience Fee',
    ];
    const rows = filteredCombRecords.map((r, i) => [
      i + 1,
      r.bankChannel,
      r.customerAccountName,
      r.customerAccountId,
      r.customerId || '—',
      r.referenceId,
      r.msgIdFetch,
      r.msgIdPay,
      r.transactionRefId,
      r.billAmount,
      r.couCustomerConvenienceFee,
      r.couConvenienceFee,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileDateStr = activeTab === 'Combination Search' ? `${combStartDate}_${combEndDate}`.replace(/\//g, '-') : `${startDate}_${endDate}`;
    link.setAttribute('download', `COU_Report_${fileDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    handleExportExcel();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = (id: number) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Deleted' } : r))
    );
  };

  const filteredReports = reportsList.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.channelName.toLowerCase().includes(q) ||
      item.reportType.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const filteredCombRecords = combRecords.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.bankChannel.toLowerCase().includes(q) ||
      item.customerAccountName.toLowerCase().includes(q) ||
      item.customerAccountId.toLowerCase().includes(q) ||
      (item.customerId && item.customerId.toLowerCase().includes(q)) ||
      (item.rrnNumber && item.rrnNumber.toLowerCase().includes(q)) ||
      item.referenceId.toLowerCase().includes(q) ||
      item.msgIdFetch.toLowerCase().includes(q) ||
      item.msgIdPay.toLowerCase().includes(q) ||
      item.transactionRefId.toLowerCase().includes(q) ||
      item.billAmount.toLowerCase().includes(q)
    );
  });

  return (
    <div id="cou-report-view" className="p-6 space-y-5 max-w-[1600px] mx-auto select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Report Center</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-800 font-medium">{couBouType} Report</span>
      </div>

      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {couBouType} Report
        </h1>
        <p className="text-xs text-slate-500">
          Customer Operating Unit - Transaction Settlement &amp; Message Logs
        </p>
      </div>

      {/* Main Single Card Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Tab Headers */}
        <div className="border-b border-slate-200 flex gap-8">
          {(['Periodic', 'Custom', 'Combination Search'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
                activeTab === tab
                  ? 'text-[#FF6B11] font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF6B11]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Periodic */}
        {activeTab === 'Periodic' && (
          <div className="space-y-5">
            {/* Radio options */}
            <div className="flex items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="periodicType"
                  checked={periodicMode === 'Date'}
                  onChange={() => setPeriodicMode('Date')}
                  className="w-4 h-4 text-[#FF6B11] accent-[#FF6B11]"
                />
                <span className="text-slate-700 font-medium">Date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="periodicType"
                  checked={periodicMode === 'Month'}
                  onChange={() => setPeriodicMode('Month')}
                  className="w-4 h-4 text-[#FF6B11] accent-[#FF6B11]"
                />
                <span className="text-slate-700 font-medium">Month</span>
              </label>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {periodicMode === 'Date' ? 'Date' : 'Month'} <span className="text-red-500">*</span>
                </label>
                {periodicMode === 'Date' ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full focus:outline-none text-xs"
                      placeholder="DD-MM-YYYY"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700">
                    <input
                      type="month"
                      value={selectedMonth.includes('-') && selectedMonth.split('-')[0].length === 2 
                        ? `${selectedMonth.split('-')[1]}-${selectedMonth.split('-')[0]}`
                        : selectedMonth}
                      onChange={(e) => {
                        const val = e.target.value; // YYYY-MM
                        if (val) {
                          const [y, m] = val.split('-');
                          setSelectedMonth(`${m}-${y}`);
                        }
                      }}
                      className="w-full focus:outline-none text-xs text-slate-700 cursor-pointer bg-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-[#FF6B11]"
                >
                  <option>Select Report Type</option>
                  <option>COU Transaction Summary Report</option>
                  <option>BOU Transaction Summary Report</option>
                  <option>Bill Generation Report</option>
                  <option>COU Category Wise Report</option>
                  <option>COU Biller Wise Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Channels <span className="text-red-500">*</span>
                </label>
                <ChannelsDropdown
                  id="periodic-channels-dropdown"
                  selectedChannel={channelSelection}
                  placeholder="Select Channels"
                  showPlaceholderInList
                  onSelect={(ch) => {
                    setChannelSelection(ch);
                    onChannelChange(ch);
                  }}
                  className="w-full"
                  buttonClassName="w-full py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Customer ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Customer ID"
                  value={periodicCustomerId}
                  onChange={(e) => setPeriodicCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              <div>
                <button
                  type="button"
                  id="periodic-search-button"
                  onClick={handlePeriodicSearch}
                  className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-xs rounded-md transition-colors shadow-2xs cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom */}
        {activeTab === 'Custom' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-[#FF6B11]"
                >
                  <option>Select Type</option>
                  <option>COU Transaction Summary Report</option>
                  <option>BOU Transaction Summary Report</option>
                  <option>COU Biller Wise Report</option>
                  <option>Bill Generation Report</option>
                  <option>COU Category Wise Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Channels <span className="text-red-500">*</span>
                </label>
                <ChannelsDropdown
                  id="custom-channels-dropdown"
                  selectedChannel={channelSelection}
                  placeholder="Select Type"
                  showPlaceholderInList
                  onSelect={(ch) => {
                    setChannelSelection(ch);
                    onChannelChange(ch);
                  }}
                  className="w-full"
                  buttonClassName="w-full py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Customer ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Customer ID"
                  value={customCustomerId}
                  onChange={(e) => setCustomCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                />
              </div>

              <div>
                <button
                  type="button"
                  id="custom-search-button"
                  onClick={handlePeriodicSearch}
                  className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-xs rounded-md transition-colors shadow-2xs cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Combination Search */}
        {activeTab === 'Combination Search' && (
          <div className="space-y-4">
            {/* 3 Radio Buttons: Ref ID, Transaction Ref ID, Customer ID */}
            <div className="flex items-center gap-6 pb-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="combSearchType"
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
                  name="combSearchType"
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
                  name="combSearchType"
                  value="Customer ID"
                  checked={combSearchType === 'Customer ID'}
                  onChange={() => setCombSearchType('Customer ID')}
                  className="text-[#FF6B11] focus:ring-[#FF6B11] accent-[#FF6B11]"
                />
                <span>Customer ID</span>
              </label>
            </div>

            {/* Combination Search Form */}
            <form onSubmit={handleCombinationSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Start Date * */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                    <input
                      type="text"
                      value={combStartDate}
                      onChange={(e) => setCombStartDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full focus:outline-none placeholder:text-slate-400 text-xs text-slate-800"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* End Date * */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus-within:border-[#FF6B11]">
                    <input
                      type="text"
                      value={combEndDate}
                      onChange={(e) => setCombEndDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full focus:outline-none placeholder:text-slate-400 text-xs text-slate-800"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Channel ID * */}
                <div className="relative" ref={channelDropdownRef}>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Channel ID <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 bg-white border rounded-md text-xs transition-colors text-left cursor-pointer ${
                      isChannelDropdownOpen
                        ? 'border-[#FF6B11] ring-1 ring-[#FF6B11]'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className={combChannel === 'Select Type' ? 'text-slate-500' : 'text-slate-800'}>
                      {combChannel}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        isChannelDropdownOpen ? 'rotate-180 text-[#FF6B11]' : ''
                      }`}
                    />
                  </button>

                  {isChannelDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 max-h-60 overflow-y-auto">
                      {COMB_CHANNELS_LIST.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            setCombChannel(ch);
                            setIsChannelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-orange-50 hover:text-[#FF6B11] cursor-pointer ${
                            combChannel === ch ? 'bg-orange-50/70 text-[#FF6B11] font-medium' : 'text-slate-700'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conditional Field based on Radio button */}
                {combSearchType === 'Ref ID' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Ref ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Ref ID"
                      value={refId}
                      onChange={(e) => setRefId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
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
                      value={txnRefId}
                      onChange={(e) => setTxnRefId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
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
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
                    />
                  </div>
                )}

                {/* Search Button */}
                <div>
                  <button
                    type="submit"
                    id="combination-search-button"
                    className="w-full py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-xs rounded-md shadow-2xs transition-colors cursor-pointer text-center"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Table Controls & Export Buttons Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
            />
          </div>

          {/* Right: Export Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Conditional Table: Combination Search vs Periodic/Custom Reports */}
        {activeTab === 'Combination Search' ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-[#FF6B11] text-white text-[11px] font-bold uppercase tracking-wider select-none">
                  <th className="py-3 px-3.5 w-14">SL NO.</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">BANK CHANNEL</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">CUSTOMER ACCOUNT ID</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">REFERENCE ID</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">MSG ID FETCH</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">MSG ID PAY</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">TRANSACTION REF ID</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">BILL AMOUNT</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">COU CUSTOMER CONVENIENCE FEE</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">COU CONVENIENCE FEE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredCombRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredCombRecords.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-3.5 font-medium text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-800">
                        {item.bankChannel}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono text-[11px]">
                        {item.customerAccountId}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono text-[11px]">
                        {item.referenceId}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono text-[11px]">
                        {item.msgIdFetch}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono text-[11px]">
                        {item.msgIdPay}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono text-[11px]">
                        {item.transactionRefId}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">
                        {item.billAmount}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        {item.couCustomerConvenienceFee}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        {item.couConvenienceFee}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Periodic / Custom Table */
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FF6B11] text-white text-[11px] font-bold uppercase tracking-wider select-none">
                  <th className="py-3 px-6 w-16">SL NO.</th>
                  <th className="py-3 px-6">CHANNEL NAME</th>
                  <th className="py-3 px-6">REPORT TYPE</th>
                  <th className="py-3 px-6">OPERATION STATUS</th>
                  <th className="py-3 px-6">CREATED DATE</th>
                  <th className="py-3 px-6 text-center w-28">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredReports.map((item, idx) => {
                  const isProcessing = item.status === 'Processing';
                  const isFinished = item.status === 'Finished';
                  const isDeleted = item.status === 'Deleted';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-medium text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-6 font-medium">
                        <span className={item.channelName === 'UPI123Pay' ? 'text-[#FF6B11] font-semibold' : ''}>
                          {item.channelName}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">
                        {item.reportType}
                      </td>
                      <td className="py-3.5 px-6">
                        {isProcessing && (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Processing
                          </span>
                        )}
                        {isFinished && (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Finished
                          </span>
                        )}
                        {isDeleted && (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
                            Deleted
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {item.createdDate}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            title="Download Report"
                            className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors cursor-pointer"
                          >
                            <FolderDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete Report"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import { ChannelOption } from '../types';
import { ChannelsDropdown } from './ChannelsDropdown';
import { CouBouDropdown } from './CouBouDropdown';
import {
  hourlyTransactionData,
  weeklyCountData,
  weeklyValueData,
} from '../data/mockData';

interface DashboardViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  channel,
  onChannelChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [couBouType, setCouBouType] = useState('BOU');
  const [billerSearch, setBillerSearch] = useState('');
  const [summaryCouBouType, setSummaryCouBouType] = useState('COU');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('18/08/2026');
  const [toDate, setToDate] = useState('24/08/2026');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Dynamic values depending on channel to demonstrate functional richness
  const isUPI123 = channel === 'UPI123Pay';
  const multiplier = isUPI123 ? 0.35 : channel === 'All' ? 1 : 0.65;

  const totalBillFetch = isUPI123 ? 594 : Math.round(1699 * multiplier);
  const successBill = isUPI123 ? 385 : Math.round(1062 * multiplier);
  const failedBill = isUPI123 ? 209 : Math.round(637 * multiplier);
  const successRate = totalBillFetch > 0 ? ((successBill / totalBillFetch) * 100).toFixed(2) : '62.51';

  const successPayment = isUPI123 ? 198 : Math.round(525 * multiplier);
  const failedPayment = isUPI123 ? 16 : Math.round(44 * multiplier);
  const pendingPayment = isUPI123 ? 28 : Math.round(77 * multiplier);
  const totalBillPayment = successPayment + failedPayment + pendingPayment;
  const paySuccessRate = totalBillPayment > 0 ? ((successPayment / totalBillPayment) * 100).toFixed(2) : '81.27';

  const declineTotal = isUPI123 ? 245 : 681;
  const businessDecline = isUPI123 ? 92 : 254;
  const technicalDecline = declineTotal - businessDecline;

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">
          Dashboard
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* BOU / COU Dropdown */}
          <CouBouDropdown
            id="dashboard-cou-bou-dropdown"
            value={couBouType}
            onChange={(val) => setCouBouType(val === 'Select Type' ? 'COU' : val)}
            buttonClassName="min-w-[110px]"
          />

          {/* Select Biller Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Select Biller"
              value={billerSearch}
              onChange={(e) => setBillerSearch(e.target.value)}
              className="px-3.5 py-1.5 text-sm bg-white border border-slate-300 rounded text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] min-w-[180px]"
            />
          </div>

          {/* Channels Dropdown */}
          <ChannelsDropdown
            id="header-channels-dropdown"
            selectedChannel={channel}
            onSelect={onChannelChange}
            buttonClassName="min-w-[180px]"
          />
        </div>
      </div>

      {/* Main Section: Dynamic (BOU / COU) Transaction Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        {/* Title and Legends */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                {couBouType === 'Select Type' ? 'COU' : couBouType} Transaction Summary
              </h2>
              <span className="text-[12px] text-slate-400">
                (Time duration / Amount)
              </span>
            </div>

            {/* Legends */}
            <div className="flex items-center gap-4 ml-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-xs" />
                <span>Successful</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#eab308] rounded-xs" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-xs" />
                <span>Failed</span>
              </div>
            </div>
          </div>

          {/* Type & Status Dropdowns if expanded */}
          {isExpanded && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Type</span>
                <select
                  aria-label="Type filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-[#FF6B11]"
                >
                  <option>All</option>
                  <option>Standard</option>
                  <option>Express</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Status</span>
                <select
                  aria-label="Status filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-[#FF6B11]"
                >
                  <option>All</option>
                  <option>Success</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stacked Bar Chart with Light Gray Background Columns */}
        <div className="relative pt-6 pb-2">
          {/* Y Axis Grid Lines */}
          <div className="relative h-[220px] w-full">
            {[390, 325, 260, 195, 130, 65, 0].map((val, idx) => {
              const bottomPercent = (val / 390) * 100;
              return (
                <div
                  key={val}
                  className="absolute w-full flex items-center"
                  style={{ bottom: `${bottomPercent}%` }}
                >
                  <span className="text-[11px] text-slate-400 w-8 text-right pr-2 select-none">
                    {val}
                  </span>
                  <div className="flex-1 border-b border-dashed border-slate-200" />
                </div>
              );
            })}

            {/* Bars Container */}
            <div className="absolute left-8 right-0 bottom-0 top-0 flex items-end justify-between px-2">
              {hourlyTransactionData.map((item, idx) => {
                const adjSuccess = Math.round(item.successful * multiplier);
                const adjPending = Math.round(item.pending * multiplier);
                const adjFailed = Math.round(item.failed * multiplier);

                const successHeight = (adjSuccess / 390) * 100;
                const pendingHeight = (adjPending / 390) * 100;
                const failedHeight = (adjFailed / 390) * 100;

                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={item.time}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="relative flex flex-col items-center h-full justify-end group cursor-pointer flex-1 px-1"
                  >
                    {/* Background Column Guide Pillar */}
                    <div className="w-[10px] h-full bg-[#f1f5f9] rounded-t-xs relative flex flex-col justify-end overflow-hidden">
                      {/* Failed Top Bar */}
                      {adjFailed > 0 && (
                        <div
                          style={{ height: `${failedHeight}%` }}
                          className="w-full bg-[#ef4444] transition-all duration-300"
                        />
                      )}
                      {/* Pending Middle Bar */}
                      {adjPending > 0 && (
                        <div
                          style={{ height: `${pendingHeight}%` }}
                          className="w-full bg-[#eab308] transition-all duration-300"
                        />
                      )}
                      {/* Successful Base Bar */}
                      {adjSuccess > 0 && (
                        <div
                          style={{ height: `${successHeight}%` }}
                          className="w-full bg-[#22c55e] transition-all duration-300"
                        />
                      )}
                    </div>

                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-14 z-20 bg-slate-800 text-white text-[11px] py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        <div className="font-semibold text-slate-200">{item.time}</div>
                        <div className="text-emerald-400">Success: {adjSuccess}</div>
                        {adjPending > 0 && <div className="text-amber-300">Pending: {adjPending}</div>}
                        {adjFailed > 0 && <div className="text-rose-400">Failed: {adjFailed}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X Axis Time Labels */}
          <div className="flex justify-between pl-8 pr-2 mt-2 text-[11px] text-slate-500">
            {hourlyTransactionData.map((item) => (
              <span key={item.time} className="flex-1 text-center truncate">
                {item.time}
              </span>
            ))}
          </div>
        </div>

        {/* View More / View Less Toggle */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            id="toggle-view-more"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B11] hover:text-[#e05a07] transition-colors focus:outline-none"
          >
            {isExpanded ? (
              <>
                <span>View Less</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>View More</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Sections */}
      {isExpanded && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Grid Row 1: Bill Fetch & Pay Summary (Left) + Technical/Business Decline (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Bill Fetch & Pay Summary */}
            <div className="lg:col-span-7 space-y-4">
              {/* Bill Fetch Summary Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <h3 className="text-[14px] font-semibold text-slate-800">
                  Bill Fetch Summary
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600 font-medium">Total Bill Fetch</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {totalBillFetch.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600 font-medium">Success Bill</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {successBill.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600 font-medium">Failed Bill</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {failedBill.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600 font-medium">Success Rate</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {successRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill Pay Summary Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <h3 className="text-[14px] font-semibold text-slate-800">
                  Bill Pay Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600 font-medium">Success Payment</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {successPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600 font-medium">Failed Payment</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {failedPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600 font-medium">Pending Payment</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {pendingPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600 font-medium">Total Bill Payment</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {totalBillPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-3 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600 font-medium">Success Rate</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {paySuccessRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Technical/Business Decline Summary */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-semibold text-slate-800">
                  Technical/Business Decline Summary
                </h3>
                <select
                  aria-label="Decline filter"
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none"
                >
                  <option>All</option>
                  <option>Technical</option>
                  <option>Business</option>
                </select>
              </div>

              {/* Donut Chart */}
              <div className="relative flex flex-col items-center justify-center my-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="16"
                    />
                    {/* Technical Decline (Red) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#dc2626"
                      strokeWidth="16"
                      strokeDasharray={`${(technicalDecline / declineTotal) * 226} 226`}
                      strokeDashoffset="0"
                    />
                    {/* Business Decline (Orange #FF6B11) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#FF6B11"
                      strokeWidth="16"
                      strokeDasharray={`${(businessDecline / declineTotal) * 226} 226`}
                      strokeDashoffset={`-${(technicalDecline / declineTotal) * 226}`}
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-slate-400 font-medium">Total</span>
                    <span className="text-[20px] font-bold text-slate-800 leading-tight">
                      {declineTotal}
                    </span>
                  </div>

                  {/* Floating Value Badge */}
                  <div className="absolute top-2 right-4 bg-[#FF6B11] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    {businessDecline}
                  </div>
                </div>

                {/* Legends */}
                <div className="flex items-center gap-6 mt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#FF6B11] rounded-xs" />
                    <span>Business Decline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#dc2626] rounded-xs" />
                    <span>Technical Decline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Transaction Summary */}
          <div className="space-y-4 pt-2">
            {/* Header & Date Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[18px] font-semibold text-slate-800">
                Transaction Summary
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* COU / BOU Select */}
                <CouBouDropdown
                  id="trans-cou-bou-dropdown"
                  value={summaryCouBouType}
                  onChange={(val) => setSummaryCouBouType(val === 'Select Type' ? 'COU' : val)}
                  buttonClassName="min-w-[100px] text-xs py-1"
                />

                {/* From Date */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700">
                  <span className="text-slate-400">From Date</span>
                  <input
                    type="text"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-20 font-medium focus:outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* To Date */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700">
                  <span className="text-slate-400">To Date</span>
                  <input
                    type="text"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-20 font-medium focus:outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Channels Dropdown */}
                <ChannelsDropdown
                  id="summary-channels-dropdown"
                  selectedChannel={channel}
                  onSelect={onChannelChange}
                  buttonClassName="min-w-[140px] text-xs py-1"
                />
              </div>
            </div>

            {/* Bill Fetch Summary & Bill Pay Summary Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bill Fetch Summary Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
                <h4 className="text-[13px] font-semibold text-slate-800">
                  Bill Fetch Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600">Total Bill Fetch</span>
                    <span className="font-semibold text-slate-800">
                      {(1195855 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600">Success Bill</span>
                    <span className="font-semibold text-slate-800">
                      {(671974 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600">Failed Bill</span>
                    <span className="font-semibold text-slate-800">
                      {(523881 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                    </span>
                  </div>
                  <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                    <span className="text-slate-600">Success Rate</span>
                    <span className="font-semibold text-slate-800">56.19%</span>
                  </div>
                </div>
              </div>

              {/* Bill Pay Summary Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
                <h4 className="text-[13px] font-semibold text-slate-800">
                  Bill Pay Summary
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600">Success Payment</span>
                      <span className="font-semibold text-slate-800">
                        {(10395 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600">Failed Payment</span>
                      <span className="font-semibold text-slate-800">
                        {(555 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600">Pending Payment</span>
                      <span className="font-semibold text-slate-800">
                        {(563 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600">Total Bill Payment</span>
                      <span className="font-semibold text-slate-800">
                        {(11513 * (isUPI123 ? 0.35 : 1)).toFixed(0)}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] p-2.5 rounded flex items-center justify-between border border-slate-100">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="font-semibold text-slate-800">90.29%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Charts: Transaction Count (Left) & Transaction Value (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Chart: Transaction Count */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                <div className="mb-4">
                  <h4 className="text-[14px] font-semibold text-slate-800">
                    Transaction Count
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ( Total Success Payment Count / Time Period )
                  </span>
                </div>

                <div className="relative pt-4">
                  {/* Grid Lines */}
                  <div className="relative h-[200px] w-full">
                    {[2400, 2000, 1600, 1200, 800, 400, 0].map((val) => (
                      <div
                        key={val}
                        className="absolute w-full flex items-center"
                        style={{ bottom: `${(val / 2400) * 100}%` }}
                      >
                        <span className="text-[10px] text-slate-400 w-10 text-right pr-2 select-none">
                          {val.toLocaleString()}
                        </span>
                        <div className="flex-1 border-b border-dashed border-slate-200" />
                      </div>
                    ))}

                    {/* Bars */}
                    <div className="absolute left-10 right-0 bottom-0 top-0 flex items-end justify-around px-4">
                      {weeklyCountData.map((item) => {
                        const count = Math.round(item.count * (isUPI123 ? 0.4 : 1));
                        const heightPercent = (count / 2400) * 100;
                        return (
                          <div
                            key={item.day}
                            className="flex flex-col items-center group relative cursor-pointer"
                          >
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-3 bg-[#22c55e] rounded-t-xs hover:bg-[#16a34a] transition-all duration-200"
                            />
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                              {count.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* X Axis Days */}
                  <div className="flex justify-around pl-10 pr-0 mt-2 text-[11px] text-slate-500 font-medium">
                    {weeklyCountData.map((item) => (
                      <span key={item.day}>{item.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Chart: Transaction Value */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                <div className="mb-4">
                  <h4 className="text-[14px] font-semibold text-slate-800">
                    Transaction Value
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ( Total Success Payment Amount / Time Period )
                  </span>
                </div>

                <div className="relative pt-4">
                  <div className="relative h-[200px] w-full">
                    {/* Y-axis Labels & Grid Lines */}
                    {[
                      { label: '5.1 Cr', val: 510 },
                      { label: '4.25 Cr', val: 425 },
                      { label: '3.4 Cr', val: 340 },
                      { label: '2.55 Cr', val: 255 },
                      { label: '1.7 Cr', val: 170 },
                      { label: '85 Lakh', val: 85 },
                      { label: '0', val: 0 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="absolute w-full flex items-center"
                        style={{ bottom: `${(item.val / 510) * 100}%` }}
                      >
                        <span className="text-[10px] text-slate-400 w-12 text-right pr-2 select-none">
                          {item.label}
                        </span>
                        <div className="flex-1 border-b border-dashed border-slate-200" />
                      </div>
                    ))}

                    {/* Smooth Bezier Line Curve */}
                    <div className="absolute left-12 right-0 bottom-0 top-0">
                      <svg
                        viewBox="0 0 500 200"
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                      >
                        {/* Smooth Line Path */}
                        <path
                          d="M 40 70 C 90 70, 110 72, 130 72 C 160 72, 180 30, 220 30 C 260 30, 280 110, 310 110 C 350 110, 370 160, 400 160 C 430 160, 450 20, 480 20"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2"
                        />
                        {/* Points */}
                        {[
                          { cx: 40, cy: 70, val: '3.4 Cr' },
                          { cx: 130, cy: 72, val: '3.35 Cr' },
                          { cx: 220, cy: 30, val: '4.5 Cr' },
                          { cx: 310, cy: 110, val: '2.3 Cr' },
                          { cx: 400, cy: 160, val: '95 Lakh' },
                          { cx: 480, cy: 20, val: '4.85 Cr' },
                        ].map((pt, i) => (
                          <g key={i} className="group cursor-pointer">
                            <circle
                              cx={pt.cx}
                              cy={pt.cy}
                              r="4"
                              fill="#ffffff"
                              stroke="#22c55e"
                              strokeWidth="2"
                              className="hover:r-6 transition-all"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* X Axis */}
                  <div className="flex justify-between pl-14 pr-2 mt-2 text-[11px] text-slate-500 font-medium">
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                    <span>MON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

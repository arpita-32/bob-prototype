import React, { useState, useEffect } from 'react';
import {
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AgentEntity, NavItem } from '../../types';
import { mockAgentEntities } from '../../data/mockData';

interface AgentDetailsViewProps {
  agent?: AgentEntity;
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
}

export const AgentDetailsView: React.FC<AgentDetailsViewProps> = ({
  agent = mockAgentEntities[0],
  onNavigate,
}) => {
  const [currentAgent, setCurrentAgent] = useState<AgentEntity>(agent);

  // Sync state if agent prop changes
  useEffect(() => {
    setCurrentAgent(agent);
    setDailyValueLimit(agent.dailyLimit?.replace('₹', '').trim() || '10,00,000');
    setPerTxnCap(agent.perTxnCap || '25,000');
    setDailyCountLimit(agent.dailyCountLimit || '2,000');
    setLowBalanceAlert(agent.lowBalanceAlert || '1,00,000');
  }, [agent]);

  // Form Inputs for Configure Wallet Limits
  const [perTxnCap, setPerTxnCap] = useState(currentAgent.perTxnCap || '25,000');
  const [dailyValueLimit, setDailyValueLimit] = useState(
    currentAgent.dailyLimit?.replace('₹', '').trim() || '10,00,000'
  );
  const [dailyCountLimit, setDailyCountLimit] = useState(
    currentAgent.dailyCountLimit || '2,000'
  );
  const [lowBalanceAlert, setLowBalanceAlert] = useState(
    currentAgent.lowBalanceAlert || '1,00,000'
  );
  const [effectivePolicy, setEffectivePolicy] = useState('Apply on approval');
  const [reason, setReason] = useState('');

  // Modals & Toast State
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('5,00,000');
  const [utrNumber, setUtrNumber] = useState('N052026081100482');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRaiseLimitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Limit change request of ₹${dailyValueLimit} submitted for checker approval.`);
    setReason('');
  };

  const handleRecordTopup = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTopupModal(false);
    showToast(`Top-up of ₹${topupAmount} recorded with UTR ${utrNumber}.`);
  };

  const handleDownloadStatement = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Date,Type,Description,Amount,Balance\n' +
      '2026-08-05,Credit,Top-up credited via UTR N052026081100482,500000,482500\n' +
      '2026-08-04,Debit,Settlement payout BBPS-TXN-88192,210760,271740\n' +
      '2026-08-03,Debit,Settlement payout BBPS-TXN-88102,185000,456740\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wallet_Statement_${currentAgent.npciId || 'AI'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Statement download started.');
  };

  const getStatusBadge = (status: AgentEntity['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Submitted
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Invited
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspended
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1280px] mx-auto select-none">
      {/* Top Page Heading */}
      <div className="space-y-4">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Agent / AI Details
        </h1>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 font-normal">
          <span>Agent</span>
          <span className="mx-2 text-slate-400">/</span>
          <button
            type="button"
            onClick={() => onNavigate('Agent / AI List')}
            className="hover:text-[#FF6B11] hover:underline cursor-pointer"
          >
            Agent / AI List
          </button>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-800 font-semibold">{currentAgent.name}</span>
        </div>
      </div>

      {/* Top Card: Entity Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs">
        {/* Title and Live Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            {currentAgent.name}
          </h2>
          <div>{getStatusBadge(currentAgent.status)}</div>
        </div>

        {/* Subtitle */}
        <div className="text-xs text-slate-400 font-normal mt-1.5">
          <span>{currentAgent.type === 'AI' ? 'Agent Institution' : 'Agent Entity'}</span>
          <span className="mx-1.5">·</span>
          <span>NPCI ID {currentAgent.npciId}</span>
          <span className="mx-1.5">·</span>
          <span>Live since {currentAgent.liveSince || '12-01-2026'}</span>
        </div>

        {/* Entity Details Header */}
        <div className="mt-7">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
            Entity Details :
          </h3>

          {/* 3-Column Key-Value Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 text-xs">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NPCI ID
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.npciId || 'SK01'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  AI ADMIN
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.aiAdmin || `${currentAgent.adminFirstName || 'Nikhil'} ${currentAgent.adminLastName || 'Rao'}`}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  KYC STATUS
                </span>
                <span className="font-bold text-xs text-emerald-600">
                  {currentAgent.kycStatus || 'Complete'}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PAN
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.pan || 'AAKCS0912L'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  RELATIONSHIP MANAGER
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.relationshipManager || 'Anita Sharma'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  AGREEMENT VALID TILL
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.agreementValidTill || '11-01-2028'}
                </span>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  ENTITY TYPE
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.entityType || 'Private Limited'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  AGENTS UNDER AI
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.agentsUnderAI || '64 live'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  ONBOARDED ON
                </span>
                <span className="font-bold text-xs text-slate-900">
                  {currentAgent.onboardedOn || '12-01-2026'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Wallet Overview & Configure Limits */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-7">
        {/* Wallet Overview Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
            Wallet Overview :
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Balance */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                BALANCE
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentAgent.walletBalance?.startsWith('₹') ? currentAgent.walletBalance : '₹4,82,500'}
              </span>
            </div>

            {/* Stat 2: On Hold */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ON HOLD
              </span>
              <span className="text-2xl font-bold text-[#FF6B11] tracking-tight">
                {currentAgent.onHold || '₹18,240'}
              </span>
            </div>

            {/* Stat 3: Used Today */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                USED TODAY
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentAgent.usedToday || '₹2,10,760'}
              </span>
            </div>

            {/* Stat 4: Daily Limit */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                DAILY LIMIT
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentAgent.dailyLimit?.startsWith('₹') ? currentAgent.dailyLimit : '₹10,00,000'}
              </span>
            </div>
          </div>
        </div>

        {/* Configure Wallet Limits Section */}
        <div className="pt-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Configure Wallet Limits :
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Changes are saved as a limit change request and routed to the checker
          </p>

          <form onSubmit={handleRaiseLimitRequest} className="space-y-4">
            {/* Limit Rows */}
            <div className="space-y-3.5">
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Per Transaction Cap
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Ceiling ₹1,00,000
                  </div>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={perTxnCap}
                    onChange={(e) => setPerTxnCap(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-right text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Daily Value Limit
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Ceiling ₹25,00,000
                  </div>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={dailyValueLimit}
                    onChange={(e) => setDailyValueLimit(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-right text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Daily Count Limit
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    No ceiling
                  </div>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={dailyCountLimit}
                    onChange={(e) => setDailyCountLimit(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-right text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Low Balance Alert
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Notifies AI admin + ops
                  </div>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={lowBalanceAlert}
                    onChange={(e) => setLowBalanceAlert(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-right text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Effective & Reason Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Effective
                </label>
                <select
                  value={effectivePolicy}
                  onChange={(e) => setEffectivePolicy(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:bg-white cursor-pointer"
                >
                  <option>Apply on approval</option>
                  <option>Immediate</option>
                  <option>Next Billing Cycle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Reason<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Festival-season increase"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:bg-white"
                />
              </div>
            </div>

            {/* Warning Callout Box */}
            <div className="bg-[#fff9e6] border border-[#fde68a] rounded-lg p-3 flex items-start gap-2.5 text-xs text-[#854d0e] mt-4">
              <Lock className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal">
                Increases above <strong className="font-semibold text-slate-900">₹5,00,000</strong> daily limit route to a second (finance) approval. Reductions apply to new transactions only.
              </p>
            </div>

            {/* Limit Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="submit"
                id="raise-limit-btn"
                className="px-5 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-xs rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                Raise Limit Change Request
              </button>

              <button
                type="button"
                id="record-topup-btn"
                onClick={() => setShowTopupModal(true)}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-md transition-colors cursor-pointer"
              >
                Record Top-up
              </button>

              <button
                type="button"
                id="download-statement-btn"
                onClick={handleDownloadStatement}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-md transition-colors cursor-pointer"
              >
                Download Statement
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Card: Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Activity :
        </h3>

        {/* Timeline Items */}
        <div className="space-y-4 text-xs">
          {/* Event 1 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0 mt-1" />
              <div>
                <div className="font-bold text-slate-900 text-xs">
                  Limit change requested
                </div>
                <div className="text-slate-500 mt-0.5">
                  Daily value ₹10,00,000 → ₹15,00,000 · maker P. Kulkarni · pending checker
                </div>
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
              <div>
                <div className="font-bold text-slate-900 text-xs">
                  Top-up credited
                </div>
                <div className="text-slate-500 mt-0.5">
                  05-08-2026 11:40 · UTR N052026081100482 · finance approved
                </div>
              </div>
            </div>
            <div className="font-bold text-slate-900 text-xs">
              ₹5,00,000
            </div>
          </div>

          {/* Event 3 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
              <div>
                <div className="font-bold text-slate-900 text-xs">
                  Agent activated
                </div>
                <div className="text-slate-500 mt-0.5">
                  02-08-2026 · SuperKirana Thane · SK01A064
                </div>
              </div>
            </div>
          </div>

          {/* Event 4 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
              <div>
                <div className="font-bold text-slate-900 text-xs">
                  NPCI registration confirmed
                </div>
                <div className="text-slate-500 mt-0.5">
                  12-01-2026 · AI ID {currentAgent.npciId || 'SK01'} issued
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            id="suspend-agent-btn"
            onClick={() => {
              setCurrentAgent((prev) => ({ ...prev, status: 'Suspended' }));
              showToast(`${currentAgent.name} status updated to Suspended.`);
            }}
            className="px-6 py-2 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Suspend
          </button>

          <button
            type="button"
            id="deactivate-agent-btn"
            onClick={() => {
              showToast(`${currentAgent.name} deactivation request submitted.`);
            }}
            className="px-6 py-2 bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Deactivate
          </button>
        </div>
      </div>

      {/* Top-up Record Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Record Wallet Top-up</h3>
              <button
                type="button"
                onClick={() => setShowTopupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordTopup} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Entity
                </label>
                <input
                  type="text"
                  disabled
                  value={currentAgent.name}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Top-up Amount (₹)*
                </label>
                <input
                  type="text"
                  required
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="5,00,000"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Bank UTR / Transaction Ref*
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="N052026081100482"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] text-slate-800 uppercase font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white rounded font-medium cursor-pointer"
                >
                  Confirm Credit
                </button>
              </div>
            </form>
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

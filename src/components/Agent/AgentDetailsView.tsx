import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ShieldAlert,
  Wallet,
  Building2,
  UserCheck,
  Power,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { AgentEntity, NavItem } from '../../types';
import { mockAgentEntities } from '../../data/mockData';

interface AgentDetailsViewProps {
  agent?: AgentEntity | null;
  agentsList?: AgentEntity[];
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  onUpdateAgent?: (updatedAgent: AgentEntity) => void;
}

export const AgentDetailsView: React.FC<AgentDetailsViewProps> = ({
  agent,
  agentsList = mockAgentEntities,
  onNavigate,
  onUpdateAgent,
}) => {
  // Selected AI Entity for viewing Wallet Overview.
  // If agent prop is provided (e.g. clicked from AI List), it starts on that AI.
  // Otherwise, it starts as null to display the list of all Live AIs.
  const [selectedAi, setSelectedAi] = useState<AgentEntity | null>(() => agent || null);

  // Search filter for Live AI list
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state for AI Wallet Limit configuration
  const [walletType, setWalletType] = useState<string>('Fixed Wallet');
  const [dailyLimit, setDailyLimit] = useState<string>('10,00,000');
  const [transactionLimit, setTransactionLimit] = useState<string>('1,00,000');
  const [isConfiguringNewWallet, setIsConfiguringNewWallet] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ daily?: string; txn?: string; type?: string }>({});

  // Confirmation modal for deactivation
  const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync if prop changes
  useEffect(() => {
    if (agent) {
      setSelectedAi(agent);
      populateForm(agent);
    } else {
      setSelectedAi(null);
    }
  }, [agent]);

  // Populate form with an AI's wallet details
  const populateForm = (ai: AgentEntity) => {
    setWalletType(ai.walletType || 'Fixed Wallet');
    setDailyLimit(ai.dailyLimit && ai.dailyLimit !== '—' ? ai.dailyLimit : '10,00,000');
    setTransactionLimit(ai.transactionLimit && ai.transactionLimit !== '—' ? ai.transactionLimit : '1,00,000');
    setIsConfiguringNewWallet(false);
    setFormErrors({});
  };

  // When an AI is clicked from the Live list
  const handleSelectAi = (ai: AgentEntity) => {
    setSelectedAi(ai);
    populateForm(ai);
  };

  // Filter for ONLY Live / Active AIs
  const liveAIs = useMemo(() => {
    return agentsList.filter(
      (item) => item.status === 'Live' || item.status === 'Active'
    );
  }, [agentsList]);

  // Filtered Live AIs by search query
  const filteredLiveAIs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return liveAIs;

    return liveAIs.filter((item) => {
      const entity = (item.name || '').toLowerCase();
      const aiId = (item.aiId || item.entityNpciId || item.npciId || '').toLowerCase();
      const pan = (item.pan || '').toLowerCase();
      return entity.includes(q) || aiId.includes(q) || pan.includes(q);
    });
  }, [liveAIs, searchTerm]);

  // Validate wallet form
  const validateWalletForm = () => {
    const errs: { daily?: string; txn?: string; type?: string } = {};
    if (!walletType) {
      errs.type = 'Wallet type is required';
    }

    const dailyNum = parseInt(dailyLimit.replace(/[^0-9]/g, ''), 10);
    if (!dailyLimit.trim()) {
      errs.daily = 'Daily limit is required';
    } else if (isNaN(dailyNum) || dailyNum <= 0) {
      errs.daily = 'Daily limit must be a valid positive amount';
    }

    const txnNum = parseInt(transactionLimit.replace(/[^0-9]/g, ''), 10);
    if (!transactionLimit.trim()) {
      errs.txn = 'Transaction limit is required';
    } else if (isNaN(txnNum) || txnNum <= 0) {
      errs.txn = 'Transaction limit must be a valid positive amount';
    } else if (!isNaN(dailyNum) && txnNum > dailyNum) {
      errs.txn = 'Transaction limit cannot exceed Daily limit';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save changes to AI wallet limit
  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAi) return;

    if (!validateWalletForm()) return;

    const dailyNum = parseInt(dailyLimit.replace(/[^0-9]/g, ''), 10) || 0;
    const updatedAi: AgentEntity = {
      ...selectedAi,
      walletCeilingEnabled: true,
      walletStatus: 'Active',
      walletType: walletType,
      dailyLimit: dailyLimit.trim(),
      dailyLimitNum: dailyNum,
      transactionLimit: transactionLimit.trim(),
      walletBalance: selectedAi.walletBalance === '—' ? '₹0' : selectedAi.walletBalance,
    };

    setSelectedAi(updatedAi);
    setIsConfiguringNewWallet(false);

    if (onUpdateAgent) {
      onUpdateAgent(updatedAi);
    }

    showToast(`Wallet limits saved successfully for ${updatedAi.name}!`);
  };

  // Confirm deactivation of AI wallet
  const handleConfirmDeactivate = () => {
    if (!selectedAi) return;

    const updatedAi: AgentEntity = {
      ...selectedAi,
      walletCeilingEnabled: false,
      walletStatus: 'Deactivated',
    };

    setSelectedAi(updatedAi);
    setShowDeactivateModal(false);

    if (onUpdateAgent) {
      onUpdateAgent(updatedAi);
    }

    showToast(`Wallet limits deactivated for ${updatedAi.name}.`);
  };

  // Direct activation from deactivated state
  const handleActivateWallet = () => {
    if (!selectedAi) return;

    // Open configuration form to confirm or edit limits before saving
    setIsConfiguringNewWallet(true);
  };

  const getEffectiveWalletStatus = (ai: AgentEntity): 'Active' | 'No Wallet Limit' | 'Deactivated' => {
    if (ai.walletStatus) return ai.walletStatus;
    if (ai.walletCeilingEnabled) return 'Active';
    return 'No Wallet Limit';
  };

  return (
    <div className="p-6 space-y-6 max-w-[1250px] mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-xl border border-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && selectedAi && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Deactivate Wallet Limit?
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAi.name} ({selectedAi.aiId || selectedAi.entityNpciId})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
              Are you sure you want to deactivate the wallet limit for this AI entity?
              Once deactivated, wallet transactions will no longer enforce daily and per-transaction limits until reactivated.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-deactivate-wallet-btn"
                onClick={handleConfirmDeactivate}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: LIVE AI STATUS LIST (When no specific AI is selected) */}
      {!selectedAi ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center text-xs text-slate-500 font-normal">
            <span>Admin</span>
            <span className="mx-2 text-slate-400">/</span>
            <span>Agent Institution</span>
            <span className="mx-2 text-slate-400">/</span>
            <button
              type="button"
              onClick={() => onNavigate('AI List')}
              className="hover:text-[#FF6B11] hover:underline cursor-pointer"
            >
              AI
            </button>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-800 font-semibold">AI Details</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Details</h1>
              <p className="text-xs text-slate-500 mt-1">
                Showing all Live / Active AI entities. Click any AI entity to view its wallet overview and configure limits.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {liveAIs.length} Live AI Entities
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Entity, AI ID, or PAN..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all shadow-xs"
            />
          </div>

          {/* Live AI Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80">
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                      Entity
                    </th>
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                      AI ID
                    </th>
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                      Status
                    </th>
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                      Wallet Status
                    </th>
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                      Daily Limit
                    </th>
                    <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLiveAIs.length > 0 ? (
                    filteredLiveAIs.map((item) => {
                      const displayAiId = item.aiId || item.entityNpciId || item.npciId || 'NPCI_AI_1001';
                      const effWalletStatus = getEffectiveWalletStatus(item);

                      return (
                        <tr
                          key={item.id}
                          id={`live-ai-row-${displayAiId}`}
                          onClick={() => handleSelectAi(item)}
                          className="hover:bg-[#FFF5EE]/70 cursor-pointer transition-colors group"
                        >
                          {/* 1. Entity */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900 group-hover:text-[#FF6B11] transition-colors">
                                {item.name || 'Unnamed Entity'}
                              </span>
                              {item.entityType && (
                                <span className="text-[11px] text-slate-400 mt-0.5">
                                  {item.entityType}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 2. AI ID */}
                          <td className="py-4 px-6">
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70">
                              {displayAiId}
                            </span>
                          </td>

                          {/* 3. Status (Live / Active) */}
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Live
                            </span>
                          </td>

                          {/* 4. Wallet Status */}
                          <td className="py-4 px-6">
                            {effWalletStatus === 'Active' && (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  Active
                                </span>
                                {item.walletType && (
                                  <span className="text-[11px] text-slate-500">
                                    ({item.walletType})
                                  </span>
                                )}
                              </div>
                            )}
                            {effWalletStatus === 'No Wallet Limit' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                No Wallet Limit
                              </span>
                            )}
                            {effWalletStatus === 'Deactivated' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Deactivated
                              </span>
                            )}
                          </td>

                          {/* 5. Daily Limit */}
                          <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                            {item.dailyLimit && item.dailyLimit !== '—'
                              ? `₹${item.dailyLimit}`
                              : '—'}
                          </td>

                          {/* 6. Action */}
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              id={`view-wallet-btn-${displayAiId}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAi(item);
                              }}
                              className="px-3.5 py-1.5 text-xs font-semibold text-[#FF6B11] hover:text-white hover:bg-[#FF6B11] border border-[#FF6B11]/40 rounded-lg transition-all cursor-pointer shadow-2xs"
                            >
                              View Wallet Overview
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-medium">
                        No live AI entities found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: AI WALLET OVERVIEW (When an AI is clicked) */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center text-xs text-slate-500 font-normal">
            <span>Admin</span>
            <span className="mx-2 text-slate-400">/</span>
            <span>Agent Institution</span>
            <span className="mx-2 text-slate-400">/</span>
            <button
              type="button"
              onClick={() => setSelectedAi(null)}
              className="hover:text-[#FF6B11] hover:underline cursor-pointer"
            >
              AI Details
            </button>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-800 font-semibold">{selectedAi.name}</span>
          </div>

          {/* Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <button
              type="button"
              id="back-to-live-ai-list-btn"
              onClick={() => setSelectedAi(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#FF6B11] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Live AI List
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Viewing Wallet Overview:</span>
              <span className="text-xs font-bold text-slate-800 bg-orange-50 text-[#FF6B11] border border-orange-200 px-2.5 py-1 rounded-md">
                {selectedAi.name} ({selectedAi.aiId || selectedAi.entityNpciId})
              </span>
            </div>
          </div>

          {/* Section 1: AI Basic Information Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B11]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    AI Entity Information
                  </h2>
                  <span className="text-sm font-bold text-slate-900">{selectedAi.name}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Status
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[11px] font-medium text-slate-400 block">AI ID</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block font-mono">
                  {selectedAi.aiId || selectedAi.entityNpciId || 'NPCI_AI_1001'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[11px] font-medium text-slate-400 block">Entity Type</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  {selectedAi.entityType || 'Private Limited'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[11px] font-medium text-slate-400 block">PAN</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block uppercase">
                  {selectedAi.pan || '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[11px] font-medium text-slate-400 block">Primary Contact</span>
                <span className="text-xs font-semibold text-slate-800 mt-1 block truncate">
                  {selectedAi.adminFirstName
                    ? `${selectedAi.adminFirstName} ${selectedAi.adminLastName || ''}`
                    : selectedAi.adminEmail || 'Authorized Admin'}
                </span>
              </div>
            </div>

            {(selectedAi.registeredAddress || selectedAi.adminEmail) && (
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                {selectedAi.registeredAddress && (
                  <span className="truncate">
                    <span className="font-semibold text-slate-700">Address: </span>
                    {selectedAi.registeredAddress}
                  </span>
                )}
                {selectedAi.adminEmail && (
                  <span className="shrink-0">
                    <span className="font-semibold text-slate-700">Email: </span>
                    {selectedAi.adminEmail}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Section 2: AI Wallet Overview Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B11]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Wallet Overview
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time wallet balance, ceiling parameters, and transaction limit controls.
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {getEffectiveWalletStatus(selectedAi) === 'Active' && (
                  <button
                    type="button"
                    id="deactivate-wallet-btn"
                    onClick={() => setShowDeactivateModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Deactivate Wallet
                  </button>
                )}

                {getEffectiveWalletStatus(selectedAi) === 'Deactivated' && (
                  <button
                    type="button"
                    id="activate-wallet-btn"
                    onClick={handleActivateWallet}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Activate Wallet
                  </button>
                )}

                {getEffectiveWalletStatus(selectedAi) === 'No Wallet Limit' && !isConfiguringNewWallet && (
                  <button
                    type="button"
                    id="setup-wallet-btn"
                    onClick={() => setIsConfiguringNewWallet(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Set Up Wallet Limit
                  </button>
                )}
              </div>
            </div>

            {/* Wallet Overview Metrics Cards */}
            {getEffectiveWalletStatus(selectedAi) === 'Active' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Wallet Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Wallet Balance
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1.5 block">
                    {selectedAi.walletBalance || '₹0'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Daily Limit
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1.5 block">
                    ₹{selectedAi.dailyLimit || '10,00,000'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Transaction Limit
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1.5 block">
                    ₹{selectedAi.transactionLimit || '1,00,000'}
                  </span>
                </div>
              </div>
            )}

            {getEffectiveWalletStatus(selectedAi) === 'No Wallet Limit' && !isConfiguringNewWallet && (
              <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      No Wallet Limit Configured
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    This AI entity does not currently have ceiling limits configured. Click 'Set Up Wallet Limit' to establish daily and per-transaction limits.
                  </p>
                </div>
              </div>
            )}

            {getEffectiveWalletStatus(selectedAi) === 'Deactivated' && (
              <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      Deactivated
                    </span>
                    <span className="text-xs text-rose-600 font-medium">
                      (Limits inactive)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Previous Wallet Type</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                      {selectedAi.walletType || 'Fixed Wallet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Previous Daily Limit</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                      ₹{selectedAi.dailyLimit || '10,00,000'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Previous Txn Limit</span>
                    <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                      ₹{selectedAi.transactionLimit || '1,00,000'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Limit Configuration Form */}
            {(getEffectiveWalletStatus(selectedAi) === 'Active' || isConfiguringNewWallet) && (
              <form onSubmit={handleSaveWallet} className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                      {getEffectiveWalletStatus(selectedAi) === 'Active'
                        ? 'Configure Wallet Limits'
                        : 'Set Up & Activate Wallet Limits'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter the ceiling limit parameters and save changes to apply immediately.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  {/* Wallet Type */}
                  <div className="space-y-1">
                    <label htmlFor="ai-wallet-type" className="block text-xs font-semibold text-slate-700">
                      Wallet Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="ai-wallet-type"
                        value={walletType}
                        onChange={(e) => {
                          setWalletType(e.target.value);
                          if (formErrors.type) setFormErrors((prev) => ({ ...prev, type: undefined }));
                        }}
                        className="w-full appearance-none px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] pr-9"
                      >
                        <option value="Fixed Wallet">Fixed Wallet</option>
                        <option value="Variable Wallet">Variable Wallet</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {formErrors.type && (
                      <p className="text-[11px] text-rose-500">{formErrors.type}</p>
                    )}
                  </div>

                  {/* Daily Limit */}
                  <div className="space-y-1">
                    <label htmlFor="ai-daily-limit" className="block text-xs font-semibold text-slate-700">
                      Daily Limit <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                        ₹
                      </span>
                      <input
                        id="ai-daily-limit"
                        type="text"
                        value={dailyLimit}
                        onChange={(e) => {
                          setDailyLimit(e.target.value);
                          if (formErrors.daily) setFormErrors((prev) => ({ ...prev, daily: undefined }));
                        }}
                        placeholder="e.g. 10,00,000"
                        className={`w-full pl-7 pr-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          formErrors.daily
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                        }`}
                      />
                    </div>
                    {formErrors.daily && (
                      <p className="text-[11px] text-rose-500">{formErrors.daily}</p>
                    )}
                  </div>

                  {/* Transaction Limit */}
                  <div className="space-y-1">
                    <label htmlFor="ai-txn-limit" className="block text-xs font-semibold text-slate-700">
                      Transaction Limit <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                        ₹
                      </span>
                      <input
                        id="ai-txn-limit"
                        type="text"
                        value={transactionLimit}
                        onChange={(e) => {
                          setTransactionLimit(e.target.value);
                          if (formErrors.txn) setFormErrors((prev) => ({ ...prev, txn: undefined }));
                        }}
                        placeholder="e.g. 1,00,000"
                        className={`w-full pl-7 pr-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          formErrors.txn
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-[#FF6B11] focus:ring-[#FF6B11]/20'
                        }`}
                      />
                    </div>
                    {formErrors.txn && (
                      <p className="text-[11px] text-rose-500">{formErrors.txn}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {isConfiguringNewWallet && getEffectiveWalletStatus(selectedAi) !== 'Active' && (
                    <button
                      type="button"
                      onClick={() => setIsConfiguringNewWallet(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    id="save-ai-wallet-changes-btn"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    {getEffectiveWalletStatus(selectedAi) === 'Active'
                      ? 'Save Changes'
                      : 'Activate & Save Limit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

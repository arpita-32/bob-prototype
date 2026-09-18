import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Power,
  RefreshCw,
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AgentEntity, NavItem, OnboardedAgent } from '../../types';
import { mockAgentEntities } from '../../data/mockData';

interface AgentListViewProps {
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  agentsList?: AgentEntity[];
  onUpdateAgent?: (updatedAgent: AgentEntity) => void;
}

export const AgentListView: React.FC<AgentListViewProps> = ({
  onNavigate,
  agentsList = mockAgentEntities,
  onUpdateAgent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Expanded AI ID for viewing onboarded agents directly in table
  const [expandedAiId, setExpandedAiId] = useState<string | null>(null);

  // Confirmation Modal state for AI activate/deactivate
  const [modalAction, setModalAction] = useState<{
    type: 'ai' | 'agent';
    action: 'activate' | 'deactivate';
    aiEntity: AgentEntity;
    agentObj?: OnboardedAgent;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter to show AI entities only
  const aiEntities = useMemo(() => {
    return agentsList.filter((item) => item.type === 'AI' || !item.type);
  }, [agentsList]);

  const filteredAIs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return aiEntities;

    return aiEntities.filter((item) => {
      const entity = (item.name || '').toLowerCase();
      const aiId = (item.aiId || item.entityNpciId || item.npciId || '').toLowerCase();
      const status = (item.status === 'Live' ? 'Active' : item.status).toLowerCase();
      // Search inside mapped agents as well
      const matchesAgent = (item.onboardedAgents || []).some(
        (ag) =>
          ag.agentId.toLowerCase().includes(q) ||
          ag.agentName.toLowerCase().includes(q) ||
          ag.agentStatus.toLowerCase().includes(q)
      );
      return entity.includes(q) || aiId.includes(q) || status.includes(q) || matchesAgent;
    });
  }, [aiEntities, searchTerm]);

  // Toggle AI Active/Inactive status
  const handleToggleAiStatus = (ai: AgentEntity, targetStatus: 'Active' | 'Inactive') => {
    const updatedAi: AgentEntity = {
      ...ai,
      status: targetStatus,
    };
    if (onUpdateAgent) {
      onUpdateAgent(updatedAi);
    }
    showToast(
      `Agent Institution "${ai.name}" has been ${
        targetStatus === 'Active' ? 'activated' : 'deactivated'
      } successfully.`
    );
    setModalAction(null);
  };

  // Toggle Agent Active/Inactive status under a specific AI
  const handleToggleAgentStatus = (
    parentAi: AgentEntity,
    agentObj: OnboardedAgent,
    targetStatus: 'Active' | 'Inactive'
  ) => {
    const currentAgents = parentAi.onboardedAgents || [];
    const updatedAgents = currentAgents.map((ag) =>
      ag.id === agentObj.id || ag.agentId === agentObj.agentId
        ? { ...ag, agentStatus: targetStatus }
        : ag
    );

    const updatedAi: AgentEntity = {
      ...parentAi,
      onboardedAgents: updatedAgents,
    };

    if (onUpdateAgent) {
      onUpdateAgent(updatedAi);
    }

    showToast(
      `Agent "${agentObj.agentName}" (${agentObj.agentId}) under ${parentAi.name} has been ${
        targetStatus === 'Active' ? 'activated' : 'deactivated'
      }.`
    );
    setModalAction(null);
  };

  const renderStatusBadge = (status: AgentEntity['status'] | OnboardedAgent['agentStatus']) => {
    const isActive = status === 'Active' || status === 'Live';
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Inactive
      </span>
    );
  };

  return (
    <div className="p-6 space-y-5 max-w-[1100px] mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal for AI / Agent Activate & Deactivate */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  modalAction.action === 'deactivate'
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}
              >
                {modalAction.action === 'deactivate' ? (
                  <Power className="w-5 h-5" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalAction.action === 'deactivate' ? 'Deactivate' : 'Activate'}{' '}
                  {modalAction.type === 'ai' ? 'Agent Institution' : 'Agent'}?
                </h3>
                <p className="text-xs text-slate-500">
                  {modalAction.type === 'ai'
                    ? `${modalAction.aiEntity.name} (${
                        modalAction.aiEntity.aiId || modalAction.aiEntity.entityNpciId
                      })`
                    : `${modalAction.agentObj?.agentName} (${modalAction.agentObj?.agentId})`}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {modalAction.action === 'deactivate' ? (
                <>
                  Are you sure you want to deactivate{' '}
                  <span className="font-bold text-slate-800">
                    {modalAction.type === 'ai'
                      ? modalAction.aiEntity.name
                      : modalAction.agentObj?.agentName}
                  </span>
                  ? This will suspend operational status and prevent new transaction requests until
                  reactivated by the administrator.
                </>
              ) : (
                <>
                  Are you sure you want to activate{' '}
                  <span className="font-bold text-slate-800">
                    {modalAction.type === 'ai'
                      ? modalAction.aiEntity.name
                      : modalAction.agentObj?.agentName}
                  </span>
                  ? This will enable operational capabilities and permit transaction processing.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-modal-status-btn"
                onClick={() => {
                  if (modalAction.type === 'ai') {
                    handleToggleAiStatus(
                      modalAction.aiEntity,
                      modalAction.action === 'deactivate' ? 'Inactive' : 'Active'
                    );
                  } else if (modalAction.agentObj) {
                    handleToggleAgentStatus(
                      modalAction.aiEntity,
                      modalAction.agentObj,
                      modalAction.action === 'deactivate' ? 'Inactive' : 'Active'
                    );
                  }
                }}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                  modalAction.action === 'deactivate'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {modalAction.action === 'deactivate' ? 'Deactivation' : 'Activation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center text-xs text-slate-500 font-normal">
        <span>Admin</span>
        <span className="mx-2 text-slate-400">/</span>
        <span>Agent Institution</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">AI</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">AI List</span>
      </div>

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI List</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered Agent Institutions and their mapped onboarded agents with instant activate / deactivate controls.
          </p>
        </div>

        <button
          type="button"
          id="btn-create-ai"
          onClick={() => onNavigate('Create AI')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create AI / Agent
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-ai-list-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Entity, AI ID, Agent Name, or Status..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Click any AI row to view onboarded agents &amp; activate / deactivate</span>
        </div>
      </div>

      {/* AI List Table with Embedded Onboarded Agents & Actions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/80">
                <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                  Entity &amp; Onboarded Agents
                </th>
                <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase">
                  AI ID
                </th>
                <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase text-center">
                  Status
                </th>
                <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase text-right">
                  AI Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAIs.length > 0 ? (
                filteredAIs.map((item) => {
                  const displayAiId =
                    item.aiId || item.entityNpciId || item.npciId || 'NPCI_AI_1001';
                  const isExpanded = expandedAiId === item.id;
                  const agents = item.onboardedAgents || [];
                  const isAiActive = item.status === 'Active' || item.status === 'Live';

                  return (
                    <React.Fragment key={item.id}>
                      {/* Parent AI Row */}
                      <tr
                        id={`ai-row-${displayAiId}`}
                        className={`transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-orange-50/40' : 'hover:bg-[#FFF5EE]/60'
                        }`}
                        onClick={() => setExpandedAiId(isExpanded ? null : item.id)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedAiId(isExpanded ? null : item.id);
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isExpanded
                                  ? 'bg-[#FF6B11] text-white border-[#FF6B11]'
                                  : 'bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-[#FF6B11] border-slate-200'
                              }`}
                              title={isExpanded ? 'Collapse agents' : 'View onboarded agents'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900 group-hover:text-[#FF6B11] transition-colors">
                                  {item.name || 'Unnamed Entity'}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  <Users className="w-3 h-3 text-[#FF6B11]" />
                                  {agents.length} agent{agents.length === 1 ? '' : 's'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                PAN: {item.pan || '—'} • Daily Ceiling: ₹{item.dailyLimit || '10,00,000'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70">
                            {displayAiId}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          {renderStatusBadge(item.status)}
                        </td>

                        {/* AI Admin Action: Activate or Deactivate AI */}
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {isAiActive ? (
                              <button
                                type="button"
                                id={`deactivate-ai-${displayAiId}`}
                                onClick={() =>
                                  setModalAction({
                                    type: 'ai',
                                    action: 'deactivate',
                                    aiEntity: item,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                                title="Deactivate Agent Institution"
                              >
                                <Power className="w-3.5 h-3.5" />
                                Deactivate AI
                              </button>
                            ) : (
                              <button
                                type="button"
                                id={`activate-ai-${displayAiId}`}
                                onClick={() =>
                                  setModalAction({
                                    type: 'ai',
                                    action: 'activate',
                                    aiEntity: item,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer shadow-xs"
                                title="Activate Agent Institution"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Activate AI
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onNavigate('AI Details', item)}
                              className="p-1.5 text-slate-400 hover:text-[#FF6B11] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-orange-200"
                              title="Open Full AI Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Sub-table: Onboarded Agents under this Mapped AI */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-y border-slate-200/90">
                          <td colSpan={4} className="p-0">
                            <div className="p-5 pl-14 space-y-3 bg-gradient-to-b from-orange-50/30 to-slate-50/60">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#FF6B11]" />
                                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Onboarded Agents under {item.name} ({displayAiId})
                                  </h3>
                                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                    {agents.length} mapped
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onNavigate('Create AI')}
                                  className="text-[11px] font-bold text-[#FF6B11] hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Onboard New Agent
                                </button>
                              </div>

                              {agents.length > 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-slate-100/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        <th className="py-2.5 px-4">Agent ID</th>
                                        <th className="py-2.5 px-4">Agent / Outlet Name</th>
                                        <th className="py-2.5 px-4 text-center">Status</th>
                                        <th className="py-2.5 px-4 text-right">Agent Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {agents.map((ag) => {
                                        const isAgActive = ag.agentStatus === 'Active';
                                        return (
                                          <tr
                                            key={ag.id || ag.agentId}
                                            id={`agent-row-${ag.agentId}`}
                                            className="hover:bg-slate-50/80 transition-colors"
                                          >
                                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                              {ag.agentId}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-800">
                                              {ag.agentName}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                              {renderStatusBadge(ag.agentStatus)}
                                            </td>
                                            {/* Activate / Deactivate Agent Action */}
                                            <td className="py-3 px-4 text-right">
                                              {isAgActive ? (
                                                <button
                                                  type="button"
                                                  id={`deactivate-agent-${ag.agentId}`}
                                                  onClick={() =>
                                                    setModalAction({
                                                      type: 'agent',
                                                      action: 'deactivate',
                                                      aiEntity: item,
                                                      agentObj: ag,
                                                    })
                                                  }
                                                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                                                >
                                                  <Power className="w-3 h-3" />
                                                  Deactivate
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  id={`activate-agent-${ag.agentId}`}
                                                  onClick={() =>
                                                    setModalAction({
                                                      type: 'agent',
                                                      action: 'activate',
                                                      aiEntity: item,
                                                      agentObj: ag,
                                                    })
                                                  }
                                                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer shadow-2xs"
                                                >
                                                  <RefreshCw className="w-3 h-3" />
                                                  Activate
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="p-4 bg-white border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                                  No onboarded agents mapped under this AI yet. Click{' '}
                                  <button
                                    type="button"
                                    onClick={() => onNavigate('Create AI')}
                                    className="font-bold text-[#FF6B11] hover:underline"
                                  >
                                    Create Agent
                                  </button>{' '}
                                  to onboard an agent under {item.name}.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No AI entities found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong className="text-slate-800 font-bold">{filteredAIs.length}</strong> Agent Institution{filteredAIs.length === 1 ? '' : 's'}
          </span>
          <span className="text-[11px] text-slate-500">
            Admins can activate / deactivate Agent Institutions &amp; AIs can activate / deactivate their mapped agents
          </span>
        </div>
      </div>
    </div>
  );
};


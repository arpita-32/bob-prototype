import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { AgentEntity, NavItem } from '../../types';
import { mockAgentEntities } from '../../data/mockData';

interface AgentListViewProps {
  onNavigate: (nav: NavItem, agent?: AgentEntity) => void;
  agentsList?: AgentEntity[];
}

export const AgentListView: React.FC<AgentListViewProps> = ({
  onNavigate,
  agentsList = mockAgentEntities,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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
      return entity.includes(q) || aiId.includes(q) || status.includes(q);
    });
  }, [aiEntities, searchTerm]);

  const renderStatusBadge = (status: AgentEntity['status']) => {
    const isActive = status === 'Active' || status === 'Live';
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Inactive
      </span>
    );
  };

  return (
    <div className="p-6 space-y-5 max-w-[1000px] mx-auto select-none">
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
            Registered Agent Institution entities and their operational status.
          </p>
        </div>

        <button
          type="button"
          id="btn-create-ai"
          onClick={() => onNavigate('Create AI')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF6B11] hover:bg-[#e05a08] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create AI
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-ai-list-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Entity, AI ID, or Status..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B11]/20 focus:border-[#FF6B11] transition-all"
          />
        </div>
      </div>

      {/* AI List Table - 3 COLUMNS: Entity, AI ID, Status */}
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
                <th className="py-3.5 px-6 text-[12px] font-bold text-slate-700 tracking-wider uppercase text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAIs.length > 0 ? (
                filteredAIs.map((item) => {
                  const displayAiId = item.aiId || item.entityNpciId || item.npciId || 'NPCI_AI_1001';
                  return (
                    <tr
                      key={item.id}
                      id={`ai-row-${displayAiId}`}
                      onClick={() => onNavigate('AI Details', item)}
                      className="hover:bg-[#FFF5EE]/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-[#FF6B11] transition-colors">
                          {item.name || 'Unnamed Entity'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70">
                          {displayAiId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {renderStatusBadge(item.status)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No AI entities found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredAIs.length} Agent Institution{filteredAIs.length === 1 ? '' : 's'}</span>
          <span className="text-[11px] text-slate-400">Click any row to view AI Details &amp; manage Onboarded Agents</span>
        </div>
      </div>
    </div>
  );
};

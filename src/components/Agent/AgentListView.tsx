import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  Download,
  Plus,
  ChevronDown,
  Filter,
} from 'lucide-react';
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
  const [typeFilter, setTypeFilter] = useState<'All' | 'AI' | 'Agent'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Submitted' | 'Invited' | 'Suspended'>('All');
  const [walletFilter, setWalletFilter] = useState<'All' | 'Pooled' | 'Dedicated'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgents = useMemo(() => {
    return agentsList.filter((item) => {
      // Search term
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.pan.toLowerCase().includes(q) ||
        item.npciId.toLowerCase().includes(q) ||
        (item.parentEntity && item.parentEntity.toLowerCase().includes(q)) ||
        (item.adminPhone && item.adminPhone.toLowerCase().includes(q));

      // Type filter
      const matchesType = typeFilter === 'All' || item.type === typeFilter;

      // Status filter
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      // Wallet filter
      const matchesWallet =
        walletFilter === 'All' ||
        (walletFilter === 'Pooled' && (item.walletType?.includes('Pooled') || item.walletBalance.includes('pooled'))) ||
        (walletFilter === 'Dedicated' && item.walletType?.includes('Dedicated'));

      return matchesSearch && matchesType && matchesStatus && matchesWallet;
    });
  }, [agentsList, searchTerm, typeFilter, statusFilter, walletFilter]);

  const exportCSV = () => {
    const headers = ['ENTITY', 'PAN / PARENT', 'TYPE', 'NPCI ID', 'WALLET BALANCE', 'DAILY LIMIT', 'STATUS'];
    const rows = filteredAgents.map((a) => [
      a.name,
      a.parentEntity ? `Under ${a.parentEntity}` : a.pan,
      a.type,
      a.npciId,
      a.walletBalance,
      a.dailyLimit,
      a.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Agent_AI_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: AgentEntity['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Submitted
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Invited
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspended
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1300px] mx-auto select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Agent</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Agent / AI List</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Agent / AI List
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="export-csv-btn"
              onClick={exportCSV}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              id="create-agent-btn"
              onClick={() => onNavigate('Create Agent / AI')}
              className="px-4 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-sm font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Agent / AI</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="agent-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, PAN, NPCI ID or mobile"
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Type Filter */}
            <div className="relative">
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium py-2 pl-3 pr-8 rounded focus:outline-none focus:border-[#FF6B11] cursor-pointer"
              >
                <option value="All">Type: All</option>
                <option value="AI">Type: AI</option>
                <option value="Agent">Type: Agent</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium py-2 pl-3 pr-8 rounded focus:outline-none focus:border-[#FF6B11] cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Live">Status: Live</option>
                <option value="Submitted">Status: Submitted</option>
                <option value="Invited">Status: Invited</option>
                <option value="Suspended">Status: Suspended</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Wallet Filter */}
            <div className="relative">
              <select
                id="filter-wallet"
                value={walletFilter}
                onChange={(e) => setWalletFilter(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium py-2 pl-3 pr-8 rounded focus:outline-none focus:border-[#FF6B11] cursor-pointer"
              >
                <option value="All">Wallet: All</option>
                <option value="Pooled">Wallet: Pooled</option>
                <option value="Dedicated">Wallet: Dedicated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/70">
                  <th className="py-3 px-4">ENTITY</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">NPCI ID</th>
                  <th className="py-3 px-4">WALLET BALANCE</th>
                  <th className="py-3 px-4">DAILY LIMIT</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => onNavigate('Agent / AI Details', agent)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <span
                          className={`font-semibold text-[13px] ${
                            agent.status === 'Submitted'
                              ? 'text-[#FF6B11]'
                              : 'text-slate-900 group-hover:text-[#FF6B11]'
                          } transition-colors`}
                        >
                          {agent.name}
                        </span>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {agent.parentEntity
                            ? `Under ${agent.parentEntity}`
                            : `PAN ${agent.pan}`}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {agent.type === 'AI' ? (
                        <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-[11px]">
                          AI
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 bg-sky-100 text-sky-700 rounded-full font-semibold text-[11px]">
                          Agent
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[12px] text-slate-600">
                      {agent.npciId}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`${
                          agent.walletBalance.startsWith('₹')
                            ? 'font-bold text-slate-900 text-[13px]'
                            : 'text-slate-400'
                        }`}
                      >
                        {agent.walletBalance}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {agent.dailyLimit}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(agent.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B11] group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                ))}

                {filteredAgents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No matching agents or institutions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <span>Showing 1–{filteredAgents.length} of 450 entities</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button
              type="button"
              className="px-2.5 py-1 bg-slate-900 text-white rounded font-medium"
            >
              1
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            >
              2
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            >
              75
            </button>
            <button
              type="button"
              className="px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

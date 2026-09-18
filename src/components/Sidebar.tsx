import React, { useState } from 'react';
import {
  Gauge,
  FileText,
  User,
  Users,
  FolderCheck,
  RefreshCw,
  CreditCard,
  FileSpreadsheet,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  currentUser?: { role: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentNav, onNavigate, currentUser }) => {
  const isMaker = currentUser?.role === 'Maker';
  const isChecker = currentUser?.role === 'Checker';
  const isAdmin = currentUser?.role === 'Admin';

  const [userManagementOpen, setUserManagementOpen] = useState(
    currentNav === 'User Management' ||
    currentNav === 'Create New User' ||
    currentNav === 'Update Bank User' ||
    currentNav === 'Verify User' ||
    isAdmin
  );

  const [billerOpen, setBillerOpen] = useState(
    currentNav === 'Biller' ||
    currentNav === 'Create New Biller' ||
    currentNav === 'Biller List' ||
    currentNav === 'Biller Details' ||
    currentNav === 'Biller Verification'
  );
  const [agentOpen, setAgentOpen] = useState(
    currentNav === 'Agent' ||
    currentNav === 'Create Agent / AI' ||
    currentNav === 'Agent / AI List' ||
    currentNav === 'Agent / AI Details'
  );
  const [reportCenterOpen, setReportCenterOpen] = useState(
    currentNav === 'COU Report' || currentNav === 'BOU Report' || currentNav === 'Report Center'
  );
  const [reconciliationOpen, setReconciliationOpen] = useState(
    currentNav === 'COU Reconciliation' || currentNav === 'BOU Reconciliation' || currentNav === 'Reconciliation'
  );

  const isUserManagementActive =
    currentNav === 'User Management' ||
    currentNav === 'Create New User' ||
    currentNav === 'Update Bank User' ||
    currentNav === 'Verify User';

  const isBillerActive =
    currentNav === 'Biller' ||
    currentNav === 'Create New Biller' ||
    currentNav === 'Biller List' ||
    currentNav === 'Biller Details' ||
    currentNav === 'Biller Verification';

  const isAgentActive =
    currentNav === 'Agent' ||
    currentNav === 'Create Agent / AI' ||
    currentNav === 'Agent / AI List' ||
    currentNav === 'Agent / AI Details' ||
    currentNav === 'Create AI' ||
    currentNav === 'AI List' ||
    currentNav === 'AI Details';

  const isReportCenterActive =
    currentNav === 'Report Center' ||
    currentNav === 'BOU Report' ||
    currentNav === 'COU Report';

  const isReconciliationActive =
    currentNav === 'Reconciliation' ||
    currentNav === 'BOU Reconciliation' ||
    currentNav === 'COU Reconciliation';

  return (
    <aside
      id="main-sidebar"
      className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] shrink-0 select-none py-2 text-sm"
    >
      <nav className="space-y-0.5">
        {/* 1. Dashboard */}
        <button
          type="button"
          id="nav-dashboard"
          onClick={() => onNavigate('Dashboard')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
            currentNav === 'Dashboard'
              ? 'text-[#FF6B11] font-medium'
              : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Gauge
              className={`w-4 h-4 shrink-0 ${
                currentNav === 'Dashboard' ? 'text-[#FF6B11]' : 'text-slate-500'
              }`}
            />
            <span className="truncate">Dashboard</span>
          </div>
          {currentNav === 'Dashboard' && (
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
          )}
        </button>

        {/* 2. Transaction Summary */}
        <button
          type="button"
          id="nav-transaction-summary"
          onClick={() => onNavigate('Transaction Summary')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
            currentNav === 'Transaction Summary'
              ? 'text-[#FF6B11] font-medium'
              : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText
              className={`w-4 h-4 shrink-0 ${
                currentNav === 'Transaction Summary'
                  ? 'text-[#FF6B11]'
                  : 'text-slate-500'
              }`}
            />
            <span className="truncate">Transaction Summary</span>
          </div>
          {currentNav === 'Transaction Summary' && (
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
          )}
        </button>

        {/* User Management (Visible ONLY for Admin portal, placed directly after Transaction Summary) */}
        {!isMaker && !isChecker && (
          <div>
            <button
              type="button"
              id="nav-user-management"
              onClick={() => {
                setUserManagementOpen(!userManagementOpen);
                if (!isUserManagementActive) {
                  onNavigate('User Management');
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
                isUserManagementActive
                  ? 'bg-[#FF6B11] text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users
                  className={`w-4 h-4 shrink-0 ${
                    isUserManagementActive ? 'text-white' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">User Management</span>
              </div>
              {userManagementOpen ? (
                <ChevronUp
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isUserManagementActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
              ) : (
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isUserManagementActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
              )}
            </button>

            {userManagementOpen && (
              <div className="space-y-0.5 pt-1 pb-1 bg-slate-50/50">
                <button
                  type="button"
                  id="nav-create-new-user"
                  onClick={() => onNavigate('Create New User')}
                  className={`w-full flex items-center justify-between pl-9 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                    currentNav === 'Create New User' || currentNav === 'User Management'
                      ? 'text-[#FF6B11] font-semibold bg-orange-50/80'
                      : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">Create & View User</span>
                  {(currentNav === 'Create New User' || currentNav === 'User Management') && (
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                  )}
                </button>

                <button
                  type="button"
                  id="nav-update-bank-user"
                  onClick={() => onNavigate('Update Bank User')}
                  className={`w-full flex items-center justify-between pl-9 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                    currentNav === 'Update Bank User'
                      ? 'text-[#FF6B11] font-semibold bg-orange-50/80'
                      : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">Update Bank User</span>
                  {currentNav === 'Update Bank User' && (
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Biller (Expandable) */}
        <div>
          <button
            type="button"
            id="nav-biller"
            onClick={() => setBillerOpen(!billerOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
              isBillerActive
                ? 'text-[#FF6B11] font-medium'
                : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User
                className={`w-4 h-4 shrink-0 ${
                  isBillerActive ? 'text-[#FF6B11]' : 'text-slate-500'
                }`}
              />
              <span className="truncate">Biller</span>
            </div>
            {billerOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {billerOpen && (
            <div className="space-y-0.5 pt-0.5">
              {/* Maker items */}
              {isMaker && (
                <>
                  <button
                    type="button"
                    id="nav-create-new-biller"
                    onClick={() => onNavigate('Create New Biller')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Create New Biller'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Create New Biller</span>
                    {currentNav === 'Create New Biller' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>

                  <button
                    type="button"
                    id="nav-biller-list"
                    onClick={() => onNavigate('Biller List')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller List'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller List</span>
                    {currentNav === 'Biller List' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>

                  <button
                    type="button"
                    id="nav-biller-details"
                    onClick={() => onNavigate('Biller Details')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller Details'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller Details</span>
                    {currentNav === 'Biller Details' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>
                </>
              )}

              {/* Checker items: Biller Verification and Biller List */}
              {isChecker && (
                <>
                  <button
                    type="button"
                    id="nav-biller-verification"
                    onClick={() => onNavigate('Biller Verification')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller Verification'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller Verification</span>
                    {currentNav === 'Biller Verification' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>

                  <button
                    type="button"
                    id="nav-biller-list-checker"
                    onClick={() => onNavigate('Biller List')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller List'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller List</span>
                    {currentNav === 'Biller List' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>
                </>
              )}

              {/* Admin / Other users: Biller List and Biller Details */}
              {!isMaker && !isChecker && (
                <>
                  <button
                    type="button"
                    id="nav-biller-list-all"
                    onClick={() => onNavigate('Biller List')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller List'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller List</span>
                    {currentNav === 'Biller List' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>

                  <button
                    type="button"
                    id="nav-biller-details-all"
                    onClick={() => onNavigate('Biller Details')}
                    className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                      currentNav === 'Biller Details'
                        ? 'text-[#FF6B11] font-medium bg-orange-50/60'
                        : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">Biller Details</span>
                    {currentNav === 'Biller Details' && (
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 4. Agent [NEW] - Hidden for Maker and Checker */}
        {!isMaker && !isChecker && (
          <div>
            <button
              type="button"
              id="nav-agent"
              onClick={() => setAgentOpen(!agentOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
                isAgentActive
                  ? 'text-[#FF6B11] font-medium'
                  : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users
                  className={`w-4 h-4 shrink-0 ${
                    isAgentActive ? 'text-[#FF6B11]' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">Agent Institution</span>
                <span className="bg-[#FF6B11] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                  NEW
                </span>
              </div>
              {agentOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {agentOpen && (
              <div className="space-y-1 pt-1 px-2">
                <button
                  type="button"
                  id="nav-create-agent"
                  onClick={() => onNavigate('Create AI')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[12.5px] rounded-lg whitespace-nowrap transition-colors relative ${
                    currentNav === 'Create AI' || currentNav === 'Create Agent / AI'
                      ? 'text-[#FF6B11] font-semibold bg-[#FFF5EE] border border-[#FF6B11]/30'
                      : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">Create AI</span>
                </button>

                <button
                  type="button"
                  id="nav-agent-list"
                  onClick={() => onNavigate('AI List')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[12.5px] rounded-lg whitespace-nowrap transition-colors relative ${
                    currentNav === 'AI List' || currentNav === 'Agent / AI List' || currentNav === 'Agent'
                      ? 'text-[#FF6B11] font-semibold bg-[#FFF5EE] border border-[#FF6B11]/30'
                      : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">AI List</span>
                </button>

                <button
                  type="button"
                  id="nav-agent-details"
                  onClick={() => onNavigate('AI Details')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[12.5px] rounded-lg whitespace-nowrap transition-colors relative ${
                    currentNav === 'AI Details' || currentNav === 'Agent / AI Details'
                      ? 'text-[#FF6B11] font-semibold bg-[#FFF5EE] border border-[#FF6B11]/30'
                      : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">AI Details</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. Report Center */}
        <div>
          <button
            type="button"
            id="nav-report-center"
            onClick={() => setReportCenterOpen(!reportCenterOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
              isReportCenterActive
                ? 'text-[#FF6B11] font-medium'
                : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderCheck
                className={`w-4 h-4 shrink-0 ${
                  isReportCenterActive ? 'text-[#FF6B11]' : 'text-slate-500'
                }`}
              />
              <span className="truncate">Report Center</span>
            </div>
            {reportCenterOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {reportCenterOpen && (
            <div className="space-y-0.5 pt-0.5">
              <button
                type="button"
                id="nav-bou-report"
                onClick={() => onNavigate('BOU Report')}
                className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                  currentNav === 'BOU Report'
                    ? 'text-[#FF6B11] font-medium bg-orange-50/50'
                    : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                }`}
              >
                <span className="truncate">BOU Report</span>
                {currentNav === 'BOU Report' && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                )}
              </button>
              <button
                type="button"
                id="nav-cou-report"
                onClick={() => onNavigate('COU Report')}
                className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                  currentNav === 'COU Report'
                    ? 'text-[#FF6B11] font-medium bg-orange-50/50'
                    : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                }`}
              >
                <span className="truncate">COU Report</span>
                {currentNav === 'COU Report' && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* 6. Reconciliation */}
        <div>
          <button
            type="button"
            id="nav-reconciliation"
            onClick={() => setReconciliationOpen(!reconciliationOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
              isReconciliationActive
                ? 'text-[#FF6B11] font-medium'
                : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw
                className={`w-4 h-4 shrink-0 ${
                  isReconciliationActive ? 'text-[#FF6B11]' : 'text-slate-500'
                }`}
              />
              <span className="truncate">Reconciliation</span>
            </div>
            {reconciliationOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {reconciliationOpen && (
            <div className="space-y-0.5 pt-0.5">
              <button
                type="button"
                id="nav-bou-reconciliation"
                onClick={() => onNavigate('BOU Reconciliation')}
                className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                  currentNav === 'BOU Reconciliation'
                    ? 'text-[#FF6B11] font-medium bg-orange-50/50'
                    : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                }`}
              >
                <span className="truncate">BOU Reconciliation</span>
                {currentNav === 'BOU Reconciliation' && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                )}
              </button>
              <button
                type="button"
                id="nav-cou-reconciliation"
                onClick={() => onNavigate('COU Reconciliation')}
                className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors relative ${
                  currentNav === 'COU Reconciliation'
                    ? 'text-[#FF6B11] font-medium bg-orange-50/50'
                    : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
                }`}
              >
                <span className="truncate">COU Reconciliation</span>
                {currentNav === 'COU Reconciliation' && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* 7. Fee Configuration */}
        <a
          href="https://analytics.isampurna.com/commission/login"
          target="_blank"
          rel="noopener noreferrer"
          id="nav-fee-configuration"
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50 transition-colors cursor-pointer"
          title="Fee Configuration (https://analytics.isampurna.com/commission/login)"
        >
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="truncate">Fee Configuration</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        </a>

        {/* 8. Ad-hoc Reports */}
        <button
          type="button"
          id="nav-adhoc-reports"
          onClick={() => onNavigate('Ad-hoc Reports')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
            currentNav === 'Ad-hoc Reports'
              ? 'text-[#FF6B11] font-medium'
              : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet
              className={`w-4 h-4 shrink-0 ${
                currentNav === 'Ad-hoc Reports'
                  ? 'text-[#FF6B11]'
                  : 'text-slate-500'
              }`}
            />
            <span className="truncate">Ad-hoc Reports</span>
          </div>
          {currentNav === 'Ad-hoc Reports' && (
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
          )}
        </button>

        {/* 9. Autopay Management [NEW] - Hidden for Maker and Checker */}
        {!isMaker && !isChecker && (
          <button
            type="button"
            id="nav-autopay-management"
            onClick={() => onNavigate('Autopay Management')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] whitespace-nowrap transition-colors relative ${
              currentNav === 'Autopay Management'
                ? 'text-[#FF6B11] font-medium bg-orange-50/50'
                : 'text-slate-600 hover:text-[#FF6B11] hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <RotateCcw
                className={`w-4 h-4 shrink-0 ${
                  currentNav === 'Autopay Management'
                    ? 'text-[#FF6B11]'
                    : 'text-slate-500'
                }`}
              />
              <span className="truncate">Autopay Management</span>
              <span className="bg-[#FF6B11] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                NEW
              </span>
            </div>
            {currentNav === 'Autopay Management' && (
              <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#FF6B11]" />
            )}
          </button>
        )}
      </nav>
    </aside>
  );
};

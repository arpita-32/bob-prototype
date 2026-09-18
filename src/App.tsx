import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { COUReportView } from './components/COUReportView';
import { BOUReportView } from './components/BOUReportView';
import { COUReconciliationView } from './components/COUReconciliationView';
import { BOUReconciliationView } from './components/BOUReconciliationView';
import { GenericReportView } from './components/OtherViews';
import { CreateAgentView } from './components/Agent/CreateAgentView';
import { AgentListView } from './components/Agent/AgentListView';
import { AgentDetailsView } from './components/Agent/AgentDetailsView';
import { AutopayManagementView } from './components/Autopay/AutopayManagementView';
import { CreateNewBillerView } from './components/Biller/CreateNewBillerView';
import { BillerListView } from './components/Biller/BillerListView';
import { BillerDetailsListView } from './components/Biller/BillerDetailsListView';
import { BillerVerificationView } from './components/Biller/BillerVerificationView';
import { BillerManagementView } from './components/Biller/BillerManagementView';
import { AdHocReportsView } from './components/AdHocReports/AdHocReportsView';
import { UserManagementView } from './components/Admin/UserManagementView';
import { UpdateBankUserView } from './components/Admin/UpdateBankUserView';
import { MakerDashboardView } from './components/Maker/MakerDashboardView';
import { BillerPortalView } from './components/BillerPortal/BillerPortalView';
import { EmailSimulationModal } from './components/EmailSimulationModal';
import { DemoWorkflowBar } from './components/DemoWorkflowBar';
import {
  AgentEntity,
  BillerEntity,
  ChannelOption,
  NavItem,
  AuthUser,
  ManagedUser,
  BillerCredentials,
  UserRole,
} from './types';
import {
  mockAgentEntities,
  mockBillersList,
  SYSTEM_USERS,
  initialManagedUsers,
  initialBillerCredentials,
} from './data/mockData';
import { ShieldCheck, LogOut, UserCheck } from 'lucide-react';

export default function App() {
  // Authentication State: Defaults directly to Maker for instant demo workflow access
  const [currentUser, setCurrentUser] = useState<AuthUser>(SYSTEM_USERS[0].user);
  const [currentNav, setCurrentNav] = useState<NavItem>('Dashboard');
  const [selectedChannel, setSelectedChannel] = useState<ChannelOption>('All');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Admin Module: Managed Users (Maker & Checker Users)
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(initialManagedUsers);

  // Agent State
  const [agentsList, setAgentsList] = useState<AgentEntity[]>(mockAgentEntities);
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);

  // Biller State
  const [billersList, setBillersList] = useState<BillerEntity[]>(mockBillersList);
  const [activeBillerForPortal, setActiveBillerForPortal] = useState<BillerEntity>(mockBillersList[0]);

  // Email Simulation Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activeEmailCredentials, setActiveEmailCredentials] = useState<BillerCredentials>(
    initialBillerCredentials[0]
  );

  // Biller Portal Active View State
  const [isBillerPortalOpen, setIsBillerPortalOpen] = useState(false);

  const handleNavigate = (nav: NavItem, agentParam?: AgentEntity) => {
    if (nav === 'Fee Configuration') {
      window.open('https://analytics.isampurna.com/commission/login', '_blank');
      return;
    }
    if (agentParam) {
      setSelectedAgent(agentParam);
    } else if (nav === 'AI Details' || nav === 'Agent / AI Details') {
      setSelectedAgent(null);
    }
    setCurrentNav(nav);
  };

  const handleAgentCreated = (newAgent: AgentEntity) => {
    setAgentsList((prev) => [newAgent, ...prev]);
    setSelectedAgent(newAgent);
  };

  const handleUpdateAgent = (updatedAgent: AgentEntity) => {
    setAgentsList((prev) =>
      prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
    );
    setSelectedAgent(updatedAgent);
  };

  const handleBillerCreated = (newBiller: BillerEntity) => {
    setBillersList((prev) => [newBiller, ...prev]);
    setActiveBillerForPortal(newBiller);

    // Auto-prepare credentials for email simulation
    const creds: BillerCredentials = {
      billerId: newBiller.billerId,
      billerName: newBiller.billerName,
      username: newBiller.userName || newBiller.billerId,
      tempPassword: 'Biller@2026',
      email: newBiller.emailId || 'biller@domain.com',
      createdDate: newBiller.createdDate || '31/08/2026',
    };
    setActiveEmailCredentials(creds);
  };

  const handleUpdateBiller = (updatedBiller: BillerEntity) => {
    setBillersList((prev) =>
      prev.map((b) => (b.id === updatedBiller.id ? updatedBiller : b))
    );
    if (activeBillerForPortal.id === updatedBiller.id) {
      setActiveBillerForPortal(updatedBiller);
    }
  };

  // Admin User Management Actions
  const handleCreateUser = (newUser: ManagedUser) => {
    setManagedUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: ManagedUser) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          return { ...u, status: newStatus as 'Active' | 'Inactive' };
        }
        return u;
      })
    );
  };

  const handleLogout = () => {
    // Reset to default Maker role for seamless demo restart
    setCurrentUser(SYSTEM_USERS[0].user);
    setCurrentNav('Dashboard');
    setShowProfileModal(false);
    setIsBillerPortalOpen(false);
  };

  const handleSwitchUser = (user: AuthUser) => {
    setCurrentUser(user);
    setShowProfileModal(false);
    if (user.role === 'Biller') {
      setIsBillerPortalOpen(true);
    } else {
      setIsBillerPortalOpen(false);
      if (user.role === 'Maker') {
        setCurrentNav('Dashboard');
      } else if (user.role === 'Checker') {
        setCurrentNav('Biller Verification');
      } else if (user.role === 'Admin') {
        setCurrentNav('User Management');
      }
    }
  };

  const handleSwitchRole = (role: UserRole) => {
    if (role === 'Biller') {
      setIsBillerPortalOpen(true);
      return;
    }

    setIsBillerPortalOpen(false);
    const targetUser = SYSTEM_USERS.find((s) => s.user.role === role)?.user;
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'Maker') {
        setCurrentNav('Dashboard');
      } else if (role === 'Checker') {
        setCurrentNav('Biller Verification');
      } else if (role === 'Admin') {
        setCurrentNav('User Management');
      }
    }
  };

  const handleOpenEmailSimulation = (credentials?: BillerCredentials) => {
    if (credentials) {
      setActiveEmailCredentials(credentials);
    }
    setEmailModalOpen(true);
  };

  const handleOpenBillerPortalFromEmail = (billerId: string, _username: string) => {
    const foundBiller = billersList.find((b) => b.billerId === billerId) || billersList[0];
    setActiveBillerForPortal(foundBiller);
    setIsBillerPortalOpen(true);
  };

  // If Biller Portal is open or current role is Biller, render the dedicated Biller Portal View
  if (isBillerPortalOpen || currentUser.role === 'Biller') {
    return (
      <div className="min-h-screen flex flex-col">
        <DemoWorkflowBar
          currentRole={currentUser.role}
          isBillerPortalOpen={true}
          onSwitchRole={handleSwitchRole}
          onOpenBillerPortal={() => setIsBillerPortalOpen(true)}
          onOpenEmailSimulation={() => handleOpenEmailSimulation()}
        />
        <BillerPortalView
          biller={activeBillerForPortal}
          currentUser={currentUser}
          onUpdateBiller={handleUpdateBiller}
          onExitPortal={() => {
            setIsBillerPortalOpen(false);
            if (currentUser.role === 'Biller') {
              handleSwitchRole('Checker');
            }
          }}
        />

        {/* Simulated Email Modal */}
        <EmailSimulationModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          credentials={activeEmailCredentials}
          onOpenBillerPortal={handleOpenBillerPortalFromEmail}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-700 font-['Public_Sans',sans-serif]">
      {/* Top Demo Workflow Step Guide Bar */}
      <DemoWorkflowBar
        currentRole={currentUser.role}
        isBillerPortalOpen={false}
        onSwitchRole={handleSwitchRole}
        onOpenBillerPortal={() => setIsBillerPortalOpen(true)}
        onOpenEmailSimulation={() => handleOpenEmailSimulation()}
      />

      {/* Top Bank of Baroda Header */}
      <Header
        currentUser={currentUser}
        onProfileClick={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentNav={currentNav}
          onNavigate={(nav) => handleNavigate(nav)}
          currentUser={currentUser}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          {/* Dashboard Route: Maker gets MakerDashboardView, Admin/Default gets DashboardView */}
          {currentNav === 'Dashboard' && (
            currentUser.role === 'Maker' ? (
              <MakerDashboardView
                billers={billersList}
                onNavigate={handleNavigate}
                onOpenEmailSimulation={handleOpenEmailSimulation}
                onOpenBillerDetails={(biller) => {
                  setActiveBillerForPortal(biller);
                  handleNavigate('Biller Details');
                }}
              />
            ) : (
              <DashboardView
                channel={selectedChannel}
                onChannelChange={setSelectedChannel}
              />
            )
          )}

          {/* Admin User Management Routes */}
          {(currentNav === 'User Management' ||
            currentNav === 'Create New User' ||
            currentNav === 'Verify User') && (
            <UserManagementView
              users={managedUsers}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onToggleStatus={handleToggleUserStatus}
              initialTab={currentNav === 'Verify User' ? 'verify' : 'create'}
              onNavigate={handleNavigate}
            />
          )}

          {/* Admin User Management: Update Bank User Screen */}
          {currentNav === 'Update Bank User' && (
            <UpdateBankUserView
              users={managedUsers}
              onUpdateUser={handleUpdateUser}
              onNavigate={handleNavigate}
            />
          )}

          {/* AI Agent Module Views */}
          {(currentNav === 'Agent' || currentNav === 'Agent / AI List' || currentNav === 'AI List') && (
            <AgentListView
              agentsList={agentsList}
              onNavigate={handleNavigate}
              onUpdateAgent={handleUpdateAgent}
            />
          )}

          {(currentNav === 'Create Agent / AI' || currentNav === 'Create AI') && (
            <CreateAgentView
              onNavigate={handleNavigate}
              onAgentCreated={handleAgentCreated}
              agentsList={agentsList}
              onUpdateAgent={handleUpdateAgent}
            />
          )}

          {(currentNav === 'Agent / AI Details' || currentNav === 'AI Details') && (
            <AgentDetailsView
              agent={selectedAgent}
              agentsList={agentsList}
              onNavigate={handleNavigate}
              onUpdateAgent={handleUpdateAgent}
            />
          )}

          {/* Autopay Management Module View */}
          {currentNav === 'Autopay Management' && (
            <AutopayManagementView />
          )}

          {currentNav === 'COU Report' && (
            <COUReportView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

          {currentNav === 'COU Reconciliation' && (
            <COUReconciliationView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

          {currentNav === 'BOU Report' && (
            <BOUReportView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

          {currentNav === 'BOU Reconciliation' && (
            <BOUReconciliationView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

          {currentNav === 'Transaction Summary' && (
            <GenericReportView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
              title="Transaction Summary"
              category="Analytics"
            />
          )}

          {/* Biller Module Views */}
          {currentNav === 'Biller' && (
            currentUser.role === 'Maker' ? (
              <BillerListView
                billersList={billersList}
                onNavigate={handleNavigate}
                onUpdateBiller={handleUpdateBiller}
              />
            ) : currentUser.role === 'Checker' ? (
              <BillerVerificationView
                onNavigate={handleNavigate}
                billersList={billersList}
                onUpdateBiller={handleUpdateBiller}
              />
            ) : (
              <BillerManagementView onNavigate={handleNavigate} />
            )
          )}

          {currentNav === 'Create New Biller' && (
            <CreateNewBillerView
              onNavigate={handleNavigate}
              onBillerCreated={handleBillerCreated}
              onOpenEmailSimulation={handleOpenEmailSimulation}
            />
          )}

          {currentNav === 'Biller List' && (
            <BillerListView
              billersList={billersList}
              onNavigate={handleNavigate}
              onUpdateBiller={handleUpdateBiller}
              hideAction={currentUser.role === 'Checker' || currentUser.role === 'Admin'}
            />
          )}

          {currentNav === 'Biller Details' && (
            <BillerDetailsListView
              billersList={billersList}
              onNavigate={handleNavigate}
              onUpdateBiller={handleUpdateBiller}
              hideUpdateDetails={currentUser.role === 'Admin'}
            />
          )}

          {currentNav === 'Biller Verification' && (
            <BillerVerificationView
              onNavigate={handleNavigate}
              billersList={billersList}
              onUpdateBiller={handleUpdateBiller}
            />
          )}

          {/* Ad-hoc Reports View */}
          {currentNav === 'Ad-hoc Reports' && (
            <AdHocReportsView
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}

        </main>
      </div>

      {/* Simulated Email Modal */}
      <EmailSimulationModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        credentials={activeEmailCredentials}
        onOpenBillerPortal={handleOpenBillerPortalFromEmail}
      />

      {/* Profile Dialog */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full ring-4 ring-[#FF6B11] overflow-hidden">
              <img
                src={
                  currentUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="font-semibold text-slate-800 text-base">{currentUser.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentUser.role === 'Admin'
                      ? 'bg-orange-50 text-[#FF6B11] border-orange-200'
                      : currentUser.role === 'Maker'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : currentUser.role === 'Biller'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.roleTitle}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentUser.department}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">Emp ID: {currentUser.employeeId}</p>
              <p className="text-xs text-[#FF6B11] font-medium mt-1">{currentUser.email}</p>
            </div>

            {/* Quick Switch Role Option in Modal */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Switch User Role
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SYSTEM_USERS.map((sys) => (
                  <button
                    key={sys.user.role}
                    type="button"
                    onClick={() => handleSwitchUser(sys.user)}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                      currentUser.role === sys.user.role
                        ? 'bg-[#FF6B11] text-white border-[#FF6B11]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50'
                    }`}
                  >
                    {sys.user.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-1.5 px-3 bg-[#FF6B11] text-white text-xs font-medium rounded hover:bg-[#e05a07] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

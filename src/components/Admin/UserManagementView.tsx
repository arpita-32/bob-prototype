import React, { useState } from 'react';
import {
  UserPlus,
  Calendar,
  Search,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  CheckCircle2,
  XCircle,
  X,
  Check,
} from 'lucide-react';
import { ManagedUser, NavItem } from '../../types';
import { CreateUserModal } from './CreateUserModal';
import { UserCreatedSuccessModal } from './UserCreatedSuccessModal';
import { VerifyUserDetailView } from './VerifyUserDetailView';

interface UserManagementViewProps {
  users: ManagedUser[];
  onCreateUser: (user: ManagedUser) => void;
  onUpdateUser: (user: ManagedUser) => void;
  onToggleStatus: (userId: string) => void;
  initialTab?: 'create' | 'verify';
  onNavigate?: (nav: NavItem) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onCreateUser,
  onUpdateUser,
  initialTab = 'create',
  onNavigate,
}) => {
  // Screen Mode: 'list' | 'verify'
  const [activeScreen, setActiveScreen] = useState<'list' | 'verify'>(
    initialTab === 'verify' ? 'verify' : 'list'
  );
  const [selectedUserForVerify, setSelectedUserForVerify] = useState<ManagedUser | null>(
    users.find((u) => u.verificationStatus === 'Pending' || u.status === 'Pending') || users[0] || null
  );

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown menu state
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    desc: string;
    type: 'success' | 'danger';
  } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter application
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedStatusFilter(statusFilter);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('All');
    setAppliedStatusFilter('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filtered and searched users
  const filteredUsers = users.filter((user) => {
    // Status filter
    if (appliedStatusFilter !== 'All') {
      const normalizedStatus = user.status || 'Active';
      if (
        appliedStatusFilter === 'Pending' &&
        user.verificationStatus !== 'Pending' &&
        user.status !== 'Pending'
      ) {
        return false;
      }
      if (
        appliedStatusFilter === 'Active' &&
        (user.status !== 'Active' || user.verificationStatus === 'Rejected')
      ) {
        return false;
      }
      if (
        appliedStatusFilter === 'Deactivated' &&
        user.status !== 'Deactivated' &&
        user.status !== 'Inactive' &&
        user.verificationStatus !== 'Rejected'
      ) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (user.fullName || '').toLowerCase().includes(q);
      const matchUsername = (user.username || '').toLowerCase().includes(q);
      const matchEmail = (user.email || '').toLowerCase().includes(q);
      const matchMobile = (user.mobile || '').toLowerCase().includes(q);
      const matchRole = (user.role || '').toLowerCase().includes(q);
      const matchEmp = (user.employeeId || '').toLowerCase().includes(q);
      if (!matchName && !matchUsername && !matchEmail && !matchMobile && !matchRole && !matchEmp) {
        return false;
      }
    }

    return true;
  });

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  // User Creation handler
  const handleUserCreated = (newUser: ManagedUser) => {
    onCreateUser(newUser);
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
    showToast(
      'User Created Successfully',
      `User ${newUser.username} (${newUser.fullName}) has been registered and is pending verification.`,
      'success'
    );
  };

  // Navigate to Verify User detail screen
  const handleShowDetails = (user: ManagedUser) => {
    setSelectedUserForVerify(user);
    setActiveActionMenuId(null);
    setActiveScreen('verify');
  };

  // Approve User
  const handleApproveUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedUser: ManagedUser = {
      ...user,
      status: 'Active',
      verificationStatus: 'Approved',
      verifiedBy: 'BOB_ADMIN',
      verifiedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.'),
    };

    onUpdateUser(updatedUser);
    showToast(
      'User Approved Successfully',
      `User ${user.fullName || user.username} has been approved and activated.`,
      'success'
    );
    setActiveScreen('list');
  };

  // Reject User
  const handleRejectUser = (userId: string, reason: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedUser: ManagedUser = {
      ...user,
      status: 'Deactivated',
      verificationStatus: 'Rejected',
      rejectionReason: reason,
      verifiedBy: 'BOB_ADMIN',
      verifiedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.'),
    };

    onUpdateUser(updatedUser);
    showToast(
      'User Rejected',
      `User ${user.fullName || user.username} has been rejected and deactivated.`,
      'danger'
    );
    setActiveScreen('list');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['S. No.', 'User Role', 'User ID', 'Created By', 'Mobile Number', 'Email ID', 'Status'];
    const csvRows = [headers.join(',')];

    filteredUsers.forEach((u, idx) => {
      const row = [
        idx + 1,
        `"${u.role || 'Admin'}"`,
        `"${u.username || 'BOB192'}"`,
        `"${u.createdBy || 'BOB_ADMIN'}"`,
        `"${u.mobile || ''}"`,
        `"${u.email || ''}"`,
        `"${u.status || 'Active'}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `User_Management_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
    showToast('Export CSV', 'User list exported successfully as CSV.', 'success');
  };

  // Helper for Status Badge matching screenshot exactly
  const renderStatusBadge = (user: ManagedUser) => {
    let statusLabel = user.status || 'Active';
    if (user.verificationStatus === 'Pending' || statusLabel === 'Pending') {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-medium border border-amber-500 text-amber-600 bg-amber-50/20">
          Pending
        </span>
      );
    }
    if (
      user.verificationStatus === 'Rejected' ||
      statusLabel === 'Deactivated' ||
      statusLabel === 'Inactive'
    ) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-medium border border-rose-500 text-rose-600 bg-rose-50/20">
          Deactivated
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500 text-emerald-600 bg-emerald-50/20">
        Active
      </span>
    );
  };

  // If in Verify User screen, render dedicated verify details view
  if (activeScreen === 'verify' && selectedUserForVerify) {
    return (
      <VerifyUserDetailView
        user={selectedUserForVerify}
        onApprove={handleApproveUser}
        onReject={handleRejectUser}
        onBack={() => {
          setActiveScreen('list');
        }}
      />
    );
  }

  return (
    <div id="user-management-screen" className="p-6 max-w-full font-sans select-none space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              toastMessage.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <X className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </div>
          <div>
            <div className="font-semibold text-xs">{toastMessage.title}</div>
            <div className="text-[11px] opacity-90 mt-0.5">{toastMessage.desc}</div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header: Title and + Create User Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          User Management / Create and View User
        </h1>

        {/* + Create User Button with Orange Border and Orange Text as in Screenshot 1 */}
        <button
          type="button"
          id="open-create-user-modal-button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 bg-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create User</span>
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          {/* Start Date */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Start Date
            </label>
            <div className="relative">
              <input
                type="text"
                id="filter-start-date"
                placeholder="DD/MM/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              End Date
            </label>
            <div className="relative">
              <input
                type="text"
                id="filter-end-date"
                placeholder="DD/MM/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* User Status */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              User Status
            </label>
            <div className="relative">
              <select
                id="filter-user-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] text-slate-700 bg-white appearance-none cursor-pointer pr-8"
              >
                <option value="All">Select User Status</option>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex items-center gap-4 pb-0.5">
            <button
              type="submit"
              id="filter-submit-button"
              className="px-6 py-2 bg-[#FF6B11] hover:bg-[#e35a05] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
            >
              Submit
            </button>
            <button
              type="button"
              id="filter-reset-button"
              onClick={handleFilterReset}
              className="text-xs font-medium text-[#FF6B11] hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Search & Export Row */}
      <div className="flex items-center justify-between pt-1">
        {/* Search here... */}
        <div className="relative w-80">
          <input
            type="text"
            id="table-search-input"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs px-3 py-2 pr-9 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] placeholder:text-slate-400 text-slate-700 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Export as CSV */}
        <button
          type="button"
          id="export-csv-button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-[#FF6B11] text-[#FF6B11] hover:bg-orange-50 bg-white text-xs font-medium rounded transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export as CSV</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 bg-white">
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>S. No.</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>User Role</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>User ID</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Created By</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Mobile Number</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Email ID</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Action</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No users found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => {
                  const sNo = startIndex + index + 1;
                  const isMenuOpen = activeActionMenuId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => handleShowDetails(user)}
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {sNo}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {user.role || 'Admin'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono">
                        {user.username || 'BOB192'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {user.createdBy || 'BOB_ADMIN'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {user.mobile || '+91 92826 28929'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {user.email || 'johndoe@gmail.com'}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(user)}
                      </td>
                      <td
                        className="py-3.5 px-4 text-center relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-block text-left relative">
                          <button
                            type="button"
                            id={`action-menu-btn-${user.id}`}
                            onClick={() =>
                              setActiveActionMenuId(isMenuOpen ? null : user.id)
                            }
                            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Menu Dropdown */}
                          {isMenuOpen && (
                            <div
                              className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                id={`action-show-details-${user.id}`}
                                onClick={() => handleShowDetails(user)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-[#FF6B11] text-left transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#FF6B11]" />
                                <span>Show Details</span>
                              </button>
                              <button
                                type="button"
                                id={`action-update-user-${user.id}`}
                                onClick={() => {
                                  setActiveActionMenuId(null);
                                  onNavigate?.('Update Bank User');
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-[#FF6B11] text-left transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5 text-[#FF6B11]" />
                                <span>Update User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Rows per page & Pagination Controls matching Screenshot 1 */}
        <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              id="rows-per-page-select"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#FF6B11] bg-white cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {totalItems === 0
                ? '0-0 of 0'
                : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, totalItems)} of ${totalItems}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                id="pagination-prev-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="pagination-next-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Create User Modal Popup */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleUserCreated}
      />

      {/* 2. User Created Successfully Modal Popup */}
      <UserCreatedSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

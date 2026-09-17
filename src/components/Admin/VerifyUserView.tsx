import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  Building2,
  Mail,
  Phone,
  Check,
  X,
  Eye,
  RotateCcw,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { ManagedUser } from '../../types';

interface VerifyUserViewProps {
  users: ManagedUser[];
  onApproveUser: (userId: string, checkerRemarks?: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
  onToggleStatus: (userId: string) => void;
  onNavigateTab: (tab: 'create' | 'verify') => void;
}

export const VerifyUserView: React.FC<VerifyUserViewProps> = ({
  users,
  onApproveUser,
  onRejectUser,
  onToggleStatus,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Maker' | 'Checker' | 'Admin'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Verification Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [checkerRemarks, setCheckerRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleOpenReviewModal = (user: ManagedUser) => {
    setSelectedUser(user);
    setCheckerRemarks('Verified user credentials, department authorization, and KYC compliance.');
    setRejectionReason('');
    setIsRejecting(false);
    setModalError(null);
    setReviewModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedUser) return;
    onApproveUser(selectedUser.id, checkerRemarks);
    setReviewModalOpen(false);
    showToast(
      'User Approved Successfully',
      `User ${selectedUser.fullName} (${selectedUser.username}) has been verified and activated with ${selectedUser.role} role.`,
      'success'
    );
  };

  const handleConfirmRejection = () => {
    if (!selectedUser) return;
    if (!rejectionReason.trim()) {
      setModalError('Please specify the reason for rejection.');
      return;
    }
    onRejectUser(selectedUser.id, rejectionReason.trim());
    setReviewModalOpen(false);
    showToast(
      'User Request Rejected',
      `User creation request for ${selectedUser.fullName} (${selectedUser.username}) was rejected.`,
      'danger'
    );
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.mobile.includes(query) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(query));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    let matchesStatus = true;
    if (statusFilter === 'Pending') {
      matchesStatus = u.verificationStatus === 'Pending' || u.status === 'Pending Verification';
    } else if (statusFilter === 'Approved') {
      matchesStatus = u.verificationStatus === 'Approved' || (u.status === 'Active' && u.verificationStatus !== 'Rejected');
    } else if (statusFilter === 'Rejected') {
      matchesStatus = u.verificationStatus === 'Rejected';
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingUsers = users.filter(
    (u) => u.verificationStatus === 'Pending' || u.status === 'Pending Verification'
  );
  const approvedUsers = users.filter(
    (u) => u.verificationStatus === 'Approved' || (u.status === 'Active' && u.verificationStatus !== 'Pending')
  );
  const rejectedUsers = users.filter((u) => u.verificationStatus === 'Rejected');

  return (
    <div id="verify-user-view" className="p-6 max-w-[1600px] mx-auto space-y-5 select-none font-sans">
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

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs text-slate-500 font-normal flex items-center gap-1.5">
            <span>Admin</span>
            <span className="text-slate-400">/</span>
            <span>User Management</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#FF6B11] font-semibold">Verify User</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Verify User (Checker Verification)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, verify, and approve pending Maker and Checker user registration requests under dual control security.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            type="button"
            id="tab-btn-create-user"
            onClick={() => onNavigateTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>

          <button
            type="button"
            id="tab-btn-verify-user"
            onClick={() => onNavigateTab('verify')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-[#FF6B11] text-white shadow-xs transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verify User</span>
            {pendingUsers.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Pending Verification Card */}
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-2xs ${
            statusFilter === 'Pending'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Verification</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-600">{pendingUsers.length}</span>
            {pendingUsers.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Action Required
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Awaiting Checker Approval</span>
        </div>

        {/* Approved Users Card */}
        <div
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-2xs ${
            statusFilter === 'Approved'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved & Active</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{approvedUsers.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Operational in System</span>
        </div>

        {/* Rejected Users Card */}
        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-2xs ${
            statusFilter === 'Rejected'
              ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rejected Requests</span>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{rejectedUsers.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Audit Rejected</span>
        </div>

        {/* Total Users Card */}
        <div
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-2xs ${
            statusFilter === 'All'
              ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total System Users</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{users.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All Records in Database</span>
        </div>
      </div>

      {/* Main Verification Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by User ID, Name, Email, Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Buttons */}
            <div className="flex items-center bg-white border border-slate-200 rounded p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Pending')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'Pending' ? 'bg-amber-600 text-white font-bold' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Pending ({pendingUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Approved')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'Approved' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Approved ({approvedUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Rejected')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'Rejected' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Rejected ({rejectedUsers.length})
              </button>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Maker">Maker</option>
                <option value="Checker">Checker</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">User ID / Staff No</th>
                <th className="py-3 px-4">Requested Role</th>
                <th className="py-3 px-4">Department & Zone</th>
                <th className="py-3 px-4">Created By / Date</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No user verification records found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const isPending =
                    user.verificationStatus === 'Pending' || user.status === 'Pending Verification';
                  const isApproved =
                    user.verificationStatus === 'Approved' ||
                    (user.status === 'Active' && user.verificationStatus !== 'Rejected');
                  const isRejected = user.verificationStatus === 'Rejected';

                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${
                        isPending ? 'bg-amber-50/20 hover:bg-amber-50/50' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{index + 1}</td>

                      {/* User Details */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-800 text-[12.5px]">
                            {user.fullName}
                          </span>
                          <div className="flex items-center gap-2.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {user.mobile}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-800">{user.username}</div>
                        {user.employeeId && (
                          <div className="text-[10.5px] text-slate-400 mt-0.5">{user.employeeId}</div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                            user.role === 'Admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : user.role === 'Maker'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-orange-50 text-[#FF6B11] border-orange-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Department & Zone */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium text-[11.5px]">
                          {user.department || 'Digital Banking Operations'}
                        </div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">
                          {user.zone || 'Corporate Centre Mumbai'}
                        </div>
                      </td>

                      {/* Created By & Date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        <div className="font-medium text-slate-700">
                          {user.createdBy || 'Biswanath Admin'}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {user.createdDate} {user.createdTime ? `• ${user.createdTime}` : ''}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Verification</span>
                          </span>
                        ) : isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved / Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        {isPending ? (
                          <button
                            type="button"
                            id={`btn-verify-user-${user.id}`}
                            onClick={() => handleOpenReviewModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-[11.5px] font-bold rounded shadow-xs transition-all cursor-pointer"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Verify User</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-medium rounded transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>View Details</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verification Modal */}
      {reviewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FF6B11] text-white flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Checker Verification & Dual Control Review</h3>
                  <p className="text-[11px] text-slate-300">
                    Review and authorize user registration for Bank of Baroda BBPS System
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Status Banner */}
              <div
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  selectedUser.verificationStatus === 'Pending' ||
                  selectedUser.status === 'Pending Verification'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : selectedUser.verificationStatus === 'Approved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">
                    Current Status:{' '}
                    {selectedUser.verificationStatus === 'Pending'
                      ? 'Pending Checker Verification'
                      : selectedUser.verificationStatus || selectedUser.status}
                  </span>
                </div>
                <span className="text-[11px] font-mono">ID: {selectedUser.id}</span>
              </div>

              {/* Grid 1: Basic Identity & Role */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. User Identification & Role Profile
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Full Name</span>
                    <span className="font-bold text-slate-900 text-[13px]">{selectedUser.fullName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">User ID / Login ID</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                      {selectedUser.username}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Requested Role</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border mt-0.5 ${
                        selectedUser.role === 'Maker'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : selectedUser.role === 'Checker'
                          ? 'bg-orange-50 text-[#FF6B11] border-orange-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {selectedUser.role} Role
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Email Address</span>
                    <span className="font-medium text-slate-800 break-all">{selectedUser.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Mobile Number</span>
                    <span className="font-medium text-slate-800">+91 {selectedUser.mobile}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Staff Employee ID</span>
                    <span className="font-mono text-slate-800">{selectedUser.employeeId || 'BOB-EMP-8821'}</span>
                  </div>
                </div>
              </div>

              {/* Grid 2: Organization & Permissions */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Organization & Channel Permissions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Department</span>
                    <span className="font-medium text-slate-800">
                      {selectedUser.department || 'Digital Banking Operations'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Zone / Region</span>
                    <span className="font-medium text-slate-800">
                      {selectedUser.zone || 'Corporate Centre Mumbai'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Branch / Office</span>
                    <span className="font-medium text-slate-800">
                      {selectedUser.branchCode || 'HO-MUMBAI-01'}
                    </span>
                  </div>
                </div>

                {/* Channel Chips */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 text-[11px] block mb-1.5">Authorized Modules / Channels</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedUser.channelAccess && selectedUser.channelAccess.length > 0
                      ? selectedUser.channelAccess
                      : ['Internet Banking (Post-login)', 'Mobile Banking (Bob World)', 'UPI (BHIM Baroda Pay)']
                    ).map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[11px] rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Maker Audit Trail */}
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-amber-900 font-semibold">
                  <span>Maker Creation Audit Details</span>
                  <span>{selectedUser.createdDate} {selectedUser.createdTime ? `• ${selectedUser.createdTime}` : ''}</span>
                </div>
                <div className="text-slate-600 text-[11.5px]">
                  <strong>Initiated By:</strong> {selectedUser.createdBy || 'Biswanath Admin'}
                </div>
                {selectedUser.remarks && (
                  <div className="text-slate-600 text-[11.5px]">
                    <strong>Maker Notes:</strong> {selectedUser.remarks}
                  </div>
                )}
              </div>

              {/* If already rejected, show rejection reasons */}
              {selectedUser.rejectionReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Rejection Reason:</span>
                  </div>
                  <div className="text-[11.5px]">{selectedUser.rejectionReason}</div>
                </div>
              )}

              {/* Action Form for Verification */}
              {selectedUser.verificationStatus === 'Pending' ||
              selectedUser.status === 'Pending Verification' ? (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  {!isRejecting ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Checker Verification Remarks / Approval Notes
                      </label>
                      <input
                        type="text"
                        value={checkerRemarks}
                        onChange={(e) => setCheckerRemarks(e.target.value)}
                        placeholder="e.g. Verified employee records and zonal clearance. Approved."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-[#FF6B11]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-rose-700 mb-1">
                        Specify Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="State reason for rejecting user onboarding (e.g. Invalid department assignment, Duplicate staff ID)..."
                        className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded text-slate-800 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}

                  {/* Dual Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {!isRejecting ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsRejecting(true)}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded transition-colors cursor-pointer"
                        >
                          Reject Request
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setReviewModalOpen(false)}
                            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            id="btn-confirm-approve-user"
                            onClick={handleConfirmApproval}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Activate User</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsRejecting(false)}
                          className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded transition-colors cursor-pointer"
                        >
                          Back to Approval
                        </button>

                        <button
                          type="button"
                          id="btn-confirm-reject-user"
                          onClick={handleConfirmRejection}
                          className="px-6 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Confirm Rejection</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

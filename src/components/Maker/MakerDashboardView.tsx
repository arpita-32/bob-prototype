import React, { useState } from 'react';
import {
  UserPlus,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { BillerEntity, NavItem, BillerCredentials } from '../../types';

interface MakerDashboardViewProps {
  billers: BillerEntity[];
  onNavigate: (nav: NavItem) => void;
  onOpenEmailSimulation: (credentials: BillerCredentials) => void;
  onOpenBillerDetails: (biller: BillerEntity) => void;
}

export const MakerDashboardView: React.FC<MakerDashboardViewProps> = ({
  billers,
  onNavigate,
  onOpenEmailSimulation,
  onOpenBillerDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const totalBillers = billers.length;
  const pendingKycCount = billers.filter(
    (b) => b.kycStatus === 'Created' || b.kycStatus === 'Pending Verification'
  ).length;
  const underReviewCount = billers.filter(
    (b) => b.kycStatus === 'Under Review' || b.status === 'Pending Verification'
  ).length;
  const approvedCount = billers.filter(
    (b) => b.kycStatus === 'Approved' || b.status === 'Live'
  ).length;
  const rejectedCount = billers.filter(
    (b) => b.kycStatus === 'Rejected' || b.status === 'Rejected'
  ).length;

  const filteredBillers = billers.filter((b) => {
    const matchesSearch =
      b.billerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.billerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.mobileNumber && b.mobileNumber.includes(searchQuery));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending KYC' &&
        (b.kycStatus === 'Created' || b.kycStatus === 'Pending Verification')) ||
      (statusFilter === 'Under Review' && b.kycStatus === 'Under Review') ||
      (statusFilter === 'Approved' &&
        (b.kycStatus === 'Approved' || b.status === 'Live')) ||
      (statusFilter === 'Rejected' &&
        (b.kycStatus === 'Rejected' || b.status === 'Rejected'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="maker-dashboard-view" className="p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-normal">
            <span>Maker</span>
            <span className="mx-1.5 text-slate-400">/</span>
            <span className="text-slate-700 font-medium">Biller Onboarding Dashboard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Maker Operations & Onboarding
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Initiate new Biller registrations, send KYC email invitations, and track approval status.
          </p>
        </div>

        <button
          type="button"
          id="btn-maker-create-new-biller"
          onClick={() => onNavigate('Create New Biller')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] active:bg-[#c94f05] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create New Biller</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Billers</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalBillers}</div>
          <span className="text-[11px] text-slate-400">Registered entities</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending KYC</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">{pendingKycCount}</div>
          <span className="text-[11px] text-slate-400">Awaiting biller submission</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Under Review</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2 font-mono">{underReviewCount}</div>
          <span className="text-[11px] text-slate-400">In Checker queue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Approved / Live</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">{approvedCount}</div>
          <span className="text-[11px] text-slate-400">Active on Bharat BillPay</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rejected</span>
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2 font-mono">{rejectedCount}</div>
          <span className="text-[11px] text-slate-400">Returned for corrections</span>
        </div>
      </div>

      {/* Billers Table */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search billers by name, ID, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending KYC">Pending KYC</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved / Live</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 px-4">Biller Name & Category</th>
                <th className="py-3 px-4">BBPS Biller ID</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBillers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No biller onboarding records found.
                  </td>
                </tr>
              ) : (
                filteredBillers.map((biller, idx) => (
                  <tr key={biller.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-800 text-[12.5px] block">
                          {biller.billerName}
                        </span>
                        <span className="text-[11px] text-slate-500 capitalize">
                          {biller.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {biller.billerId}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">
                      <div>{biller.emailId || biller.supportEmail || '—'}</div>
                      <div className="text-slate-400">{biller.mobileNumber || '—'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          biller.kycStatus === 'Approved' || biller.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : biller.kycStatus === 'Under Review'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : biller.kycStatus === 'Rejected' || biller.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {biller.kycStatus === 'Approved' || biller.status === 'Live' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : biller.kycStatus === 'Rejected' || biller.status === 'Rejected' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {biller.kycStatus || 'Pending KYC'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {biller.createdDate || biller.registrationDate || '31/08/2026'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        {/* View Email Invite */}
                        <button
                          type="button"
                          onClick={() =>
                            onOpenEmailSimulation({
                              billerId: biller.billerId,
                              billerName: biller.billerName,
                              username: biller.userName || biller.billerId,
                              tempPassword: 'Biller@2026',
                              email: biller.emailId || 'biller@domain.com',
                              createdDate: biller.createdDate || '31/08/2026',
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#FF6B11] rounded border border-orange-200 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="View Simulated Email Invitation"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email Invite</span>
                        </button>

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => onOpenBillerDetails(biller)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="View Biller Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

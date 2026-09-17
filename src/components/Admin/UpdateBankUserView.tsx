import React, { useState } from 'react';
import { ManagedUser, NavItem } from '../../types';
import { Check, X } from 'lucide-react';

interface UpdateBankUserViewProps {
  users: ManagedUser[];
  onUpdateUser: (user: ManagedUser) => void;
  onNavigate?: (nav: NavItem) => void;
  initialUsername?: string;
}

export const UpdateBankUserView: React.FC<UpdateBankUserViewProps> = ({
  users,
  onUpdateUser,
  onNavigate,
  initialUsername = 'ABHISHEKSINGLA',
}) => {
  // Search query state
  const [searchUsername, setSearchUsername] = useState<string>(initialUsername);

  // Find initial user or create default state matching the screenshot
  const findUserByUsername = (uname: string): ManagedUser | undefined => {
    const trimmed = uname.trim().toLowerCase();
    return users.find(
      (u) =>
        u.username.toLowerCase() === trimmed ||
        u.id.toLowerCase() === trimmed ||
        (u.fullName && u.fullName.toLowerCase().replace(/\s+/g, '') === trimmed)
    );
  };

  const initialUser = findUserByUsername(initialUsername) || {
    id: 'USR-ABHISHEK',
    fullName: 'Abhishek Singla',
    firstName: 'Abhishek',
    lastName: 'Singla',
    email: 'abhishek.singla014@gmail.com',
    mobile: '9915693750',
    role: 'ROLE_BILLER_MAKER',
    username: 'ABHISHEKSINGLA',
    employeeId: 'BOB_201',
    status: 'Active',
    verificationStatus: 'Approved',
    createdDate: '03-05-2025',
    createdBy: 'UATADMIN',
  };

  const [activeUser, setActiveUser] = useState<ManagedUser>(initialUser);

  // Form fields state
  const [formData, setFormData] = useState({
    username: initialUser.username || 'ABHISHEKSINGLA',
    firstName: initialUser.firstName || 'Abhishek',
    lastName: initialUser.lastName || 'Singla',
    email: initialUser.email || 'abhishek.singla014@gmail.com',
    mobile: initialUser.mobile || '9915693750',
    role: initialUser.role || 'ROLE_BILLER_MAKER',
    createdDate: initialUser.createdDate || '03-05-2025',
    createdBy: initialUser.createdBy || 'UATADMIN',
    status: initialUser.status || 'Active',
  });

  // Success Toast notification
  const [showToast, setShowToast] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    const found = findUserByUsername(searchUsername);
    if (found) {
      setActiveUser(found);
      setFormData({
        username: found.username,
        firstName: found.firstName || found.fullName.split(' ')[0] || '',
        lastName: found.lastName || found.fullName.split(' ').slice(1).join(' ') || '',
        email: found.email,
        mobile: found.mobile,
        role: found.role || 'ROLE_BILLER_MAKER',
        createdDate: found.createdDate || '03-05-2025',
        createdBy: found.createdBy || 'UATADMIN',
        status: found.status || 'Active',
      });
      setSearchFeedback(null);
    } else {
      setSearchFeedback(`No record found for "${searchUsername}". Displaying standard template.`);
      setFormData({
        username: searchUsername.toUpperCase(),
        firstName: 'Abhishek',
        lastName: 'Singla',
        email: 'abhishek.singla014@gmail.com',
        mobile: '9915693750',
        role: 'ROLE_BILLER_MAKER',
        createdDate: '03-05-2025',
        createdBy: 'UATADMIN',
        status: 'Active',
      });
    }
  };

  // Handle Update Submit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUserRecord: ManagedUser = {
      ...activeUser,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      createdDate: formData.createdDate,
      createdBy: formData.createdBy,
      status: formData.status as 'Active' | 'Inactive' | 'Deactivated' | 'Pending',
    };

    setActiveUser(updatedUserRecord);
    onUpdateUser(updatedUserRecord);

    // Trigger toast notification
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  // Handle Cancel
  const handleCancel = () => {
    if (onNavigate) {
      onNavigate('Create New User');
    } else {
      // Reset form
      setFormData({
        username: activeUser.username,
        firstName: activeUser.firstName || '',
        lastName: activeUser.lastName || '',
        email: activeUser.email,
        mobile: activeUser.mobile,
        role: activeUser.role,
        createdDate: activeUser.createdDate,
        createdBy: activeUser.createdBy || 'UATADMIN',
        status: activeUser.status,
      });
    }
  };

  return (
    <div id="update-bank-user-page" className="p-6 max-w-full font-sans select-none relative">
      {/* Toast Notification (Top Right as in Screenshot 2) */}
      {showToast && (
        <div
          id="toast-user-data-updated"
          className="fixed top-18 right-8 z-50 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded shadow-md animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
          </div>
          <span className="text-[11.5px] font-medium text-slate-700 whitespace-nowrap">
            User Data Updated Successfully
          </span>
          <button
            type="button"
            id="close-toast-btn"
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-slate-600 ml-3 p-0.5 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 mb-2 font-normal flex items-center gap-1.5" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('Create New User')}
          className="hover:underline hover:text-slate-700 cursor-pointer text-slate-500"
        >
          User Management
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Update Bank User</span>
      </nav>

      {/* Main Page Heading */}
      <h1 className="text-[15px] font-semibold text-slate-800 mb-4">
        Update Bank User
      </h1>

      {/* Top Search / Lookup Card */}
      <div className="bg-white rounded border border-slate-200 p-5 mb-5 shadow-2xs">
        <form onSubmit={handleSearchSubmit}>
          <label
            htmlFor="search-username-input"
            className="block text-xs font-medium text-slate-700 mb-2"
          >
            User Name <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="search-username-input"
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter User Name"
              className="w-64 sm:w-72 px-3 py-1.5 text-xs text-slate-800 border border-slate-300 rounded focus:outline-none focus:border-[#FF6B11] uppercase tracking-wide bg-white"
            />
            <button
              type="submit"
              id="search-username-submit"
              className="px-6 py-1.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              Submit
            </button>
          </div>
          {searchFeedback && (
            <p className="text-[11px] text-amber-600 mt-2">{searchFeedback}</p>
          )}
        </form>
      </div>

      {/* Update Bank User Form Card */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-sm font-semibold text-slate-800 mb-5">
          Update Bank User
        </h2>

        <form onSubmit={handleUpdate}>
          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Row 1 Left: User Name (Read-only) */}
            <div>
              <label
                htmlFor="input-username"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                User Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-username"
                type="text"
                readOnly
                disabled
                value={formData.username}
                className="w-full px-3 py-2 text-xs bg-[#efefef] text-slate-700 border border-slate-300 rounded cursor-not-allowed select-none"
              />
            </div>

            {/* Row 1 Right: First Name (Editable) */}
            <div>
              <label
                htmlFor="input-first-name"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-first-name"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white text-slate-800 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Row 2 Left: Last Name (Editable) */}
            <div>
              <label
                htmlFor="input-last-name"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-last-name"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white text-slate-800 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Row 2 Right: Email ID (Editable) */}
            <div>
              <label
                htmlFor="input-email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                id="input-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white text-slate-800 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Row 3 Left: Mobile Number (Editable) */}
            <div>
              <label
                htmlFor="input-mobile"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                id="input-mobile"
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white text-slate-800 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Row 3 Right: User Role (Read-only) */}
            <div>
              <label
                htmlFor="input-user-role"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                User Role <span className="text-red-500">*</span>
              </label>
              <input
                id="input-user-role"
                type="text"
                readOnly
                disabled
                value={formData.role}
                className="w-full px-3 py-2 text-xs bg-[#efefef] text-slate-700 border border-slate-300 rounded cursor-not-allowed select-none"
              />
            </div>

            {/* Row 4 Left: Created Date (Read-only) */}
            <div>
              <label
                htmlFor="input-created-date"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Created Date <span className="text-red-500">*</span>
              </label>
              <input
                id="input-created-date"
                type="text"
                readOnly
                disabled
                value={formData.createdDate}
                className="w-full px-3 py-2 text-xs bg-[#efefef] text-slate-700 border border-slate-300 rounded cursor-not-allowed select-none"
              />
            </div>

            {/* Row 4 Right: Created By (Read-only) */}
            <div>
              <label
                htmlFor="input-created-by"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Created By <span className="text-red-500">*</span>
              </label>
              <input
                id="input-created-by"
                type="text"
                readOnly
                disabled
                value={formData.createdBy}
                className="w-full px-3 py-2 text-xs bg-[#efefef] text-slate-700 border border-slate-300 rounded cursor-not-allowed select-none"
              />
            </div>

            {/* Row 5 Left: Status (Read-only) */}
            <div>
              <label
                htmlFor="input-status"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <input
                id="input-status"
                type="text"
                readOnly
                disabled
                value={formData.status}
                className="w-full px-3 py-2 text-xs bg-[#efefef] text-slate-700 border border-slate-300 rounded cursor-not-allowed select-none"
              />
            </div>

            {/* Row 5 Right: Empty slot to preserve perfect 2-column alignment */}
            <div className="hidden md:block" />
          </div>

          {/* Form Action Buttons: Cancel and Update */}
          <div className="flex items-center justify-end gap-5 mt-6 pt-2">
            <button
              type="button"
              id="cancel-update-user-btn"
              onClick={handleCancel}
              className="text-xs font-normal text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-update-user-btn"
              className="px-8 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

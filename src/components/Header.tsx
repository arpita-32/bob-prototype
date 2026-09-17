import React from 'react';
import { BankLogo } from './BankLogo';
import { AuthUser } from '../types';
import { LogOut, Bell } from 'lucide-react';

interface HeaderProps {
  currentUser?: AuthUser | null;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onProfileClick, onLogout }) => {
  return (
    <header
      id="main-header"
      className="relative w-full bg-white select-none z-30 shadow-2xs"
      style={{ height: '62px' }}
    >
      {/* Background SVG for the smooth orange left swoop & full width bottom line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="h-full w-[420px] absolute left-0 top-0"
          viewBox="0 0 420 62"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Smooth orange banner shape */}
          <path
            d="M 0 0 H 300 C 300 24 322 54 380 59 H 0 Z"
            fill="#FF6B11"
          />
        </svg>
        {/* Full width bottom orange border line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF6B11]" />
      </div>

      {/* Header Interactive Content */}
      <div className="relative w-full h-[59px] flex items-center justify-between px-4 sm:px-6">
        {/* Bank of Baroda Logo & Text (inside the orange swoop) */}
        <div className="flex items-center pl-0 sm:pl-1 z-10">
          <BankLogo />
        </div>

        {/* User Profile Avatar and Role Badge */}
        <div className="flex items-center gap-3 pr-2 sm:pr-4 z-10">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 pr-1">
              <span className="text-xs font-semibold text-slate-700">
                {currentUser.name}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  currentUser.role === 'Admin'
                    ? 'bg-orange-50 text-[#FF6B11] border-orange-200'
                    : currentUser.role === 'Maker'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
          )}

          {/* Bell Notifications */}
          <button
            type="button"
            id="header-notification-button"
            className="relative p-1.5 text-slate-600 hover:text-[#FF6B11] hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User Profile Button */}
          <button
            type="button"
            id="user-profile-button"
            onClick={onProfileClick}
            className="flex items-center justify-center p-0.5 rounded-full border-2 border-[#FF6B11] hover:scale-105 transition-all duration-150 focus:outline-none cursor-pointer bg-white"
            title={`${currentUser?.name || 'User Profile'} (${currentUser?.role || 'Admin'})`}
          >
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt="User Avatar"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-[#FF6B11] hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};



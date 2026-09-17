import React from 'react';

export const BankLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* BBPS Logo */}
      <div className="relative flex items-center justify-center py-1">
        <img
          src="/bbps_logo.png"
          alt="BBPS Logo"
          referrerPolicy="no-referrer"
          className="h-25 max-h-25 w-auto max-w-[500px] object-contain drop-shadow-xs"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};


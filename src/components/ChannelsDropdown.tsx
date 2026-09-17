import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChannelOption, CHANNELS_LIST } from '../types';

interface ChannelsDropdownProps {
  selectedChannel: ChannelOption | string;
  onSelect: (channel: ChannelOption) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  defaultOpen?: boolean;
  showPlaceholderInList?: boolean;
  id?: string;
}

export const ChannelsDropdown: React.FC<ChannelsDropdownProps> = ({
  selectedChannel,
  onSelect,
  placeholder = 'All',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  defaultOpen = false,
  showPlaceholderInList = false,
  id = 'channels-dropdown',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (channel: ChannelOption) => {
    onSelect(channel);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        id={`${id}-button`}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 text-sm bg-white border rounded transition-colors duration-150 focus:outline-none ${
          isOpen
            ? 'border-[#FF6B11] ring-1 ring-[#FF6B11]/30 shadow-sm'
            : 'border-slate-300 hover:border-slate-400'
        } ${buttonClassName}`}
      >
        <span className="truncate text-slate-700 font-normal">
          {selectedChannel || placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div
          id={`${id}-menu`}
          className={`absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-md shadow-xl py-1 text-sm animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
          style={{ minWidth: '220px' }}
        >
          {showPlaceholderInList && (
            <div
              className="px-4 py-2 text-slate-400 cursor-default text-xs font-medium border-b border-slate-100"
            >
              {placeholder}
            </div>
          )}

          {CHANNELS_LIST.map((channel) => {
            const isSelected = selectedChannel === channel;

            return (
              <button
                key={channel}
                type="button"
                id={`${id}-option-${channel.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                onClick={() => handleSelect(channel)}
                className={`w-full text-left px-4 py-2 text-[13.5px] transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-orange-50 text-[#FF6B11] font-medium'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#FF6B11]'
                }`}
              >
                <span>{channel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

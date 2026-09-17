import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Download,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Building,
  CreditCard,
} from 'lucide-react';
import { ChannelOption } from '../types';
import { ChannelsDropdown } from './ChannelsDropdown';
import { CouBouDropdown } from './CouBouDropdown';

interface OtherViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
  title: string;
  category: string;
}

export const GenericReportView: React.FC<OtherViewProps> = ({
  channel,
  onChannelChange,
  title,
  category,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>(channel);
  const [couBou, setCouBou] = useState<string>(title.includes('BOU') ? 'BOU' : 'COU');

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="text-xs text-slate-500 font-normal">
        <span>{category}</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700">{title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <CouBouDropdown
            id="other-view-cou-bou-dropdown"
            value={couBou}
            onChange={(val) => setCouBou(val === 'Select Type' ? 'COU' : val)}
            buttonClassName="min-w-[100px]"
          />
          <ChannelsDropdown
            id="other-view-channels-dropdown"
            selectedChannel={channel}
            onSelect={onChannelChange}
            buttonClassName="min-w-[180px]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Type
            </label>
            <CouBouDropdown
              id="generic-cou-bou-filter"
              value={couBou}
              onChange={(val) => setCouBou(val === 'Select Type' ? 'COU' : val)}
              className="w-full"
              buttonClassName="w-full py-2"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Select Date Range
            </label>
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-700">
              <span>24/08/2026 - 25/08/2026</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Channel
            </label>
            <ChannelsDropdown
              id="generic-channel-dropdown"
              selectedChannel={selectedChannel}
              placeholder="Select Channel"
              showPlaceholderInList
              onSelect={(ch) => {
                setSelectedChannel(ch);
                onChannelChange(ch);
              }}
              className="w-full"
              buttonClassName="w-full py-2"
            />
          </div>

          <button
            type="button"
            className="px-8 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-sm rounded shadow-xs"
          >
            Search
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center text-xs text-slate-500">
            Showing verified <strong className="text-slate-800">{couBou}</strong> {title} records for{' '}
            <strong className="text-[#FF6B11]">{channel}</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Calendar,
  RotateCcw,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ChannelOption } from '../types';
import { ChannelsDropdown } from './ChannelsDropdown';
import { CouBouDropdown } from './CouBouDropdown';

interface COUReconciliationViewProps {
  channel: ChannelOption;
  onChannelChange: (ch: ChannelOption) => void;
}

export const COUReconciliationView: React.FC<COUReconciliationViewProps> = ({
  channel,
  onChannelChange,
}) => {
  const [couBouType, setCouBouType] = useState('COU');
  const [selectedDate, setSelectedDate] = useState('25/08/2026');
  const [selectedChannelType, setSelectedChannelType] = useState<string>(
    channel === 'All' ? 'Select Channel Type' : channel
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.txt') || file.type.includes('text')) {
        setUploadedFile(file);
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.txt') || file.type.includes('text') || file.name.includes('.')) {
        setUploadedFile(file);
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
      }
    }
  };

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      setUploadStatus('success');
    }
  };

  return (
    <div id="cou-reconciliation-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Reconciliation</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700">{couBouType} Reconciliation</span>
      </div>

      {/* Title & History Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">
          {couBouType} Reconciliation
        </h1>

        <div className="flex items-center gap-3">
          <CouBouDropdown
            id="recon-header-cou-bou"
            value={couBouType}
            onChange={(val) => setCouBouType(val === 'Select Type' ? 'COU' : val)}
            buttonClassName="min-w-[100px]"
          />

          <button
            type="button"
            id="history-button"
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#FF6B11] hover:bg-[#e05a07] text-white font-medium text-sm rounded shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Main Reconciliation Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <p className="text-xs text-slate-500 font-normal">
          After Selecting the date you can upload the FINACLE Files for {couBouType}.
        </p>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* COU / BOU Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Type
            </label>
            <CouBouDropdown
              id="recon-type-dropdown"
              value={couBouType}
              onChange={(val) => setCouBouType(val === 'Select Type' ? 'COU' : val)}
              className="w-full"
              buttonClassName="w-full py-2"
            />
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Select Date
            </label>
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-700">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full focus:outline-none placeholder:text-slate-400"
              />
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Channel Type Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Channel Type
            </label>
            <ChannelsDropdown
              id="recon-channel-dropdown"
              selectedChannel={selectedChannelType}
              placeholder="Select Channel Type"
              showPlaceholderInList
              onSelect={(ch) => {
                setSelectedChannelType(ch);
                onChannelChange(ch);
              }}
              className="w-full"
              buttonClassName="w-full py-2"
            />
          </div>
        </div>

        {/* File Upload Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#FF6B11] bg-orange-50/40'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.csv"
            className="hidden"
          />

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-orange-100/80 flex items-center justify-center mb-3">
            <FileText className="w-8 h-8 text-[#FF6B11]" />
          </div>

          <p className="text-sm font-semibold text-slate-700 mb-1">
            {uploadedFile ? uploadedFile.name : 'Drag & drop'}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Please upload only Text File
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (uploadedFile) {
                handleUploadSubmit();
              } else {
                fileInputRef.current?.click();
              }
            }}
            className={`px-8 py-2 rounded text-xs font-medium transition-colors ${
              uploadedFile
                ? 'bg-[#FF6B11] text-white hover:bg-[#e05a07] shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Upload
          </button>

          {uploadStatus === 'success' && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>FINACLE file processed and reconciled successfully for {selectedChannelType}!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Invalid file format. Please upload only text (.txt) files.</span>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-semibold text-slate-800">
                Reconciliation Upload History
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-4 py-2 font-semibold text-slate-600 bg-slate-50 px-3 rounded">
                <span>Date</span>
                <span>Channel</span>
                <span>Filename</span>
                <span>Status</span>
              </div>
              <div className="grid grid-cols-4 py-2 px-3 border-b text-slate-700">
                <span>24/08/2026</span>
                <span className="text-[#FF6B11] font-medium">UPI123Pay</span>
                <span>FIN_UPI123_2408.txt</span>
                <span className="text-emerald-600 font-medium">Matched (100%)</span>
              </div>
              <div className="grid grid-cols-4 py-2 px-3 border-b text-slate-700">
                <span>24/08/2026</span>
                <span>Mobile Banking</span>
                <span>FIN_BOBWORLD_2408.txt</span>
                <span className="text-emerald-600 font-medium">Matched (99.8%)</span>
              </div>
              <div className="grid grid-cols-4 py-2 px-3 border-b text-slate-700">
                <span>23/08/2026</span>
                <span>UPI (BHIM Baroda Pay)</span>
                <span>FIN_UPI_2308.txt</span>
                <span className="text-emerald-600 font-medium">Matched (100%)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-[#FF6B11] text-white text-xs font-medium rounded hover:bg-[#e05a07]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { BillerEntity, NavItem, BillerCredentials } from '../../types';

interface CreateNewBillerViewProps {
  onNavigate?: (nav: NavItem) => void;
  onBillerCreated?: (biller: BillerEntity) => void;
  onOpenEmailSimulation?: (credentials: BillerCredentials) => void;
}

export const CreateNewBillerView: React.FC<CreateNewBillerViewProps> = ({
  onNavigate,
  onBillerCreated,
  onOpenEmailSimulation,
}) => {
  // Form State
  // 1. Basic Details
  const [billerName, setBillerName] = useState('');
  const [billerId, setBillerId] = useState('');
  const [category, setCategory] = useState('');
  const [tanNumber, setTanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');

  // 2. Admin Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');

  // 3. Settlement Account Details
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [deemedAcceptance, setDeemedAcceptance] = useState<'yes' | 'no'>('no');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdBillerData, setCreatedBillerData] = useState<BillerEntity | null>(null);

  const categories = [
    'education fees',
    'electricity',
    'water',
    'gas',
    'municipal services',
    'telecom',
    'dth',
    'broadband',
    'fastag',
    'loan repayment',
    'insurance',
    'credit card',
    'housing society',
    'hospital',
    'cable tv',
    'recurring deposit',
  ];

  const handleReset = () => {
    setBillerName('');
    setBillerId('');
    setCategory('');
    setTanNumber('');
    setGstin('');
    setPinCode('');
    setAddress('');
    setFirstName('');
    setLastName('');
    setMobileNumber('');
    setEmailId('');
    setAccountHolderName('');
    setBankName('');
    setAccountNumber('');
    setBankIfsc('');
    setDeemedAcceptance('no');
    setErrorMsg(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!billerName.trim()) {
      setErrorMsg('Please enter Biller Name.');
      return;
    }
    if (!billerId.trim()) {
      setErrorMsg('Please enter BBPS Biller ID.');
      return;
    }
    if (!category || category === 'Select') {
      setErrorMsg('Please select a Category.');
      return;
    }
    if (!pinCode.trim() || pinCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit PIN Code.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter Address.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Please enter First Name and Last Name of Biller Admin.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!emailId.trim() || !emailId.includes('@')) {
      setErrorMsg('Please enter a valid Email ID.');
      return;
    }
    if (!accountHolderName.trim()) {
      setErrorMsg('Please enter Account Holder Name.');
      return;
    }
    if (!bankName.trim()) {
      setErrorMsg('Please enter Bank Name.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMsg('Please enter Account Number.');
      return;
    }
    if (!bankIfsc.trim()) {
      setErrorMsg('Please enter Bank IFSC Code.');
      return;
    }

    const newUserId = '1123' + Math.floor(100000000000 + Math.random() * 900000000000);
    const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const newBiller: BillerEntity = {
      id: `BIL-${Date.now()}`,
      billerId: billerId.toUpperCase().trim(),
      billerName: billerName.trim(),
      billerLegalName: billerName.trim(),
      category: category,
      state: 'GUJARAT',
      billerType: 'BOU',
      flowType: 'Fetch & Pay',
      paymentModes: ['Internet Banking', 'Mobile Banking', 'UPI'],
      status: 'Pending Verification',
      createdDate: currentDateFormatted,
      updatedBy: 'MAKER',
      transactionEnabled: false,
      kycStatus: 'Created',
      lastUpdatedDate: currentDateFormatted,
      createdBy: 'MAKER',
      userType: 'BILLER',
      userName: billerId.toUpperCase().trim(),
      userId: newUserId,
      registrationDate: currentDateFormatted,
      createdTime: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      mobileNumber: mobileNumber.trim(),
      emailId: emailId.trim(),
      contactPerson: `${firstName} ${lastName}`,
      supportEmail: emailId.trim(),
      supportPhone: mobileNumber.trim(),
      settlementCycle: 'T+1 Daily',
      gstin: gstin.trim() || 'NA',
      tanNo: tanNumber.trim() || 'NA',
      bankAccountNo: accountNumber.trim(),
      ifscCode: bankIfsc.toUpperCase().trim(),
      parametersRequired: ['Student Registration ID / Bill Account Number'],
      deemedAcceptance: deemedAcceptance === 'yes',
      registeredAddress: {
        country: 'India',
        state: 'GUJARAT',
        district: 'District',
        pinCode: pinCode.trim(),
        address: address.trim(),
      },
      communicationAddress: {
        country: 'India',
        state: 'GUJARAT',
        district: 'District',
        pinCode: pinCode.trim(),
        address: address.trim(),
      },
      billerAdmin: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.trim(),
        emailId: emailId.trim(),
      },
      settlementAccount: {
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        bankIfsc: bankIfsc.toUpperCase().trim(),
      },
      configuration: {
        billerType: 'Offline',
        billFetchApiUrl: 'NA',
        billPaymentApiUrl: 'NA',
        billStatusApiUrl: 'NA',
      },
      pocDetails: {
        hod: {
          name: `${firstName} ${lastName}`,
          email: emailId.trim(),
          mobileNumber: mobileNumber.trim(),
        },
        ops: { name: 'NA', email: 'NA', mobileNumber: 'NA' },
        tech: { name: 'NA', email: 'NA', mobileNumber: 'NA' },
      },
      kycDocuments: {
        mdmDocumentUrl: '#view-mdm',
        mdmDocumentName: `${billerName.replace(/\s+/g, '_')}_MDM.pdf`,
      },
    };

    if (onBillerCreated) {
      onBillerCreated(newBiller);
    }
    setCreatedBillerData(newBiller);
    setSuccessModalOpen(true);
  };

  return (
    <div id="create-new-biller-view" className="p-6 space-y-4 max-w-[1400px] mx-auto select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-normal">
        <span>Biller</span>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Create New Biller</span>
      </div>

      {/* Page Title */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Biller</h1>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3.5 flex items-center gap-3 text-red-700 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleCreate} className="space-y-6">
        {/* Section 1: Biller's Basic Details */}
        <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
              Biller's Basic Details :
            </h2>
            <span className="text-[11px] text-red-500 font-normal">
              * Mark fields are mandatory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Biller Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Biller Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
                placeholder="Enter Biller Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* BBPS Biller ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                BBPS Biller ID (For Existing BBPS Billers)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={billerId}
                onChange={(e) => setBillerId(e.target.value)}
                placeholder="Enter BBPS Biller ID"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all uppercase"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Category<span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all bg-white"
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* TAN Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">TAN Number</label>
              <input
                type="text"
                value={tanNumber}
                onChange={(e) => setTanNumber(e.target.value)}
                placeholder="Enter TAN Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all uppercase"
              />
            </div>

            {/* GSTIN */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="Enter GSTIN"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all uppercase"
              />
            </div>

            {/* Empty grid space */}
            <div className="hidden md:block" />

            {/* PIN Code */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                PIN Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN Code"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Biller Admin Details */}
        <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
              Biller Admin Details :
            </h2>
            <span className="text-[11px] text-red-500 font-normal">
              * Mark fields are mandatory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter Mobile Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email ID<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter Email ID"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Biller Settlement Account Details */}
        <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
              Biller Settlement Account Details :
            </h2>
            <span className="text-[11px] text-red-500 font-normal">
              * Mark fields are mandatory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Account Holder Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Account Holder Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter Account Holder Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Bank Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter Bank Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Account Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all"
              />
            </div>

            {/* Bank IFSC */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Bank IFSC<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value)}
                placeholder="Enter Bank IFSC"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF6B11] focus:ring-1 focus:ring-[#FF6B11]/20 transition-all uppercase"
              />
            </div>

            {/* Deemed Acceptance Required */}
            <div className="md:col-span-2 pt-2">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Deemed Acceptance Required?<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="deemedAcceptance"
                    checked={deemedAcceptance === 'yes'}
                    onChange={() => setDeemedAcceptance('yes')}
                    className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11]"
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="deemedAcceptance"
                    checked={deemedAcceptance === 'no'}
                    onChange={() => setDeemedAcceptance('no')}
                    className="w-4 h-4 text-[#FF6B11] border-slate-300 focus:ring-[#FF6B11] accent-[#FF6B11]"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Create and Reset */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-sm transition-all cursor-pointer"
          >
            Create
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-semibold rounded-md shadow-sm transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successModalOpen && createdBillerData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">
                Biller Created Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Biller <span className="font-semibold text-slate-800">{createdBillerData.billerName}</span> ({createdBillerData.billerId}) has been successfully created and sent to the Checker queue for verification.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">BBPS Biller ID:</span>
                <span className="font-semibold text-slate-700">{createdBillerData.billerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-700">{createdBillerData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">KYC Status:</span>
                <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {createdBillerData.kycStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-slate-600">{createdBillerData.userId}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="btn-view-email-invite-modal"
                onClick={() => {
                  setSuccessModalOpen(false);
                  if (onOpenEmailSimulation) {
                    onOpenEmailSimulation({
                      billerId: createdBillerData.billerId,
                      billerName: createdBillerData.billerName,
                      username: createdBillerData.userName || createdBillerData.billerId,
                      tempPassword: 'Biller@2026',
                      email: createdBillerData.emailId || 'biller@domain.com',
                      createdDate: createdBillerData.createdDate || '31/08/2026',
                    });
                  }
                }}
                className="w-full py-2.5 bg-[#FF6B11] hover:bg-[#e05a07] text-white text-xs font-bold rounded-md shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>View & Send Biller Email Invitation</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessModalOpen(false);
                    if (onNavigate) onNavigate('Biller List');
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Go to Biller List
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuccessModalOpen(false);
                    if (onNavigate) onNavigate('Biller Details');
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  View Biller Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

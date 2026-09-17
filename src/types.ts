export type UserRole = 'Admin' | 'Maker' | 'Checker' | 'Biller';

export interface AuthUser {
  username: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatarUrl?: string;
  employeeId: string;
  billerId?: string;
}

export interface ManagedUser {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile: string;
  role: 'Admin' | 'Maker' | 'Checker' | 'Agent' | string;
  username: string;
  status: 'Active' | 'Inactive' | 'Deactivated' | 'Pending';
  createdDate: string;
  department?: string;
  employeeId?: string;
  zone?: string;
  branchCode?: string;
  channelAccess?: string[];
  verificationStatus?: 'Pending' | 'Approved' | 'Rejected';
  createdBy?: string;
  createdTime?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  remarks?: string;
}

export interface BillerCredentials {
  billerId: string;
  billerName: string;
  username: string;
  tempPassword: string;
  email: string;
  createdDate: string;
}

export type ChannelOption =
  | 'All'
  | 'Internet Banking (Post-login)'
  | 'Mobile Banking (Bob World)'
  | 'UPI (BHIM Baroda Pay)'
  | 'Internet Banking (Pre-login)'
  | 'Jio Feature Phone'
  | 'UPI123Pay';

export const CHANNELS_LIST: ChannelOption[] = [
  'All',
  'Internet Banking (Post-login)',
  'Mobile Banking (Bob World)',
  'UPI (BHIM Baroda Pay)',
  'Internet Banking (Pre-login)',
  'Jio Feature Phone',
  'UPI123Pay',
];

export type NavItem =
  | 'Dashboard'
  | 'User Management'
  | 'Create New User'
  | 'Update Bank User'
  | 'Verify User'
  | 'Maker Dashboard'
  | 'Checker Dashboard'
  | 'Transaction Summary'
  | 'Biller'
  | 'Create New Biller'
  | 'Biller List'
  | 'Biller Details'
  | 'Biller Verification'
  | 'Agent'
  | 'Create Agent / AI'
  | 'Agent / AI List'
  | 'Agent / AI Details'
  | 'Report Center'
  | 'BOU Report'
  | 'COU Report'
  | 'Reconciliation'
  | 'BOU Reconciliation'
  | 'COU Reconciliation'
  | 'Fee Configuration'
  | 'Ad-hoc Reports'
  | 'Autopay Management';

export interface ChartDataPoint {
  time: string;
  successful: number;
  pending: number;
  failed: number;
}

export interface DayTransactionCount {
  day: string;
  count: number;
}

export interface DayTransactionValue {
  day: string;
  valueInLakhs: number;
  displayLabel: string;
}

export interface ReportItem {
  id: number;
  channelName: string;
  reportType: string;
  status: 'Processing' | 'Finished' | 'Deleted';
  createdDate: string;
}

export interface CombinationSearchRecord {
  id: number;
  slNo: number;
  bankChannel: string;
  customerAccountName: string;
  customerAccountId: string;
  customerId?: string;
  rrnNumber?: string;
  referenceId: string;
  msgIdFetch: string;
  msgIdPay: string;
  transactionRefId: string;
  billAmount: string;
  couCustomerConvenienceFee: string;
  couConvenienceFee: string;
}

export interface AgentEntity {
  id: string;
  name: string;
  pan: string;
  type: 'AI' | 'Agent';
  parentEntity?: string;
  npciId: string;
  walletBalance: string;
  walletBalanceNum: number;
  dailyLimit: string;
  dailyLimitNum: number;
  status: 'Live' | 'Submitted' | 'Invited' | 'Suspended';
  entityType?: string;
  gstin?: string;
  pinCode?: string;
  registeredAddress?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminPhone?: string;
  adminEmail?: string;
  walletType?: 'AI Pooled Wallet' | 'AI Dedicated Wallet';
  perTxnCap?: string;
  lowBalanceAlert?: string;
  inviteValidity?: string;
  onHold?: string;
  usedToday?: string;
  dailyCountLimit?: string;
}

export interface AutopaySummaryRow {
  slNo: number;
  channel: string;
  agentId: string;
  favBillersRegistered: string;
  autopayRegistered: string;
  favCount: number;
  autopayCount: number;
}

export interface CustomerFavBillerRecord {
  id: string;
  shortName: string;
  billerName: string;
  billerId: string;
  customerId: string;
  billerAccountId: string;
  channel: string;
  autopay: boolean;
  authenticator1?: string;
  nickname?: string;
  sourceId?: string;
  mandateId?: string;
  paymentMethod?: string;
  accountDetails?: string;
  frequency?: string;
  amountLimit?: string;
  registeredOn?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  consumerNo?: string;
  autopayStatus?: 'Active' | 'Paused' | 'Failed' | 'Not Enrolled';
  maxLimit?: string;
  nextExecutionDate?: string;
  mandateUmn?: string;
  accountNo?: string;
  bankName?: string;
  registrationDate?: string;
  lastExecutionStatus?: 'Success' | 'Failed' | 'Pending';
  lastExecutionAmount?: string;
  transactions?: BillerTransactionHistoryItem[];
}

export interface BillerTransactionHistoryItem {
  id: string;
  title: string;
  dateTime: string;
  referenceNo: string;
  amount: string;
  status: 'SUCCESS' | 'FAILED';
  accountNo?: string;
  failureReason?: string;
}

export interface BillerEntity {
  id: string;
  billerId: string;
  billerName: string;
  billerLegalName?: string;
  category: string;
  state: string;
  billerType: 'BOU' | 'COU' | 'Both';
  flowType: 'Fetch & Pay' | 'Fetch Only' | 'Pay Only';
  paymentModes: string[];
  status: 'Live' | 'Pending Verification' | 'Under Review' | 'Suspended' | 'Rejected' | 'Deactivate';
  registrationDate: string;
  createdDate?: string;
  createdTime?: string;
  createdBy?: string;
  updatedBy?: string;
  lastUpdatedDate?: string;
  transactionEnabled?: boolean;
  kycStatus?: 'Approved' | 'Created' | 'Pending' | 'Rejected';
  userType?: string;
  userName?: string;
  userId?: string;
  deemedAcceptance?: boolean;
  mobileNumber?: string;
  emailId?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  contactPerson: string;
  supportEmail: string;
  supportPhone: string;
  settlementCycle: string;
  turnoverRange?: string;
  gstin?: string;
  tanNo?: string;
  uaAadhaar?: string;
  rocUin?: string;
  pan?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  rejectionReason?: string;
  rejectedSections?: string[];
  parametersRequired: string[];
  registeredAddress?: {
    country: string;
    state: string;
    district: string;
    pinCode: string;
    address: string;
  };
  communicationAddress?: {
    country: string;
    state: string;
    district: string;
    pinCode: string;
    address: string;
  };
  billerAdmin?: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailId: string;
  };
  settlementAccount?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    bankIfsc: string;
  };
  configuration?: {
    billerType: string;
    billFetchApiUrl: string;
    billPaymentApiUrl: string;
    billStatusApiUrl: string;
  };
  pocDetails?: {
    hod: { name: string; email: string; mobileNumber: string };
    ops: { name: string; email: string; mobileNumber: string };
    tech: { name: string; email: string; mobileNumber: string };
  };
  kycDocuments?: {
    mdmDocumentUrl?: string;
    mdmDocumentName?: string;
  };
}

export interface AdHocReportItem {
  id: string;
  requestId: string;
  reportName: string;
  category: string;
  channel: string;
  couBouType: 'COU' | 'BOU' | 'All';
  fromDate: string;
  toDate: string;
  format: 'XLSX' | 'CSV' | 'PDF';
  fileSize: string;
  rowCount: number;
  requestedBy: string;
  requestedAt: string;
  status: 'Finished' | 'Processing' | 'Failed' | 'Queued';
  downloadFileName: string;
}

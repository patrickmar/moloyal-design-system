// MoLoyal Sample Data
import { User, Goal, Transaction, RankAllocation, AllocationPayout, AuditLogEntry, RosterData, Notification, ArmyAnnouncement, NotificationSettings } from './types';

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  if (amount == null || isNaN(amount)) return '₦0';
  return amount.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).replace('NGN', '₦').replace(/\s/g, '');
};

export const sampleUsers: User[] = [
  {
    name: "Amina Okoye",
    rank: "Sergeant", 
    service_no: "NA-12345",
    bvn: "12345678901",
    allocation: 10000,
    avatar: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTI0NjExMHww&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    name: "Chinedu E.",
    rank: "Corporal",
    service_no: "NA-22345", 
    allocation: 5000,
    avatar: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTQ4OTR8MA&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    name: "Adebayo Folake",
    rank: "Lieutenant",
    service_no: "NA-33456",
    allocation: 15000,
    avatar: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1OTI1NzkwNHww&ixlib=rb-4.1.0&q=80&w=100"
  }
];

export const sampleGoals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    description: "Emergency savings for unexpected expenses",
    target: 100000,
    current: 50000,
    deadline: "2025-12-01",
    priority: "high",
    currency: "NGN",
    status: "active",
    createdAt: "2024-06-01",
    contributionSchedule: {
      type: "monthly",
      amount: 8333,
      alignWithPayCycle: true,
      nextContribution: "2025-11-01"
    },
    autoDeduct: true,
    contributions: [
      {
        id: "c1",
        goalId: "1",
        amount: 10000,
        date: "2025-10-01",
        type: "payroll",
        status: "completed",
        description: "Monthly payroll deduction"
      },
      {
        id: "c2", 
        goalId: "1",
        amount: 5000,
        date: "2025-09-15",
        type: "manual",
        status: "completed",
        description: "Manual top-up"
      },
      {
        id: "c3",
        goalId: "1", 
        amount: 10000,
        date: "2025-09-01",
        type: "payroll",
        status: "completed",
        description: "Monthly payroll deduction"
      },
      {
        id: "c4",
        goalId: "1",
        amount: 15000,
        date: "2025-08-01", 
        type: "manual",
        status: "completed",
        description: "Bonus allocation"
      },
      {
        id: "c5",
        goalId: "1",
        amount: 10000,
        date: "2025-07-01",
        type: "payroll", 
        status: "completed",
        description: "Monthly payroll deduction"
      },
      {
        id: "c6",
        goalId: "1",
        amount: 10000,
        date: "2025-06-01",
        type: "payroll",
        status: "completed", 
        description: "Initial contribution"
      }
    ]
  },
  {
    id: "2", 
    title: "House Deposit",
    description: "Down payment for new family home",
    target: 2000000,
    current: 250000,
    deadline: "2027-06-30",
    priority: "high",
    currency: "NGN", 
    status: "active",
    createdAt: "2024-01-15",
    contributionSchedule: {
      type: "monthly",
      amount: 50000,
      alignWithPayCycle: true,
      nextContribution: "2025-11-01"
    },
    autoDeduct: true,
    contributions: [
      {
        id: "c7",
        goalId: "2",
        amount: 50000,
        date: "2025-10-01",
        type: "payroll",
        status: "completed"
      },
      {
        id: "c8",
        goalId: "2", 
        amount: 50000,
        date: "2025-09-01",
        type: "payroll",
        status: "completed"
      },
      {
        id: "c9",
        goalId: "2",
        amount: 50000, 
        date: "2025-08-01",
        type: "payroll",
        status: "completed"
      },
      {
        id: "c10",
        goalId: "2",
        amount: 50000,
        date: "2025-07-01",
        type: "payroll",
        status: "completed"
      },
      {
        id: "c11", 
        goalId: "2",
        amount: 25000,
        date: "2025-06-15",
        type: "manual",
        status: "completed"
      },
      {
        id: "c12",
        goalId: "2",
        amount: 25000,
        date: "2025-06-01", 
        type: "manual",
        status: "completed"
      }
    ]
  },
  {
    id: "3",
    title: "Education Fund",
    description: "Children's university education savings",
    target: 500000,
    current: 40000,
    deadline: "2026-12-01", 
    priority: "medium",
    currency: "NGN",
    status: "active",
    createdAt: "2024-08-01",
    contributionSchedule: {
      type: "monthly",
      amount: 15000,
      alignWithPayCycle: false,
      nextContribution: "2025-11-15"
    },
    autoDeduct: false,
    contributions: [
      {
        id: "c13",
        goalId: "3", 
        amount: 20000,
        date: "2025-10-15",
        type: "manual",
        status: "completed"
      },
      {
        id: "c14",
        goalId: "3",
        amount: 20000,
        date: "2025-09-15",
        type: "manual", 
        status: "completed"
      }
    ]
  }
];

export const sampleTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "credit",
    amount: 85000,
    description: "Payroll Allocation — October 2025",
    date: "2025-10-25",
    category: "Salary",
    subCategory: "payroll",
    status: "completed",
    initiatedBy: "Nigerian Army Payroll System",
    processedAt: "2025-10-25T08:30:00Z",
    referenceId: "PAY-2025-10-085001",
    note: "Monthly salary allocation for October 2025",
    balanceAfter: 128500,
    supportingDocuments: ["payslip-oct-2025.pdf"]
  },
  {
    id: "TXN002", 
    type: "debit",
    amount: 25000,
    description: "Goal Contribution - House Deposit",
    date: "2025-10-26",
    category: "Savings",
    subCategory: "goal-contribution",
    status: "completed",
    initiatedBy: "Auto-deduction System",
    processedAt: "2025-10-26T09:15:00Z",
    referenceId: "GC-2025-10-025001",
    goalId: "2",
    note: "Automatic monthly contribution to House Deposit goal",
    balanceAfter: 103500
  },
  {
    id: "TXN003",
    type: "credit",
    amount: 5000,
    description: "Agent Top-up via Kuda Bank",
    date: "2025-10-22",
    category: "Deposit",
    subCategory: "deposit",
    status: "completed",
    initiatedBy: "Sergeant Amina Okoye",
    processedAt: "2025-10-22T14:20:00Z",
    referenceId: "DEP-2025-10-005001",
    merchantName: "MoLoyal Agent - Abuja Central",
    note: "Cash deposit via authorized MoLoyal agent",
    balanceAfter: 108500,
    fees: [
      { amount: 50, description: "Agent processing fee" }
    ]
  },
  {
    id: "TXN004",
    type: "debit",
    amount: 50000,
    description: "Withdrawal Request - Emergency",
    date: "2025-10-20",
    category: "Withdrawal",
    subCategory: "withdrawal",
    status: "denied",
    initiatedBy: "Sergeant Amina Okoye",
    processedAt: "2025-10-21T11:45:00Z",
    referenceId: "WTH-2025-10-050001",
    note: "Emergency withdrawal request for medical expenses",
    denialReason: "Insufficient documentation provided. Medical certificate required for emergency withdrawals above ₦30,000. Please resubmit with proper documentation.",
    appealable: true,
    balanceAfter: 103500
  },
  {
    id: "TXN005",
    type: "credit",
    amount: 3500,
    description: "Bonus Payment - Performance",
    date: "2025-10-15",
    category: "Bonus",
    subCategory: "bonus",
    status: "completed",
    initiatedBy: "Nigerian Army Finance Division",
    processedAt: "2025-10-15T16:30:00Z",
    referenceId: "BON-2025-10-003501",
    note: "Performance bonus for Q3 2025 exceptional service",
    balanceAfter: 107000
  },
  {
    id: "TXN006",
    type: "debit",
    amount: 200,
    description: "Service Fee - Monthly Maintenance",
    date: "2025-10-01",
    category: "Fees",
    subCategory: "fee",
    status: "completed",
    initiatedBy: "MoLoyal System",
    processedAt: "2025-10-01T00:01:00Z",
    referenceId: "FEE-2025-10-000201",
    note: "Monthly account maintenance fee",
    balanceAfter: 103300
  },
  {
    id: "TXN007",
    type: "debit",
    amount: 15000,
    description: "Goal Contribution - Emergency Fund",
    date: "2025-09-28",
    category: "Savings",
    subCategory: "goal-contribution",
    status: "completed",
    initiatedBy: "Sergeant Amina Okoye",
    processedAt: "2025-09-28T12:00:00Z",
    referenceId: "GC-2025-09-015001",
    goalId: "1",
    note: "Manual contribution to Emergency Fund",
    balanceAfter: 103500
  },
  {
    id: "TXN008",
    type: "credit",
    amount: 2000,
    description: "Refund - Cancelled Transaction",
    date: "2025-09-25",
    category: "Refund",
    subCategory: "refund",
    status: "completed",
    initiatedBy: "MoLoyal Customer Service",
    processedAt: "2025-09-25T10:15:00Z",
    referenceId: "REF-2025-09-002001",
    note: "Refund for cancelled withdrawal transaction TXN-WTH-2025-09-020001",
    balanceAfter: 118500
  },
  {
    id: "TXN009",
    type: "debit",
    amount: 30000,
    description: "Withdrawal - ATM Cash Out",
    date: "2025-09-20",
    category: "Withdrawal",
    subCategory: "withdrawal",
    status: "pending",
    initiatedBy: "Sergeant Amina Okoye",
    processedAt: null,
    referenceId: "WTH-2025-09-030001",
    note: "ATM withdrawal request - pending approval",
    balanceAfter: 116500,
    fees: [
      { amount: 100, description: "ATM processing fee" }
    ]
  },
  {
    id: "TXN010",
    type: "credit",
    amount: 12000,
    description: "Agent Deposit - First Bank",
    date: "2025-09-18",
    category: "Deposit",
    subCategory: "deposit",
    status: "completed",
    initiatedBy: "Sergeant Amina Okoye",
    processedAt: "2025-09-18T13:45:00Z",
    referenceId: "DEP-2025-09-012001",
    merchantName: "MoLoyal Agent - Lagos Victoria Island",
    note: "Bank transfer deposit via First Bank agent",
    balanceAfter: 146500
  }
];

// Sample withdrawal and early release data
export const sampleBankAccounts = [
  {
    id: "BA001",
    bankName: "First Bank of Nigeria",
    accountNumber: "3024567890",
    accountName: "Amina Okoye",
    isDefault: true
  },
  {
    id: "BA002", 
    bankName: "Access Bank",
    accountNumber: "0987654321",
    accountName: "Amina Okoye",
    isDefault: false
  },
  {
    id: "BA003",
    bankName: "Zenith Bank",
    accountNumber: "2196873450",
    accountName: "Chinedu Emmanuel",
    isDefault: true
  }
];

export const sampleAgentLocations = [
  {
    id: "AG001",
    name: "MoLoyal Express - Victoria Island",
    location: "Plot 1234, Tiamiyu Savage Street, Victoria Island, Lagos",
    distance: "2.3 km",
    fee: 100
  },
  {
    id: "AG002",
    name: "QuickCash Agent - Ikoyi",
    location: "35 Awolowo Road, Ikoyi, Lagos",
    distance: "4.1 km", 
    fee: 150
  },
  {
    id: "AG003",
    name: "FastPay Outlet - Lagos Island",
    location: "Marina Road, Lagos Island",
    distance: "6.8 km",
    fee: 100
  }
];

export const sampleWithdrawalRequests = [
  {
    id: "WR001",
    userId: "U001",
    user: sampleUsers[0],
    amount: 75000,
    destinationType: "bank" as const,
    destinationDetails: {
      bankName: "First Bank of Nigeria",
      accountNumber: "3024567890"
    },
    status: "pending" as const,
    submittedAt: "2025-10-02T09:15:00Z",
    reference: "WTH-2025-10-075001",
    fees: 0,
    netAmount: 75000,
    priority: "high" as const,
    riskLevel: "medium" as const,
    isEarlyRelease: true,
    lockReleaseReason: "Medical emergency requiring immediate funds"
  },
  {
    id: "WR002",
    userId: "U002", 
    user: sampleUsers[1],
    amount: 25000,
    destinationType: "agent" as const,
    destinationDetails: {
      agentName: "MoLoyal Express - Victoria Island",
      location: "Victoria Island, Lagos"
    },
    status: "pending" as const,
    submittedAt: "2025-10-02T08:30:00Z",
    reference: "WTH-2025-10-025001",
    fees: 100,
    netAmount: 24900,
    priority: "normal" as const,
    riskLevel: "low" as const
  },
  {
    id: "WR003",
    userId: "U003",
    user: sampleUsers[2],
    amount: 150000,
    destinationType: "bank" as const,
    destinationDetails: {
      bankName: "Access Bank",
      accountNumber: "0987654321"
    },
    status: "approved" as const,
    submittedAt: "2025-10-01T14:20:00Z",
    processedAt: "2025-10-01T16:45:00Z",
    processedBy: "Major Sarah Adekunle",
    reference: "WTH-2025-10-150001",
    fees: 0,
    netAmount: 150000,
    priority: "urgent" as const,
    riskLevel: "high" as const,
    adminNotes: "Approved for deployment expenses"
  },
  {
    id: "WR004",
    userId: "U001",
    user: sampleUsers[0],
    amount: 200000,
    destinationType: "bank" as const,
    destinationDetails: {
      bankName: "First Bank of Nigeria", 
      accountNumber: "3024567890"
    },
    status: "denied" as const,
    submittedAt: "2025-09-30T11:10:00Z",
    processedAt: "2025-09-30T13:25:00Z",
    processedBy: "Captain Michael Adebayo",
    reference: "WTH-2025-09-200001",
    fees: 0,
    netAmount: 200000,
    priority: "high" as const,
    riskLevel: "high" as const,
    denialReason: "daily_limit_exceeded",
    adminNotes: "Amount exceeds daily withdrawal limit of ₦150,000"
  }
];

export const sampleEarlyReleaseRequests = [
  {
    id: "ER001",
    userId: "U001",
    user: sampleUsers[0],
    lockedAmount: 100000,
    lockReason: "Mandatory savings lock for new personnel",
    lockUntil: "2025-12-01",
    releaseReason: "Medical emergency for dependent - hospital bills required urgently",
    supportingDocument: "medical_certificate_001.pdf",
    status: "pending" as const,
    submittedAt: "2025-10-02T09:00:00Z"
  },
  {
    id: "ER002",
    userId: "U002",
    user: sampleUsers[1], 
    lockedAmount: 50000,
    lockReason: "Performance improvement plan lock",
    lockUntil: "2025-11-15",
    releaseReason: "Family emergency - father hospitalized, need funds for medical care",
    status: "pending" as const,
    submittedAt: "2025-10-01T16:30:00Z"
  },
  {
    id: "ER003",
    userId: "U003",
    user: sampleUsers[2],
    lockedAmount: 75000,
    lockReason: "Administrative hold pending investigation",
    lockUntil: "2025-10-15",
    releaseReason: "House rent due - risk of eviction without immediate payment",
    status: "approved" as const,
    submittedAt: "2025-09-28T13:15:00Z",
    processedAt: "2025-09-29T10:20:00Z",
    processedBy: "Col. Ibrahim Hassan",
    adminNotes: "Approved due to extenuating circumstances. Investigation cleared."
  }
];

export const sampleLockedFunds = {
  totalLocked: 100000,
  lockUntil: "2025-12-01",
  reason: "Mandatory savings lock for new personnel",
  policyReference: "MSF-2025-001",
  canRequestEarlyRelease: true
};

export const sampleRankAllocations: RankAllocation[] = [
  {
    id: "RA001",
    rank: "Private",
    defaultAllocation: 8000,
    effectiveFrom: "2025-01-01",
    lockPeriod: 6,
    isActive: true,
    createdBy: "Col. Ibrahim Hassan",
    createdAt: "2024-12-01T10:00:00Z",
    updatedBy: "Lt. Col. Sarah Adebayo",
    updatedAt: "2025-01-15T14:30:00Z"
  },
  {
    id: "RA002", 
    rank: "Corporal",
    defaultAllocation: 12000,
    effectiveFrom: "2025-01-01",
    lockPeriod: 6,
    isActive: true,
    createdBy: "Col. Ibrahim Hassan",
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "RA003",
    rank: "Sergeant", 
    defaultAllocation: 18000,
    effectiveFrom: "2025-01-01",
    lockPeriod: 6,
    isActive: true,
    createdBy: "Col. Ibrahim Hassan",
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "RA004",
    rank: "Lieutenant",
    defaultAllocation: 25000,
    effectiveFrom: "2025-01-01", 
    lockPeriod: 6,
    isActive: true,
    createdBy: "Col. Ibrahim Hassan",
    createdAt: "2024-12-01T10:00:00Z"
  }
];

export const sampleAllocationPayouts: AllocationPayout[] = [
  {
    id: "AP001",
    userId: sampleUsers[0].service_no,
    rank: "Sergeant",
    amount: 18000,
    payoutDate: "2025-11-01",
    status: "scheduled",
    reference: "PAY-2025-11-18001",
    description: "November 2025 monthly allocation"
  },
  {
    id: "AP002",
    userId: sampleUsers[0].service_no,
    rank: "Sergeant", 
    amount: 18000,
    payoutDate: "2025-10-01",
    status: "completed",
    reference: "PAY-2025-10-18001",
    description: "October 2025 monthly allocation"
  },
  {
    id: "AP003",
    userId: sampleUsers[0].service_no,
    rank: "Sergeant",
    amount: 18000,
    payoutDate: "2025-09-01", 
    status: "completed",
    reference: "PAY-2025-09-18001",
    description: "September 2025 monthly allocation"
  },
  {
    id: "AP004",
    userId: sampleUsers[0].service_no,
    rank: "Sergeant",
    amount: 18000,
    payoutDate: "2025-08-01",
    status: "completed", 
    reference: "PAY-2025-08-18001",
    description: "August 2025 monthly allocation"
  }
];

export const sampleAuditLog: AuditLogEntry[] = [
  {
    id: "AL001",
    action: "rank_allocation_updated",
    actor: "Lt. Col. Sarah Adebayo",
    actorRole: "finance_officer",
    timestamp: "2025-01-15T14:30:00Z",
    entityType: "rank_allocation",
    entityId: "RA001",
    beforeState: { defaultAllocation: 7500, lockPeriod: 3 },
    afterState: { defaultAllocation: 8000, lockPeriod: 6 },
    description: "Updated Private rank allocation from ₦7,500 to ₦8,000 and extended lock period to 6 months",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  },
  {
    id: "AL002",
    action: "policy_published",
    actor: "Col. Ibrahim Hassan",
    actorRole: "super_admin", 
    timestamp: "2025-01-01T08:00:00Z",
    entityType: "policy",
    entityId: "POL-2025-001",
    description: "Published new rank allocation policy effective January 1, 2025",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  },
  {
    id: "AL003",
    action: "rank_allocation_created",
    actor: "Col. Ibrahim Hassan", 
    actorRole: "super_admin",
    timestamp: "2024-12-01T10:00:00Z",
    entityType: "rank_allocation",
    entityId: "RA001",
    afterState: { defaultAllocation: 7500, lockPeriod: 3 },
    description: "Created rank allocation policy for Private rank",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  }
];

export const sampleRosterData: RosterData[] = [
  {
    rank: "Private",
    count: 12500,
    activeCount: 11250,
    totalAllocation: 90000000 // 11,250 * 8,000
  },
  {
    rank: "Corporal", 
    count: 8200,
    activeCount: 7380,
    totalAllocation: 88560000 // 7,380 * 12,000
  },
  {
    rank: "Sergeant",
    count: 3500,
    activeCount: 3150,
    totalAllocation: 56700000 // 3,150 * 18,000
  },
  {
    rank: "Lieutenant",
    count: 850,
    activeCount: 765,
    totalAllocation: 19125000 // 765 * 25,000
  }
];

// Agent App Sample Data
export const sampleAgents = [
  {
    id: "AG001",
    name: "Adamu Mohammed",
    businessName: "Adamu Mobile Money",
    phone: "+234-803-123-4567",
    bvn: "12345678901",
    agentCode: "AML001",
    location: {
      latitude: 9.0579,
      longitude: 8.6796,
      address: "Shop 15, Kwari Market, Kano State"
    },
    floatBalance: 125000,
    avatar: null,
    isActive: true,
    tier: "Premium",
    kycStatus: "verified",
    joinedAt: "2024-08-15T09:00:00Z",
    lastActive: "2025-10-04T10:30:00Z"
  },
  {
    id: "AG002", 
    name: "Grace Okafor",
    businessName: "Grace Pay Centre",
    phone: "+234-806-987-6543",
    bvn: "98765432109",
    agentCode: "GPL002",
    location: {
      latitude: 5.1958,
      longitude: 7.2012,
      address: "Block 5, Ogbete Main Market, Enugu State"
    },
    floatBalance: 89500,
    avatar: null,
    isActive: true,
    tier: "Standard",
    kycStatus: "verified",
    joinedAt: "2024-09-02T11:15:00Z",
    lastActive: "2025-10-04T08:45:00Z"
  }
];

export const sampleAgentTransactions = [
  {
    id: "AT001",
    agentId: "AG001",
    type: "cash_in" as const,
    soldierServiceNumber: "2023/0001",
    soldierName: "Amina Okoye",
    soldierRank: "Sergeant",
    amount: 5000,
    agentFee: 50,
    netAmount: 4950,
    reference: "CI-2025-10-04-001",
    status: "completed" as const,
    timestamp: "2025-10-04T10:15:00Z",
    receiptGenerated: true,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  },
  {
    id: "AT002",
    agentId: "AG001",
    type: "cash_out" as const,
    soldierServiceNumber: "2023/0002",
    soldierName: "Chinedu Emmanuel",
    soldierRank: "Corporal",
    amount: 15000,
    agentFee: 100,
    netAmount: 14900,
    reference: "CO-2025-10-04-002",
    withdrawalCode: "WTH123456",
    status: "completed" as const,
    timestamp: "2025-10-04T09:30:00Z",
    otpVerified: true
  },
  {
    id: "AT003",
    agentId: "AG001",
    type: "cash_in" as const,
    soldierServiceNumber: "2023/0003",
    soldierName: "Adebayo Folake",
    soldierRank: "Lieutenant",
    amount: 8000,
    agentFee: 0, // No fee for officers
    netAmount: 8000,
    reference: "CI-2025-10-04-003",
    status: "completed" as const,
    timestamp: "2025-10-04T08:45:00Z",
    receiptGenerated: true
  },
  {
    id: "AT004",
    agentId: "AG001", 
    type: "cash_out" as const,
    soldierServiceNumber: "2023/0004",
    soldierName: "Ibrahim Yakubu",
    soldierRank: "Private",
    amount: 25000,
    agentFee: 150,
    netAmount: 24850,
    reference: "CO-2025-10-04-004",
    withdrawalCode: "WTH789012",
    status: "pending_otp" as const,
    timestamp: "2025-10-04T10:45:00Z",
    requiresOTP: true
  },
  {
    id: "AT005",
    agentId: "AG001",
    type: "cash_in" as const,
    soldierServiceNumber: "2023/0005",
    soldierName: "Fatima Bello",
    soldierRank: "Corporal",
    amount: 3500,
    agentFee: 35,
    netAmount: 3465,
    reference: "CI-2025-10-03-005",
    status: "failed" as const,
    timestamp: "2025-10-03T16:20:00Z",
    errorReason: "Network timeout - please retry"
  }
];

export const sampleOfflineQueue = [
  {
    id: "OQ001",
    agentId: "AG001",
    type: "cash_in" as const,
    soldierServiceNumber: "2023/0006",
    soldierName: "Samuel Adekunle",
    soldierRank: "Sergeant",
    amount: 7500,
    agentFee: 75,
    netAmount: 7425,
    timestamp: "2025-10-04T11:30:00Z",
    retryCount: 2,
    lastRetry: "2025-10-04T11:35:00Z",
    status: "queued" as const
  },
  {
    id: "OQ002",
    agentId: "AG001",
    type: "cash_out" as const,
    soldierServiceNumber: "2023/0007", 
    soldierName: "Blessing Okon",
    soldierRank: "Private",
    amount: 12000,
    agentFee: 120,
    netAmount: 11880,
    withdrawalCode: "WTH345678",
    timestamp: "2025-10-04T11:45:00Z",
    retryCount: 1,
    lastRetry: "2025-10-04T11:50:00Z",
    status: "queued" as const
  }
];

export const sampleDailyReconciliation = {
  date: "2025-10-04",
  agentId: "AG001",
  summary: {
    totalCashIn: 16500,
    totalCashInFees: 85,
    cashInCount: 3,
    totalCashOut: 40000,
    totalCashOutFees: 250,
    cashOutCount: 2,
    netCashFlow: -23500,
    totalFees: 335
  },
  transactions: sampleAgentTransactions.filter(t => t.status === "completed"),
  settlementBatch: {
    id: "SB-2025-10-04-AG001",
    createdAt: "2025-10-04T18:00:00Z",
    status: "pending" as const
  }
};

// Admin Portal Sample Data
export const sampleAdminUsers = [
  {
    id: "ADM001",
    name: "Col. Ibrahim Hassan",
    email: "ibrahim.hassan@moloyal.mil.ng",
    role: "super_admin" as const,
    department: "Finance Command",
    rank: "Colonel",
    avatar: null,
    lastLogin: "2025-10-15T09:30:00Z",
    isActive: true
  },
  {
    id: "ADM002",
    name: "Major Grace Eze",
    email: "grace.eze@moloyal.mil.ng",
    role: "finance_admin" as const,
    department: "Finance Command",
    rank: "Major",
    avatar: null,
    lastLogin: "2025-10-15T08:15:00Z",
    isActive: true
  },
  {
    id: "ADM003",
    name: "Captain Sarah Adebayo",
    email: "sarah.adebayo@moloyal.mil.ng",
    role: "auditor" as const,
    department: "Audit & Compliance",
    rank: "Captain",
    avatar: null,
    lastLogin: "2025-10-15T07:45:00Z",
    isActive: true
  },
  {
    id: "ADM004",
    name: "Lt. John Okonkwo",
    email: "john.okonkwo@moloyal.mil.ng",
    role: "support" as const,
    department: "Personnel Support",
    rank: "Lieutenant",
    avatar: null,
    lastLogin: "2025-10-15T10:00:00Z",
    isActive: true
  }
];

export const samplePayrollUploadHistory = [
  {
    id: "PU001",
    fileName: "payroll_october_2025.csv",
    uploadedBy: "ADM002",
    uploadedByName: "Major Grace Eze",
    uploadedAt: "2025-10-01T09:00:00Z",
    totalRecords: 25050,
    successfulRecords: 25050,
    failedRecords: 0,
    totalAmount: 254385000,
    status: "completed" as const,
    processingTime: 180
  },
  {
    id: "PU002",
    fileName: "payroll_september_2025.csv",
    uploadedBy: "ADM002",
    uploadedByName: "Major Grace Eze",
    uploadedAt: "2025-09-01T09:15:00Z",
    totalRecords: 25020,
    successfulRecords: 24998,
    failedRecords: 22,
    totalAmount: 253950000,
    status: "completed_with_errors" as const,
    processingTime: 185
  }
];

export const samplePayrollValidationErrors = [
  {
    row: 156,
    serviceNumber: "NA-15678",
    error: "Invalid service number format",
    suggestion: "Service number should match pattern NA-XXXXX"
  },
  {
    row: 302,
    serviceNumber: "NA-30245",
    error: "Rank code 'X7' not found in system",
    suggestion: "Valid rank codes: R1 (Private), R2 (Corporal), R3 (Sergeant), R4 (Lieutenant)"
  },
  {
    row: 1024,
    serviceNumber: "NA-10240",
    error: "Amount exceeds maximum allocation for rank",
    suggestion: "Maximum for Corporal rank is ₦12,000"
  }
];

export const sampleKPIData = {
  totalUsers: 25050,
  totalUsersTrend: 2.5,
  activeSavers: 18750,
  activeSaversTrend: 5.2,
  totalFunds: 1250000000,
  totalFundsTrend: 12.3,
  lockedFunds: 450000000,
  lockedFundsTrend: -3.4,
  pendingWithdrawals: 125,
  pendingWithdrawalsTrend: 8.1,
  monthlyGrowth: [
    { month: "Apr", value: 1100000000 },
    { month: "May", value: 1150000000 },
    { month: "Jun", value: 1180000000 },
    { month: "Jul", value: 1200000000 },
    { month: "Aug", value: 1220000000 },
    { month: "Sep", value: 1240000000 },
    { month: "Oct", value: 1250000000 }
  ]
};

export const sampleExtendedUsers = [
  {
    ...sampleUsers[0],
    email: "amina.okoye@army.mil.ng",
    phone: "+234-803-456-7890",
    regiment: "1st Division Infantry",
    branch: "Nigerian Army",
    kycStatus: "verified" as const,
    accountStatus: "active" as const,
    balance: 285000,
    lockedBalance: 100000,
    lastLogin: "2025-10-14T18:30:00Z",
    createdAt: "2024-03-15T09:00:00Z",
    suspendedAt: null,
    suspendedBy: null,
    suspensionReason: null
  },
  {
    ...sampleUsers[1],
    email: "chinedu.emmanuel@army.mil.ng",
    phone: "+234-806-123-4567",
    regiment: "2nd Brigade Artillery",
    branch: "Nigerian Army",
    kycStatus: "verified" as const,
    accountStatus: "active" as const,
    balance: 145000,
    lockedBalance: 50000,
    lastLogin: "2025-10-15T07:20:00Z",
    createdAt: "2024-05-20T11:30:00Z",
    suspendedAt: null,
    suspendedBy: null,
    suspensionReason: null
  },
  {
    ...sampleUsers[2],
    email: "adebayo.folake@army.mil.ng",
    phone: "+234-701-987-6543",
    regiment: "3rd Division Mechanized",
    branch: "Nigerian Army",
    kycStatus: "verified" as const,
    accountStatus: "active" as const,
    balance: 520000,
    lockedBalance: 75000,
    lastLogin: "2025-10-15T09:45:00Z",
    createdAt: "2023-11-10T08:15:00Z",
    suspendedAt: null,
    suspendedBy: null,
    suspensionReason: null
  },
  {
    name: "Musa Abdullahi",
    rank: "Private",
    service_no: "NA-44567",
    bvn: "23456789012",
    allocation: 8000,
    email: "musa.abdullahi@army.mil.ng",
    phone: "+234-805-234-5678",
    regiment: "7th Division Infantry",
    branch: "Nigerian Army",
    kycStatus: "pending" as const,
    accountStatus: "active" as const,
    balance: 42000,
    lockedBalance: 32000,
    avatar: null,
    lastLogin: "2025-10-13T16:00:00Z",
    createdAt: "2025-06-01T10:00:00Z",
    suspendedAt: null,
    suspendedBy: null,
    suspensionReason: null
  },
  {
    name: "Blessing Nwosu",
    rank: "Corporal",
    service_no: "NA-55678",
    bvn: "34567890123",
    allocation: 12000,
    email: "blessing.nwosu@army.mil.ng",
    phone: "+234-809-345-6789",
    regiment: "4th Brigade Engineering",
    branch: "Nigerian Army",
    kycStatus: "verified" as const,
    accountStatus: "suspended" as const,
    balance: 98000,
    lockedBalance: 0,
    avatar: null,
    lastLogin: "2025-09-28T14:20:00Z",
    createdAt: "2024-08-12T13:45:00Z",
    suspendedAt: "2025-10-01T10:00:00Z",
    suspendedBy: "ADM001",
    suspensionReason: "Pending security clearance review"
  }
];

export const sampleAdminAuditLogs = [
  {
    id: "AL001",
    timestamp: "2025-10-15T09:30:15Z",
    actor: "ADM002",
    actorName: "Major Grace Eze",
    actorRole: "finance_admin" as const,
    action: "payroll_upload" as const,
    resource: "Payroll Batch",
    resourceId: "PU001",
    description: "Uploaded October 2025 payroll batch with 25,050 records",
    ipAddress: "10.20.30.40",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      fileName: "payroll_october_2025.csv",
      totalRecords: 25050,
      totalAmount: 254385000
    },
    severity: "info" as const
  },
  {
    id: "AL002",
    timestamp: "2025-10-15T08:45:20Z",
    actor: "ADM001",
    actorName: "Col. Ibrahim Hassan",
    actorRole: "super_admin" as const,
    action: "user_suspended" as const,
    resource: "User Account",
    resourceId: "NA-55678",
    description: "Suspended user account: Blessing Nwosu (Corporal)",
    ipAddress: "10.20.30.41",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    changes: {
      before: { accountStatus: "active" },
      after: { accountStatus: "suspended", reason: "Pending security clearance review" }
    },
    severity: "warning" as const
  },
  {
    id: "AL003",
    timestamp: "2025-10-15T07:20:10Z",
    actor: "ADM004",
    actorName: "Lt. John Okonkwo",
    actorRole: "support" as const,
    action: "pin_reset" as const,
    resource: "User Account",
    resourceId: "NA-44567",
    description: "Reset PIN for Musa Abdullahi (Private) upon user request",
    ipAddress: "10.20.30.42",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    changes: {
      resetMethod: "SMS OTP",
      requestId: "PR-2025-10-15-001"
    },
    severity: "info" as const
  },
  {
    id: "AL004",
    timestamp: "2025-10-14T16:30:45Z",
    actor: "ADM001",
    actorName: "Col. Ibrahim Hassan",
    actorRole: "super_admin" as const,
    action: "policy_update" as const,
    resource: "Rank Allocation Policy",
    resourceId: "RA003",
    description: "Updated Sergeant rank allocation from ₦16,000 to ₦18,000",
    ipAddress: "10.20.30.41",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    changes: {
      before: { defaultAllocation: 16000 },
      after: { defaultAllocation: 18000 },
      effectiveFrom: "2025-11-01"
    },
    severity: "critical" as const
  },
  {
    id: "AL005",
    timestamp: "2025-10-14T11:15:30Z",
    actor: "ADM003",
    actorName: "Captain Sarah Adebayo",
    actorRole: "auditor" as const,
    action: "report_generated" as const,
    resource: "Financial Report",
    resourceId: "REP-2025-Q3",
    description: "Generated Q3 2025 quarterly financial report",
    ipAddress: "10.20.30.43",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      reportType: "quarterly",
      period: "2025-Q3",
      format: "PDF"
    },
    severity: "info" as const
  },
  {
    id: "AL006",
    timestamp: "2025-10-13T14:00:00Z",
    actor: "ADM002",
    actorName: "Major Grace Eze",
    actorRole: "finance_admin" as const,
    action: "withdrawal_approved" as const,
    resource: "Withdrawal Request",
    resourceId: "WR-2025-10-100045",
    description: "Approved withdrawal request for ₦75,000 - Chinedu Emmanuel",
    ipAddress: "10.20.30.40",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      before: { status: "pending" },
      after: { status: "approved" },
      approvalNotes: "Verified supporting documents"
    },
    severity: "info" as const
  },
  {
    id: "AL007",
    timestamp: "2025-10-12T09:45:00Z",
    actor: "SYSTEM",
    actorName: "System Automated Process",
    actorRole: "system" as const,
    action: "failed_login" as const,
    resource: "Admin Login",
    resourceId: "ADM002",
    description: "Failed login attempt detected - incorrect credentials",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      attemptCount: 3,
      accountLocked: false
    },
    severity: "warning" as const
  }
];

export const sampleReportFilters = {
  dateRanges: [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7days" },
    { label: "Last 30 days", value: "30days" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Quarter", value: "thisQuarter" },
    { label: "Custom Range", value: "custom" }
  ],
  ranks: ["Private", "Corporal", "Sergeant", "Lieutenant", "Captain", "Major", "Colonel"],
  regiments: [
    "1st Division Infantry",
    "2nd Brigade Artillery",
    "3rd Division Mechanized",
    "4th Brigade Engineering",
    "7th Division Infantry",
    "81st Division",
    "82nd Division"
  ],
  branches: [
    "Nigerian Army",
    "Nigerian Navy",
    "Nigerian Air Force"
  ],
  reportTypes: [
    { label: "Transaction Summary", value: "transactions" },
    { label: "User Activity", value: "user_activity" },
    { label: "Financial Overview", value: "financial" },
    { label: "Allocation Report", value: "allocations" },
    { label: "Withdrawal Report", value: "withdrawals" },
    { label: "Audit Log", value: "audit" }
  ]
};

// Notification and Announcement Data
export const sampleNotifications: Notification[] = [
  {
    id: "N001",
    type: "system",
    title: "Payroll Allocation Received",
    message: "Your monthly allocation of ₦10,000 has been credited to your account.",
    timestamp: "2025-10-15T08:00:00Z",
    read: false,
    priority: "medium",
    category: "transaction",
    metadata: {
      transactionId: "TXN-2025-10-15-001",
      amount: 10000
    }
  },
  {
    id: "N002",
    type: "system",
    title: "Goal Milestone Reached",
    message: "Congratulations! Your Emergency Fund has reached 50% of target.",
    timestamp: "2025-10-14T15:30:00Z",
    read: false,
    priority: "low",
    category: "goal",
    actionLabel: "View Goal",
    metadata: {
      goalId: "1"
    }
  },
  {
    id: "N003",
    type: "system",
    title: "Withdrawal Approved",
    message: "Your withdrawal request of ₦15,000 has been approved and processed.",
    timestamp: "2025-10-13T11:20:00Z",
    read: true,
    priority: "high",
    category: "transaction",
    metadata: {
      transactionId: "TXN-2025-10-13-042",
      amount: 15000
    }
  },
  {
    id: "N004",
    type: "system",
    title: "Security Alert",
    message: "New login detected from Windows device in Lagos, Nigeria.",
    timestamp: "2025-10-12T09:45:00Z",
    read: true,
    priority: "urgent",
    category: "security",
    actionLabel: "Review Activity"
  },
  {
    id: "N005",
    type: "system",
    title: "Goal Contribution Scheduled",
    message: "Your next automatic contribution of ₦8,333 will be deducted on Nov 1, 2025.",
    timestamp: "2025-10-11T07:00:00Z",
    read: true,
    priority: "low",
    category: "goal",
    metadata: {
      goalId: "1",
      amount: 8333
    }
  },
  {
    id: "N006",
    type: "announcement",
    title: "New Policy Update - Enhanced Withdrawal Limits",
    message: "The Nigerian Army Finance Corps has approved increased withdrawal limits for all ranks effective Nov 1, 2025.",
    timestamp: "2025-10-10T06:00:00Z",
    read: false,
    priority: "high",
    category: "policy",
    actionLabel: "Read More"
  }
];

export const sampleArmyAnnouncements: ArmyAnnouncement[] = [
  {
    id: "ANN001",
    title: "Enhanced Withdrawal Limits for All Ranks",
    body: "Dear Personnel,\\n\\nThe Nigerian Army Finance Corps is pleased to announce enhanced withdrawal limits effective November 1, 2025.\\n\\n**New Limits:**\\n- Private/Corporal: ₦100,000 per transaction (up from ₦50,000)\\n- Sergeant: ₦150,000 per transaction (up from ₦75,000)\\n- Lieutenant and above: ₦250,000 per transaction (up from ₦150,000)\\n\\n**What This Means:**\\n- Greater flexibility for emergency expenses\\n- Reduced processing time for standard withdrawals\\n- All security measures remain in place\\n\\nFor questions, contact your Regimental Finance Officer.\\n\\n**Nigerian Army Finance Corps**\\nServing Those Who Serve",
    createdBy: "Colonel Ibrahim Musa",
    createdAt: "2025-10-08T10:00:00Z",
    publishedAt: "2025-10-10T06:00:00Z",
    expiresAt: "2025-11-10T23:59:59Z",
    status: "published",
    priority: "high",
    targetAudience: {
      type: "all"
    },
    attachments: [
      {
        id: "ATT001",
        name: "Withdrawal_Limits_Policy_Nov2025.pdf",
        type: "pdf",
        url: "#",
        size: 245000
      },
      {
        id: "ATT002",
        name: "FAQ - Withdrawal Updates",
        type: "link",
        url: "https://moloyal.ng/faq/withdrawals"
      }
    ],
    analytics: {
      delivered: 45678,
      opened: 32451,
      clicked: 12340,
      targetCount: 45678
    }
  },
  {
    id: "ANN002",
    title: "October Payroll Schedule - Allocation Dates",
    body: "**Attention All Personnel**\\n\\nOctober monthly allocations will be credited according to the following schedule:\\n\\n**Week 1 (Oct 28-29):**\\n- 1st Division Infantry\\n- 2nd Brigade Artillery\\n\\n**Week 2 (Oct 30-31):**\\n- 3rd Division Mechanized\\n- 7th Division Infantry\\n\\n**Week 3 (Nov 1-2):**\\n- All other formations\\n\\n**Important Notes:**\\n- Allocations will be credited by 6:00 AM on your scheduled date\\n- SMS notifications will be sent upon successful credit\\n- Contact your unit finance officer for any discrepancies\\n\\nThank you for your service.\\n\\n**NA Finance Directorate**",
    createdBy: "Major Grace Eze",
    createdAt: "2025-10-05T14:30:00Z",
    publishedAt: "2025-10-06T08:00:00Z",
    expiresAt: "2025-11-05T23:59:59Z",
    status: "published",
    priority: "medium",
    targetAudience: {
      type: "all"
    },
    analytics: {
      delivered: 45678,
      opened: 38920,
      clicked: 5430,
      targetCount: 45678
    }
  },
  {
    id: "ANN003",
    title: "Mandatory KYC Update for Sergeants and Above",
    body: "**Urgent: KYC Compliance Required**\\n\\nAll personnel holding the rank of Sergeant and above must complete enhanced KYC verification by November 30, 2025.\\n\\n**Required Documents:**\\n1. Updated BVN verification\\n2. Current residential address proof\\n3. Next of kin information\\n4. Updated phone number and email\\n\\n**How to Update:**\\n- Log into MoLoyal app\\n- Navigate to Settings > Profile > KYC Update\\n- Upload required documents\\n- Wait for verification (2-3 business days)\\n\\n**Deadline:** November 30, 2025\\n**Penalty:** Accounts not updated will have restricted withdrawal access\\n\\nFor assistance, visit your nearest MoLoyal agent or contact support.\\n\\n**Compliance Department**\\nNigerian Army Finance Corps",
    createdBy: "Captain Okonkwo James",
    createdAt: "2025-10-01T09:00:00Z",
    publishedAt: "2025-10-02T07:00:00Z",
    expiresAt: "2025-11-30T23:59:59Z",
    status: "published",
    priority: "urgent",
    targetAudience: {
      type: "rank",
      ranks: ["Sergeant", "Lieutenant"]
    },
    attachments: [
      {
        id: "ATT003",
        name: "KYC_Requirements_Checklist.pdf",
        type: "pdf",
        url: "#",
        size: 189000
      }
    ],
    analytics: {
      delivered: 12340,
      opened: 9870,
      clicked: 6540,
      targetCount: 12340
    }
  },
  {
    id: "ANN004",
    title: "MoLoyal Mobile App Update - New Features Available",
    body: "**Exciting New Features!**\\n\\nWe've just released MoLoyal v2.5 with enhanced features:\\n\\n**What's New:**\\n✅ Biometric login (fingerprint/face ID)\\n✅ Dark mode support\\n✅ Enhanced goal tracking with charts\\n✅ Quick balance view widget\\n✅ Improved transaction search\\n✅ Offline receipt viewing\\n\\n**Performance Improvements:**\\n- 40% faster app startup\\n- Reduced data usage\\n- Better offline functionality\\n\\n**Update Now:**\\n- Android: Google Play Store\\n- iOS: Apple App Store\\n\\nUpdate is optional but highly recommended for the best experience.\\n\\n**MoLoyal Tech Team**",
    createdBy: "Tech Support Team",
    createdAt: "2025-09-28T11:00:00Z",
    publishedAt: "2025-09-30T08:00:00Z",
    expiresAt: "2025-10-30T23:59:59Z",
    status: "published",
    priority: "low",
    targetAudience: {
      type: "all"
    },
    attachments: [
      {
        id: "ATT004",
        name: "Release Notes v2.5",
        type: "link",
        url: "https://moloyal.ng/updates/v2.5"
      }
    ],
    analytics: {
      delivered: 45678,
      opened: 28900,
      clicked: 15600,
      targetCount: 45678
    }
  },
  {
    id: "ANN005",
    title: "[DRAFT] Year-End Financial Planning Workshop",
    body: "**Financial Planning Workshop - December 2025**\\n\\nJoin us for a comprehensive financial planning workshop designed specifically for military personnel.\\n\\n**Topics Covered:**\\n- Effective savings strategies\\n- Investment opportunities for service members\\n- Retirement planning\\n- Emergency fund management\\n- Tax optimization\\n\\n**Details:**\\n- Date: December 15, 2025\\n- Time: 10:00 AM - 4:00 PM\\n- Venue: Army HQ Conference Hall, Abuja\\n- Registration: Free (Limited seats)\\n\\n**Guest Speakers:**\\n- Financial advisors from top Nigerian banks\\n- Retired senior officers sharing their experiences\\n- Investment experts\\n\\nRegistration opens November 1, 2025.\\n\\n**Professional Development Office**",
    createdBy: "Colonel Ibrahim Musa",
    createdAt: "2025-10-14T15:00:00Z",
    status: "draft",
    priority: "medium",
    targetAudience: {
      type: "rank",
      ranks: ["Sergeant", "Lieutenant"]
    }
  }
];

export const sampleNotificationSettings: NotificationSettings = {
  userId: "NA-12345",
  push: {
    enabled: true,
    categories: {
      transactions: true,
      goals: true,
      security: true,
      announcements: true
    }
  },
  sms: {
    enabled: true,
    categories: {
      transactions: true,
      security: true
    }
  },
  email: {
    enabled: true,
    categories: {
      transactions: true,
      goals: false,
      security: true,
      announcements: true,
      weekly_summary: true
    }
  }
};
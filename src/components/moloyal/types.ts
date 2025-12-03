// MoLoyal Design System Types
export interface User {
  name: string;
  rank: string;
  service_no: string;
  bvn?: string;
  allocation: number;
  avatar?: string;
}

// Add missing Admin type (only declare once)
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin" | "finance_officer";
  permissions: string[];
  lastLogin?: string;
}

// Add missing Agent type
export interface Agent {
  id: string;
  name: string;
  agentId: string;
  floatBalance: number;
  location: string;
  status: "active" | "inactive" | "suspended";
  lastSync?: string;
}

export type Rank = "Private" | "Corporal" | "Sergeant" | "Lieutenant";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export type CardVariant =
  | "balance"
  | "goal"
  | "transaction-compact"
  | "transaction-expanded";

export interface Goal {
  id: string;
  title: string; // Changed from name to title
  description?: string;
  target: number;
  current: number;
  deadline: string;
  priority?: "low" | "medium" | "high";
  currency?: string;
  contributionSchedule?: ContributionSchedule;
  autoDeduct?: boolean;
  status?: "active" | "completed" | "paused" | "locked";
  createdAt?: string;
  contributions?: Contribution[];
}

export interface ContributionSchedule {
  type: "one-off" | "weekly" | "monthly" | "per-payroll";
  amount: number;
  frequency?: number; // for weekly/monthly
  alignWithPayCycle?: boolean;
  nextContribution?: string;
}

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  type: "manual" | "automatic" | "payroll";
  status: "completed" | "pending" | "failed";
  description?: string;
}

export interface RankAllocation {
  id: string;
  rank: Rank;
  defaultAllocation: number;
  effectiveFrom: string;
  lockPeriod: number; // months
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface AllocationPayout {
  id: string;
  userId: string;
  rank: Rank;
  amount: number;
  payoutDate: string;
  status: "scheduled" | "processing" | "completed" | "failed";
  reference: string;
  description?: string;
}

export interface AuditLogEntry {
  id: string;
  action:
    | "rank_allocation_created"
    | "rank_allocation_updated"
    | "rank_allocation_deleted"
    | "policy_published";
  actor: string;
  actorRole: "admin" | "super_admin" | "finance_officer";
  timestamp: string;
  entityType: "rank_allocation" | "policy" | "user";
  entityId: string;
  beforeState?: any;
  afterState?: any;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RosterData {
  rank: Rank;
  count: number;
  activeCount: number;
  totalAllocation: number;
}

export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  category?: string;
  status?: "completed" | "pending" | "locked" | "failed" | "denied";
  // Enhanced transaction details
  subCategory?:
    | "payroll"
    | "goal-contribution"
    | "withdrawal"
    | "deposit"
    | "fee"
    | "bonus"
    | "refund";
  initiatedBy?: string;
  processedAt?: string | null;
  referenceId?: string;
  note?: string;
  supportingDocuments?: string[];
  denialReason?: string;
  appealable?: boolean;
  merchantName?: string;
  goalId?: string;
  originalAmount?: number;
  exchangeRate?: number;
  balanceAfter?: number;
  fees?: {
    amount: number;
    description: string;
  }[];
}

export interface TransactionFilter {
  dateRange?: {
    from: string;
    to: string;
  };
  type?: "all" | "credit" | "debit";
  status?: "all" | "completed" | "pending" | "failed" | "denied";
  category?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface Notification {
  id: string;
  type: "system" | "announcement";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: "transaction" | "goal" | "security" | "policy" | "general";
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    transactionId?: string;
    goalId?: string;
    amount?: number;
  };
}

export interface ArmyAnnouncement {
  id: string;
  title: string;
  body: string;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
  status: "draft" | "scheduled" | "published" | "expired";
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: {
    type: "all" | "rank" | "regiment" | "custom";
    ranks?: Rank[];
    regiments?: string[];
    customUserIds?: string[];
  };
  scheduledSendDate?: string;
  attachments?: {
    id: string;
    name: string;
    type: "pdf" | "link" | "image";
    url: string;
    size?: number;
  }[];
  analytics?: {
    delivered: number;
    opened: number;
    clicked: number;
    targetCount: number;
  };
}

export interface NotificationSettings {
  userId: string;
  push: {
    enabled: boolean;
    categories: {
      transactions: boolean;
      goals: boolean;
      security: boolean;
      announcements: boolean;
    };
  };
  sms: {
    enabled: boolean;
    categories: {
      transactions: boolean;
      security: boolean;
    };
  };
  email: {
    enabled: boolean;
    categories: {
      transactions: boolean;
      goals: boolean;
      security: boolean;
      announcements: boolean;
      weekly_summary: boolean;
    };
  };
}

// REMOVED THE DUPLICATE EXPORT DECLARATION AT THE END
// The types are already exported with their declarations above

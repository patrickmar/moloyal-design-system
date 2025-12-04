import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Grid3x3 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ScrollArea } from "./components/ui/scroll-area";

// Design System
import {
  MoLoyalButton,
  MoLoyalInput,
  BalanceCard,
  GoalCard,
  TransactionRow,
  MoLoyalBadge,
  MoLoyalModal,
  MoLoyalTable,
  MoLoyalProgressBar,
  MoLoyalBottomNav,
  MoLoyalAppBar,
} from "./components/moloyal";

// Agent App Screens
import { MoLoyalAgentLogin } from "./components/moloyal/MoLoyalAgentLogin";
import { MoLoyalAgentCashIn } from "./components/moloyal/MoLoyalAgentCashIn";
import { MoLoyalAgentCashOut } from "./components/moloyal/MoLoyalAgentCashOut";
import { MoLoyalAgentKYC } from "./components/moloyal/MoLoyalAgentKYC";
import { MoLoyalAgentReconciliation } from "./components/moloyal/MoLoyalAgentReconciliation";
import { MoLoyalAgentOfflineQueue } from "./components/moloyal/MoLoyalAgentOfflineQueue";

// Admin Portal Screens
import { MoLoyalAdminLogin } from "./components/moloyal/MoLoyalAdminLogin";
import { MoLoyalAdminDashboard } from "./components/moloyal/MoLoyalAdminDashboard";
import { MoLoyalAdminUserManagement } from "./components/moloyal/MoLoyalAdminUserManagement";
import { MoLoyalAdminPayroll } from "./components/moloyal/MoLoyalAdminPayroll";
import { MoLoyalAdminAnnouncementComposer } from "./components/moloyal/MoLoyalAdminAnnouncementComposer";
import { MoLoyalAdminReports } from "./components/moloyal/MoLoyalAdminReports";
import { MoLoyalAdminAuditLogs } from "./components/moloyal/MoLoyalAdminAuditLogs";

// Mobile Notifications
import { MoLoyalNotificationsCenter } from "./components/moloyal/MoLoyalNotificationsCenter";
import { MoLoyalAnnouncementDetail } from "./components/moloyal/MoLoyalAnnouncementDetail";
import { MoLoyalNotificationSettings } from "./components/moloyal/MoLoyalNotificationSettings";

// QA & Testing
import { MoLoyalAccessibilityChecklist } from "./components/moloyal/MoLoyalAccessibilityChecklist";
import { MoLoyalTestPlan } from "./components/moloyal/MoLoyalTestPlan";

// Sample Data
import {
  sampleAgents,
  sampleUsers,
  sampleKPIData,
  sampleExtendedUsers,
  sampleRankAllocations,
  sampleAdminAuditLogs,
  sampleRosterData,
  sampleDailyReconciliation,
  sampleOfflineQueue,
  sampleAdminUsers,
  sampleArmyAnnouncements,
  sampleReportFilters,
  sampleNotifications,
  sampleNotificationSettings,
} from "./components/moloyal/data";

// Import types
import {
  Admin,
  Agent,
  TransactionType,
  Goal,
  User,
} from "./components/moloyal/types";

interface DemoStep {
  id: string;
  section: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

// Demo wrapper components with sample data
const DemoAgentLogin = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentLogin
      onLogin={(agent: Agent) => console.log("Agent logged in:", agent)}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);

const DemoAgentCashIn = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentCashIn
      agent={sampleAgents[0]}
      onBack={() => console.log("Back clicked")}
      onTransactionComplete={(tx: any) =>
        console.log("Transaction complete:", tx)
      }
    />
  </div>
);

const DemoAgentCashOut = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentCashOut
      agent={sampleAgents[0]}
      onBack={() => console.log("Back clicked")}
      onTransactionComplete={(tx: any) =>
        console.log("Transaction complete:", tx)
      }
    />
  </div>
);

const DemoAgentKYC = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentKYC
      agent={sampleAgents[0]}
      onBack={() => console.log("Back clicked")}
      onKYCComplete={(data: any) => console.log("KYC submitted:", data)}
    />
  </div>
);

const DemoAgentReconciliation = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentReconciliation
      agent={sampleAgents[0]}
      reconciliationData={sampleDailyReconciliation}
      onBack={() => console.log("Back clicked")}
      onSettlementCreated={(batchId: string) =>
        console.log("Settlement created:", batchId)
      }
    />
  </div>
);

const DemoAgentOfflineQueue = () => (
  <div className="w-full max-w-md mx-auto p-4">
    <MoLoyalAgentOfflineQueue
      agent={sampleAgents[0]}
      queuedTransactions={sampleOfflineQueue}
      onBack={() => console.log("Back clicked")}
      onRetry={(transactionId: string) =>
        console.log("Retry transaction:", transactionId)
      }
    />
  </div>
);

const DemoAdminLogin = () => {
  // Create a complete Admin object with all required properties
  const handleLoginSuccess = (admin: Admin, sessionToken: string) => {
    console.log("Admin login successful:", admin);
    console.log("Session token:", sessionToken);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* <MoLoyalAdminLogin 
        onLoginSuccess={handleLoginSuccess}
      /> */}
    </div>
  );
};

const DemoAdminDashboard = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminDashboard
      kpiData={sampleKPIData}
      adminName={sampleAdminUsers[0].name}
      adminRole={sampleAdminUsers[0].role}
    />
  </div>
);

const DemoAdminUserManagement = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminUserManagement
      users={sampleExtendedUsers}
      onUserAction={(userId: string, action: string, reason?: string) =>
        console.log(
          "User action:",
          action,
          "for user:",
          userId,
          "reason:",
          reason
        )
      }
    />
  </div>
);

const DemoAdminPayroll = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminPayroll
      onUploadComplete={(data: any) => console.log("Upload complete:", data)}
    />
  </div>
);

const DemoAdminAnnouncements = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminAnnouncementComposer
      announcements={sampleArmyAnnouncements}
      onCreateAnnouncement={(announcement: any) =>
        console.log("Created:", announcement)
      }
      onPublishAnnouncement={(id: string) => console.log("Published:", id)}
      onDeleteDraft={(id: string) => console.log("Deleted draft:", id)}
    />
  </div>
);

const DemoAdminReports = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminReports filters={sampleReportFilters} />
  </div>
);

const DemoAdminAuditLogs = () => (
  <div className="w-full h-[700px]">
    <MoLoyalAdminAuditLogs logs={sampleAdminAuditLogs} />
  </div>
);

const DemoNotificationsCenter = () => (
  <div className="w-full max-w-md mx-auto">
    <MoLoyalNotificationsCenter
      user={sampleUsers[0]}
      notifications={sampleNotifications}
      announcements={sampleArmyAnnouncements}
      onNotificationClick={(notif: any) =>
        console.log("Notification clicked:", notif)
      }
      onAnnouncementClick={(announcement: any) =>
        console.log("Announcement clicked:", announcement)
      }
    />
  </div>
);

const DemoAnnouncementDetail = () => (
  <div className="w-full max-w-md mx-auto">
    <MoLoyalAnnouncementDetail
      announcement={sampleArmyAnnouncements[0]}
      user={sampleUsers[0]}
      onBack={() => console.log("Back clicked")}
    />
  </div>
);

const DemoNotificationSettings = () => (
  <div className="w-full max-w-md mx-auto">
    <MoLoyalNotificationSettings
      user={sampleUsers[0]}
      settings={sampleNotificationSettings}
      onBack={() => console.log("Back clicked")}
      onSaveSettings={(settings: any) =>
        console.log("Settings saved:", settings)
      }
    />
  </div>
);

const DemoAccessibilityChecklist = () => (
  <div className="w-full p-4">
    <MoLoyalAccessibilityChecklist />
  </div>
);

const DemoTestPlan = () => (
  <div className="w-full p-4">
    <MoLoyalTestPlan />
  </div>
);

const DemoDesignButtons = () => (
  <div className="w-full max-w-4xl mx-auto p-8">
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <MoLoyalButton variant="primary">Primary</MoLoyalButton>
          <MoLoyalButton variant="secondary">Secondary</MoLoyalButton>
          <MoLoyalButton variant="ghost">Ghost</MoLoyalButton>
          <MoLoyalButton variant="danger">Danger</MoLoyalButton>
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-4">Button Sizes</h3>
        <div className="flex items-center gap-3">
          <MoLoyalButton size="small">Small</MoLoyalButton>
          <MoLoyalButton size="medium">Medium</MoLoyalButton>
          <MoLoyalButton size="large">Large</MoLoyalButton>
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-4">Button States</h3>
        <div className="flex flex-wrap gap-3">
          <MoLoyalButton loading>Loading</MoLoyalButton>
          <MoLoyalButton disabled>Disabled</MoLoyalButton>
          <MoLoyalButton fullWidth>Full Width</MoLoyalButton>
        </div>
      </div>
    </div>
  </div>
);

const DemoDesignInputs = () => (
  <div className="w-full max-w-4xl mx-auto p-8">
    <div className="space-y-4 max-w-md">
      <MoLoyalInput
        label="Service Number"
        placeholder="Enter your service number"
        helperText="Format: XX-XXXXX"
      />
      <MoLoyalInput
        label="Amount"
        placeholder="Enter amount"
        error="Amount must be greater than ₦100"
      />
      <MoLoyalInput
        label="Phone Number"
        placeholder="+234 XXX XXX XXXX"
        helperText="Your registered mobile number"
      />
      <MoLoyalInput
        label="Disabled Field"
        placeholder="This field is disabled"
        disabled
      />
    </div>
  </div>
);

const DemoDesignCards = () => {
  // Create a properly typed goal object
  const goal: Goal = {
    id: "1",
    title: "Emergency Fund",
    current: 45000,
    target: 100000,
    deadline: "2025-12-31",
  };

  // Create a properly typed transaction object
  const transaction = {
    id: "1",
    type: "credit" as TransactionType,
    amount: 5000,
    description: "Payroll Allocation",
    date: "2025-10-20",
    status: "completed" as "completed" | "pending" | "denied" | "failed",
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-6">
      <h3 className="text-xl mb-4">Balance Card</h3>
      <BalanceCard balance={125450} allocation={50000} />
      <h3 className="text-xl mb-4 mt-8">Goal Card</h3>
      <GoalCard goal={goal} onClick={() => console.log("Goal clicked")} />
      <h3 className="text-xl mb-4 mt-8">Transaction Row</h3>
      <TransactionRow transaction={transaction} />
    </div>
  );
};

const DemoDesignBadges = () => (
  <div className="w-full max-w-4xl mx-auto p-8">
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-4">Rank Badges - Small</h3>
        <div className="flex flex-wrap gap-2">
          <MoLoyalBadge rank="Private" size="sm" />
          <MoLoyalBadge rank="Corporal" size="sm" />
          <MoLoyalBadge rank="Sergeant" size="sm" />
          <MoLoyalBadge rank="Lieutenant" size="sm" />
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-4">Rank Badges - Medium (Default)</h3>
        <div className="flex flex-wrap gap-2">
          <MoLoyalBadge rank="Private" />
          <MoLoyalBadge rank="Corporal" />
          <MoLoyalBadge rank="Sergeant" />
          <MoLoyalBadge rank="Lieutenant" />
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-4">Rank Badges - Large</h3>
        <div className="flex flex-wrap gap-2">
          <MoLoyalBadge rank="Private" size="lg" />
          <MoLoyalBadge rank="Corporal" size="lg" />
          <MoLoyalBadge rank="Sergeant" size="lg" />
          <MoLoyalBadge rank="Lieutenant" size="lg" />
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-4">Without Icons</h3>
        <div className="flex flex-wrap gap-2">
          <MoLoyalBadge rank="Private" showIcon={false} />
          <MoLoyalBadge rank="Corporal" showIcon={false} />
          <MoLoyalBadge rank="Sergeant" showIcon={false} />
          <MoLoyalBadge rank="Lieutenant" showIcon={false} />
        </div>
      </div>
    </div>
  </div>
);

const demoSteps: DemoStep[] = [
  // Introduction
  {
    id: "intro",
    section: "Introduction",
    title: "Welcome to MoLoyal",
    description:
      "A military-grade fintech app for military personnel to manage savings and financial goals with offline-first capabilities.",
    component: <IntroScreen />,
  },

  // Design System
  {
    id: "design-buttons",
    section: "Design System",
    title: "Button Components",
    description:
      "Military-themed buttons with multiple variants (primary, secondary, outline, ghost) and sizes.",
    component: <DemoDesignButtons />,
  },
  {
    id: "design-inputs",
    section: "Design System",
    title: "Input Fields",
    description:
      "Accessible form inputs with validation states, icons, and helper text.",
    component: <DemoDesignInputs />,
  },
  {
    id: "design-cards",
    section: "Design System",
    title: "Card Components",
    description:
      "Reusable cards for balances, goals, and transactions with consistent styling.",
    component: <DemoDesignCards />,
  },
  {
    id: "design-badges",
    section: "Design System",
    title: "Rank Badges",
    description:
      "Military rank badges with color-coding and hierarchy visualization.",
    component: <DemoDesignBadges />,
  },

  // Agent Journey
  {
    id: "agent-login",
    section: "Agent App",
    title: "Agent Login",
    description:
      "Secure agent authentication with float balance display and offline status indicators.",
    component: <DemoAgentLogin />,
  },
  {
    id: "agent-cashin",
    section: "Agent App",
    title: "Cash-In Flow",
    description:
      "Accept cash deposits from military personnel with service number lookup and receipt generation.",
    component: <DemoAgentCashIn />,
  },
  {
    id: "agent-cashout",
    section: "Agent App",
    title: "Cash-Out Flow",
    description:
      "Process withdrawals with 2FA security for amounts above limits and PIN verification.",
    component: <DemoAgentCashOut />,
  },
  {
    id: "agent-kyc",
    section: "Agent App",
    title: "KYC Verification",
    description:
      "Capture and verify customer identity with photo upload and document scanning.",
    component: <DemoAgentKYC />,
  },
  {
    id: "agent-reconciliation",
    section: "Agent App",
    title: "Daily Reconciliation",
    description:
      "End-of-day cash counting and transaction reconciliation with discrepancy reporting.",
    component: <DemoAgentReconciliation />,
  },
  {
    id: "agent-offline",
    section: "Agent App",
    title: "Offline Queue",
    description:
      "Manage transactions when connectivity is limited with automatic sync when online.",
    component: <DemoAgentOfflineQueue />,
  },

  // Admin Journey
  {
    id: "admin-login",
    section: "Admin Portal",
    title: "Admin Login & 2FA",
    description:
      "Secure admin authentication with two-factor authentication and session management.",
    component: <DemoAdminLogin />,
  },
  {
    id: "admin-dashboard",
    section: "Admin Portal",
    title: "KPI Dashboard",
    description:
      "Real-time metrics, charts, and analytics for operational oversight and decision-making.",
    component: <DemoAdminDashboard />,
  },
  {
    id: "admin-users",
    section: "Admin Portal",
    title: "User Management",
    description:
      "Search, filter, and manage military personnel accounts with role-based access control.",
    component: <DemoAdminUserManagement />,
  },
  {
    id: "admin-payroll",
    section: "Admin Portal",
    title: "Payroll Upload",
    description:
      "CSV import with column mapping, validation, and bulk deposit processing.",
    component: <DemoAdminPayroll />,
  },
  {
    id: "admin-announcements",
    section: "Admin Portal",
    title: "Announcement Composer",
    description:
      "Rich text editor for army announcements with audience targeting and scheduling.",
    component: <DemoAdminAnnouncements />,
  },
  {
    id: "admin-reports",
    section: "Admin Portal",
    title: "Reports & Export",
    description:
      "Generate transaction, payroll, and compliance reports with CSV/PDF export.",
    component: <DemoAdminReports />,
  },
  {
    id: "admin-audit",
    section: "Admin Portal",
    title: "Audit Logs",
    description:
      "Comprehensive security and compliance logging with search and filtering capabilities.",
    component: <DemoAdminAuditLogs />,
  },

  // Mobile Notifications
  {
    id: "notifications-center",
    section: "Notifications",
    title: "Notifications Center",
    description:
      "Mobile notification hub with system alerts and army announcements.",
    component: <DemoNotificationsCenter />,
  },
  {
    id: "notifications-detail",
    section: "Notifications",
    title: "Announcement Detail",
    description: "Full announcement view with attachments and action buttons.",
    component: <DemoAnnouncementDetail />,
  },
  {
    id: "notifications-settings",
    section: "Notifications",
    title: "Notification Settings",
    description:
      "User preferences for notification types and delivery methods.",
    component: <DemoNotificationSettings />,
  },

  // QA & Testing
  {
    id: "qa-accessibility",
    section: "QA & Testing",
    title: "Accessibility Checklist",
    description:
      "WCAG AA compliance verification with color contrast, keyboard navigation, and screen reader support.",
    component: <DemoAccessibilityChecklist />,
  },
  {
    id: "qa-testplan",
    section: "QA & Testing",
    title: "Test Plan",
    description:
      "Comprehensive testing strategy covering functional, security, and performance requirements.",
    component: <DemoTestPlan />,
  },

  // Conclusion
  {
    id: "conclusion",
    section: "Conclusion",
    title: "Thank You",
    description: "Complete design system ready for development handoff.",
    component: <ConclusionScreen />,
  },
];

function IntroScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#0B6B40] rounded-full mb-6">
          <span className="text-4xl text-white">🎖️</span>
        </div>
        <h1 className="text-5xl mb-4 text-[#0B6B40]">MoLoyal</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Military-Grade Fintech Platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
        <div className="p-6 bg-white border-2 border-[#0B6B40] rounded-lg">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="mb-2 text-[#0B6B40]">Agent Mobile App</h3>
          <p className="text-sm text-gray-600">
            Offline-first cash-in/out with KYC and reconciliation
          </p>
        </div>

        <div className="p-6 bg-white border-2 border-[#0B6B40] rounded-lg">
          <div className="text-3xl mb-3">💻</div>
          <h3 className="mb-2 text-[#0B6B40]">Admin Web Portal</h3>
          <p className="text-sm text-gray-600">
            Data-heavy dashboards with RBAC and audit logging
          </p>
        </div>

        <div className="p-6 bg-white border-2 border-[#0B6B40] rounded-lg">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="mb-2 text-[#0B6B40]">Design System</h3>
          <p className="text-sm text-gray-600">
            Military-themed components with WCAG AA compliance
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600">
          This demo showcases {demoSteps.length - 2} screens across the complete
          platform
        </p>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-[#0B6B40] text-white border-[#0B6B40]"
          >
            Army Green #0B6B40
          </Badge>
          <Badge
            variant="outline"
            className="bg-[#C69C18] text-white border-[#C69C18]"
          >
            Gold Accent #C69C18
          </Badge>
          <Badge variant="outline">Inter Typography</Badge>
        </div>
      </div>
    </div>
  );
}

function ConclusionScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#0B6B40] rounded-full mb-6">
          <span className="text-4xl text-white">✅</span>
        </div>
        <h1 className="text-5xl mb-4 text-[#0B6B40]">Demo Complete</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          MoLoyal Design System & Prototypes
        </p>
      </div>

      <div className="max-w-3xl space-y-6 mb-8">
        <div className="p-6 bg-white border-2 border-[#0B6B40] rounded-lg text-left">
          <h3 className="mb-3 text-[#0B6B40]">✨ What's Included</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Complete design system with reusable components</li>
            <li>• Agent mobile app prototype (6 screens)</li>
            <li>• Admin web portal prototype (7 screens)</li>
            <li>• Notifications center with mobile + admin views</li>
            <li>• Accessibility compliance (WCAG AA)</li>
            <li>• Comprehensive test plan and QA documentation</li>
          </ul>
        </div>

        <div className="p-6 bg-white border-2 border-[#C69C18] rounded-lg text-left">
          <h3 className="mb-3 text-[#C69C18]">🚀 Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Export designs for development handoff</li>
            <li>• Conduct user testing with military personnel</li>
            <li>• Implement backend API and database</li>
            <li>• Build offline-first mobile apps (React Native/Flutter)</li>
            <li>• Deploy admin portal with RBAC enforcement</li>
            <li>• Security audit and penetration testing</li>
          </ul>
        </div>
      </div>

      <div className="text-gray-500 text-sm">
        <p>Built with React + Tailwind CSS + Shadcn/ui</p>
        <p className="mt-2">Designed for Android, iOS, and Web platforms</p>
      </div>
    </div>
  );
}

export default function DemoApp({ onExitDemo }: { onExitDemo?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleExitDemo = () => {
    if (onExitDemo) {
      onExitDemo();
    } else {
      // Reload page to go back to normal view
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4 text-[#0B6B40]" />
                <span className="text-sm text-gray-700">MoLoyal Demo</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <Badge variant="outline" className="text-xs">
                {step.section}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <Button
                onClick={handleExitDemo}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Exit Demo
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              className="h-full bg-[#0B6B40] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Step Info */}
            <div className="mb-6">
              <h1 className="text-3xl mb-2 text-gray-900">{step.title}</h1>
              <p className="text-gray-600">{step.description}</p>
            </div>

            {/* Component Display */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {step.component}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-[#0B6B40] w-8"
                      : index < currentStep
                      ? "bg-[#0B6B40] opacity-40"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
              className="gap-2 bg-[#0B6B40] hover:bg-[#0B6B40]/90"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

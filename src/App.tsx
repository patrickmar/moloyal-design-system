import React, { useState } from "react"; // Added React import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import { ScrollArea } from "./components/ui/scroll-area";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Presentation, Grid3x3 } from "lucide-react";
import DemoApp from "./DemoApp";

// MoLoyal Components
import { MoLoyalButton } from "./components/moloyal/MoLoyalButton";
import { MoLoyalInput } from "./components/moloyal/MoLoyalInput";
import { MoLoyalAvatar } from "./components/moloyal/MoLoyalAvatar";
import { MoLoyalAppBar } from "./components/moloyal/MoLoyalAppBar";
import { MoLoyalBottomNav } from "./components/moloyal/MoLoyalBottomNav";
import { MoLoyalProgressBar } from "./components/moloyal/MoLoyalProgressBar";
import {
  BalanceCard,
  GoalCard,
  TransactionRow,
} from "./components/moloyal/MoLoyalCards";
import { MoLoyalBadge } from "./components/moloyal/MoLoyalBadge";
import {
  MoLoyalModal,
  MoLoyalConfirmation,
} from "./components/moloyal/MoLoyalModal";
import { MoLoyalToast } from "./components/moloyal/MoLoyalToast";
import { MoLoyalTable } from "./components/moloyal/MoLoyalTable";
// import { MoLoyalOnboardingFlow } from "./components/moloyal/MoLoyalOnboarding";
import { MoLoyalHomeDashboard } from "./components/moloyal/MoLoyalHomeDashboard";
import { MoLoyalGoalsModule } from "./components/moloyal/MoLoyalGoalsModule";
import { MoLoyalTransactionsModule } from "./components/moloyal/MoLoyalTransactionsModule";
import { MoLoyalRankAllocation } from "./components/moloyal/MoLoyalRankAllocation";
import { MoLoyalAdminPolicyEditor } from "./components/moloyal/MoLoyalAdminPolicyEditor";
import { MoLoyalWithdrawalModule } from "./components/moloyal/MoLoyalWithdrawalModule";
import { MoLoyalWithdrawalAdmin } from "./components/moloyal/MoLoyalWithdrawalAdmin";
import { MoLoyalAgentApp } from "./components/moloyal/MoLoyalAgentApp";
import { MoLoyalAdminPortal } from "./components/moloyal/MoLoyalAdminPortal";
import { MoLoyalNotificationsCenter } from "./components/moloyal/MoLoyalNotificationsCenter";
import { MoLoyalAnnouncementDetail } from "./components/moloyal/MoLoyalAnnouncementDetail";
import { MoLoyalNotificationSettings } from "./components/moloyal/MoLoyalNotificationSettings";
import { MoLoyalAdminAnnouncementComposer } from "./components/moloyal/MoLoyalAdminAnnouncementComposer";
import { MoLoyalDemoBanner } from "./components/moloyal/MoLoyalDemoBanner";
import { MoLoyalAccessibilityChecklist } from "./components/moloyal/MoLoyalAccessibilityChecklist";
import { MoLoyalTestPlan } from "./components/moloyal/MoLoyalTestPlan";
import {
  MoLoyalLogo,
  FinanceIcons,
  MilitaryIcons,
  SecurityIcons,
  UIIcons,
  PrivateInsignia,
  CorporalInsignia,
  SergeantInsignia,
  LieutenantInsignia,
} from "./components/moloyal/MoLoyalIcons";

// Sample Data
import {
  sampleUsers,
  sampleGoals,
  sampleTransactions,
  sampleRankAllocations,
  sampleAllocationPayouts,
  sampleAuditLog,
  sampleRosterData,
  sampleBankAccounts,
  sampleAgentLocations,
  sampleWithdrawalRequests,
  sampleEarlyReleaseRequests,
  sampleLockedFunds,
  sampleKPIData,
  sampleExtendedUsers,
  sampleAdminAuditLogs,
  sampleReportFilters,
  sampleNotifications,
  sampleArmyAnnouncements,
  sampleNotificationSettings,
} from "./components/moloyal/data";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeDesignTab, setActiveDesignTab] = useState("onboarding");
  // Removed unused showOnboarding state
  const [demoMode, setDemoMode] = useState(false);

  // Phone frame component for mobile preview - Fixed styling conflict
  const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto w-[375px] h-[812px]">
      {" "}
      {/* Removed inline style, used Tailwind */}
      <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-background rounded-[2rem] h-full overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );

  // Design Tokens Page - Fixed missing className
  const TokensPage = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">MoLoyal Design Tokens</h2>
        <p className="text-muted-foreground mb-6">
          Core design tokens for the MoLoyal Military Savings Framework
        </p>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>
            Color palette with WCAG AA accessibility compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded-lg border shadow-sm"></div>
              <div className="text-sm">
                <div className="font-medium">Primary (Army Green)</div>
                <div className="text-muted-foreground">#0B6B40</div>
                <Badge variant="secondary" className="text-xs">
                  AA Compliant
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-accent rounded-lg border shadow-sm"></div>
              <div className="text-sm">
                <div className="font-medium">Accent (Gold)</div>
                <div className="text-muted-foreground">#C69C18</div>
                <Badge variant="secondary" className="text-xs">
                  AA Compliant
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-background rounded-lg border shadow-sm"></div>
              <div className="text-sm">
                <div className="font-medium">Background</div>
                <div className="text-muted-foreground">#F4F6F8</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-destructive rounded-lg border shadow-sm"></div>
              <div className="text-sm">
                <div className="font-medium">Danger</div>
                <div className="text-muted-foreground">#DC2626</div>
                <Badge variant="secondary" className="text-xs">
                  AA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Inter font family with military-grade hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Headline 24px Bold</h1>
              <p className="text-sm text-muted-foreground">
                Used for main headings and important titles
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Subhead 18px SemiBold</h2>
              <p className="text-sm text-muted-foreground">
                Used for section headers and card titles
              </p>
            </div>
            <div>
              <p className="text-base">Body 16px Regular</p>
              <p className="text-sm text-muted-foreground">
                Used for body text and descriptions
              </p>
            </div>
            <div>
              <p className="text-sm">
                {" "}
                {/* Fixed: Changed text-caption to text-sm */}
                Caption 12px Regular
              </p>
              <p className="text-sm text-muted-foreground">
                Used for small text and labels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>Consistent spacing system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[4, 8, 12, 16, 24, 32, 40].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div
                  className="bg-primary h-4"
                  style={{ width: `${size}px` }} // Fixed template literal
                ></div>
                <span className="text-sm font-medium w-8">{size}px</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className="h-16 w-16 bg-primary mx-auto mb-2"
                style={{ borderRadius: "8px" }}
              ></div>
              <div className="text-sm font-medium">Small - 8px</div>
            </div>
            <div className="text-center">
              <div
                className="h-16 w-16 bg-primary mx-auto mb-2"
                style={{ borderRadius: "12px" }}
              ></div>
              <div className="text-sm font-medium">Medium - 12px</div>
            </div>
            <div className="text-center">
              <div
                className="h-16 w-16 bg-primary mx-auto mb-2"
                style={{ borderRadius: "20px" }}
              ></div>
              <div className="text-sm font-medium">Large - 20px</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Components Page - Fixed sample data access
  const ComponentsPage = () => {
    // Get the first goal with contributions property
    const firstGoal = sampleGoals[0] || {};
    const goalContributions = firstGoal.contributions || [];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">MoLoyal UI Components</h2>
          <p className="text-muted-foreground mb-6">
            Production-ready components with variants and accessibility
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Primary, secondary, ghost, and danger variants in multiple sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <MoLoyalButton variant="primary">Primary</MoLoyalButton>
                  <MoLoyalButton variant="secondary">Secondary</MoLoyalButton>
                  <MoLoyalButton variant="ghost">Ghost</MoLoyalButton>
                  <MoLoyalButton variant="danger">Danger</MoLoyalButton>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Sizes</h4>
                <div className="flex items-center gap-3">
                  <MoLoyalButton size="small">Small</MoLoyalButton>
                  <MoLoyalButton size="medium">Medium</MoLoyalButton>
                  <MoLoyalButton size="large">Large</MoLoyalButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>
              Form inputs with label, error states, and validation
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                label="Disabled Field"
                placeholder="This field is disabled"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>
              Balance, goal, and transaction card components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <BalanceCard balance={45000} allocation={10000} />
              <GoalCard goal={firstGoal} />
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-medium mb-3">Transaction Rows</h4>
                <div className="space-y-2">
                  {sampleTransactions.slice(0, 2).map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Bars</CardTitle>
            <CardDescription>
              Goal progress tracking with tooltips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <MoLoyalProgressBar
                current={32000}
                target={50000}
                label="Emergency Fund"
              />
              <MoLoyalProgressBar
                current={85000}
                target={200000}
                label="Housing Deposit"
                showTooltip
              />
            </div>
          </CardContent>
        </Card>

        {/* Avatars & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars & Rank Badges</CardTitle>
            <CardDescription>
              Personnel avatars with rank insignia and standalone rank badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Avatars</h4>
                <div className="flex items-center gap-4">
                  <MoLoyalAvatar name="Amina Okoye" rank="Sergeant" size="sm" />
                  <MoLoyalAvatar
                    name="Chinedu E."
                    rank="Corporal"
                    size="md"
                    src={sampleUsers[1]?.avatar || ""}
                  />
                  <MoLoyalAvatar
                    name="Adebayo Folake"
                    rank="Lieutenant"
                    size="lg"
                    src={sampleUsers[2]?.avatar || ""}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Rank Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <MoLoyalBadge rank="Private" />
                  <MoLoyalBadge rank="Corporal" />
                  <MoLoyalBadge rank="Sergeant" />
                  <MoLoyalBadge rank="Lieutenant" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Structure */}
        <Card>
          <CardHeader>
            <CardTitle>App Structure Components</CardTitle>
            <CardDescription>App bar and bottom navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">App Bar Variants</h4>
                <div className="space-y-2 border rounded-lg p-4 bg-muted/25">
                  <MoLoyalAppBar user={sampleUsers[0]} />
                  <MoLoyalAppBar variant="with-back" title="Goal Details" />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Bottom Navigation</h4>
                <div className="border rounded-lg p-4 bg-muted/25">
                  <MoLoyalBottomNav
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals & Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Modals & Notifications</CardTitle>
            <CardDescription>
              Modal dialogs, confirmations, and toast notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <MoLoyalModal
                  trigger={
                    <MoLoyalButton variant="secondary">
                      Open Modal
                    </MoLoyalButton>
                  }
                  title="Goal Details"
                  description="Manage your savings goal"
                >
                  <div className="space-y-4">
                    <MoLoyalInput
                      label="Goal Name"
                      placeholder="Enter goal name"
                    />
                    <MoLoyalInput
                      label="Target Amount"
                      placeholder="Enter target amount"
                    />
                    <div className="flex justify-end gap-2">
                      <MoLoyalButton variant="ghost">Cancel</MoLoyalButton>
                      <MoLoyalButton>Save Goal</MoLoyalButton>
                    </div>
                  </div>
                </MoLoyalModal>

                <MoLoyalConfirmation
                  trigger={
                    <MoLoyalButton variant="danger">Delete Goal</MoLoyalButton>
                  }
                  title="Delete Goal"
                  description="Are you sure you want to delete this goal? This action cannot be undone."
                  confirmText="Delete"
                  onConfirm={() =>
                    MoLoyalToast.success("Goal deleted successfully")
                  }
                  variant="danger"
                />

                <MoLoyalButton
                  variant="secondary"
                  onClick={() =>
                    MoLoyalToast.success(
                      "Test notification",
                      "This is a success message"
                    )
                  }
                >
                  Show Toast
                </MoLoyalButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>
              Admin portal table for personnel management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoLoyalTable data={sampleUsers} />
          </CardContent>
        </Card>
      </div>
    );
  };

  // Goals Module Page - Fixed data structure access
  const GoalsModulePage = () => {
    // Safely get the first goal with contributions
    const firstGoal = sampleGoals[0] || { contributions: [] };
    const contributions = firstGoal.contributions || [];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">MoLoyal Goals Module</h2>
          <p className="text-muted-foreground mb-6">
            Complete goals management system with 6 screens: Goals list, 3-step
            creation wizard, goal details with timeline & charts, and
            celebration states. Features military-themed UI with automatic
            contribution scheduling and progress tracking.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-[375px]">
            <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-background rounded-[2rem] h-[700px] overflow-hidden relative">
                <MoLoyalGoalsModule
                  user={sampleUsers[0]}
                  goals={sampleGoals}
                  onGoalCreate={(goal) => {
                    console.log("Goal created:", goal);
                    MoLoyalToast.success(
                      "Goal Created!",
                      `${goal.title} has been created successfully`
                    );
                  }}
                  onGoalUpdate={(id, goal) => {
                    console.log("Goal updated:", id, goal);
                    MoLoyalToast.success(
                      "Goal Updated!",
                      "Your goal has been updated"
                    );
                  }}
                  onGoalDelete={(id) => {
                    console.log("Goal deleted:", id);
                    MoLoyalToast.success(
                      "Goal Deleted",
                      "Goal has been removed"
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sample Data Structure</CardTitle>
            <CardDescription>
              Enhanced goal and contribution data models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Goal Example JSON</h4>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(
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
                      contributionSchedule: {
                        type: "monthly",
                        amount: 8333,
                        alignWithPayCycle: true,
                        nextContribution: "2025-11-01",
                      },
                      autoDeduct: true,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-3">
                  Contribution Timeline (6 entries)
                </h4>
                <div className="space-y-2 text-xs">
                  {contributions.slice(0, 6).map((contrib, i) => (
                    <div
                      key={i}
                      className="flex justify-between p-2 bg-muted rounded"
                    >
                      <span>{(contrib as any).date}</span>
                      <span className="font-medium">
                        ₦{(contrib as any).amount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {(contrib as any).type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Home Dashboard Page - Remove goals prop since MoLoyalHomeDashboard doesn't accept it
  const HomeDashboardPage = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">MoLoyal Home Dashboard</h2>
        <p className="text-muted-foreground mb-6">
          Complete home dashboard with multiple states: active saver, empty
          user, and locked funds. Features greeting header, balance management,
          goal tracking, recent transactions, and quick actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Saver State */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Active Saver</h3>
          <p className="text-sm text-muted-foreground mb-4">
            User with active goals and transactions
          </p>
          <div className="flex justify-center">
            <div className="w-[375px]">
              <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-background rounded-[2rem] h-[600px] overflow-hidden relative">
                  <MoLoyalHomeDashboard
                    user={sampleUsers[0]}
                    state="active"
                    onGoalClick={(goal) =>
                      MoLoyalToast.info(
                        "Goal Details",
                        `Opening ${goal.title} details`
                      )
                    }
                    onDepositClick={() =>
                      MoLoyalToast.info("Deposit", "Opening deposit options")
                    }
                    onWithdrawClick={() =>
                      MoLoyalToast.info(
                        "Withdraw",
                        "Processing withdrawal request"
                      )
                    }
                    onNewGoalClick={() =>
                      MoLoyalToast.info("New Goal", "Creating new savings goal")
                    }
                    onSettingsClick={() =>
                      MoLoyalToast.info("Settings", "Opening account settings")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty User State */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Empty User</h3>
          <p className="text-sm text-muted-foreground mb-4">
            New user with no goals or transactions
          </p>
          <div className="flex justify-center">
            <div className="w-[375px]">
              <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-background rounded-[2rem] h-[600px] overflow-hidden relative">
                  <MoLoyalHomeDashboard
                    user={sampleUsers[1]}
                    state="empty"
                    onGoalClick={(goal) =>
                      MoLoyalToast.info(
                        "Goal Details",
                        `Opening ${goal.title} details`
                      )
                    }
                    onDepositClick={() =>
                      MoLoyalToast.info("Deposit", "Opening deposit options")
                    }
                    onWithdrawClick={() =>
                      MoLoyalToast.info(
                        "Withdraw",
                        "Processing withdrawal request"
                      )
                    }
                    onNewGoalClick={() =>
                      MoLoyalToast.info("New Goal", "Creating new savings goal")
                    }
                    onSettingsClick={() =>
                      MoLoyalToast.info("Settings", "Opening account settings")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Funds State */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Locked Funds</h3>
          <p className="text-sm text-muted-foreground mb-4">
            User with locked savings and restricted access
          </p>
          <div className="flex justify-center">
            <div className="w-[375px]">
              <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-background rounded-[2rem] h-[600px] overflow-hidden relative">
                  <MoLoyalHomeDashboard
                    user={sampleUsers[2]}
                    state="locked"
                    onGoalClick={(goal) =>
                      MoLoyalToast.info(
                        "Goal Details",
                        `Opening ${goal.title} details`
                      )
                    }
                    onDepositClick={() =>
                      MoLoyalToast.info("Deposit", "Opening deposit options")
                    }
                    onWithdrawClick={() =>
                      MoLoyalToast.warning(
                        "Withdrawal Restricted",
                        "Some funds are locked"
                      )
                    }
                    onNewGoalClick={() =>
                      MoLoyalToast.info("New Goal", "Creating new savings goal")
                    }
                    onSettingsClick={() =>
                      MoLoyalToast.info("Settings", "Opening account settings")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Mobile Preview Page - Fixed to use sampleGoals
  const MobilePreviewPage = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Mobile Preview</h2>
        <p className="text-muted-foreground mb-6">
          6.5" phone frame preview (iPhone 14 / Android equivalent)
        </p>
      </div>

      <div className="flex justify-center">
        <PhoneFrame>
          <div className="h-full flex flex-col">
            <MoLoyalAppBar user={sampleUsers[0]} />

            <ScrollArea className="flex-1 px-4 py-6">
              <div className="space-y-6">
                <BalanceCard balance={45000} allocation={10000} />

                <div>
                  <h3 className="font-semibold mb-3">Active Goals</h3>
                  <div className="space-y-3">
                    {sampleGoals.slice(0, 2).map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Recent Transactions</h3>
                  <div className="bg-card border rounded-lg p-4">
                    <div className="space-y-2">
                      {sampleTransactions.slice(0, 3).map((transaction) => (
                        <TransactionRow
                          key={transaction.id}
                          transaction={transaction}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pb-20">{/* Bottom nav spacing */}</div>
              </div>
            </ScrollArea>

            <MoLoyalBottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </PhoneFrame>
      </div>
    </div>
  );

  // Show DemoApp if in demo mode
  if (demoMode) {
    return <DemoApp onExitDemo={() => setDemoMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MoLoyalLogo size={40} variant="full" />
              <Badge variant="secondary">Design System v1.0</Badge>
            </div>
            <Button
              onClick={() => setDemoMode(true)}
              className="bg-[#0B6B40] hover:bg-[#0B6B40]/90 gap-2"
            >
              <Presentation className="w-4 h-4" />
              Start Demo Mode
            </Button>
          </div>
          <h1 className="text-3xl font-bold">MoLoyal Design System</h1>
          <p className="text-muted-foreground">
            Military-grade fintech design system for Android + iOS. Reusable
            components and tokens for the MoLoyal Military Savings Framework.
          </p>
        </div>

        <Tabs value={activeDesignTab} onValueChange={setActiveDesignTab}>
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-14 gap-1 overflow-x-auto">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
            <TabsTrigger value="agent-app">Agent App</TabsTrigger>
            <TabsTrigger value="admin-portal">Admin Portal</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="qa-testing">QA & Testing</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            {/* <TabsContent value="onboarding">
              <OnboardingFlowPage />
            </TabsContent> */}

            <TabsContent value="dashboard">
              <HomeDashboardPage />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsModulePage />
            </TabsContent>

            {/* <TabsContent value="transactions">
              <TransactionsModulePage />
            </TabsContent> */}

            {/* <TabsContent value="withdrawals">
              <WithdrawalsModulePage />
            </TabsContent> */}

            {/* <TabsContent value="allocations">
              <AllocationsModulePage />
            </TabsContent>

            <TabsContent value="agent-app">
              <AgentAppPage />
            </TabsContent> */}

            <TabsContent value="admin-portal">
              <div className="min-h-screen -mx-4 -my-8">
                <MoLoyalAdminPortal
                  kpiData={sampleKPIData}
                  users={sampleExtendedUsers}
                  rankAllocations={sampleRankAllocations}
                  auditLog={sampleAuditLog}
                  rosterData={sampleRosterData}
                  reportFilters={sampleReportFilters}
                  adminAuditLogs={sampleAdminAuditLogs}
                  onBack={() => setActiveDesignTab("dashboard")}
                />
              </div>
            </TabsContent>

            {/* <TabsContent value="notifications">
              <NotificationsPage />
            </TabsContent> */}

            {/* <TabsContent value="qa-testing">
              <QATestingPage />
            </TabsContent> */}

            <TabsContent value="tokens">
              <TokensPage />
            </TabsContent>

            <TabsContent value="components">
              <ComponentsPage />
            </TabsContent>

            {/* <TabsContent value="icons">
              <IconsPage />
            </TabsContent> */}

            <TabsContent value="preview">
              <MobilePreviewPage />
            </TabsContent>
          </div>
        </Tabs>

        <Separator className="my-12" />

        <div className="text-center text-muted-foreground">
          <h3 className="font-semibold mb-2">Sample Dataset</h3>
          <p className="text-sm">
            Design system includes {sampleUsers.length} sample users,{" "}
            {sampleGoals.length} goals, {sampleTransactions.length}{" "}
            transactions, {sampleNotifications.length} notifications, and{" "}
            {sampleArmyAnnouncements.length} army announcements for prototyping.
          </p>
          <p className="text-xs mt-2">
            All components are production-ready with accessibility features
            (WCAG AA), responsive design, and comprehensive testing
            documentation.
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

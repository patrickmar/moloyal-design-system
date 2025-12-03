import { useState, useCallback } from "react";
import { cn } from "../ui/utils";
import {
  RefreshCw,
  Settings,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  CreditCard,
  Banknote,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";

// MoLoyal Components
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalAvatar } from "./MoLoyalAvatar";
import { MoLoyalBadge } from "./MoLoyalBadge";
import { MoLoyalProgressBar } from "./MoLoyalProgressBar";
import { MoLoyalToast } from "./MoLoyalToast";
import { MoLoyalModal } from "./MoLoyalModal";
import { FinanceIcons } from "./MoLoyalIcons";

import { User, Goal, Transaction, Rank } from "./types";

// Sample goals data based on requirements
const dashboardGoals: Goal[] = [
  {
    id: "1",
    title: "House Deposit",
    target: 2000000,
    current: 250000,
    deadline: "2027-06-30",
  },
  {
    id: "2",
    title: "Education Fund",
    target: 500000,
    current: 40000,
    deadline: "2026-12-01",
  },
  {
    id: "3",
    title: "Emergency Fund",
    target: 100000,
    current: 50000,
    deadline: "2025-12-01",
  },
];

interface DashboardState {
  user: User;
  totalBalance: number;
  lockedFunds: number;
  availableBalance: number;
  goals: Goal[];
  recentTransactions: Transaction[];
  hasGoals: boolean;
  hasLockedFunds: boolean;
}

interface MoLoyalHomeDashboardProps {
  user: User;
  state?: "empty" | "active" | "locked";
  onGoalClick?: (goal: Goal) => void;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  onNewGoalClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

const MoLoyalHomeDashboard: React.FC<MoLoyalHomeDashboardProps> = ({
  user,
  state = "active",
  onGoalClick,
  onDepositClick,
  onWithdrawClick,
  onNewGoalClick,
  onSettingsClick,
  className,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Generate dashboard state based on prop
  const getDashboardState = useCallback((): DashboardState => {
    const baseTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 15000,
        description: "Monthly Salary Allocation",
        date: "2025-10-01",
        category: "Salary",
        status: "completed",
      },
      {
        id: "2",
        type: "debit",
        amount: 5000,
        description: "Goal Contribution - House Deposit",
        date: "2025-09-30",
        category: "Savings",
        status: "completed",
      },
      {
        id: "3",
        type: "credit",
        amount: 2500,
        description: "Agent Top-up via Kuda Bank",
        date: "2025-09-28",
        category: "Deposit",
        status: "completed",
      },
    ];

    switch (state) {
      case "empty":
        return {
          user,
          totalBalance: 0,
          lockedFunds: 0,
          availableBalance: 0,
          goals: [],
          recentTransactions: [],
          hasGoals: false,
          hasLockedFunds: false,
        };

      case "locked":
        return {
          user,
          totalBalance: 95000,
          lockedFunds: 50000,
          availableBalance: 45000,
          goals: dashboardGoals,
          recentTransactions: [
            ...baseTransactions,
            {
              id: "4",
              type: "debit",
              amount: 50000,
              description: "Funds Locked - Housing Goal",
              date: "2025-09-25",
              category: "Lock",
              status: "locked",
            },
          ],
          hasGoals: true,
          hasLockedFunds: true,
        };

      default: // 'active'
        return {
          user,
          totalBalance: 125000,
          lockedFunds: 0,
          availableBalance: 125000,
          goals: dashboardGoals,
          recentTransactions: baseTransactions,
          hasGoals: true,
          hasLockedFunds: false,
        };
    }
  }, [user, state]);

  const dashboardData = getDashboardState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    MoLoyalToast.success("Sync complete", "Your data has been updated");
  };

  const getUserSurname = (fullName: string) => {
    const parts = fullName.split(" ");
    return parts[parts.length - 1];
  };

  // Quick Actions
  const quickActions = [
    {
      id: "agent-topup",
      label: "Top-up via Agent",
      icon: Users,
      onClick: () =>
        MoLoyalToast.info(
          "Agent Top-up",
          "Find nearby agents to deposit funds"
        ),
    },
    {
      id: "payroll",
      label: "Payroll Allocation",
      icon: CreditCard,
      onClick: () =>
        MoLoyalToast.info(
          "Payroll Settings",
          "Manage automatic salary allocations"
        ),
    },
    {
      id: "withdrawal",
      label: "Request Withdrawal",
      icon: Banknote,
      onClick:
        onWithdrawClick ||
        (() => MoLoyalToast.info("Withdrawal", "Request fund withdrawal")),
    },
  ];

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Header with Greeting */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <MoLoyalAvatar
            name={user.name}
            rank={user.rank as Rank} // Cast to Rank type
            size="md"
            src={user.avatar}
          />
          <div>
            <h1 className="font-semibold">
              Welcome, {user.rank} {getUserSurname(user.name)}
            </h1>
            <div className="flex items-center gap-2">
              <MoLoyalBadge rank={user.rank as Rank} />{" "}
              {/* Cast to Rank type */}
              <span className="text-xs text-muted-foreground">
                {user.service_no}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isRefreshing && "animate-spin"
              )}
            />
          </motion.button>

          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-90">Total Balance</p>
                <h2 className="text-3xl font-bold">
                  {showBalance
                    ? formatCurrency(dashboardData.totalBalance)
                    : "••••••"}
                </h2>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? "👁️" : "🙈"}
              </button>
            </div>

            {dashboardData.hasLockedFunds && (
              <div className="mb-4 p-3 bg-white/10 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">Locked Funds</span>
                  <span className="font-medium">
                    {formatCurrency(dashboardData.lockedFunds)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="opacity-90">Available Balance</span>
                  <span className="font-medium">
                    {formatCurrency(dashboardData.availableBalance)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <MoLoyalButton
                size="small"
                variant="secondary"
                onClick={onNewGoalClick}
                className="flex-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </MoLoyalButton>

              {/* Deposit Modal Trigger */}
              <MoLoyalModal
                trigger={
                  <MoLoyalButton
                    size="small"
                    variant="secondary"
                    className="flex-1"
                  >
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Deposit
                  </MoLoyalButton>
                }
                title="Deposit Funds"
                description="Choose your preferred deposit method"
              >
                <div className="space-y-4">
                  <MoLoyalButton
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      MoLoyalToast.info(
                        "Payroll Deposit",
                        "Set up automatic payroll deductions"
                      );
                    }}
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    Payroll Deduction
                  </MoLoyalButton>

                  <MoLoyalButton
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      MoLoyalToast.info(
                        "Agent Deposit",
                        "Find nearby agents for cash deposits"
                      );
                    }}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Agent Deposit
                  </MoLoyalButton>

                  <MoLoyalButton
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      MoLoyalToast.info(
                        "Bank Transfer",
                        "Transfer funds from your bank account"
                      );
                    }}
                  >
                    <Banknote className="mr-3 h-5 w-5" />
                    Bank Transfer
                  </MoLoyalButton>
                </div>
              </MoLoyalModal>

              <MoLoyalButton
                size="small"
                variant="secondary"
                onClick={onWithdrawClick}
                className="flex-1"
                disabled={dashboardData.availableBalance === 0}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw
              </MoLoyalButton>
            </div>
          </motion.div>

          {/* Army Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-accent/10 border border-accent/20 p-4 rounded-lg cursor-pointer hover:bg-accent/20 transition-colors"
            onClick={() =>
              MoLoyalToast.info(
                "Army Update",
                "New financial wellness program available"
              )
            }
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-accent" />
              <div className="flex-1">
                <h3 className="font-medium text-accent-foreground">
                  Nigerian Army Financial Update
                </h3>
                <p className="text-sm text-muted-foreground">
                  New savings incentive program launched. Tap for details.
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                New
              </Badge>
            </div>
          </motion.div>

          {/* Goals Summary */}
          {dashboardData.hasGoals ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Your Goals</h3>
                <span className="text-sm text-muted-foreground">
                  {dashboardData.goals.length} active
                </span>
              </div>

              <ScrollArea
                orientation="horizontal"
                className="w-full whitespace-nowrap"
              >
                <div className="flex gap-4 pb-4">
                  {dashboardData.goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-card border rounded-lg p-4 min-w-[280px] cursor-pointer hover:shadow-md transition-all"
                      onClick={() => onGoalClick?.(goal)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {getProgressPercentage(goal.current, goal.target)}%
                        </span>
                      </div>

                      <MoLoyalProgressBar
                        current={goal.current}
                        target={goal.target}
                        className="mb-3"
                        label={`${goal.title} progress: ${getProgressPercentage(
                          goal.current,
                          goal.target
                        )} percent`}
                        showTooltip
                      />

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Saved: {formatCurrency(goal.current)}</span>
                        <span>Target: {formatCurrency(goal.target)}</span>
                      </div>

                      <div className="text-xs text-muted-foreground mt-2">
                        Target:{" "}
                        {new Date(goal.deadline).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border rounded-lg p-8 text-center"
            >
              <FinanceIcons.Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Goals Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your savings journey by creating your first goal
              </p>
              <MoLoyalButton onClick={onNewGoalClick}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Goal
              </MoLoyalButton>
            </motion.div>
          )}

          {/* Recent Transactions */}
          {dashboardData.recentTransactions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              <div className="bg-card border rounded-lg p-4">
                <div className="space-y-3">
                  {dashboardData.recentTransactions
                    .slice(0, 3)
                    .map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              transaction.type === "credit"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            )}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)} •{" "}
                              {transaction.category}
                              {transaction.status && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {transaction.status}
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "font-medium",
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border rounded-lg p-8 text-center"
            >
              <FinanceIcons.Transaction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Transactions Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your transaction history will appear here
              </p>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className="bg-card border rounded-lg p-4 text-center hover:shadow-md transition-all"
                >
                  <action.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Bottom spacing for navigation */}
          <div className="h-20" />
        </div>
      </ScrollArea>
    </div>
  );
};

export { MoLoyalHomeDashboard };
export type { MoLoyalHomeDashboardProps };

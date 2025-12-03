import React, { useState, useEffect } from "react";
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalAgentLogin } from "./MoLoyalAgentLogin";
import { MoLoyalAgentCashIn } from "./MoLoyalAgentCashIn";
import { MoLoyalAgentCashOut } from "./MoLoyalAgentCashOut";
import { MoLoyalAgentKYC } from "./MoLoyalAgentKYC";
import { MoLoyalAgentReconciliation } from "./MoLoyalAgentReconciliation";
import { MoLoyalAgentOfflineQueue } from "./MoLoyalAgentOfflineQueue";
import { MoLoyalToast } from "./MoLoyalToast";
import {
  FinanceIcons,
  UIIcons,
  SecurityIcons,
  MoLoyalLogo,
} from "./MoLoyalIcons";
import {
  sampleAgents,
  sampleAgentTransactions,
  sampleOfflineQueue,
  sampleDailyReconciliation,
  sampleUsers,
} from "./data";
import { Badge } from "../ui/badge";

type Screen =
  | "login"
  | "dashboard"
  | "cash-in"
  | "cash-out"
  | "kyc"
  | "reconciliation"
  | "offline-queue";

interface MoLoyalAgentAppProps {
  onBack?: () => void;
}

export function MoLoyalAgentApp({ onBack }: MoLoyalAgentAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [currentAgent, setCurrentAgent] = useState(sampleAgents[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate network connectivity changes
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% uptime
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    MoLoyalToast.info("Syncing...", "Synchronizing with server");

    // Simulate sync delay
    setTimeout(() => {
      setLastSync(new Date());
      MoLoyalToast.success("Sync Complete", "All data synchronized");
    }, 2000);
  };

  const handleLogin = (agentData: any) => {
    setCurrentAgent(agentData);
    setCurrentScreen("dashboard");
    MoLoyalToast.success("Login Successful", `Welcome back, ${agentData.name}`);
  };

  // Connection Status Indicator
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-xs text-muted-foreground">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );

  // Sync Button
  const SyncButton = () => (
    <MoLoyalButton
      variant="ghost"
      size="small"
      onClick={handleSync}
      className="px-2"
    >
      <UIIcons.RefreshCw className="h-4 w-4" />
    </MoLoyalButton>
  );

  if (currentScreen === "login") {
    return <MoLoyalAgentLogin onLogin={handleLogin} onBack={onBack} />;
  }

  if (currentScreen === "cash-in") {
    return (
      <MoLoyalAgentCashIn
        agent={currentAgent}
        onBack={() => setCurrentScreen("dashboard")}
        onTransactionComplete={(transaction) => {
          MoLoyalToast.success(
            "Cash-In Complete",
            `Transaction ${transaction.reference} processed`
          );
          setCurrentScreen("dashboard");
        }}
      />
    );
  }

  if (currentScreen === "cash-out") {
    return (
      <MoLoyalAgentCashOut
        agent={currentAgent}
        onBack={() => setCurrentScreen("dashboard")}
        onTransactionComplete={(transaction) => {
          MoLoyalToast.success(
            "Cash-Out Complete",
            `₦${transaction.amount.toLocaleString()} paid out`
          );
          setCurrentScreen("dashboard");
        }}
      />
    );
  }

  if (currentScreen === "kyc") {
    return (
      <MoLoyalAgentKYC
        agent={currentAgent}
        onBack={() => setCurrentScreen("dashboard")}
        onKYCComplete={(kycData) => {
          MoLoyalToast.success(
            "KYC Updated",
            "Your information has been updated"
          );
          setCurrentScreen("dashboard");
        }}
      />
    );
  }

  if (currentScreen === "reconciliation") {
    return (
      <MoLoyalAgentReconciliation
        agent={currentAgent}
        reconciliationData={sampleDailyReconciliation}
        onBack={() => setCurrentScreen("dashboard")}
        onSettlementCreated={(batchId) => {
          MoLoyalToast.success(
            "Settlement Created",
            `Batch ${batchId} submitted`
          );
        }}
      />
    );
  }

  if (currentScreen === "offline-queue") {
    return (
      <MoLoyalAgentOfflineQueue
        agent={currentAgent}
        queuedTransactions={sampleOfflineQueue}
        onBack={() => setCurrentScreen("dashboard")}
        onRetry={(transactionId) => {
          MoLoyalToast.info("Retrying...", "Processing queued transaction");
        }}
      />
    );
  }

  // Main Dashboard
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with sync status */}
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MoLoyalLogo size={28} variant="icon" />
          <div>
            <h1 className="font-semibold">Agent Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {currentAgent.businessName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <SyncButton />
        </div>
      </div>

      {/* Float Balance Card */}
      <div className="p-4">
        <div className="bg-primary text-primary-foreground rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Float Balance</p>
              <p className="text-2xl font-bold">
                ₦{currentAgent.floatBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-xs">
                {currentAgent.tier}
              </Badge>
              <p className="text-xs opacity-90 mt-1">
                ID: {currentAgent.agentCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Cash In */}
          <div
            className="bg-card border rounded-lg p-6 flex flex-col items-center gap-3 active:bg-muted/50 cursor-pointer"
            onClick={() => setCurrentScreen("cash-in")}
          >
            <div className="bg-green-100 p-4 rounded-full">
              <FinanceIcons.ArrowUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Cash In</h3>
              <p className="text-xs text-muted-foreground">
                Deposit for soldier
              </p>
            </div>
          </div>

          {/* Cash Out */}
          <div
            className="bg-card border rounded-lg p-6 flex flex-col items-center gap-3 active:bg-muted/50 cursor-pointer"
            onClick={() => setCurrentScreen("cash-out")}
          >
            <div className="bg-red-100 p-4 rounded-full">
              <FinanceIcons.ArrowDown className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Cash Out</h3>
              <p className="text-xs text-muted-foreground">Withdrawal payout</p>
            </div>
          </div>

          {/* Daily Reconciliation */}
          <div
            className="bg-card border rounded-lg p-6 flex flex-col items-center gap-3 active:bg-muted/50 cursor-pointer"
            onClick={() => setCurrentScreen("reconciliation")}
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <FinanceIcons.Calculator className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Reconcile</h3>
              <p className="text-xs text-muted-foreground">Daily settlement</p>
            </div>
          </div>

          {/* Agent KYC */}
          <div
            className="bg-card border rounded-lg p-6 flex flex-col items-center gap-3 active:bg-muted/50 cursor-pointer"
            onClick={() => setCurrentScreen("kyc")}
          >
            <div className="bg-amber-100 p-4 rounded-full">
              <SecurityIcons.Shield className="h-8 w-8 text-amber-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">KYC</h3>
              <p className="text-xs text-muted-foreground">Update details</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">Today's Activity</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {sampleDailyReconciliation.summary.cashInCount}
              </p>
              <p className="text-xs text-muted-foreground">Cash-In</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {sampleDailyReconciliation.summary.cashOutCount}
              </p>
              <p className="text-xs text-muted-foreground">Cash-Out</p>
            </div>
          </div>
        </div>

        {/* Offline Queue Status */}
        {sampleOfflineQueue.length > 0 && (
          <div
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 cursor-pointer active:bg-amber-100"
            onClick={() => setCurrentScreen("offline-queue")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UIIcons.Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    {sampleOfflineQueue.length} Queued Transaction
                    {sampleOfflineQueue.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-amber-600">
                    Tap to retry offline transactions
                  </p>
                </div>
              </div>
              <UIIcons.ChevronRight className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        )}

        {/* Last sync info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Last sync: {lastSync.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Back button */}
      {onBack && (
        <div className="p-4 border-t">
          <MoLoyalButton variant="ghost" onClick={onBack} className="w-full">
            ← Back to MoLoyal
          </MoLoyalButton>
        </div>
      )}
    </div>
  );
}

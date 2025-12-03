import React, { useState } from "react";
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalToast } from "./MoLoyalToast";
import { FinanceIcons, UIIcons } from "./MoLoyalIcons";
import { Badge } from "../ui/badge";

interface MoLoyalAgentReconciliationProps {
  agent: any;
  reconciliationData: any;
  onBack: () => void;
  onSettlementCreated: (batchId: string) => void;
}

export function MoLoyalAgentReconciliation({
  agent,
  reconciliationData,
  onBack,
  onSettlementCreated,
}: MoLoyalAgentReconciliationProps) {
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { summary, transactions } = reconciliationData;

  const handleCreateSettlement = () => {
    setIsCreatingBatch(true);

    // Simulate settlement batch creation
    setTimeout(() => {
      const batchId = `SB-${reconciliationData.date}-${agent.agentCode}`;
      setIsCreatingBatch(false);
      onSettlementCreated(batchId);
    }, 2000);
  };

  const handleDownloadCSV = () => {
    setIsDownloading(true);

    // Simulate CSV generation and download
    setTimeout(() => {
      // Create CSV content
      const csvContent = [
        "Reference,Type,Soldier Name,Service Number,Amount,Fee,Net Amount,Timestamp",
        ...transactions.map(
          (
            t: any // Add type annotation here
          ) =>
            `${t.reference},${t.type},${t.soldierName},${t.soldierServiceNumber},${t.amount},${t.agentFee},${t.netAmount},${t.timestamp}`
        ),
      ].join("\n");

      // Simulate download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reconciliation-${reconciliationData.date}-${agent.agentCode}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      MoLoyalToast.success(
        "Download Complete",
        "Reconciliation report downloaded"
      );
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "pending_otp":
        return (
          <Badge className="bg-amber-100 text-amber-800">Pending OTP</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
        <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
          <UIIcons.ArrowLeft className="h-4 w-4" />
        </MoLoyalButton>
        <div>
          <h1 className="font-semibold">Daily Reconciliation</h1>
          <p className="text-xs text-muted-foreground">
            {reconciliationData.date}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cash-In Summary */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FinanceIcons.ArrowUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm">Cash-In</h3>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-green-600">
                ₦{summary.totalCashIn.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.cashInCount} transaction
                {summary.cashInCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Fees: ₦{summary.totalCashInFees.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Cash-Out Summary */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FinanceIcons.ArrowDown className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="font-semibold text-sm">Cash-Out</h3>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-red-600">
                ₦{summary.totalCashOut.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.cashOutCount} transaction
                {summary.cashOutCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Fees: ₦{summary.totalCashOutFees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Net Position */}
        <div className="bg-card border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Net Cash Flow</h3>
              <p
                className={`text-2xl font-bold ${
                  summary.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {summary.netCashFlow >= 0 ? "+" : ""}₦
                {summary.netCashFlow.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.netCashFlow >= 0 ? "Surplus" : "Deficit"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Total Fees Earned</h3>
              <p className="text-2xl font-bold text-primary">
                ₦{summary.totalFees.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Commission earned</p>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold">Transaction Details</h3>
            <p className="text-sm text-muted-foreground">
              {transactions.length} completed transactions
            </p>
          </div>

          <div className="max-h-64 overflow-auto">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="px-4 py-3 border-b last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          transaction.type === "cash_in"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "cash_in" ? (
                          <FinanceIcons.ArrowUp className="h-2.5 w-2.5 text-green-600" />
                        ) : (
                          <FinanceIcons.ArrowDown className="h-2.5 w-2.5 text-red-600" />
                        )}
                      </div>
                      <span className="font-medium text-sm">
                        {transaction.soldierName}
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {transaction.soldierServiceNumber} •{" "}
                      {transaction.reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₦{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fee: ₦{transaction.agentFee.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <MoLoyalButton
            variant="secondary"
            size="large"
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <UIIcons.Clock className="h-4 w-4" />
                </div>
                Generating CSV...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FinanceIcons.Download className="h-4 w-4" />
                Download CSV Report
              </div>
            )}
          </MoLoyalButton>

          <MoLoyalButton
            variant="primary"
            size="large"
            onClick={handleCreateSettlement}
            disabled={isCreatingBatch || transactions.length === 0}
            className="w-full"
          >
            {isCreatingBatch ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <UIIcons.Clock className="h-4 w-4" />
                </div>
                Creating Settlement Batch...
              </div>
            ) : (
              "Create Settlement Batch"
            )}
          </MoLoyalButton>
        </div>

        {/* Settlement Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FinanceIcons.Calculator className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">
              Settlement Process
            </span>
          </div>
          <p className="text-sm text-blue-700">
            Creating a settlement batch will submit your daily transactions for
            processing. This cannot be undone once submitted.
          </p>
        </div>
      </div>
    </div>
  );
}

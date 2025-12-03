import React, { useState } from 'react';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalToast } from './MoLoyalToast';
import { FinanceIcons, UIIcons } from './MoLoyalIcons';
import { Badge } from '../ui/badge';

interface MoLoyalAgentOfflineQueueProps {
  agent: any;
  queuedTransactions: any[];
  onBack: () => void;
  onRetry: (transactionId: string) => void;
}

export function MoLoyalAgentOfflineQueue({ 
  agent, 
  queuedTransactions, 
  onBack, 
  onRetry 
}: MoLoyalAgentOfflineQueueProps) {
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());
  const [retryingAll, setRetryingAll] = useState(false);

  const handleRetry = async (transactionId: string) => {
    setRetryingIds(prev => new Set(prev).add(transactionId));

    // Simulate retry process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        MoLoyalToast.success('Retry Successful', 'Transaction processed successfully');
      } else {
        MoLoyalToast.error('Retry Failed', 'Network error - will retry automatically');
      }
      
      setRetryingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
      });
      
      onRetry(transactionId);
    }, 2000);
  };

  const handleRetryAll = async () => {
    setRetryingAll(true);

    // Simulate retrying all transactions
    setTimeout(() => {
      const successCount = Math.floor(queuedTransactions.length * 0.7);
      MoLoyalToast.success(
        'Batch Retry Complete', 
        `${successCount}/${queuedTransactions.length} transactions processed`
      );
      
      setRetryingAll(false);
      queuedTransactions.forEach(t => onRetry(t.id));
    }, 3000);
  };

  const getTransactionIcon = (type: string) => {
    return type === 'cash_in' 
      ? <FinanceIcons.ArrowUp className="h-4 w-4 text-green-600" />
      : <FinanceIcons.ArrowDown className="h-4 w-4 text-red-600" />;
  };

  const getRetryBadge = (retryCount: number) => {
    if (retryCount === 0) return null;
    
    const variant = retryCount >= 3 ? 'destructive' : 'secondary';
    return (
      <Badge variant={variant} className="text-xs">
        {retryCount} retr{retryCount === 1 ? 'y' : 'ies'}
      </Badge>
    );
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
        <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
          <UIIcons.ArrowLeft className="h-4 w-4" />
        </MoLoyalButton>
        <div>
          <h1 className="font-semibold">Offline Queue</h1>
          <p className="text-xs text-muted-foreground">
            {queuedTransactions.length} pending transaction{queuedTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Connection Status */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UIIcons.Wifi className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-800">Network Status</span>
          </div>
          <p className="text-sm text-amber-700">
            These transactions are queued due to network connectivity issues. 
            They will be automatically retried when connection is restored.
          </p>
        </div>

        {/* Bulk Actions */}
        {queuedTransactions.length > 1 && (
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Bulk Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Retry all queued transactions
                </p>
              </div>
              <MoLoyalButton
                variant="secondary"
                onClick={handleRetryAll}
                disabled={retryingAll}
              >
                {retryingAll ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">
                      <UIIcons.RefreshCw className="h-4 w-4" />
                    </div>
                    Retrying...
                  </div>
                ) : (
                  'Retry All'
                )}
              </MoLoyalButton>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="space-y-3">
          {queuedTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-card border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'cash_in' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{transaction.soldierName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {transaction.soldierServiceNumber} • {transaction.soldierRank}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{transaction.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Fee: ₦{transaction.agentFee.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.type === 'cash_in' ? 'Cash-In' : 'Cash-Out'}
                  </Badge>
                  {getRetryBadge(transaction.retryCount)}
                  {transaction.withdrawalCode && (
                    <Badge variant="outline" className="text-xs font-mono">
                      {transaction.withdrawalCode}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </div>

              {transaction.lastRetry && (
                <div className="text-xs text-muted-foreground mb-3">
                  Last retry: {new Date(transaction.lastRetry).toLocaleTimeString()}
                </div>
              )}

              <MoLoyalButton
                variant="primary"
                size="small"
                onClick={() => handleRetry(transaction.id)}
                disabled={retryingIds.has(transaction.id) || retryingAll}
                className="w-full"
              >
                {retryingIds.has(transaction.id) ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">
                      <UIIcons.RefreshCw className="h-3 w-3" />
                    </div>
                    Retrying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UIIcons.RefreshCw className="h-3 w-3" />
                    Retry Transaction
                  </div>
                )}
              </MoLoyalButton>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {queuedTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UIIcons.CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground">
              No pending transactions in the offline queue
            </p>
          </div>
        )}

        {/* Auto-retry Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UIIcons.Info className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Auto-Retry</span>
          </div>
          <p className="text-sm text-blue-700">
            Transactions are automatically retried every 30 seconds when network 
            connection is available. Manual retry is available anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
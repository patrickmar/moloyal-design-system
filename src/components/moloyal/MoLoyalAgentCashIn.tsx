import React, { useState } from 'react';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalInput } from './MoLoyalInput';
import { MoLoyalToast } from './MoLoyalToast';
import { MoLoyalBadge } from './MoLoyalBadge';
import { FinanceIcons, UIIcons, MilitaryIcons } from './MoLoyalIcons';
import { sampleUsers } from './data';

interface MoLoyalAgentCashInProps {
  agent: any;
  onBack: () => void;
  onTransactionComplete: (transaction: any) => void;
}

type Step = 'scan' | 'amount' | 'receipt';

export function MoLoyalAgentCashIn({ agent, onBack, onTransactionComplete }: MoLoyalAgentCashInProps) {
  const [currentStep, setCurrentStep] = useState<Step>('scan');
  const [serviceNumber, setServiceNumber] = useState('');
  const [detectedSoldier, setDetectedSoldier] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);

  // Calculate agent fee based on amount and rank
  const calculateFee = (amount: number, rank: string) => {
    if (rank === 'Lieutenant' || rank === 'Captain') return 0; // No fee for officers
    if (amount <= 5000) return Math.max(25, amount * 0.01); // 1% min ₦25
    return Math.max(50, amount * 0.005); // 0.5% min ₦50
  };

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false);
      setServiceNumber('2023/0001');
      handleServiceNumberLookup('2023/0001');
    }, 2000);
  };

  const handleServiceNumberLookup = (serviceNo: string) => {
    const soldier = sampleUsers.find(u => u.service_no === serviceNo);
    
    if (soldier) {
      setDetectedSoldier(soldier);
      MoLoyalToast.success('Soldier Found', `${soldier.name} - ${soldier.rank}`);
    } else {
      setDetectedSoldier(null);
      MoLoyalToast.error('Not Found', 'Service number not found in system');
    }
  };

  const handleServiceNumberChange = (value: string) => {
    setServiceNumber(value);
    if (value.length >= 9) {
      handleServiceNumberLookup(value);
    }
  };

  const handleAmountConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      MoLoyalToast.error('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > agent.floatBalance) {
      MoLoyalToast.error('Insufficient Float', 'Amount exceeds your float balance');
      return;
    }

    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      const amountValue = parseFloat(amount);
      const fee = calculateFee(amountValue, detectedSoldier.rank);
      const reference = `CI-${new Date().toISOString().split('T')[0]}-${Math.random().toString().substring(2, 8)}`;
      
      const newTransaction = {
        id: `AT${Date.now()}`,
        agentId: agent.id,
        type: 'cash_in',
        soldierServiceNumber: serviceNumber,
        soldierName: detectedSoldier.name,
        soldierRank: detectedSoldier.rank,
        amount: amountValue,
        agentFee: fee,
        netAmount: amountValue - fee,
        reference,
        status: 'completed',
        timestamp: new Date().toISOString(),
        receiptGenerated: true,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      };

      setTransaction(newTransaction);
      setIsProcessing(false);
      setCurrentStep('receipt');
    }, 3000);
  };

  const handlePrintReceipt = () => {
    MoLoyalToast.success('Receipt Printed', 'Transaction receipt generated');
    setTimeout(() => {
      onTransactionComplete(transaction);
    }, 1000);
  };

  // Step 1: Scan/Enter Service Number
  if (currentStep === 'scan') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
            <UIIcons.ArrowLeft className="h-4 w-4" />
          </MoLoyalButton>
          <div>
            <h1 className="font-semibold">Cash-In Deposit</h1>
            <p className="text-xs text-muted-foreground">Step 1: Identify Soldier</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* QR Scanner Section */}
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-dashed ${isScanning ? 'border-primary bg-primary/10 animate-pulse' : 'border-muted-foreground/30'}`}>
                <MilitaryIcons.QrCode className={`h-10 w-10 ${isScanning ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Point camera at soldier's QR code
                </p>
                
                <MoLoyalButton
                  variant="primary"
                  size="large"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <UIIcons.Clock className="h-4 w-4" />
                      </div>
                      Scanning...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MilitaryIcons.QrCode className="h-4 w-4" />
                      Start Scan
                    </div>
                  )}
                </MoLoyalButton>
              </div>
            </div>
          </div>

          {/* Manual Entry Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="space-y-4">
            <MoLoyalInput
              label="Service Number"
              placeholder="e.g., 2023/0001"
              value={serviceNumber}
              onChange={(e) => handleServiceNumberChange(e.target.value)}
              helperText="Format: YYYY/NNNN"
            />

            {detectedSoldier && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">{detectedSoldier.name}</h4>
                    <p className="text-sm text-green-600">Service No: {detectedSoldier.service_no}</p>
                  </div>
                  <MoLoyalBadge rank={detectedSoldier.rank} />
                </div>
                
                <MoLoyalButton
                  variant="primary"
                  onClick={() => setCurrentStep('amount')}
                  className="w-full mt-4"
                >
                  Continue to Amount →
                </MoLoyalButton>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Enter Amount & Confirm
  if (currentStep === 'amount') {
    const amountValue = parseFloat(amount) || 0;
    const fee = calculateFee(amountValue, detectedSoldier.rank);
    const netAmount = amountValue - fee;

    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <MoLoyalButton variant="ghost" size="small" onClick={() => setCurrentStep('scan')}>
            <UIIcons.ArrowLeft className="h-4 w-4" />
          </MoLoyalButton>
          <div>
            <h1 className="font-semibold">Cash-In Deposit</h1>
            <p className="text-xs text-muted-foreground">Step 2: Enter Amount</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Soldier Info */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{detectedSoldier.name}</h3>
                <p className="text-sm text-muted-foreground">{detectedSoldier.service_no}</p>
              </div>
              <MoLoyalBadge rank={detectedSoldier.rank} />
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <MoLoyalInput
              label="Deposit Amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              helperText={`Available float: ₦${agent.floatBalance.toLocaleString()}`}
            />

            {amountValue > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Deposit Amount:</span>
                  <span className="font-medium">₦{amountValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Agent Fee ({detectedSoldier.rank === 'Lieutenant' ? '0%' : fee/amountValue*100}%):</span>
                  <span className="font-medium">₦{fee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Net to Soldier:</span>
                  <span>₦{netAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <MoLoyalButton
            variant="primary"
            size="large"
            onClick={handleAmountConfirm}
            disabled={!amount || amountValue <= 0 || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <UIIcons.Clock className="h-4 w-4" />
                </div>
                Processing Transaction...
              </div>
            ) : (
              `Confirm Deposit - ₦${(amountValue || 0).toLocaleString()}`
            )}
          </MoLoyalButton>
        </div>
      </div>
    );
  }

  // Step 3: Receipt & QR Code
  if (currentStep === 'receipt') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
          <UIIcons.CheckCircle className="h-6 w-6" />
          <div>
            <h1 className="font-semibold">Transaction Complete</h1>
            <p className="text-xs opacity-90">Cash-In Successful</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Receipt */}
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold">CASH-IN RECEIPT</h2>
              <p className="text-sm text-muted-foreground">MoLoyal Agent Transaction</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-mono font-medium">{transaction.reference}</span>
              </div>
              <div className="flex justify-between">
                <span>Date/Time:</span>
                <span>{new Date(transaction.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Soldier:</span>
                <span className="font-medium">{transaction.soldierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Service No:</span>
                <span className="font-mono">{transaction.soldierServiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Rank:</span>
                <span>{transaction.soldierRank}</span>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Deposit Amount:</span>
                  <span>₦{transaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent Fee:</span>
                  <span>₦{transaction.agentFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Net Credited:</span>
                  <span>₦{transaction.netAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Agent:</span>
                  <span>{agent.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent ID:</span>
                  <span className="font-mono">{agent.agentCode}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-6 text-center">
              <div className="inline-block bg-muted p-4 rounded-lg">
                <div className="w-24 h-24 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs">QR Code</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Transaction Verification Code</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <MoLoyalButton
              variant="primary"
              size="large"
              onClick={handlePrintReceipt}
              className="w-full"
            >
              <div className="flex items-center gap-2">
                <FinanceIcons.Receipt className="h-4 w-4" />
                Print Receipt
              </div>
            </MoLoyalButton>

            <MoLoyalButton
              variant="secondary"
              size="large"
              onClick={() => {
                setCurrentStep('scan');
                setServiceNumber('');
                setDetectedSoldier(null);
                setAmount('');
                setTransaction(null);
              }}
              className="w-full"
            >
              New Transaction
            </MoLoyalButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
import React, { useState } from 'react';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalInput } from './MoLoyalInput';
import { MoLoyalToast } from './MoLoyalToast';
import { MoLoyalBadge } from './MoLoyalBadge';
import { FinanceIcons, UIIcons, SecurityIcons } from './MoLoyalIcons';
import { sampleUsers } from './data';

interface MoLoyalAgentCashOutProps {
  agent: any;
  onBack: () => void;
  onTransactionComplete: (transaction: any) => void;
}

type Step = 'code' | 'verify' | 'otp' | 'complete';

export function MoLoyalAgentCashOut({ agent, onBack, onTransactionComplete }: MoLoyalAgentCashOutProps) {
  const [currentStep, setCurrentStep] = useState<Step>('code');
  const [withdrawalCode, setWithdrawalCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [withdrawalRequest, setWithdrawalRequest] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);

  // Mock withdrawal requests - would come from API
  const mockWithdrawalRequests = [
    {
      code: 'WTH123456',
      soldierServiceNumber: '2023/0001',
      soldierName: 'Amina Okoye',
      soldierRank: 'Sergeant',
      amount: 15000,
      agentFee: 100,
      netAmount: 14900,
      reference: 'WTH-2025-10-04-001',
      requiresOTP: false,
      kycVerified: true
    },
    {
      code: 'WTH789012',
      soldierServiceNumber: '2023/0002',
      soldierName: 'Chinedu Emmanuel',
      soldierRank: 'Corporal',
      amount: 50000,
      agentFee: 300,
      netAmount: 49700,
      reference: 'WTH-2025-10-04-002',
      requiresOTP: true, // Large amount requires OTP
      kycVerified: true
    }
  ];

  const handleVerifyCode = () => {
    if (!withdrawalCode) {
      MoLoyalToast.error('Error', 'Please enter withdrawal code');
      return;
    }

    setIsVerifying(true);

    // Simulate code verification
    setTimeout(() => {
      const request = mockWithdrawalRequests.find(r => r.code === withdrawalCode);
      
      if (request) {
        setWithdrawalRequest(request);
        setRequiresOTP(request.requiresOTP);
        setIsVerifying(false);
        setCurrentStep('verify');
        MoLoyalToast.success('Code Verified', 'Withdrawal request found');
      } else {
        setIsVerifying(false);
        MoLoyalToast.error('Invalid Code', 'Withdrawal code not found or expired');
      }
    }, 2000);
  };

  const handleConfirmPayout = () => {
    if (requiresOTP) {
      setCurrentStep('otp');
      // Simulate sending OTP to agent
      MoLoyalToast.info('OTP Sent', `Verification code sent to ${agent.phone}`);
    } else {
      processTransaction();
    }
  };

  const handleOTPVerification = () => {
    if (otpCode !== '123456') {
      MoLoyalToast.error('Invalid OTP', 'Please check the code and try again');
      return;
    }

    processTransaction();
  };

  const processTransaction = () => {
    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      const transaction = {
        id: `AT${Date.now()}`,
        agentId: agent.id,
        type: 'cash_out',
        soldierServiceNumber: withdrawalRequest.soldierServiceNumber,
        soldierName: withdrawalRequest.soldierName,
        soldierRank: withdrawalRequest.soldierRank,
        amount: withdrawalRequest.amount,
        agentFee: withdrawalRequest.agentFee,
        netAmount: withdrawalRequest.netAmount,
        reference: withdrawalRequest.reference,
        withdrawalCode,
        status: 'completed',
        timestamp: new Date().toISOString(),
        otpVerified: requiresOTP
      };

      setIsProcessing(false);
      setCurrentStep('complete');
      
      // Update agent float balance (simulate)
      setTimeout(() => {
        onTransactionComplete(transaction);
      }, 2000);
    }, 3000);
  };

  // Step 1: Enter Withdrawal Code
  if (currentStep === 'code') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
            <UIIcons.ArrowLeft className="h-4 w-4" />
          </MoLoyalButton>
          <div>
            <h1 className="font-semibold">Cash-Out Withdrawal</h1>
            <p className="text-xs text-muted-foreground">Step 1: Enter Code</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Instructions */}
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <FinanceIcons.ArrowDown className="h-10 w-10 text-red-600" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Withdrawal Request</h3>
                <p className="text-sm text-muted-foreground">
                  Ask soldier to provide their withdrawal code
                </p>
              </div>
            </div>
          </div>

          {/* Code Input */}
          <div className="space-y-4">
            <MoLoyalInput
              label="Withdrawal Code"
              placeholder="Enter withdrawal code"
              value={withdrawalCode}
              onChange={(e) => setWithdrawalCode(e.target.value.toUpperCase())}
              helperText="Code format: WTH123456"
            />

            <MoLoyalButton
              variant="primary"
              size="large"
              onClick={handleVerifyCode}
              disabled={!withdrawalCode || isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <UIIcons.Clock className="h-4 w-4" />
                  </div>
                  Verifying Code...
                </div>
              ) : (
                'Verify Code'
              )}
            </MoLoyalButton>
          </div>

          {/* Demo Codes */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2 text-sm">Demo Codes</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>WTH123456:</span>
                <span>₦15,000 (No OTP)</span>
              </div>
              <div className="flex justify-between">
                <span>WTH789012:</span>
                <span>₦50,000 (Requires OTP)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Verify KYC & Confirm Payout
  if (currentStep === 'verify') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <MoLoyalButton variant="ghost" size="small" onClick={() => setCurrentStep('code')}>
            <UIIcons.ArrowLeft className="h-4 w-4" />
          </MoLoyalButton>
          <div>
            <h1 className="font-semibold">Cash-Out Withdrawal</h1>
            <p className="text-xs text-muted-foreground">Step 2: Verify & Confirm</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Soldier Details */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{withdrawalRequest.soldierName}</h3>
                <p className="text-sm text-muted-foreground">{withdrawalRequest.soldierServiceNumber}</p>
              </div>
              <MoLoyalBadge rank={withdrawalRequest.soldierRank} />
            </div>

            {/* KYC Status */}
            <div className="flex items-center gap-2 mb-4">
              <UIIcons.CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">KYC Verified</span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Withdrawal Amount:</span>
              <span className="font-medium">₦{withdrawalRequest.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Agent Fee:</span>
              <span className="font-medium">₦{withdrawalRequest.agentFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Cash to Pay:</span>
              <span>₦{withdrawalRequest.netAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Reference:</span>
              <span className="font-mono">{withdrawalRequest.reference}</span>
            </div>
          </div>

          {/* Security Notice */}
          {requiresOTP && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SecurityIcons.Shield className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">Additional Verification Required</span>
              </div>
              <p className="text-sm text-amber-700">
                This withdrawal requires OTP verification due to amount size.
              </p>
            </div>
          )}

          {/* Confirm Button */}
          <MoLoyalButton
            variant="primary"
            size="large"
            onClick={handleConfirmPayout}
            className="w-full"
          >
            {requiresOTP 
              ? `Proceed to OTP Verification`
              : `Confirm Payout - ₦${withdrawalRequest.netAmount.toLocaleString()}`
            }
          </MoLoyalButton>
        </div>
      </div>
    );
  }

  // Step 3: OTP Verification (if required)
  if (currentStep === 'otp') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
          <MoLoyalButton variant="ghost" size="small" onClick={() => setCurrentStep('verify')}>
            <UIIcons.ArrowLeft className="h-4 w-4" />
          </MoLoyalButton>
          <div>
            <h1 className="font-semibold">OTP Verification</h1>
            <p className="text-xs text-muted-foreground">Security Verification Required</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* OTP Instructions */}
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full">
                <SecurityIcons.Shield className="h-10 w-10 text-amber-600" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Enter Verification Code</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to your registered phone number
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {agent.phone}
                </p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <MoLoyalInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              type="number"
              helperText="Demo OTP: 123456"
            />

            <MoLoyalButton
              variant="primary"
              size="large"
              onClick={handleOTPVerification}
              disabled={otpCode.length !== 6 || isProcessing}
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
                'Verify & Complete Transaction'
              )}
            </MoLoyalButton>

            <MoLoyalButton
              variant="ghost"
              size="medium"
              onClick={() => MoLoyalToast.info('OTP Resent', 'New code sent to your phone')}
              className="w-full"
            >
              Resend Code
            </MoLoyalButton>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Transaction Complete
  if (currentStep === 'complete') {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
          <UIIcons.CheckCircle className="h-6 w-6" />
          <div>
            <h1 className="font-semibold">Cash-Out Complete</h1>
            <p className="text-xs opacity-90">Payment Successful</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Success Message */}
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <FinanceIcons.Banknote className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">₦{withdrawalRequest.netAmount.toLocaleString()}</h2>
            <p className="text-sm text-muted-foreground">
              Cash paid to {withdrawalRequest.soldierName}
            </p>
          </div>

          {/* Transaction Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Soldier:</span>
              <span className="font-medium">{withdrawalRequest.soldierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Service No:</span>
              <span className="font-mono">{withdrawalRequest.soldierServiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono">{withdrawalRequest.reference}</span>
            </div>
            <div className="flex justify-between">
              <span>Date/Time:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            {requiresOTP && (
              <div className="flex justify-between">
                <span>OTP Verified:</span>
                <span className="text-green-600 font-medium">✓ Yes</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Important:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Count cash carefully before handing over</li>
              <li>• Ask soldier to verify amount</li>
              <li>• Transaction cannot be reversed</li>
              <li>• Keep records for reconciliation</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <MoLoyalButton
              variant="secondary"
              size="large"
              onClick={() => {
                setCurrentStep('code');
                setWithdrawalCode('');
                setOtpCode('');
                setWithdrawalRequest(null);
                setRequiresOTP(false);
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
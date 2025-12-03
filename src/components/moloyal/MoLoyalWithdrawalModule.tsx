import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Alert, AlertDescription } from "../ui/alert";
// import { motion } from 'motion/react'; // Removed to prevent performance issues
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalAppBar } from "./MoLoyalAppBar";
import { MoLoyalModal, MoLoyalConfirmation } from "./MoLoyalModal";
import { MoLoyalToast } from "./MoLoyalToast";
import {
  FinanceIcons,
  SecurityIcons,
  UIIcons,
  MilitaryIcons,
} from "./MoLoyalIcons";
import { User, Transaction } from "./types";
import { formatCurrency } from "./data";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface AgentLocation {
  id: string;
  name: string;
  location: string;
  distance: string;
  fee: number;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  destinationType: "bank" | "agent";
  destination: BankAccount | AgentLocation;
  reason?: string;
  supportingDoc?: File;
  status: "pending" | "approved" | "denied" | "completed";
  createdAt: string;
  processedAt?: string;
  denialReason?: string;
  reference: string;
  fees: number;
  netAmount: number;
  adminNotes?: string;
}

interface LockedFunds {
  totalLocked: number;
  lockUntil: string;
  reason: string;
  policyReference: string;
  canRequestEarlyRelease: boolean;
}

interface Props {
  user: User;
  availableBalance: number;
  lockedFunds?: LockedFunds;
  bankAccounts: BankAccount[];
  agentLocations: AgentLocation[];
  withdrawalThreshold: number;
  onBack: () => void;
  onWithdrawalSubmit: (request: WithdrawalRequest) => void;
  onEarlyReleaseRequest: (reason: string, doc?: File) => void;
}

export function MoLoyalWithdrawalModule({
  user,
  availableBalance,
  lockedFunds,
  bankAccounts,
  agentLocations,
  withdrawalThreshold = 50000,
  onBack,
  onWithdrawalSubmit,
  onEarlyReleaseRequest,
}: Props) {
  const [currentScreen, setCurrentScreen] = useState<
    "form" | "locked" | "release-request" | "mfa" | "success" | "denied"
  >("form");
  const [amount, setAmount] = useState("");
  const [destinationType, setDestinationType] = useState<"bank" | "agent">(
    "bank"
  );
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [showAuthMethods, setShowAuthMethods] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [releaseReason, setReleaseReason] = useState("");
  const [supportingDoc, setSupportingDoc] = useState<File | null>(null);
  const [currentRequest, setCurrentRequest] =
    useState<WithdrawalRequest | null>(null);

  // Mock blocked account detection
  const [needsReauth, setNeedsReauth] = useState(true);
  const [isReauthenticated, setIsReauthenticated] = useState(false);

  const numericAmount = React.useMemo(() => parseFloat(amount) || 0, [amount]);
  const fees = React.useMemo(
    () => (destinationType === "agent" ? 100 : 0),
    [destinationType]
  );
  const netAmount = React.useMemo(
    () => numericAmount - fees,
    [numericAmount, fees]
  );
  const needsStepUpAuth = React.useMemo(
    () => numericAmount > withdrawalThreshold,
    [numericAmount, withdrawalThreshold]
  );

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^\d.]/g, "");
    setAmount(sanitized);
  };

  const handleWithdrawalSubmit = () => {
    if (!amount || numericAmount <= 0 || !selectedDestination) {
      MoLoyalToast.error(
        "Invalid Input",
        "Please enter a valid amount and select destination"
      );
      return;
    }

    if (numericAmount > availableBalance) {
      MoLoyalToast.error(
        "Insufficient Balance",
        "Amount exceeds available balance"
      );
      return;
    }

    // Check if funds are locked
    if (
      lockedFunds &&
      numericAmount > availableBalance - lockedFunds.totalLocked
    ) {
      setCurrentScreen("locked");
      return;
    }

    // Proceed to MFA if amount is above threshold or always for demo
    setCurrentScreen("mfa");
  };

  const handleMfaSubmit = () => {
    setIsVerifyingOtp(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifyingOtp(false);

      if (otpCode === "123456") {
        // Create withdrawal request
        const destination =
          destinationType === "bank"
            ? bankAccounts.find((acc) => acc.id === selectedDestination)
            : agentLocations.find((agent) => agent.id === selectedDestination);

        const request: WithdrawalRequest = {
          id: `WD${Date.now()}`,
          amount: numericAmount,
          destinationType,
          destination: destination!,
          status: Math.random() > 0.3 ? "completed" : "denied", // 70% success rate for demo
          createdAt: new Date().toISOString(),
          reference: `REF${Date.now().toString().slice(-8)}`,
          fees,
          netAmount,
          denialReason:
            Math.random() > 0.3 ? undefined : "Exceeds daily withdrawal limit",
        };

        setCurrentRequest(request);
        onWithdrawalSubmit(request);

        if (request.status === "completed") {
          setCurrentScreen("success");
          MoLoyalToast.success(
            "Withdrawal Successful",
            `₦${formatCurrency(netAmount)} sent successfully`
          );
        } else {
          setCurrentScreen("denied");
        }
      } else {
        MoLoyalToast.error(
          "Invalid OTP",
          "Please check your code and try again"
        );
      }
    }, 2000);
  };

  const handleEarlyRelease = () => {
    if (!releaseReason.trim()) {
      MoLoyalToast.error(
        "Required Field",
        "Please provide a reason for early release"
      );
      return;
    }

    onEarlyReleaseRequest(releaseReason, supportingDoc || undefined);
    MoLoyalToast.success(
      "Request Submitted",
      "Early release request sent for approval"
    );
    setCurrentScreen("form");
  };

  const handleReauth = () => {
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (otpCode === "123456") {
        setIsReauthenticated(true);
        setNeedsReauth(false);
        MoLoyalToast.success("Authenticated", "Account details unlocked");
      } else {
        MoLoyalToast.error("Invalid OTP", "Please try again");
      }
    }, 1500);
  };

  // Mask account number for security
  const maskAccountNumber = React.useCallback(
    (accountNumber: string) => {
      if (!isReauthenticated && needsReauth) {
        return "••••••" + accountNumber.slice(-4);
      }
      return accountNumber;
    },
    [isReauthenticated, needsReauth]
  );

  const renderWithdrawalForm = () => (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-6">
        {/* Amount Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FinanceIcons.Wallet className="h-5 w-5 text-primary" />
              <CardTitle>Withdrawal Amount</CardTitle>
            </div>
            <CardDescription>
              Available balance: {formatCurrency(availableBalance)}
              {lockedFunds && (
                <span className="block text-amber-600 mt-1">
                  ⚠️ {formatCurrency(lockedFunds.totalLocked)} locked until{" "}
                  {new Date(lockedFunds.lockUntil).toLocaleDateString()}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAmountChange(e.target.value)
                  }
                  placeholder="0.00"
                  className="text-lg"
                />
              </div>

              {numericAmount > 0 && (
                <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Withdrawal amount:</span>
                    <span>{formatCurrency(numericAmount)}</span>
                  </div>
                  {fees > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Transaction fee:</span>
                      <span>-{formatCurrency(fees)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>You'll receive:</span>
                    <span>{formatCurrency(netAmount)}</span>
                  </div>
                  {needsStepUpAuth && (
                    <Alert>
                      <SecurityIcons.Shield className="h-4 w-4" />
                      <AlertDescription>
                        Step-up authentication required for amounts above{" "}
                        {formatCurrency(withdrawalThreshold)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Destination Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Method</CardTitle>
            <CardDescription>
              Choose how you'd like to receive your funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={destinationType}
              onValueChange={(value: string) =>
                setDestinationType(value as "bank" | "agent")
              }
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2">
                    <FinanceIcons.Bank className="h-4 w-4" />
                    Bank Transfer (Free)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agent" id="agent" />
                  <Label htmlFor="agent" className="flex items-center gap-2">
                    <MilitaryIcons.Location className="h-4 w-4" />
                    Agent Cash-out (₦100 fee)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Bank Account Selection */}
        {destinationType === "bank" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Bank Account</CardTitle>
                {needsReauth && !isReauthenticated && (
                  <MoLoyalButton
                    variant="ghost"
                    size="small"
                    onClick={() => setShowAuthMethods(true)}
                  >
                    <SecurityIcons.Eye className="h-4 w-4 mr-1" />
                    Show Details
                  </MoLoyalButton>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedDestination}
                onValueChange={(value: string) => setSelectedDestination(value)}
              >
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={account.id} id={account.id} />
                      <Label
                        htmlFor={account.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {account.bankName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {maskAccountNumber(account.accountNumber)} •{" "}
                              {account.accountName}
                            </div>
                          </div>
                          {account.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Agent Location Selection */}
        {destinationType === "agent" && (
          <Card>
            <CardHeader>
              <CardTitle>Select Agent Location</CardTitle>
              <CardDescription>Choose a nearby cash-out agent</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedDestination}
                onValueChange={(value: string) => setSelectedDestination(value)}
              >
                <div className="space-y-3">
                  {agentLocations.map((agent) => (
                    <div key={agent.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={agent.id} id={agent.id} />
                      <Label
                        htmlFor={agent.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {agent.location} • {agent.distance} away
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ₦{agent.fee} fee
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="pb-6">
          <MoLoyalButton
            onClick={handleWithdrawalSubmit}
            disabled={!amount || numericAmount <= 0 || !selectedDestination}
            className="w-full"
            size="large"
          >
            <SecurityIcons.Lock className="h-4 w-4 mr-2" />
            Proceed to Verification
          </MoLoyalButton>
        </div>
      </div>

      {/* Re-auth Modal */}
      <MoLoyalModal
        open={showAuthMethods}
        onOpenChange={setShowAuthMethods}
        title="Verify Identity"
        description="Enter OTP to view full account details"
        trigger={<div />} // Added trigger prop
      >
        <div className="space-y-4">
          <MoLoyalInput
            label="OTP Code"
            value={otpCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOtpCode(e.target.value)
            }
            placeholder="Enter 6-digit code"
            helperText="Demo: Use 123456"
          />
          <div className="flex gap-2">
            <MoLoyalButton
              variant="ghost"
              onClick={() => setShowAuthMethods(false)}
              className="flex-1"
            >
              Cancel
            </MoLoyalButton>
            <MoLoyalButton
              onClick={handleReauth}
              disabled={isVerifyingOtp || otpCode.length !== 6}
              className="flex-1"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify"}
            </MoLoyalButton>
          </div>
        </div>
      </MoLoyalModal>
    </ScrollArea>
  );

  const renderLockedFundsScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
          <SecurityIcons.Lock className="h-10 w-10 text-amber-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Funds Locked</h2>
          <p className="text-muted-foreground">
            Your funds are locked until{" "}
            <span className="font-medium">
              {new Date(lockedFunds!.lockUntil).toLocaleDateString()}
            </span>
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Locked Amount:</span>
                <span className="font-medium">
                  {formatCurrency(lockedFunds!.totalLocked)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reason:</span>
                <span className="font-medium">{lockedFunds!.reason}</span>
              </div>
              <div className="flex justify-between">
                <span>Policy Ref:</span>
                <span className="font-medium text-primary">
                  {lockedFunds!.policyReference}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {lockedFunds!.canRequestEarlyRelease && (
            <MoLoyalButton
              onClick={() => setCurrentScreen("release-request")}
              className="w-full"
            >
              <MilitaryIcons.Document className="h-4 w-4 mr-2" />
              Request Early Release
            </MoLoyalButton>
          )}

          <MoLoyalButton
            variant="ghost"
            onClick={() => setCurrentScreen("form")}
            className="w-full"
          >
            <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
            Back to Withdrawal
          </MoLoyalButton>
        </div>
      </div>
    </div>
  );

  const renderEarlyReleaseRequest = () => (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Request Early Release</h2>
          <p className="text-muted-foreground">
            Submit a request for early access to your locked funds
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Locked Funds Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">
                {formatCurrency(lockedFunds!.totalLocked)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Lock expires:</span>
              <span className="font-medium">
                {new Date(lockedFunds!.lockUntil).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reason:</span>
              <span className="font-medium">{lockedFunds!.reason}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Provide a reason for early release approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Early Release *</Label>
              <Textarea
                id="reason"
                value={releaseReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReleaseReason(e.target.value)
                }
                placeholder="Explain why you need early access to these funds..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Supporting Documentation (Optional)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSupportingDoc(e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="doc-upload"
                />
                <Label
                  htmlFor="doc-upload"
                  className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <MilitaryIcons.Document className="h-5 w-5" />
                  {supportingDoc
                    ? supportingDoc.name
                    : "Upload supporting document"}
                </Label>
              </div>
              {supportingDoc && (
                <p className="text-sm text-muted-foreground mt-1">
                  File uploaded: {supportingDoc.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Alert>
          <MilitaryIcons.Info className="h-4 w-4" />
          <AlertDescription>
            Early release requests are reviewed by regimental administrators.
            Approval is not guaranteed and may take 2-5 business days.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <MoLoyalButton
            variant="ghost"
            onClick={() => setCurrentScreen("locked")}
            className="flex-1"
          >
            Cancel
          </MoLoyalButton>
          <MoLoyalButton
            onClick={handleEarlyRelease}
            disabled={!releaseReason.trim()}
            className="flex-1"
          >
            Submit Request
          </MoLoyalButton>
        </div>
      </div>
    </ScrollArea>
  );

  const renderMfaScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <SecurityIcons.Shield className="h-10 w-10 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Verify Transaction</h2>
          <p className="text-muted-foreground">
            Enter the OTP sent to your registered phone number
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fees:</span>
                <span className="font-medium">{formatCurrency(fees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>You'll receive:</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <MoLoyalInput
            label="OTP Code"
            value={otpCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOtpCode(e.target.value)
            }
            placeholder="Enter 6-digit code"
            helperText="Demo: Use 123456"
          />

          <div className="flex gap-3">
            <MoLoyalButton
              variant="ghost"
              onClick={() => setCurrentScreen("form")}
              className="flex-1"
              disabled={isVerifyingOtp}
            >
              Cancel
            </MoLoyalButton>
            <MoLoyalButton
              onClick={handleMfaSubmit}
              disabled={isVerifyingOtp || otpCode.length !== 6}
              className="flex-1"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Withdraw"}
            </MoLoyalButton>
          </div>

          <div className="text-center">
            <MoLoyalButton
              variant="ghost"
              size="small"
              onClick={() =>
                MoLoyalToast.info(
                  "Biometric",
                  "Biometric authentication would be available on device"
                )
              }
            >
              <SecurityIcons.Fingerprint className="h-4 w-4 mr-1" />
              Use Biometric
            </MoLoyalButton>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <UIIcons.Check className="h-10 w-10 text-green-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-600">
            Withdrawal Successful!
          </h2>
          <p className="text-muted-foreground">
            Your withdrawal has been processed successfully
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Transaction Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono text-sm">
                {currentRequest?.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">
                {formatCurrency(currentRequest?.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fees:</span>
              <span className="font-medium">
                {formatCurrency(currentRequest?.fees || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Net Amount:</span>
              <span>{formatCurrency(currentRequest?.netAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                Completed
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <MoLoyalButton
            onClick={() => {
              navigator
                .share?.({
                  title: "MoLoyal Withdrawal Receipt",
                  text: `Withdrawal successful: ${formatCurrency(
                    currentRequest?.netAmount || 0
                  )} - Ref: ${currentRequest?.reference}`,
                })
                .catch(() => {
                  MoLoyalToast.success(
                    "Receipt",
                    "Receipt details copied to clipboard"
                  );
                });
            }}
            variant="secondary"
            className="w-full"
          >
            <UIIcons.Share className="h-4 w-4 mr-2" />
            Share Receipt
          </MoLoyalButton>

          <MoLoyalButton onClick={onBack} className="w-full">
            Done
          </MoLoyalButton>
        </div>
      </div>
    </div>
  );

  const renderDeniedScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <UIIcons.X className="h-10 w-10 text-red-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Withdrawal Denied
          </h2>
          <p className="text-muted-foreground">
            Your withdrawal request could not be processed
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Denial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono text-sm">
                {currentRequest?.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">
                {formatCurrency(currentRequest?.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant="destructive">Denied</Badge>
            </div>
            <Separator />
            <Alert>
              <MilitaryIcons.Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Reason:</strong> {currentRequest?.denialReason}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <MoLoyalButton
            onClick={() => {
              MoLoyalToast.info(
                "Contact Support",
                "Connecting to Regimental Admin..."
              );
              // Would open support ticket or contact flow
            }}
            variant="secondary"
            className="w-full"
          >
            <MilitaryIcons.Contact className="h-4 w-4 mr-2" />
            Contact Regimental Admin
          </MoLoyalButton>

          <MoLoyalButton
            onClick={() => setCurrentScreen("form")}
            variant="ghost"
            className="w-full"
          >
            <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
            Try Different Amount
          </MoLoyalButton>

          <MoLoyalButton onClick={onBack} className="w-full">
            Done
          </MoLoyalButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <MoLoyalAppBar
        variant="with-back"
        title="Withdraw Funds"
        onBack={
          currentScreen === "form" ? onBack : () => setCurrentScreen("form")
        }
      />

      <div className="flex-1 flex flex-col">
        {currentScreen === "form" && renderWithdrawalForm()}
        {currentScreen === "locked" && renderLockedFundsScreen()}
        {currentScreen === "release-request" && renderEarlyReleaseRequest()}
        {currentScreen === "mfa" && renderMfaScreen()}
        {currentScreen === "success" && renderSuccessScreen()}
        {currentScreen === "denied" && renderDeniedScreen()}
      </div>
    </div>
  );
}

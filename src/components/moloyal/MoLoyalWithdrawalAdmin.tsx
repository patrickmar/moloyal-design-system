import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { motion } from "motion/react";
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalModal, MoLoyalConfirmation } from "./MoLoyalModal";
import { MoLoyalToast } from "./MoLoyalToast";
import { MoLoyalBadge } from "./MoLoyalBadge";
import { MoLoyalAvatar } from "./MoLoyalAvatar";
import {
  FinanceIcons,
  SecurityIcons,
  UIIcons,
  MilitaryIcons,
} from "./MoLoyalIcons";
import { User, Rank } from "./types";
import { formatCurrency } from "./data";

// Helper function to validate rank
const isValidRank = (rank: string | undefined): rank is Rank => {
  if (!rank) return false;
  const validRanks: Rank[] = ["Private", "Corporal", "Sergeant", "Lieutenant"];
  return validRanks.includes(rank as Rank);
};

// Helper function to get valid rank or undefined
const getValidRank = (rank: string | undefined): Rank | undefined => {
  return isValidRank(rank) ? rank : undefined;
};

interface WithdrawalRequest {
  id: string;
  userId: string;
  user: User;
  amount: number;
  destinationType: "bank" | "agent";
  destinationDetails: {
    bankName?: string;
    accountNumber?: string;
    agentName?: string;
    location?: string;
  };
  status: "pending" | "approved" | "denied" | "completed";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
  denialReason?: string;
  reference: string;
  fees: number;
  netAmount: number;
  isEarlyRelease?: boolean;
  lockReleaseReason?: string;
  supportingDocument?: string;
  priority: "normal" | "high" | "urgent";
  riskLevel: "low" | "medium" | "high";
}

interface EarlyReleaseRequest {
  id: string;
  userId: string;
  user: User;
  lockedAmount: number;
  lockReason: string;
  lockUntil: string;
  releaseReason: string;
  supportingDocument?: string;
  status: "pending" | "approved" | "denied";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
}

interface Props {
  withdrawalRequests: WithdrawalRequest[];
  earlyReleaseRequests: EarlyReleaseRequest[];
  currentAdmin: User;
  onApproveWithdrawal: (id: string, notes?: string) => void;
  onDenyWithdrawal: (id: string, reason: string, notes?: string) => void;
  onApproveEarlyRelease: (id: string, notes?: string) => void;
  onDenyEarlyRelease: (id: string, reason: string, notes?: string) => void;
}

export function MoLoyalWithdrawalAdmin({
  withdrawalRequests,
  earlyReleaseRequests,
  currentAdmin,
  onApproveWithdrawal,
  onDenyWithdrawal,
  onApproveEarlyRelease,
  onDenyEarlyRelease,
}: Props) {
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [selectedReleaseRequest, setSelectedReleaseRequest] =
    useState<EarlyReleaseRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "deny" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [denialReason, setDenialReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingWithdrawals = React.useMemo(
    () => withdrawalRequests.filter((req) => req.status === "pending"),
    [withdrawalRequests]
  );

  const pendingReleases = React.useMemo(
    () => earlyReleaseRequests.filter((req) => req.status === "pending"),
    [earlyReleaseRequests]
  );

  const filteredWithdrawals = React.useMemo(() => {
    return withdrawalRequests.filter((req) => {
      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || req.priority === filterPriority;
      const matchesSearch =
        searchQuery === "" ||
        req.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.user.service_no.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [withdrawalRequests, filterStatus, filterPriority, searchQuery]);

  const handleApprove = () => {
    if (selectedRequest) {
      onApproveWithdrawal(selectedRequest.id, adminNotes);
      MoLoyalToast.success(
        "Approved",
        `Withdrawal ${selectedRequest.reference} approved`
      );
    } else if (selectedReleaseRequest) {
      onApproveEarlyRelease(selectedReleaseRequest.id, adminNotes);
      MoLoyalToast.success("Approved", "Early release request approved");
    }
    resetForm();
  };

  const handleDeny = () => {
    if (!denialReason.trim()) {
      MoLoyalToast.error("Required", "Please provide a denial reason");
      return;
    }

    if (selectedRequest) {
      onDenyWithdrawal(selectedRequest.id, denialReason, adminNotes);
      MoLoyalToast.success(
        "Denied",
        `Withdrawal ${selectedRequest.reference} denied`
      );
    } else if (selectedReleaseRequest) {
      onDenyEarlyRelease(selectedReleaseRequest.id, denialReason, adminNotes);
      MoLoyalToast.success("Denied", "Early release request denied");
    }
    resetForm();
  };

  const resetForm = () => {
    setSelectedRequest(null);
    setSelectedReleaseRequest(null);
    setActionType(null);
    setAdminNotes("");
    setDenialReason("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "normal":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "approved":
        return "secondary";
      case "denied":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const renderWithdrawalCard = (request: WithdrawalRequest) => {
    // Get valid rank or undefined
    const userRank = getValidRank(request.user.rank);

    return (
      <Card key={request.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <MoLoyalAvatar
                name={request.user.name}
                rank={userRank} // Use validated rank
                size="sm"
                src={request.user.avatar}
              />
              <div>
                <div className="font-medium">{request.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {request.user.service_no} • {request.user.rank || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>
              <Badge variant={getRiskColor(request.riskLevel)}>
                {request.riskLevel} risk
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <div className="font-medium">
                {formatCurrency(request.amount)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Net Amount:</span>
              <div className="font-medium">
                {formatCurrency(request.netAmount)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Method:</span>
              <div className="font-medium capitalize">
                {request.destinationType}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Reference:</span>
              <div className="font-mono text-xs">{request.reference}</div>
            </div>
          </div>

          {request.destinationType === "bank" && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Bank Details</div>
              <div className="text-sm text-muted-foreground">
                {request.destinationDetails.bankName} • ••••
                {request.destinationDetails.accountNumber?.slice(-4)}
              </div>
            </div>
          )}

          {request.destinationType === "agent" && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Agent Details</div>
              <div className="text-sm text-muted-foreground">
                {request.destinationDetails.agentName} •{" "}
                {request.destinationDetails.location}
              </div>
            </div>
          )}

          {request.isEarlyRelease && (
            <Alert>
              <SecurityIcons.Alert className="h-4 w-4" />
              <AlertDescription>
                <strong>Early Release Request:</strong>{" "}
                {request.lockReleaseReason}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground">
            Submitted: {new Date(request.submittedAt).toLocaleString()}
          </div>

          {request.status === "pending" && (
            <div className="flex gap-2">
              <MoLoyalButton
                variant="secondary"
                size="small"
                onClick={() => {
                  setSelectedRequest(request);
                  setActionType("approve");
                }}
                className="flex-1"
              >
                <UIIcons.Check className="h-4 w-4 mr-1" />
                Approve
              </MoLoyalButton>
              <MoLoyalButton
                variant="danger"
                size="small"
                onClick={() => {
                  setSelectedRequest(request);
                  setActionType("deny");
                }}
                className="flex-1"
              >
                <UIIcons.X className="h-4 w-4 mr-1" />
                Deny
              </MoLoyalButton>
            </div>
          )}

          {request.status !== "pending" && (
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor(request.status)}>
                {request.status}
              </Badge>
              {request.processedAt && (
                <div className="text-xs text-muted-foreground">
                  {new Date(request.processedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEarlyReleaseCard = (request: EarlyReleaseRequest) => {
    // Get valid rank or undefined
    const userRank = getValidRank(request.user.rank);

    return (
      <Card key={request.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <MoLoyalAvatar
                name={request.user.name}
                rank={userRank} // Use validated rank
                size="sm"
                src={request.user.avatar}
              />
              <div>
                <div className="font-medium">{request.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {request.user.service_no} • {request.user.rank || "N/A"}
                </div>
              </div>
            </div>
            <Badge variant="default">Early Release</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Locked Amount:</span>
              <div className="font-medium">
                {formatCurrency(request.lockedAmount)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Lock Until:</span>
              <div className="font-medium">
                {new Date(request.lockUntil).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">Lock Reason</div>
            <div className="text-sm text-muted-foreground">
              {request.lockReason}
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">
              Release Request Reason
            </div>
            <div className="text-sm text-muted-foreground">
              {request.releaseReason}
            </div>
          </div>

          {request.supportingDocument && (
            <div className="flex items-center gap-2 text-sm">
              <MilitaryIcons.Document className="h-4 w-4" />
              <span>Supporting document attached</span>
              <MoLoyalButton variant="ghost" size="small">
                View
              </MoLoyalButton>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Submitted: {new Date(request.submittedAt).toLocaleString()}
          </div>

          {request.status === "pending" && (
            <div className="flex gap-2">
              <MoLoyalButton
                variant="secondary"
                size="small"
                onClick={() => {
                  setSelectedReleaseRequest(request);
                  setActionType("approve");
                }}
                className="flex-1"
              >
                <UIIcons.Check className="h-4 w-4 mr-1" />
                Approve
              </MoLoyalButton>
              <MoLoyalButton
                variant="danger"
                size="small"
                onClick={() => {
                  setSelectedReleaseRequest(request);
                  setActionType("deny");
                }}
                className="flex-1"
              >
                <UIIcons.X className="h-4 w-4 mr-1" />
                Deny
              </MoLoyalButton>
            </div>
          )}

          {request.status !== "pending" && (
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor(request.status)}>
                {request.status}
              </Badge>
              {request.processedAt && (
                <div className="text-xs text-muted-foreground">
                  {new Date(request.processedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Get current admin's valid rank
  const currentAdminRank = getValidRank(currentAdmin.rank);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Withdrawal Administration</h1>
              <p className="text-muted-foreground">
                Manage withdrawal requests and early release approvals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MoLoyalAvatar
                name={currentAdmin.name}
                rank={currentAdminRank} // Use validated rank
                size="sm"
                src={currentAdmin.avatar}
              />
              <div className="text-right">
                <div className="text-sm font-medium">{currentAdmin.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentAdmin.rank || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-amber-600">
                  {pendingWithdrawals.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Withdrawals
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {pendingReleases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Releases
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-green-600">
                  {
                    withdrawalRequests.filter((r) => r.status === "approved")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Approved Today
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    withdrawalRequests
                      .filter((r) => r.status === "pending")
                      .reduce((sum, r) => sum + r.amount, 0)
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Amount
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b bg-card px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="withdrawals"
              className="flex items-center gap-2"
            >
              <FinanceIcons.ArrowDown className="h-4 w-4" />
              Withdrawals ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="releases" className="flex items-center gap-2">
              <SecurityIcons.Unlock className="h-4 w-4" />
              Early Releases ({pendingReleases.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="withdrawals" className="flex-1 flex flex-col p-4">
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by name, service number, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Withdrawal Requests */}
          <ScrollArea className="flex-1">
            <div className="grid gap-4">
              {filteredWithdrawals.map(renderWithdrawalCard)}
              {filteredWithdrawals.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FinanceIcons.ArrowDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No withdrawal requests</h3>
                    <p className="text-muted-foreground">
                      No requests match your current filters
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="releases" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1">
            <div className="grid gap-4">
              {earlyReleaseRequests.map(renderEarlyReleaseCard)}
              {earlyReleaseRequests.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <SecurityIcons.Unlock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">
                      No early release requests
                    </h3>
                    <p className="text-muted-foreground">
                      All current requests have been processed
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Action Modal */}
      <MoLoyalModal
        open={actionType !== null}
        onOpenChange={() => resetForm()}
        title={actionType === "approve" ? "Approve Request" : "Deny Request"}
        description={
          actionType === "approve"
            ? "Confirm approval of this request"
            : "Provide a reason for denial"
        }
        trigger={<div />} // Added trigger prop
      >
        <div className="space-y-4">
          {selectedRequest && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Request Summary</div>
              <div className="text-sm space-y-1">
                <div>
                  User: {selectedRequest.user.name} (
                  {selectedRequest.user.service_no})
                </div>
                <div>Amount: {formatCurrency(selectedRequest.amount)}</div>
                <div>Method: {selectedRequest.destinationType}</div>
                <div>Reference: {selectedRequest.reference}</div>
              </div>
            </div>
          )}

          {selectedReleaseRequest && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">
                Release Request Summary
              </div>
              <div className="text-sm space-y-1">
                <div>
                  User: {selectedReleaseRequest.user.name} (
                  {selectedReleaseRequest.user.service_no})
                </div>
                <div>
                  Locked Amount:{" "}
                  {formatCurrency(selectedReleaseRequest.lockedAmount)}
                </div>
                <div>
                  Lock Until:{" "}
                  {new Date(
                    selectedReleaseRequest.lockUntil
                  ).toLocaleDateString()}
                </div>
                <div>Reason: {selectedReleaseRequest.releaseReason}</div>
              </div>
            </div>
          )}

          {actionType === "deny" && (
            <div>
              <Label htmlFor="denial-reason">Denial Reason *</Label>
              <Select value={denialReason} onValueChange={setDenialReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select denial reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insufficient_funds">
                    Insufficient Funds
                  </SelectItem>
                  <SelectItem value="daily_limit_exceeded">
                    Daily Limit Exceeded
                  </SelectItem>
                  <SelectItem value="suspicious_activity">
                    Suspicious Activity
                  </SelectItem>
                  <SelectItem value="account_restrictions">
                    Account Restrictions
                  </SelectItem>
                  <SelectItem value="invalid_destination">
                    Invalid Destination
                  </SelectItem>
                  <SelectItem value="documentation_required">
                    Additional Documentation Required
                  </SelectItem>
                  <SelectItem value="policy_violation">
                    Policy Violation
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any additional notes for this decision..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <MoLoyalButton
              variant="ghost"
              onClick={resetForm}
              className="flex-1"
            >
              Cancel
            </MoLoyalButton>
            <MoLoyalButton
              onClick={actionType === "approve" ? handleApprove : handleDeny}
              variant={actionType === "approve" ? "primary" : "danger"}
              disabled={actionType === "deny" && !denialReason}
              className="flex-1"
            >
              {actionType === "approve" ? "Approve" : "Deny"}
            </MoLoyalButton>
          </div>
        </div>
      </MoLoyalModal>
    </div>
  );
}

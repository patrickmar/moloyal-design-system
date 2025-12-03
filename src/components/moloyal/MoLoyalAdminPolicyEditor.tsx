import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "../ui/utils";
import {
  Save,
  Eye,
  History,
  Lock,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Shield,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// MoLoyal Components
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalModal } from "./MoLoyalModal";
import { MoLoyalToast } from "./MoLoyalToast";
import { MoLoyalBadge } from "./MoLoyalBadge";
import { FinanceIcons, MilitaryIcons } from "./MoLoyalIcons";

// Types
import { RankAllocation, AuditLogEntry, RosterData, Rank } from "./types";

interface PolicyPreviewData {
  totalPersonnel: number;
  activePersonnel: number;
  totalMonthlyAllocation: number;
  yearlyProjection: number;
  breakdown: {
    rank: Rank;
    count: number;
    allocation: number;
    total: number;
  }[];
}

interface MoLoyalAdminPolicyEditorProps {
  rankAllocations: RankAllocation[];
  auditLog: AuditLogEntry[];
  rosterData: RosterData[];
  onSave?: (allocations: RankAllocation[]) => void;
  onPublish?: (allocations: RankAllocation[]) => void;
  className?: string;
}

// Admin PIN Confirmation Modal - Using trigger only (uncontrolled)
const AdminPinModal = ({
  trigger,
  onSuccess,
  title = "Admin Confirmation",
  description = "Enter your admin PIN to confirm this action",
}: {
  trigger: React.ReactNode;
  onSuccess: () => void;
  title?: string;
  description?: string;
}) => {
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (pin === "1234") {
      onSuccess();
      MoLoyalToast.success("Verified", "Admin PIN confirmed");
      setPin("");
    } else {
      MoLoyalToast.error("Invalid PIN", "Please try again");
    }
    setIsVerifying(false);
  };

  return (
    <MoLoyalModal trigger={trigger} title={title} description={description}>
      <div className="space-y-4">
        <div className="text-center py-4">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This action requires administrative privileges
          </p>
        </div>

        <MoLoyalInput
          label="Admin PIN"
          type="password"
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          helperText="Use PIN: 1234 for this demo"
        />

        <div className="flex gap-3">
          <MoLoyalButton
            variant="ghost"
            className="flex-1"
            onClick={() => {
              setPin("");
            }}
          >
            Cancel
          </MoLoyalButton>
          <MoLoyalButton
            className="flex-1"
            onClick={handleVerify}
            disabled={pin.length !== 4 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Confirm"}
          </MoLoyalButton>
        </div>
      </div>
    </MoLoyalModal>
  );
};

// Preview Impact Modal - Using trigger only (uncontrolled)
const PreviewImpactModal = ({
  trigger,
  previewData,
}: {
  trigger: React.ReactNode;
  previewData: PolicyPreviewData;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MoLoyalModal
      trigger={trigger}
      title="Policy Impact Preview"
      description="Simulated financial impact of proposed changes"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">
                {previewData.totalPersonnel.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Personnel</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">
                {previewData.activePersonnel.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Active Recipients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-xl font-bold">
                {formatCurrency(previewData.totalMonthlyAllocation)}
              </p>
              <p className="text-sm text-muted-foreground">Monthly Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-xl font-bold">
                {formatCurrency(previewData.yearlyProjection)}
              </p>
              <p className="text-sm text-muted-foreground">Yearly Projection</p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Breakdown by Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead className="text-right">Personnel Count</TableHead>
                  <TableHead className="text-right">
                    Monthly Allocation
                  </TableHead>
                  <TableHead className="text-right">
                    Total Monthly Cost
                  </TableHead>
                  <TableHead className="text-right">% of Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.breakdown.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MoLoyalBadge rank={item.rank} size="sm" />
                        <span className="font-medium">{item.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.allocation)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(item.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {(
                          (item.total / previewData.totalMonthlyAllocation) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Visual Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {previewData.breakdown.map((item) => {
                const percentage =
                  (item.total / previewData.totalMonthlyAllocation) * 100;
                return (
                  <div key={item.rank} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.rank}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MoLoyalModal>
  );
};

export function MoLoyalAdminPolicyEditor({
  rankAllocations,
  auditLog,
  rosterData,
  onSave,
  onPublish,
  className,
}: MoLoyalAdminPolicyEditorProps) {
  const [allocations, setAllocations] =
    useState<RankAllocation[]>(rankAllocations);
  const [activeTab, setActiveTab] = useState("policy");
  const [pendingAction, setPendingAction] = useState<"save" | "publish" | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM dd, yyyy • h:mm a");
  };

  // Calculate preview data
  const previewData = useMemo((): PolicyPreviewData => {
    const breakdown = allocations.map((allocation) => {
      const roster = rosterData.find((r) => r.rank === allocation.rank);
      const count = roster?.activeCount || 0;
      const total = count * allocation.defaultAllocation;

      return {
        rank: allocation.rank,
        count,
        allocation: allocation.defaultAllocation,
        total,
      };
    });

    const totalPersonnel = rosterData.reduce((sum, r) => sum + r.count, 0);
    const activePersonnel = rosterData.reduce(
      (sum, r) => sum + r.activeCount,
      0
    );
    const totalMonthlyAllocation = breakdown.reduce(
      (sum, b) => sum + b.total,
      0
    );
    const yearlyProjection = totalMonthlyAllocation * 12;

    return {
      totalPersonnel,
      activePersonnel,
      totalMonthlyAllocation,
      yearlyProjection,
      breakdown,
    };
  }, [allocations, rosterData]);

  const handleAllocationChange = (
    rank: Rank,
    field: keyof RankAllocation,
    value: any
  ) => {
    setAllocations((prev) =>
      prev.map((allocation) =>
        allocation.rank === rank
          ? { ...allocation, [field]: value }
          : allocation
      )
    );
    setHasChanges(true);
  };

  const handleSave = useCallback(() => {
    setPendingAction("save");
  }, []);

  const handlePublish = useCallback(() => {
    setPendingAction("publish");
  }, []);

  const handlePinSuccess = useCallback(() => {
    if (pendingAction === "save") {
      onSave?.(allocations);
      MoLoyalToast.success(
        "Policy Saved",
        "Rank allocation policy has been saved as draft"
      );
      setHasChanges(false);
    } else if (pendingAction === "publish") {
      onPublish?.(allocations);
      MoLoyalToast.success(
        "Policy Published",
        "New rank allocation policy is now active"
      );
      setHasChanges(false);
    }

    setPendingAction(null);
  }, [pendingAction, allocations, onSave, onPublish]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "rank_allocation_created":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "rank_allocation_updated":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "rank_allocation_deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "policy_published":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      default:
        return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActorRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge variant="destructive">Super Admin</Badge>;
      case "admin":
        return (
          <Badge className="bg-primary text-primary-foreground">Admin</Badge>
        );
      case "finance_officer":
        return <Badge variant="secondary">Finance Officer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className={cn("h-full bg-background", className)}>
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rank Allocation Policy</h1>
            <p className="text-muted-foreground">
              Manage monthly allocation amounts for military ranks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                Unsaved Changes
              </Badge>
            )}

            {/* Preview Impact Modal Trigger */}
            <PreviewImpactModal
              trigger={
                <MoLoyalButton variant="secondary">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Impact
                </MoLoyalButton>
              }
              previewData={previewData}
            />

            {/* Save Draft Button with PIN Modal */}
            <AdminPinModal
              trigger={
                <MoLoyalButton
                  variant="ghost"
                  disabled={!hasChanges}
                  onClick={() => setPendingAction("save")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </MoLoyalButton>
              }
              onSuccess={() => {
                if (pendingAction === "save") {
                  onSave?.(allocations);
                  MoLoyalToast.success(
                    "Policy Saved",
                    "Rank allocation policy has been saved as draft"
                  );
                  setHasChanges(false);
                  setPendingAction(null);
                }
              }}
              title="Save Policy Draft"
              description="Enter your admin PIN to save policy changes as a draft"
            />

            {/* Publish Policy Button with PIN Modal */}
            <AdminPinModal
              trigger={
                <MoLoyalButton
                  disabled={!hasChanges}
                  onClick={() => setPendingAction("publish")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish Policy
                </MoLoyalButton>
              }
              onSuccess={() => {
                if (pendingAction === "publish") {
                  onPublish?.(allocations);
                  MoLoyalToast.success(
                    "Policy Published",
                    "New rank allocation policy is now active"
                  );
                  setHasChanges(false);
                  setPendingAction(null);
                }
              }}
              title="Publish Policy"
              description="Enter your admin PIN to publish the new policy. This will make it active immediately."
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b px-6">
          <TabsList>
            <TabsTrigger value="policy">Policy Editor</TabsTrigger>
            <TabsTrigger value="audit">Audit History</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="policy" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-xl font-bold">
                        {previewData.activePersonnel.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active Recipients
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <p className="text-lg font-bold">
                        {formatCurrency(previewData.totalMonthlyAllocation)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Monthly Total
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-lg font-bold">
                        {formatCurrency(previewData.yearlyProjection)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Yearly Projection
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MilitaryIcons.Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-xl font-bold">{allocations.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Rank Policies
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Policy Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rank Allocation Policies</CardTitle>
                    <CardDescription>
                      Configure default monthly allocations, effective dates,
                      and lock periods for each rank
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Personnel Count</TableHead>
                            <TableHead>Default Allocation</TableHead>
                            <TableHead>Effective From</TableHead>
                            <TableHead>Lock Period (Months)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Monthly Impact
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allocations.map((allocation) => {
                            const roster = rosterData.find(
                              (r) => r.rank === allocation.rank
                            );
                            const monthlyImpact =
                              (roster?.activeCount || 0) *
                              allocation.defaultAllocation;

                            return (
                              <TableRow key={allocation.rank}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <MoLoyalBadge
                                      rank={allocation.rank}
                                      size="sm"
                                    />
                                    <span className="font-medium">
                                      {allocation.rank}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <p className="font-medium">
                                      {roster?.activeCount?.toLocaleString() ||
                                        0}
                                    </p>
                                    <p className="text-muted-foreground">
                                      of {roster?.count?.toLocaleString() || 0}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <MoLoyalInput
                                    type="number"
                                    value={allocation.defaultAllocation}
                                    onChange={(e) =>
                                      handleAllocationChange(
                                        allocation.rank,
                                        "defaultAllocation",
                                        Number(e.target.value)
                                      )
                                    }
                                    prefix="₦"
                                    className="w-32"
                                  />
                                </TableCell>
                                <TableCell>
                                  <MoLoyalInput
                                    type="date"
                                    value={allocation.effectiveFrom}
                                    onChange={(e) =>
                                      handleAllocationChange(
                                        allocation.rank,
                                        "effectiveFrom",
                                        e.target.value
                                      )
                                    }
                                    className="w-40"
                                  />
                                </TableCell>
                                <TableCell>
                                  <MoLoyalInput
                                    type="number"
                                    value={allocation.lockPeriod}
                                    onChange={(e) =>
                                      handleAllocationChange(
                                        allocation.rank,
                                        "lockPeriod",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20"
                                    min="0"
                                    max="36"
                                  />
                                </TableCell>
                                <TableCell>
                                  {allocation.isActive ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Inactive</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {formatCurrency(monthlyImpact)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Notes */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Changes to rank allocation
                    policies will affect all personnel of the respective ranks.
                    Lock periods prevent early withdrawal of allocated funds.
                    All changes require admin confirmation and are logged for
                    audit purposes.
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="audit" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Policy Change Audit Log
                    </CardTitle>
                    <CardDescription>
                      Complete history of all policy changes and administrative
                      actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLog.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {getActionIcon(entry.action)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">
                                    {entry.description}
                                  </h4>
                                  {getActorRoleBadge(entry.actorRole)}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>
                                    By: <strong>{entry.actor}</strong>
                                  </p>
                                  <p>Date: {formatDate(entry.timestamp)}</p>
                                  {entry.beforeState && entry.afterState && (
                                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                      <p>
                                        <strong>Before:</strong>{" "}
                                        {JSON.stringify(entry.beforeState)}
                                      </p>
                                      <p>
                                        <strong>After:</strong>{" "}
                                        {JSON.stringify(entry.afterState)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {entry.entityType}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export type { MoLoyalAdminPolicyEditorProps };

import { useState } from "react";
import { cn } from "../ui/utils";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Info,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import { format, parseISO } from "date-fns";

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
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";

// MoLoyal Components
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalBadge } from "./MoLoyalBadge";
import { MilitaryIcons } from "./MoLoyalIcons";
import { MoLoyalToast } from "./MoLoyalToast";

// Types
import { User, RankAllocation, AllocationPayout, Rank } from "./types";

interface MoLoyalRankAllocationProps {
  user: User;
  rankAllocation: RankAllocation;
  payouts: AllocationPayout[];
  onBack?: () => void;
  className?: string;
}

// Add type guard for Rank
const isValidRank = (rank: string): rank is Rank => {
  const validRanks: Rank[] = ["Private", "Corporal", "Sergeant", "Lieutenant"];
  return validRanks.includes(rank as Rank);
};

export function MoLoyalRankAllocation({
  user,
  rankAllocation,
  payouts,
  onBack,
  className,
}: MoLoyalRankAllocationProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Validate that user.rank is a valid Rank type
  const userRank: Rank = isValidRank(user.rank) ? user.rank : "Private";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM dd, yyyy");
  };

  const getPayoutStatus = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge: (
            <Badge className="bg-green-100 text-green-800 text-xs">
              Completed
            </Badge>
          ),
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        };
      case "scheduled":
        return {
          badge: (
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              Scheduled
            </Badge>
          ),
          icon: <Clock className="h-4 w-4 text-blue-600" />,
        };
      case "processing":
        return {
          badge: (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Processing
            </Badge>
          ),
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
        };
      case "failed":
        return {
          badge: (
            <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
          ),
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        };
      default:
        return {
          badge: (
            <Badge className="bg-gray-100 text-gray-800 text-xs">Unknown</Badge>
          ),
          icon: <Clock className="h-4 w-4 text-gray-600" />,
        };
    }
  };

  const nextPayout = payouts.find((p) => p.status === "scheduled");
  const lastPayouts = payouts
    .filter((p) => p.status === "completed")
    .slice(0, 5);

  return (
    <div className={cn("h-full bg-background flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {onBack && (
          <MoLoyalButton
            variant="ghost"
            size="medium"
            className="w-10 h-10 p-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </MoLoyalButton>
        )}
        <h1 className="font-bold text-xl">Your Rank Allocation</h1>
        <MoLoyalButton
          variant="ghost"
          size="small"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="h-4 w-4" />
        </MoLoyalButton>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Rank & Allocation Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Use the validated userRank instead of user.rank directly */}
                  <MoLoyalBadge
                    rank={userRank}
                    size="lg"
                    className="bg-primary-foreground/20"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{userRank}</h2>
                    <p className="text-primary-foreground/80">{user.name}</p>
                  </div>
                </div>
                <MilitaryIcons.Shield className="h-8 w-8 text-primary-foreground/60" />
              </div>

              <div className="text-center">
                <p className="text-primary-foreground/80 mb-2">
                  Monthly Allocation
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(rankAllocation.defaultAllocation)}
                </p>
              </div>

              {rankAllocation.lockPeriod > 0 && (
                <div className="mt-4 p-3 bg-primary-foreground/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Lock Period: {rankAllocation.lockPeriod} months</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Next Payout */}
          {nextPayout && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next Payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {formatDate(nextPayout.payoutDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nextPayout.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatCurrency(nextPayout.amount)}
                    </p>
                    {getPayoutStatus(nextPayout.status).badge}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Recent Payouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recent Payouts
              </CardTitle>
              <CardDescription>
                Your last {lastPayouts.length} allocation payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lastPayouts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent payouts found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lastPayouts.map((payout, index) => (
                    <div key={payout.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPayoutStatus(payout.status).icon}
                          <div>
                            <p className="font-medium">
                              {formatDate(payout.payoutDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payout.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(payout.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payout.reference}
                          </p>
                        </div>
                      </div>
                      {index < lastPayouts.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Allocations are set by Nigerian Army Finance and are automatically
              deposited to your MoLoyal account each month.
            </AlertDescription>
          </Alert>
          {/* Additional Details */}
          {showDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Allocation Details</CardTitle>
                <CardDescription>Policy information and terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Effective From
                    </label>
                    <p>{formatDate(rankAllocation.effectiveFrom)}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Lock Period
                    </label>
                    <p>{rankAllocation.lockPeriod} months</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Policy Status
                    </label>
                    <p>{rankAllocation.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p>
                      {rankAllocation.updatedAt
                        ? formatDate(rankAllocation.updatedAt)
                        : "Never"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Terms:</strong> Monthly allocations are
                    automatically deposited based on your current rank. Funds
                    may be subject to lock periods as determined by Nigerian
                    Army Finance policies.
                  </p>
                  <p>
                    <strong>Changes:</strong> Allocation amounts may be adjusted
                    based on rank promotions, policy updates, or special
                    circumstances. You will be notified of any changes in
                    advance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Contact Support */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Have questions about your allocation?
                </p>
                <MoLoyalButton
                  variant="secondary"
                  size="small"
                  onClick={() =>
                    MoLoyalToast.info(
                      "Support",
                      "Connecting to Nigerian Army Finance..."
                    )
                  }
                >
                  Contact Army Finance
                </MoLoyalButton>
              </div>
            </CardContent>
          </Card>
          <div className="h-20" /> {/* Bottom spacing */}
        </div>
      </ScrollArea>
    </div>
  );
}

export type { MoLoyalRankAllocationProps };

import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "../ui/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Eye,
  EyeOff,
  Search,
  MoreVertical,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  CreditCard,
  Banknote,
  Users,
  PiggyBank,
  Zap,
  RefreshCw,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// MoLoyal Components
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalModal } from "./MoLoyalModal";
import { MoLoyalToast } from "./MoLoyalToast";
import { FinanceIcons, SecurityIcons } from "./MoLoyalIcons";

// Types
import { Transaction, TransactionFilter, User } from "./types";

type TransactionType = "all" | "deposits" | "withdrawals";
type TransactionScreen = "list" | "filters" | "export";

interface MoLoyalTransactionsModuleProps {
  user: User;
  transactions: Transaction[];
  onBack?: () => void;
  className?: string;
}

// OTP Re-auth Modal
const OTPReAuthModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (otp === "123456") {
      onSuccess();
      MoLoyalToast.success(
        "Authentication successful",
        "Sensitive details unlocked"
      );
    } else {
      MoLoyalToast.error("Invalid OTP", "Please try again");
    }
    setIsVerifying(false);
  };

  return (
    <MoLoyalModal
      open={open}
      onOpenChange={(openState) => !openState && onClose()}
      title="Authenticate to View Details"
      description="Enter your OTP to view sensitive transaction information"
      trigger={<div />} // Added trigger prop
    >
      <div className="space-y-4">
        <div className="text-center py-4">
          <SecurityIcons.Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            For security, we need to verify your identity before showing
            sensitive details
          </p>
        </div>

        <MoLoyalInput
          label="Enter OTP"
          placeholder="123456"
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          helperText="Enter the 6-digit code sent to your registered phone"
        />

        <div className="flex gap-3">
          <MoLoyalButton variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </MoLoyalButton>
          <MoLoyalButton
            className="flex-1"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </MoLoyalButton>
        </div>
      </div>
    </MoLoyalModal>
  );
};

// Transaction Detail Modal
const TransactionDetailModal = ({
  transaction,
  open,
  onClose,
}: {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return format(parseISO(dateString), "MMM dd, yyyy • h:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "denied":
        return <XCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    MoLoyalToast.success("Copied", "Reference ID copied to clipboard");
  };

  const handleShowSensitive = () => {
    setShowOTPModal(true);
  };

  const handleOTPSuccess = () => {
    setShowSensitive(true);
    setShowOTPModal(false);
  };

  return (
    <>
      <MoLoyalModal
        open={open}
        onOpenChange={(openState) => !openState && onClose()}
        title="Transaction Details"
        description="Complete transaction audit trail"
        trigger={<div />} // Added trigger prop
      >
        <div className="max-w-2xl max-h-[600px] overflow-auto">
          {" "}
          {/* Removed className prop, added inline styles */}
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(transaction.date), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    className={cn(
                      "text-xs",
                      getStatusColor(transaction.status || "completed")
                    )}
                  >
                    {getStatusIcon(transaction.status || "completed")}
                    <span className="ml-1 capitalize">
                      {transaction.status || "completed"}
                    </span>
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reference ID
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {showSensitive
                        ? transaction.referenceId
                        : "•••••••••••••"}
                    </code>
                    {showSensitive && (
                      <MoLoyalButton
                        size="small"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(transaction.referenceId || "")
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </MoLoyalButton>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Category
                  </label>
                  <p className="mt-1 capitalize">{transaction.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Initiated By
                  </label>
                  <p className="mt-1">
                    {showSensitive ? transaction.initiatedBy : "•••••••••••••"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Processed At
                  </label>
                  <p className="mt-1">
                    {transaction.processedAt
                      ? formatDateTime(transaction.processedAt)
                      : "Pending"}
                  </p>
                </div>
              </div>

              {/* Sensitive Details Toggle */}
              {!showSensitive && (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Some details are hidden for security</span>
                      <MoLoyalButton size="small" onClick={handleShowSensitive}>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Details
                      </MoLoyalButton>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Balance After */}
              {showSensitive && transaction.balanceAfter && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Balance After Transaction
                  </label>
                  <p className="mt-1 font-semibold">
                    {formatCurrency(transaction.balanceAfter)}
                  </p>
                </div>
              )}

              {/* Fees */}
              {transaction.fees && transaction.fees.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fees Applied
                  </label>
                  <div className="mt-2 space-y-2">
                    {transaction.fees.map((fee, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{fee.description}</span>
                        <span className="font-medium">
                          {formatCurrency(fee.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {transaction.note && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transaction Note
                  </label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded">
                    {transaction.note}
                  </p>
                </div>
              )}

              {/* Merchant */}
              {transaction.merchantName && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Merchant/Agent
                  </label>
                  <p className="mt-1">{transaction.merchantName}</p>
                </div>
              )}

              {/* Denial Reason */}
              {transaction.status === "denied" && transaction.denialReason && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p>
                        <strong>Denial Reason:</strong>
                      </p>
                      <p className="text-sm">{transaction.denialReason}</p>
                      {transaction.appealable && (
                        <MoLoyalButton size="small" variant="secondary">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Regimental Admin
                        </MoLoyalButton>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Supporting Documents */}
              {transaction.supportingDocuments &&
                transaction.supportingDocuments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Supporting Documents
                    </label>
                    <div className="mt-2 space-y-2">
                      {transaction.supportingDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm flex-1">{doc}</span>
                          <MoLoyalButton size="small" variant="ghost">
                            <ExternalLink className="h-3 w-3" />
                          </MoLoyalButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </MoLoyalModal>

      <OTPReAuthModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
      />
    </>
  );
};

// Export Modal
const ExportModal = ({
  open,
  onClose,
  transactionCount,
}: {
  open: boolean;
  onClose: () => void;
  transactionCount: number;
}) => {
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsExporting(false);
    onClose();

    // Show success modal with download link
    MoLoyalToast.success(
      "Export completed",
      `Your ${exportFormat.toUpperCase()} file is ready for download`
    );

    // Simulate download
    setTimeout(() => {
      const filename = `moloyal-transactions-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.${exportFormat}`;
      MoLoyalToast.info("Download started", `Downloading ${filename}`);
    }, 1000);
  };

  return (
    <MoLoyalModal
      open={open}
      onOpenChange={(openState) => !openState && onClose()}
      title="Export Transactions"
      description={`Export ${transactionCount} transactions to file`}
      trigger={<div />} // Added trigger prop
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-3 block">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <MoLoyalButton
              variant={exportFormat === "csv" ? "primary" : "secondary"}
              onClick={() => setExportFormat("csv")}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">CSV</div>
                <div className="text-xs opacity-70">Spreadsheet format</div>
              </div>
            </MoLoyalButton>
            <MoLoyalButton
              variant={exportFormat === "pdf" ? "primary" : "secondary"}
              onClick={() => setExportFormat("pdf")}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">PDF</div>
                <div className="text-xs opacity-70">Document format</div>
              </div>
            </MoLoyalButton>
          </div>
        </div>

        <Alert>
          <Download className="h-4 w-4" />
          <AlertDescription>
            The exported file will include transaction details, amounts, dates,
            and reference numbers. Sensitive information will be masked for
            security.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <MoLoyalButton variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </MoLoyalButton>
          <MoLoyalButton
            className="flex-1"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </MoLoyalButton>
        </div>
      </div>
    </MoLoyalModal>
  );
};

export function MoLoyalTransactionsModule({
  user,
  transactions,
  onBack,
  className,
}: MoLoyalTransactionsModuleProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>("all");
  const [currentScreen, setCurrentScreen] = useState<TransactionScreen>("list");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [longPressedTransaction, setLongPressedTransaction] =
    useState<Transaction | null>(null);

  // Filters
  const [filters, setFilters] = useState<TransactionFilter>({
    type: "all",
    status: "all",
  });

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

  // Filter transactions based on active tab and filters
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Tab filtering
    if (activeTab === "deposits") {
      filtered = filtered.filter((t) => t.type === "credit");
    } else if (activeTab === "withdrawals") {
      filtered = filtered.filter((t) => t.type === "debit");
    }

    // Search filtering
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filtering
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Date range filtering
    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      filtered = filtered.filter((t) => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, {
          start: startOfDay(parseISO(from)),
          end: endOfDay(parseISO(to)),
        });
      });
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, activeTab, searchQuery, filters]);

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.subCategory) {
      case "payroll":
        return <CreditCard className="h-4 w-4" />;
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4" />;
      case "goal-contribution":
        return <PiggyBank className="h-4 w-4" />;
      case "fee":
        return <Zap className="h-4 w-4" />;
      case "bonus":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return transaction.type === "credit" ? (
          <ArrowDownLeft className="h-4 w-4" />
        ) : (
          <ArrowUpRight className="h-4 w-4" />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Pending
          </Badge>
        );
      case "denied":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Denied</Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">Unknown</Badge>
        );
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const handleLongPress = (transaction: Transaction) => {
    setLongPressedTransaction(transaction);
    // Show contextual actions
    MoLoyalToast.info("Long press detected", "Contextual actions available");
  };

  // Transaction List Component
  const TransactionList = () => (
    <div className="space-y-3">
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <FinanceIcons.Transaction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "No transactions match your criteria"}
          </p>
        </div>
      ) : (
        filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleTransactionClick(transaction)}
            onMouseDown={(e) => {
              const timeoutId = setTimeout(
                () => handleLongPress(transaction),
                500
              );
              const cleanup = () => {
                clearTimeout(timeoutId);
                document.removeEventListener("mouseup", cleanup);
                document.removeEventListener("mouseleave", cleanup);
              };
              document.addEventListener("mouseup", cleanup);
              document.addEventListener("mouseleave", cleanup);
            }}
            onTouchStart={(e) => {
              const timeoutId = setTimeout(
                () => handleLongPress(transaction),
                500
              );
              const cleanup = () => {
                clearTimeout(timeoutId);
                document.removeEventListener("touchend", cleanup);
                document.removeEventListener("touchcancel", cleanup);
              };
              document.addEventListener("touchend", cleanup);
              document.addEventListener("touchcancel", cleanup);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    transaction.type === "credit"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {getTransactionIcon(transaction)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {transaction.description}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                    {getStatusBadge(transaction.status || "completed")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold",
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                {transaction.status === "denied" && transaction.appealable && (
                  <MoLoyalButton
                    size="small"
                    variant="ghost"
                    className="text-xs mt-1"
                  >
                    Appeal
                  </MoLoyalButton>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

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
        <h1 className="font-bold text-xl">Transactions</h1>
        <div className="flex items-center gap-2">
          <MoLoyalButton
            variant="ghost"
            size="medium"
            className="w-10 h-10 p-0"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-5 w-5" />
          </MoLoyalButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoLoyalButton
                variant="ghost"
                size="medium"
                className="w-10 h-10 p-0"
              >
                <MoreVertical className="h-5 w-5" />
              </MoLoyalButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export Transactions
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as TransactionType)
        }
      >
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full mt-4">
            <ScrollArea className="h-full px-4">
              <TransactionList />
              <div className="h-20" /> {/* Bottom spacing */}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="deposits" className="h-full mt-4">
            <ScrollArea className="h-full px-4">
              <TransactionList />
              <div className="h-20" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="withdrawals" className="h-full mt-4">
            <ScrollArea className="h-full px-4">
              <TransactionList />
              <div className="h-20" />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={showTransactionDetail}
        onClose={() => {
          setShowTransactionDetail(false);
          setSelectedTransaction(null);
        }}
      />

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        transactionCount={filteredTransactions.length}
      />
    </div>
  );
}

export type { TransactionType, TransactionScreen };

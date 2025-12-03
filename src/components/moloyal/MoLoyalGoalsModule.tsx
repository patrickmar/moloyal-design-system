import { useState, useCallback, useEffect } from "react";
import { cn } from "../ui/utils";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Edit,
  Lock,
  CheckCircle,
  Star,
  Repeat,
  CreditCard,
  Users,
  Banknote,
  BarChart3,
  Clock,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

// MoLoyal Components
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalProgressBar } from "./MoLoyalProgressBar";
import { MoLoyalToast } from "./MoLoyalToast";
import { MoLoyalModal } from "./MoLoyalModal";
import { FinanceIcons, MilitaryIcons } from "./MoLoyalIcons";

// Types
import { Goal, ContributionSchedule, Contribution, User } from "./types";

type GoalModuleScreen =
  | "list"
  | "create-step1"
  | "create-step2"
  | "create-step3"
  | "confirmation"
  | "detail"
  | "edit";

interface GoalCreateData {
  title: string;
  description: string;
  target: number;
  currency: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  contributionSchedule: ContributionSchedule;
  autoDeduct: boolean;
}

interface MoLoyalGoalsModuleProps {
  user: User;
  goals: Goal[];
  onGoalCreate?: (goal: Partial<Goal>) => void;
  onGoalUpdate?: (id: string, goal: Partial<Goal>) => void;
  onGoalDelete?: (id: string) => void;
  onBack?: () => void;
  className?: string;
}

// Celebration Modal Component
const CelebrationModal = ({
  trigger,
  goalTitle,
}: {
  trigger: React.ReactNode;
  goalTitle: string;
}) => {
  return (
    <MoLoyalModal trigger={trigger} title="">
      <div className="text-center py-8">
        {/* Confetti Effect */}
        <div className="relative mb-6">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: (Math.random() - 0.5) * 200,
                y: -100 + Math.random() * -50,
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}

          {/* Military Salute Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto"
          >
            <MilitaryIcons.Trophy className="h-10 w-10 text-primary-foreground" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-2">
            Mission Accomplished! 🎉
          </h2>
          <p className="text-muted-foreground mb-4">
            Congratulations! You've successfully completed your
          </p>
          <p className="font-semibold text-lg mb-6">"{goalTitle}" goal</p>

          <Badge className="bg-primary text-primary-foreground">
            100% Target Achieved
          </Badge>
        </motion.div>
      </div>
    </MoLoyalModal>
  );
};

export function MoLoyalGoalsModule({
  user,
  goals,
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete,
  onBack,
  className,
}: MoLoyalGoalsModuleProps) {
  const [currentScreen, setCurrentScreen] = useState<GoalModuleScreen>("list");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [celebrationGoal, setCelebrationGoal] = useState<string>("");

  // Create Goal Form Data
  const [createData, setCreateData] = useState<GoalCreateData>({
    title: "",
    description: "",
    target: 0,
    currency: "NGN",
    deadline: "",
    priority: "medium",
    contributionSchedule: {
      type: "monthly",
      amount: 0,
      alignWithPayCycle: true,
    },
    autoDeduct: false,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const calculateRecommendedContribution = (
    target: number,
    current: number,
    deadline: string
  ) => {
    const remaining = target - current;
    const today = new Date();
    const endDate = new Date(deadline);
    const monthsLeft = Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
    );
    return Math.ceil(remaining / monthsLeft);
  };

  const handleGoalComplete = useCallback((goal: Goal) => {
    setCelebrationGoal(goal.title);
    MoLoyalToast.success(
      "Goal Completed!",
      `Congratulations on completing ${goal.title}`
    );
  }, []);

  // Navigation functions
  const goToCreateStep1 = () => setCurrentScreen("create-step1");
  const goToCreateStep2 = () => setCurrentScreen("create-step2");
  const goToCreateStep3 = () => setCurrentScreen("create-step3");
  const goToConfirmation = () => setCurrentScreen("confirmation");
  const goToList = () => {
    setCurrentScreen("list");
    setSelectedGoal(null);
    setCreateData({
      title: "",
      description: "",
      target: 0,
      currency: "NGN",
      deadline: "",
      priority: "medium",
      contributionSchedule: {
        type: "monthly",
        amount: 0,
        alignWithPayCycle: true,
      },
      autoDeduct: false,
    });
  };

  const goToGoalDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentScreen("detail");
  };

  const handleCreateGoal = () => {
    const newGoal: Partial<Goal> = {
      id: Date.now().toString(),
      title: createData.title,
      description: createData.description,
      target: createData.target,
      current: 0,
      deadline: createData.deadline,
      priority: createData.priority,
      currency: createData.currency,
      contributionSchedule: createData.contributionSchedule,
      autoDeduct: createData.autoDeduct,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      contributions: [],
    };

    onGoalCreate?.(newGoal);
    MoLoyalToast.success(
      "Goal Created!",
      `${createData.title} has been created successfully`
    );
    goToList();
  };

  // Goals List Screen
  const GoalsListScreen = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-bold text-xl">My Goals</h1>
        <MoLoyalButton size="small" onClick={goToCreateStep1}>
          <Plus className="h-4 w-4 mr-2" />
          Create
        </MoLoyalButton>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <FinanceIcons.Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start building your financial future by creating your first
                savings goal
              </p>
              <MoLoyalButton onClick={goToCreateStep1}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </MoLoyalButton>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => goToGoalDetail(goal)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{goal.title}</h3>
                            {goal.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                            {goal.status === "completed" && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {goal.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {getProgressPercentage(goal.current, goal.target)}%
                          </p>
                        </div>
                      </div>

                      <MoLoyalProgressBar
                        current={goal.current}
                        target={goal.target}
                        className="mb-3"
                        label={`${goal.title} progress: ${getProgressPercentage(
                          goal.current,
                          goal.target
                        )} percent`}
                      />

                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-muted-foreground">Saved: </span>
                          <span className="font-medium">
                            {formatCurrency(goal.current)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Target:{" "}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(goal.target)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {formatDate(goal.deadline)}</span>
                        </div>
                        {goal.autoDeduct && (
                          <div className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            <span>Auto-deduct</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Create Goal Step 1: Name & Description
  const CreateStep1Screen = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={goToList}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold">Create Goal</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
              1
            </div>
            <span className="text-sm font-medium">Goal Details</span>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">What are you saving for?</h2>
            <p className="text-muted-foreground mb-6">
              Give your goal a clear name and description to stay motivated
            </p>
          </div>

          <MoLoyalInput
            label="Goal Name"
            placeholder="e.g., Emergency Fund, House Deposit"
            value={createData.title}
            onChange={(e) =>
              setCreateData((prev) => ({ ...prev, title: e.target.value }))
            }
            helperText="Choose a clear, motivating name"
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Describe what this goal means to you..."
              value={createData.description}
              onChange={(e) =>
                setCreateData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <MoLoyalButton
          className="w-full"
          disabled={!createData.title.trim()}
          onClick={goToCreateStep2}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </MoLoyalButton>
      </div>
    </div>
  );

  // Create Goal Step 2: Target Amount & Date
  const CreateStep2Screen = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      createData.deadline ? new Date(createData.deadline) : undefined
    );

    const recommendedAmount =
      createData.target && createData.deadline
        ? calculateRecommendedContribution(
            createData.target,
            0,
            createData.deadline
          )
        : 0;

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={goToCreateStep1}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">Target & Timeline</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                2
              </div>
              <span className="text-sm font-medium">Financial Target</span>
            </div>
            <Progress value={66} className="h-2" />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Set your target</h2>
              <p className="text-muted-foreground mb-6">
                How much do you want to save and by when?
              </p>
            </div>

            <MoLoyalInput
              label="Target Amount"
              type="number"
              placeholder="0"
              value={createData.target || ""}
              onChange={(e) =>
                setCreateData((prev) => ({
                  ...prev,
                  target: Number(e.target.value),
                }))
              }
              prefix="₦"
              helperText="Enter your savings target in Naira"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Date
              </label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? formatDate(selectedDate.toISOString().split("T")[0])
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => {
                      setSelectedDate(date);
                      setCreateData((prev) => ({
                        ...prev,
                        deadline: date ? date.toISOString().split("T")[0] : "",
                      }));
                      setShowCalendar(false);
                    }}
                    disabled={(date: Date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["low", "medium", "high"] as const).map((priority) => (
                  <Button
                    key={priority}
                    variant={
                      createData.priority === priority ? "default" : "outline"
                    }
                    onClick={() =>
                      setCreateData((prev) => ({ ...prev, priority }))
                    }
                    className="capitalize"
                  >
                    {priority === "high" && <Star className="h-4 w-4 mr-1" />}
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            {recommendedAmount > 0 && (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommended monthly contribution:</strong>{" "}
                  {formatCurrency(recommendedAmount)} / month to reach your
                  target on time.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <MoLoyalButton
            className="w-full"
            disabled={!createData.target || !createData.deadline}
            onClick={goToCreateStep3}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </MoLoyalButton>
        </div>
      </div>
    );
  };

  // Create Goal Step 3: Contribution Schedule
  const CreateStep3Screen = () => {
    const scheduleTypes = [
      {
        id: "one-off",
        label: "One-time",
        icon: DollarSign,
        description: "Single contribution",
      },
      {
        id: "weekly",
        label: "Weekly",
        icon: Calendar,
        description: "Every week",
      },
      {
        id: "monthly",
        label: "Monthly",
        icon: Repeat,
        description: "Every month",
      },
      {
        id: "per-payroll",
        label: "Per Payroll",
        icon: CreditCard,
        description: "With each salary",
      },
    ];

    const getNextContributionDate = () => {
      const today = new Date();
      switch (createData.contributionSchedule.type) {
        case "weekly":
          return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        case "monthly":
          return new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
          );
        case "per-payroll":
          return new Date(today.getFullYear(), today.getMonth(), 25); // Assume 25th is payday
        default:
          return today;
      }
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={goToCreateStep2}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">Contribution Schedule</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                3
              </div>
              <span className="text-sm font-medium">Contribution Plan</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                How often will you contribute?
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose a schedule that fits your income and budget
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {scheduleTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    createData.contributionSchedule.type === type.id
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setCreateData((prev) => ({
                      ...prev,
                      contributionSchedule: {
                        ...prev.contributionSchedule,
                        type: type.id as ContributionSchedule["type"],
                      },
                    }))
                  }
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <type.icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs opacity-70">{type.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {createData.contributionSchedule.type !== "one-off" && (
              <MoLoyalInput
                label="Contribution Amount"
                type="number"
                placeholder="0"
                value={createData.contributionSchedule.amount || ""}
                onChange={(e) =>
                  setCreateData((prev) => ({
                    ...prev,
                    contributionSchedule: {
                      ...prev.contributionSchedule,
                      amount: Number(e.target.value),
                    },
                  }))
                }
                prefix="₦"
                helperText={`Amount to contribute ${createData.contributionSchedule.type}`}
              />
            )}

            {(createData.contributionSchedule.type === "monthly" ||
              createData.contributionSchedule.type === "per-payroll") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">
                      Auto-deduct from salary
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Automatically deduct contributions from your payroll
                    </p>
                  </div>
                  <Switch
                    checked={createData.autoDeduct}
                    onCheckedChange={(checked: boolean) =>
                      setCreateData((prev) => ({
                        ...prev,
                        autoDeduct: checked,
                      }))
                    }
                  />
                </div>

                {createData.autoDeduct && (
                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>
                          Align contribution to your pay cycle for automated
                          deductions
                        </span>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {createData.contributionSchedule.amount > 0 &&
              createData.contributionSchedule.type !== "one-off" && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Schedule Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Frequency:
                        </span>
                        <span className="capitalize">
                          {createData.contributionSchedule.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>
                          {formatCurrency(
                            createData.contributionSchedule.amount
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Next contribution:
                        </span>
                        <span>
                          {formatDate(
                            getNextContributionDate()
                              .toISOString()
                              .split("T")[0]
                          )}
                        </span>
                      </div>
                      {createData.autoDeduct && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Method:</span>
                          <span className="text-primary">Auto-deduct</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        <div className="p-4 border-t">
          <MoLoyalButton
            className="w-full"
            disabled={
              createData.contributionSchedule.type !== "one-off" &&
              !createData.contributionSchedule.amount
            }
            onClick={goToConfirmation}
          >
            Review Goal
            <ArrowRight className="h-4 w-4 ml-2" />
          </MoLoyalButton>
        </div>
      </div>
    );
  };

  // Confirmation Screen
  const ConfirmationScreen = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={goToCreateStep3}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold">Confirm Goal</h1>
        <div className="w-10" />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Goal Ready to Create!</h2>
            <p className="text-muted-foreground">
              Review your goal details below and start saving
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {createData.title}
              </CardTitle>
              {createData.description && (
                <CardDescription>{createData.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Target Amount
                  </span>
                  <p className="font-semibold">
                    {formatCurrency(createData.target)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Target Date
                  </span>
                  <p className="font-semibold">
                    {formatDate(createData.deadline)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Priority
                  </span>
                  <p className="font-semibold capitalize">
                    {createData.priority}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Schedule
                  </span>
                  <p className="font-semibold capitalize">
                    {createData.contributionSchedule.type}
                  </p>
                </div>
              </div>

              {createData.contributionSchedule.type !== "one-off" && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Contribution Details</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Amount per {createData.contributionSchedule.type}:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(createData.contributionSchedule.amount)}
                      </span>
                    </div>
                    {createData.autoDeduct && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Auto-deduct:
                        </span>
                        <span className="text-primary font-medium">
                          Enabled
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {createData.autoDeduct && (
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                Automatic deductions will be set up after goal creation. You can
                modify this in your goal settings.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        <MoLoyalButton className="w-full" onClick={handleCreateGoal}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Create Goal
        </MoLoyalButton>

        {createData.autoDeduct && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleCreateGoal();
              MoLoyalToast.info(
                "Auto-deduct Setup",
                "Goal created with automatic deductions enabled"
              );
            }}
          >
            Create & Start Auto-deductions
          </Button>
        )}
      </div>
    </div>
  );

  // Goal Detail Screen
  const GoalDetailScreen = () => {
    if (!selectedGoal) return null;

    const progressPercentage = getProgressPercentage(
      selectedGoal.current,
      selectedGoal.target
    );
    const remainingAmount = selectedGoal.target - selectedGoal.current;
    const isCompleted = progressPercentage >= 100;

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={goToList}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">Goal Details</h1>
          <Button variant="ghost" size="icon">
            <Edit className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Goal Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">
                        {selectedGoal.title}
                      </h2>
                      {selectedGoal.priority === "high" && (
                        <Badge variant="destructive">High Priority</Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    {selectedGoal.description && (
                      <p className="text-muted-foreground mb-4">
                        {selectedGoal.description}
                      </p>
                    )}
                  </div>
                  {selectedGoal.status === "locked" && (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <MoLoyalProgressBar
                  current={selectedGoal.current}
                  target={selectedGoal.target}
                  className="mb-4"
                  showTooltip
                  label={`${selectedGoal.title} progress: ${progressPercentage} percent`}
                />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedGoal.current)}
                    </p>
                    <p className="text-sm text-muted-foreground">Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedGoal.target)}
                    </p>
                    <p className="text-sm text-muted-foreground">Target</p>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(remainingAmount)} remaining to reach your
                      goal
                    </p>
                  </div>
                )}

                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-center"
                  >
                    <CelebrationModal
                      trigger={
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Trophy className="h-4 w-4 mr-2" />
                          Celebrate Achievement!
                        </Button>
                      }
                      goalTitle={selectedGoal.title}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Goal Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Target Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedGoal.deadline)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Repeat className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Schedule</p>
                  <p className="font-semibold capitalize">
                    {selectedGoal.contributionSchedule?.type || "Manual"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contribution Chart */}
            {selectedGoal.contributions &&
              selectedGoal.contributions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Contribution History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedGoal.contributions
                        .slice(0, 6)
                        .map((contribution, index) => (
                          <div
                            key={contribution.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-2 h-8 rounded",
                                  contribution.type === "payroll"
                                    ? "bg-primary"
                                    : contribution.type === "automatic"
                                    ? "bg-accent"
                                    : "bg-muted-foreground"
                                )}
                              />
                              <div>
                                <p className="font-medium">
                                  {formatCurrency(contribution.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(contribution.date)} •{" "}
                                  {contribution.type}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                contribution.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {contribution.status}
                            </Badge>
                          </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-muted/50 rounded text-sm">
                      <p className="font-medium mb-1">Chart Summary</p>
                      <p className="text-muted-foreground">
                        Total {selectedGoal.contributions.length} contributions
                        made. Average contribution:{" "}
                        {formatCurrency(
                          selectedGoal.contributions.reduce(
                            (sum, c) => sum + c.amount,
                            0
                          ) / selectedGoal.contributions.length
                        )}{" "}
                        per transaction.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <MoLoyalButton variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </MoLoyalButton>
              <MoLoyalButton variant="ghost" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </MoLoyalButton>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "list":
        return <GoalsListScreen />;
      case "create-step1":
        return <CreateStep1Screen />;
      case "create-step2":
        return <CreateStep2Screen />;
      case "create-step3":
        return <CreateStep3Screen />;
      case "confirmation":
        return <ConfirmationScreen />;
      case "detail":
        return <GoalDetailScreen />;
      default:
        return <GoalsListScreen />;
    }
  };

  return (
    <div className={cn("h-full bg-background", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export type { GoalModuleScreen };

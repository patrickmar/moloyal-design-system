import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalLogo, SecurityIcons, MilitaryIcons } from "./MoLoyalIcons";
import { MoLoyalBadge } from "./MoLoyalBadge";
import { MoLoyalToast } from "./MoLoyalToast";
import { sampleUsers } from "./data";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  Camera,
  Phone,
  Mail,
  FileText,
  Shield,
  UserCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Import the Rank type from your types file
import { Rank } from "./types";

// Helper function to validate rank - MUST match the actual Rank type
const isValidRank = (rank: string): rank is Rank => {
  const validRanks: Rank[] = ["Private", "Corporal", "Sergeant", "Lieutenant"];
  return validRanks.includes(rank as Rank);
};

// Helper components moved outside to prevent recreation
const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto" style={{ width: "375px", height: "812px" }}>
    <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
      <div className="bg-background rounded-[2rem] h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  </div>
);

const StepHeader = ({
  canGoBack = false,
  onGoBack,
  currentStep,
  totalSteps,
}: {
  canGoBack?: boolean;
  onGoBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}) => (
  <div className="px-4 py-6 bg-card border-b">
    <div className="flex items-center justify-between mb-4">
      {canGoBack ? (
        <Button variant="ghost" size="sm" onClick={onGoBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : (
        <div className="w-10"></div>
      )}

      <MoLoyalLogo size={32} variant="icon" />

      <div className="w-10"></div>
    </div>

    {currentStep && totalSteps && (
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    )}
  </div>
);

type OnboardingStep =
  | "welcome"
  | "service-number"
  | "bvn-verification"
  | "rank-mapping"
  | "contact-verification"
  | "document-upload"
  | "terms-acceptance"
  | "complete";

interface OnboardingData {
  serviceNumber: string;
  bvn: string;
  detectedRank: Rank;
  detectedName: string;
  phone: string;
  email: string;
  otp: string;
  documentsUploaded: boolean;
  termsAccepted: boolean;
}

interface OnboardingFlowProps {
  onComplete?: (data: OnboardingData) => void;
  onBack?: () => void;
}

export function MoLoyalOnboardingFlow({
  onComplete,
  onBack,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>({
    serviceNumber: "",
    bvn: "",
    detectedRank: "Private", // Must be one of the valid Rank values
    detectedName: "",
    phone: "",
    email: "",
    otp: "",
    documentsUploaded: false,
    termsAccepted: false,
  });

  // Verification states
  const [bvnVerificationState, setBvnVerificationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [otpVerificationState, setOtpVerificationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Progress calculation - memoized to prevent recreation
  const stepOrder = useMemo<OnboardingStep[]>(
    () => [
      "welcome",
      "service-number",
      "bvn-verification",
      "rank-mapping",
      "contact-verification",
      "document-upload",
      "terms-acceptance",
      "complete",
    ],
    []
  );

  const currentStepIndex = useMemo(
    () => stepOrder.indexOf(currentStep),
    [stepOrder, currentStep]
  );
  const progress = useMemo(
    () => ((currentStepIndex + 1) / stepOrder.length) * 100,
    [currentStepIndex, stepOrder.length]
  );

  // OTP countdown effect
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Separate function to clear specific validation errors
  const clearValidationError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Navigation functions - defined early to avoid temporal dead zone
  const goToServiceNumber = useCallback(
    () => setCurrentStep("service-number"),
    []
  );
  const goToBVNVerification = useCallback(
    () => setCurrentStep("bvn-verification"),
    []
  );
  const goToRankMapping = useCallback(() => setCurrentStep("rank-mapping"), []);
  const goToContactVerification = useCallback(
    () => setCurrentStep("contact-verification"),
    []
  );
  const goToDocumentUpload = useCallback(
    () => setCurrentStep("document-upload"),
    []
  );
  const goToTermsAcceptance = useCallback(
    () => setCurrentStep("terms-acceptance"),
    []
  );
  const goToComplete = useCallback(() => setCurrentStep("complete"), []);

  const goBack = useCallback(() => {
    const prevStep = stepOrder[currentStepIndex - 1];
    if (prevStep) setCurrentStep(prevStep);
  }, [currentStepIndex, stepOrder]);

  // Validation functions
  const validateServiceNumber = useCallback(
    (serviceNumber: string): boolean => {
      const pattern = /^[A-Z]{2}-\d{5}$/;
      return pattern.test(serviceNumber);
    },
    []
  );

  const validateBVN = useCallback((bvn: string): boolean => {
    return bvn.length === 11 && /^\d+$/.test(bvn);
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    return /^(\+234|0)[789]\d{9}$/.test(phone);
  }, []);

  // Input handlers
  const handleServiceNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase();
      updateData({ serviceNumber: value });
      clearValidationError("serviceNumber");
    },
    [updateData, clearValidationError]
  );

  const handleBVNChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 11);
      updateData({ bvn: value });
      clearValidationError("bvn");
    },
    [updateData, clearValidationError]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateData({ phone: value });
      clearValidationError("phone");
    },
    [updateData, clearValidationError]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateData({ email: value });
      clearValidationError("email");
    },
    [updateData, clearValidationError]
  );

  const handleOTPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      updateData({ otp: value });
      clearValidationError("otp");
    },
    [updateData, clearValidationError]
  );

  // Async operations
  const simulateBVNVerification = useCallback(
    async (bvn: string) => {
      setBvnVerificationState("loading");
      setValidationErrors({});

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!validateBVN(bvn)) {
        setBvnVerificationState("error");
        setValidationErrors({
          bvn: "BVN not found. Please re-enter or contact support.",
        });
        return;
      }

      // Simulate successful verification with mock data
      const mockUser = sampleUsers[0];
      setBvnVerificationState("success");

      // Convert string to Rank type using validation
      const detectedRank: Rank = isValidRank(mockUser.rank)
        ? mockUser.rank
        : "Private";

      updateData({
        detectedRank,
        detectedName: mockUser.name,
      });

      setTimeout(() => {
        goToRankMapping();
      }, 1500);
    },
    [updateData, goToRankMapping, validateBVN]
  );

  const sendOTP = useCallback(async () => {
    setOtpVerificationState("loading");

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setOtpVerificationState("idle");
    setOtpCountdown(60);
    MoLoyalToast.success(
      "Code sent",
      "Verification code sent to your phone and email"
    );
  }, []);

  const verifyOTP = useCallback(
    async (otp: string) => {
      setOtpVerificationState("loading");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (otp === "123456") {
        setOtpVerificationState("success");
        setTimeout(() => {
          goToDocumentUpload();
        }, 1000);
      } else {
        setOtpVerificationState("error");
        setValidationErrors({ otp: "Invalid OTP. Please try again." });
      }
    },
    [goToDocumentUpload]
  );

  // Action handlers
  const handleServiceNumberContinue = useCallback(() => {
    if (validateServiceNumber(data.serviceNumber)) {
      goToBVNVerification();
    } else {
      setValidationErrors({
        serviceNumber: "Please enter a valid service number (e.g., NA-12345)",
      });
    }
  }, [data.serviceNumber, validateServiceNumber, goToBVNVerification]);

  const handleBVNVerify = useCallback(() => {
    simulateBVNVerification(data.bvn);
  }, [data.bvn, simulateBVNVerification]);

  const handleOTPVerify = useCallback(() => {
    verifyOTP(data.otp);
  }, [data.otp, verifyOTP]);

  const handleContactSubmit = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!validatePhone(data.phone)) {
      errors.phone = "Please enter a valid Nigerian phone number";
    }
    if (!validateEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      sendOTP();
    }
  }, [data.phone, data.email, validatePhone, validateEmail, sendOTP]);

  const handleDocumentUpload = useCallback(() => {
    updateData({ documentsUploaded: true });
    MoLoyalToast.success("Upload complete", "Documents uploaded successfully");
    setTimeout(() => goToTermsAcceptance(), 1000);
  }, [updateData, goToTermsAcceptance]);

  const handleAccountCreate = useCallback(() => {
    onComplete?.(data);
    MoLoyalToast.success("Account created", "Welcome to MoLoyal!");
  }, [data, onComplete]);

  // Render function based on current step
  const renderCurrentScreen = useCallback(() => {
    const commonProps = {
      data,
      currentStepIndex,
      stepOrder,
      goBack,
      validationErrors,
      bvnVerificationState,
      otpVerificationState,
      otpCountdown,
    };

    switch (currentStep) {
      case "welcome":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="mb-12">
                <MoLoyalLogo size={80} variant="icon" />
              </div>

              <h1 className="text-2xl font-bold mb-4">Welcome to MoLoyal</h1>
              <p className="text-lg text-muted-foreground mb-2">
                Structured saving for service families
              </p>
              <p className="text-sm text-muted-foreground mb-12 max-w-sm">
                Secure financial management designed specifically for military
                personnel and their families
              </p>

              <div className="w-full space-y-4">
                <MoLoyalButton
                  size="large"
                  className="w-full"
                  onClick={goToServiceNumber}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MoLoyalButton>

                <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Military-grade security</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "service-number":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Service Number</h1>
                <p className="text-muted-foreground">
                  Enter your military service number to verify your identity
                </p>
              </div>

              <div className="space-y-6">
                <MoLoyalInput
                  key="service-number-input"
                  label="Service Number"
                  placeholder="XX-12345"
                  value={data.serviceNumber}
                  onChange={handleServiceNumberChange}
                  error={validationErrors.serviceNumber}
                  helperText="Format: Two letters followed by hyphen and five digits"
                />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your service number is used to verify your military status
                    and link to your records.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="p-6 border-t">
              <MoLoyalButton
                className="w-full"
                disabled={!validateServiceNumber(data.serviceNumber)}
                onClick={handleServiceNumberContinue}
              >
                Continue
              </MoLoyalButton>
            </div>
          </div>
        );

      case "bvn-verification":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Bank Verification</h1>
                <p className="text-muted-foreground">
                  Enter your Bank Verification Number for identity confirmation
                </p>
              </div>

              <div className="space-y-6">
                <MoLoyalInput
                  key="bvn-input"
                  label="BVN (Bank Verification Number)"
                  placeholder="12345678901"
                  value={data.bvn}
                  onChange={handleBVNChange}
                  error={validationErrors.bvn}
                  helperText="11-digit number provided by your bank"
                />

                {bvnVerificationState === "success" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      BVN verified successfully! Rank detected:{" "}
                      {data.detectedRank}
                    </AlertDescription>
                  </Alert>
                )}

                {bvnVerificationState === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.bvn}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="p-6 border-t">
              <MoLoyalButton
                className="w-full"
                disabled={
                  !validateBVN(data.bvn) || bvnVerificationState === "loading"
                }
                onClick={handleBVNVerify}
              >
                {bvnVerificationState === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying BVN...
                  </>
                ) : (
                  "Verify BVN"
                )}
              </MoLoyalButton>
            </div>
          </div>
        );

      case "rank-mapping":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Rank Confirmation</h1>
                <p className="text-muted-foreground">
                  Please confirm your military rank and personal details
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <UserCheck className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {data.detectedName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <MoLoyalBadge rank={data.detectedRank} />
                          <span className="text-sm text-muted-foreground">
                            Service Number: {data.serviceNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Identity verified through military records
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="p-6 border-t">
              <MoLoyalButton
                className="w-full"
                onClick={goToContactVerification}
              >
                Continue
              </MoLoyalButton>
            </div>
          </div>
        );

      case "contact-verification":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Contact Information</h1>
                <p className="text-muted-foreground">
                  Add your phone number and email for account security
                </p>
              </div>

              <div className="space-y-6">
                <MoLoyalInput
                  key="phone-input"
                  label="Phone Number"
                  placeholder="+234 801 234 5678"
                  value={data.phone}
                  onChange={handlePhoneChange}
                  error={validationErrors.phone}
                  helperText="We'll send a verification code to this number"
                />

                <MoLoyalInput
                  key="email-input"
                  label="Email Address"
                  placeholder="name@example.com"
                  value={data.email}
                  onChange={handleEmailChange}
                  error={validationErrors.email}
                  helperText="For important account notifications"
                />

                {otpVerificationState === "success" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      Contact information verified successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {otpVerificationState === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      OTP verification failed. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {data.phone &&
                  data.email &&
                  otpVerificationState === "idle" && (
                    <div className="space-y-4">
                      <MoLoyalInput
                        key="otp-input"
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={data.otp}
                        onChange={handleOTPChange}
                        error={validationErrors.otp}
                        helperText={
                          otpCountdown > 0
                            ? `Resend code in ${otpCountdown}s`
                            : "Enter the code sent to your phone"
                        }
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="p-6 border-t">
              {otpVerificationState === "success" ? (
                <MoLoyalButton className="w-full" onClick={goToDocumentUpload}>
                  Continue
                </MoLoyalButton>
              ) : data.phone && data.email && data.otp.length === 6 ? (
                <MoLoyalButton
                  className="w-full"
                  disabled={otpVerificationState === "loading"}
                  onClick={handleOTPVerify}
                >
                  {otpVerificationState === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </MoLoyalButton>
              ) : (
                <MoLoyalButton
                  className="w-full"
                  disabled={
                    !validatePhone(data.phone) ||
                    !validateEmail(data.email) ||
                    otpVerificationState === "loading"
                  }
                  onClick={handleContactSubmit}
                >
                  {otpVerificationState === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </MoLoyalButton>
              )}
            </div>
          </div>
        );

      case "document-upload":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Document Upload</h1>
                <p className="text-muted-foreground">
                  Upload your ID and take a selfie for account verification
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Upload ID Document</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        International passport, driver's license, or national ID
                      </p>
                      <MoLoyalButton variant="secondary" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Choose File
                      </MoLoyalButton>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Take Selfie</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take a clear photo of yourself for identity verification
                      </p>
                      <MoLoyalButton variant="secondary" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Open Camera
                      </MoLoyalButton>
                    </div>
                  </CardContent>
                </Card>

                {data.documentsUploaded && (
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      Documents uploaded successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="p-6 border-t">
              <MoLoyalButton className="w-full" onClick={handleDocumentUpload}>
                {data.documentsUploaded ? "Continue" : "Complete Upload"}
              </MoLoyalButton>
            </div>
          </div>
        );

      case "terms-acceptance":
        return (
          <div className="flex flex-col h-full">
            <StepHeader
              canGoBack
              onGoBack={goBack}
              currentStep={currentStepIndex + 1}
              totalSteps={stepOrder.length}
            />

            <div className="flex-1 px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Terms & Privacy</h1>
                <p className="text-muted-foreground">
                  Please review and accept our terms to complete your account
                  setup
                </p>
              </div>

              <ScrollArea className="h-64 border rounded-lg p-4 mb-6">
                <div className="space-y-4 text-sm">
                  <h3 className="font-medium">Terms of Service</h3>
                  <p>
                    By creating a MoLoyal account, you agree to our terms of
                    service. MoLoyal is designed specifically for military
                    personnel and their families to provide secure financial
                    management services.
                  </p>

                  <h3 className="font-medium">Privacy Policy</h3>
                  <p>
                    Your personal information is protected with military-grade
                    security. We collect only necessary information to provide
                    our services and never share your data with unauthorized
                    third parties.
                  </p>

                  <h3 className="font-medium">Data Protection</h3>
                  <p>
                    All financial data is encrypted and stored securely. Your
                    military service information is used solely for identity
                    verification and service customization.
                  </p>
                </div>
              </ScrollArea>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={data.termsAccepted}
                    onCheckedChange={(checked: boolean) =>
                      updateData({ termsAccepted: checked })
                    }
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I have read and agree to the Terms of Service and Privacy
                    Policy
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <MoLoyalButton
                className="w-full"
                disabled={!data.termsAccepted}
                onClick={goToComplete}
              >
                Create Account
              </MoLoyalButton>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Account Created!</h1>
                <p className="text-lg text-muted-foreground mb-2">
                  Welcome to MoLoyal, {data.detectedRank} {data.detectedName}
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Your account has been successfully created. You can now start
                  saving towards your financial goals.
                </p>
              </div>

              <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Number:
                      </span>
                      <span className="font-medium">{data.serviceNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rank:</span>
                      <span className="font-medium">{data.detectedRank}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{data.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{data.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full mt-8">
                <MoLoyalButton
                  size="large"
                  className="w-full"
                  onClick={handleAccountCreate}
                >
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MoLoyalButton>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Screen not implemented</div>;
    }
  }, [
    currentStep,
    data,
    currentStepIndex,
    stepOrder,
    goBack,
    validationErrors,
    bvnVerificationState,
    otpVerificationState,
    otpCountdown,
    validateServiceNumber,
    validateBVN,
    validatePhone,
    validateEmail,
    handleServiceNumberChange,
    handleBVNChange,
    handlePhoneChange,
    handleEmailChange,
    handleOTPChange,
    handleServiceNumberContinue,
    handleBVNVerify,
    handleContactSubmit,
    handleOTPVerify,
    handleDocumentUpload,
    handleAccountCreate,
    goToServiceNumber,
    goToContactVerification,
    goToDocumentUpload,
    goToTermsAcceptance,
    goToComplete,
    updateData,
  ]);

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-background">
        {renderCurrentScreen()}
      </div>
    </PhoneFrame>
  );
}

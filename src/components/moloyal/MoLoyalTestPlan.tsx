import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { UIIcons, FinanceIcons, SecurityIcons } from './MoLoyalIcons';

export function MoLoyalTestPlan() {
  const testFlows = [
    {
      id: 'onboarding',
      title: '1. Onboarding & KYC Flow',
      priority: 'critical',
      estimated: '5 min',
      icon: <SecurityIcons.UserPlus className="h-5 w-5" />,
      description: 'Complete user registration and identity verification',
      steps: [
        'Open onboarding tab in design system',
        'Click through welcome screen',
        'Enter service number: 2023/0001',
        'Enter BVN: 12345678901 and submit',
        'Verify auto-detected name and rank appear',
        'Enter phone: +234 XXX XXX XXXX',
        'Enter OTP: 123456',
        'Upload mock ID document',
        'Capture selfie photo',
        'Accept terms and privacy',
        'Verify account created confirmation'
      ],
      testCriteria: [
        'Progress indicator updates correctly',
        'Form validation shows errors appropriately',
        'Loading states display during API calls',
        'Success toast appears on completion',
        'All screens accessible via keyboard'
      ]
    },
    {
      id: 'dashboard',
      title: '2. Home Dashboard Navigation',
      priority: 'critical',
      estimated: '3 min',
      icon: <UIIcons.Home className="h-5 w-5" />,
      description: 'Explore main dashboard and balance information',
      steps: [
        'Navigate to Dashboard tab',
        'Verify balance card shows correct amounts',
        'Check locked vs available funds display',
        'Scroll through active goals horizontally',
        'Tap on a goal card to view details',
        'Review recent transactions list',
        'Click army announcement banner',
        'Test pull-to-refresh gesture (simulated)'
      ],
      testCriteria: [
        'Balance visibility toggle works',
        'Goal progress bars show percentages',
        'Transactions display correct status badges',
        'Bottom navigation highlights active tab',
        'Touch targets meet 44px minimum'
      ]
    },
    {
      id: 'goals',
      title: '3. Goals Creation & Management',
      priority: 'high',
      estimated: '4 min',
      icon: <FinanceIcons.Target className="h-5 w-5" />,
      description: 'Create, edit, and track savings goals',
      steps: [
        'Navigate to Goals tab/module',
        'Click "Create New Goal" button',
        'Step 1: Enter goal name and description',
        'Step 2: Set target amount and deadline',
        'Toggle priority flag',
        'Step 3: Set up contribution schedule',
        'Enable auto-deduct from payroll',
        'Review confirmation screen',
        'Return to goals list',
        'Tap existing goal to view details',
        'View contribution timeline and chart'
      ],
      testCriteria: [
        'Wizard navigation (next/back) works',
        'Recommended contribution calculated correctly',
        'Progress bars update on contribution',
        'Goal detail charts render properly',
        'Celebration modal shows on completion'
      ]
    },
    {
      id: 'transactions',
      title: '4. Transaction History & Details',
      priority: 'high',
      estimated: '4 min',
      icon: <FinanceIcons.Receipt className="h-5 w-5" />,
      description: 'View and filter transaction history',
      steps: [
        'Navigate to Transactions module',
        'Switch between All/Deposits/Withdrawals tabs',
        'Tap on a transaction to view details',
        'Verify audit trail shows all fields',
        'Tap "Show Details" to enter OTP',
        'Enter OTP: 123456',
        'View unmasked reference ID',
        'Open filter & export panel',
        'Set date range filter',
        'Export to CSV (simulated)',
        'Test denied transaction appeal flow'
      ],
      testCriteria: [
        'Tabs filter transactions correctly',
        'OTP re-auth required for sensitive data',
        'Export modal generates download',
        'Denial reasons shown clearly',
        'Appeal button routes to support'
      ]
    },
    {
      id: 'withdrawals',
      title: '5. Withdrawal Request Flow',
      priority: 'critical',
      estimated: '5 min',
      icon: <FinanceIcons.ArrowDown className="h-5 w-5" />,
      description: 'Request withdrawal with bank or agent',
      steps: [
        'Navigate to Withdrawals module',
        'Enter withdrawal amount',
        'Select destination: Bank or Agent',
        'If Bank: Select account from list',
        'Tap "Show Account Number" → Enter OTP',
        'If Agent: Select nearest location',
        'Review fees and net amount',
        'Submit withdrawal request',
        'If locked funds detected: Review early release',
        'Enter MFA OTP: 123456',
        'View success receipt with reference',
        'Test denied withdrawal with appeal'
      ],
      testCriteria: [
        'Account numbers masked by default',
        'OTP required above threshold (₦50,000)',
        'Locked funds banner shows correctly',
        'Early release form accepts documents',
        'Receipt includes all transaction details'
      ]
    },
    {
      id: 'allocations',
      title: '6. Rank Allocation View (Mobile)',
      priority: 'medium',
      estimated: '3 min',
      icon: <UIIcons.Badge className="h-5 w-5" />,
      description: 'View monthly allocation and payout history',
      steps: [
        'Navigate to Allocations module (mobile)',
        'Verify rank badge displays correctly',
        'Check monthly allocation amount',
        'Review next payout date',
        'Scroll through payout history',
        'Expand policy information section',
        'Verify lock period information',
        'Tap "Contact Finance" button'
      ],
      testCriteria: [
        'Rank insignia matches user rank',
        'Payout dates formatted correctly',
        'History shows reference numbers',
        'Policy terms clearly stated',
        'Contact button provides support info'
      ]
    },
    {
      id: 'agent-app',
      title: '7. Agent App Cash-In/Cash-Out',
      priority: 'high',
      estimated: '6 min',
      icon: <UIIcons.Store className="h-5 w-5" />,
      description: 'Process agent deposits and withdrawals',
      steps: [
        'Navigate to Agent App tab',
        'Login with Agent Code: AML001, PIN: 1234',
        'Verify float balance displays',
        'Click "Cash In" tile',
        'Scan QR or enter service number: 2023/0001',
        'Enter amount: ₦5,000',
        'Review fee calculation',
        'Generate receipt',
        'Return to home',
        'Click "Cash Out" tile',
        'Enter withdrawal code: WTH123456',
        'Verify KYC status',
        'Enter OTP: 123456 (for high amounts)',
        'Process cash disbursement'
      ],
      testCriteria: [
        'Float balance updates in real-time',
        'Fee structure applies correctly',
        'QR scanner UI shows (simulated)',
        'OTP required above limit',
        'Offline queue shows pending items'
      ]
    },
    {
      id: 'admin-portal',
      title: '8. Admin Portal Dashboard',
      priority: 'high',
      estimated: '5 min',
      icon: <SecurityIcons.Shield className="h-5 w-5" />,
      description: 'Access admin features and analytics',
      steps: [
        'Navigate to Admin Portal tab',
        'Login with 2FA: Code 123456',
        'Review KPI dashboard cards',
        'Check transaction volume chart',
        'Navigate to User Management',
        'Search for a user by service number',
        'View user details and activity',
        'Navigate to Payroll Upload',
        'Upload CSV (simulated)',
        'Map columns correctly',
        'Review batch and publish'
      ],
      testCriteria: [
        '2FA required on login',
        'KPIs display real-time data',
        'Charts render without errors',
        'User search works correctly',
        'CSV mapping validates columns'
      ]
    },
    {
      id: 'announcements',
      title: '9. Announcements & Notifications',
      priority: 'medium',
      estimated: '4 min',
      icon: <UIIcons.Megaphone className="h-5 w-5" />,
      description: 'View and manage notifications',
      steps: [
        'Navigate to Notifications (mobile)',
        'Switch between System/Announcements tabs',
        'Verify unread count badges',
        'Tap on system notification',
        'Tap on army announcement',
        'View announcement details',
        'Download PDF attachment (simulated)',
        'Open notification settings',
        'Toggle push/SMS/email preferences',
        'Save settings'
      ],
      testCriteria: [
        'Unread indicators show correctly',
        'Tabs filter content appropriately',
        'Announcement detail shows all fields',
        'Attachments display with icons',
        'Settings save immediately'
      ]
    },
    {
      id: 'admin-compose',
      title: '10. Admin Announcement Composer',
      priority: 'medium',
      estimated: '5 min',
      icon: <UIIcons.Edit className="h-5 w-5" />,
      description: 'Create and publish announcements',
      steps: [
        'Navigate to Admin Portal → Announcements',
        'Click "Compose" tab',
        'Enter announcement title',
        'Write message body with markdown',
        'Select priority level',
        'Choose target audience (All/Rank/Regiment)',
        'If Rank: Select specific ranks',
        'Choose immediate or scheduled delivery',
        'If scheduled: Pick date from calendar',
        'Click "Preview" to review',
        'Save as draft',
        'Load draft from Drafts tab',
        'Publish announcement',
        'View analytics in Published tab'
      ],
      testCriteria: [
        'Markdown formatting previews correctly',
        'Target audience calculation accurate',
        'Calendar blocks past dates',
        'Draft saves all fields',
        'Analytics show delivery stats'
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const totalTime = testFlows.reduce((sum, flow) => {
    const mins = parseInt(flow.estimated);
    return sum + mins;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Prototype Test Plan</h2>
        <p className="text-muted-foreground">
          Comprehensive UAT testing guide for MoLoyal prototype with 10 core user flows
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UIIcons.Clipboard className="h-6 w-6 text-primary" />
            Test Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{testFlows.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Test Flows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">~{totalTime}</div>
              <div className="text-sm text-muted-foreground mt-1">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">
                {testFlows.filter(f => f.priority === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {testFlows.filter(f => f.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">High Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Credentials */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <SecurityIcons.Key className="h-5 w-5" />
            Test Credentials & Sample Data
          </CardTitle>
          <CardDescription className="text-amber-700">
            Use these credentials throughout testing
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-amber-900 mb-2">User Accounts</h4>
            <ul className="space-y-1 text-amber-800">
              <li>• Service No: 2023/0001, 2023/0002, 2023/0003</li>
              <li>• BVN: 12345678901</li>
              <li>• OTP (all flows): 123456</li>
              <li>• Admin PIN: 1234</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Agent Access</h4>
            <ul className="space-y-1 text-amber-800">
              <li>• Agent Code: AML001</li>
              <li>• Agent PIN: 1234</li>
              <li>• Withdrawal Codes: WTH123456, WTH789012</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Test Flows */}
      <Card>
        <CardHeader>
          <CardTitle>Core User Flows</CardTitle>
          <CardDescription>
            Click each flow to expand detailed testing steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {testFlows.map((flow) => (
              <AccordionItem key={flow.id} value={flow.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {flow.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{flow.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {flow.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={getPriorityColor(flow.priority)}>
                        {flow.priority}
                      </Badge>
                      <Badge variant="secondary">{flow.estimated}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-13 pt-4 space-y-4">
                    {/* Steps */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <UIIcons.List className="h-4 w-4" />
                        Testing Steps
                      </h4>
                      <ol className="space-y-2">
                        {flow.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-sm">
                            <span className="h-6 w-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-medium text-xs">
                              {idx + 1}
                            </span>
                            <span className="text-foreground pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Separator />

                    {/* Test Criteria */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <UIIcons.Check className="h-4 w-4" />
                        Success Criteria
                      </h4>
                      <ul className="space-y-2">
                        {flow.testCriteria.map((criterion, idx) => (
                          <li key={idx} className="flex gap-2 text-sm">
                            <UIIcons.ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Testing Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <UIIcons.Lightbulb className="h-4 w-4" />
              General Tips
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Test on both desktop and mobile viewports</li>
              <li>• Try keyboard navigation for all flows</li>
              <li>• Check toast notifications appear correctly</li>
              <li>• Verify loading states display properly</li>
              <li>• Test error states by entering invalid data</li>
              <li>• Look for console errors in browser DevTools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <SecurityIcons.Bug className="h-4 w-4" />
              Issue Reporting
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Note the specific test flow and step number</li>
              <li>• Include browser and device information</li>
              <li>• Describe expected vs actual behavior</li>
              <li>• Screenshot any visual issues</li>
              <li>• Check if issue is reproducible</li>
              <li>• Rate severity: Critical, High, Medium, Low</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Browser Support */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Browser & Device Support</CardTitle>
          <CardDescription className="text-blue-700">
            Tested and verified on the following platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="font-medium text-blue-900">Chrome</div>
            <div className="text-sm text-blue-700">Latest</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="font-medium text-blue-900">Safari</div>
            <div className="text-sm text-blue-700">Latest</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="font-medium text-blue-900">Android</div>
            <div className="text-sm text-blue-700">9.0+</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="font-medium text-blue-900">iOS</div>
            <div className="text-sm text-blue-700">13.0+</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
